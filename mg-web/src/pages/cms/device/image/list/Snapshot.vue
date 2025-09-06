<template>
  <cb-dialog
    :title="$t('device.snapshotHistory')"
    :visible.sync="visibleDialog"
    width="950px"
    @close="close"
  >
    <!-- 路径图 -->
    <div class="wrapper">
      <div ref="myChart" class="myChart"></div>
    </div>

    <!-- 节点详情 -->
    <div class="node-detail" v-if="tipVisiable">
      <div class="remove" @click="tipVisiable = false">×</div>
      <p :title="currentNodeName">
        {{ $t('device.SnapshotName') }}：{{ this.currentNodeName }}
      </p>
      <p :title="createTime">
        {{ $t('device.createTime') }}：{{ this.createTime }}
      </p>
      <p :title="description">
        {{ $t('device.SnapshotDescription') }}：{{ this.description }}
      </p>
      <p :title="snapSource">
        {{ $t('device.SnapshotSource') }}：{{ snapSource }}
      </p>
      <div
        class="delete_wrap"
        v-show="deleteVisiable === true"
        @click="deleteNode()"
      >
        <span>
          <cb-iconfont type="icon-shanchu" size="17" />
          <span>{{ $t('device.delete') }}</span>
        </span>
      </div>
      <div v-show="deleteVisiable === false" class="delete_disabled">
        <span>
          <cb-iconfont type="icon-shanchu" size="17" class="icon-color" />
          <span>{{ $t('device.delete') }}</span>
        </span>
      </div>
    </div>
    <!-- -------------- -->
    <div slot="footer" class="dialog-footer">
      <cb-button-group space="middle">
        <cb-button v-if="mergeTrigger" @click="mergeSnapshotEvent">
          {{ $t('device.mergeSnapshot') }}
        </cb-button>
        <cb-button
          :disabled="!mergeTrigger"
          v-if="!mergeTrigger"
          icon="icon-jiazai"
          class="merging-btn"
        >
          {{ $t('device.mergeSnapshoting') }}
        </cb-button>
        <cb-button button-type="cancel" @click="close"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import { getSnapshot, mergeSnapshot, deleteshot } from '@/api/device/image';
import _ from 'lodash';
import * as echarts from 'echarts';

export default {
  name: 'Snapshot',
  props: {
    device: {
      type: Object,
      default: {},
    },
    snapshotModalTrigger: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    device: {
      handler(data) {
        const deviceActions =
          _.get(data, 'ext_image_info.device_actions', '') || '';
        if (deviceActions.indexOf('b') > -1) {
          this.mergeTrigger = false;
        } else {
          this.mergeTrigger = true;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      visibleDialog: this.snapshotModalTrigger,
      mergeTrigger: true,
      data: [],
      showMessage: this.$t('device.mergeSnapshot'),
      colorType: 'green',
      snapshotList: [],
      listData: [],
      treeData: [],
      myChart: null,
      // 节点详情
      tipVisiable: false,
      // 删除按钮显示
      deleteVisiable: false,
      currentNodeName: '',
      createTime: '',
      description: '',
      snapSource: '',
      // 快照id
      snapshot_id: '',
    };
  },
  created() {},
  mounted() {
    this.getSnapshotList();
  },
  methods: {
    // 获取快照历史
    getSnapshotList() {
      getSnapshot(this.device.uuid).then((res) => {
        const data = _.get(res, 'data.data', []);
        if (data) {
          this.snapshotList = [...data];
          // 清空listData,避免数据重复
          this.listData = [];
          this.toTree(this.snapshotList);
          // 获取所有节点name
          const allName = this.listData.map((item) => {
            return item.name;
          });
          // image_name不在所有节点name中的为初始镜像
          this.listData.forEach((item) => {
            if (!allName.includes(item.image_name || !item.image_name)) {
              item.image_name = this.$t('device.originalImage');
            }
          });
          this.initChart();
        }
      });
    },

    toTree(data) {
      let obj = {}, // 使用对象重新存储数据
        result = [], // 存储最后结果
        len = data.length;
      // 遍历原始数据data，构造obj数据，键名为id，值为数据
      for (let i = 0; i < len; i++) {
        obj[data[i]['name']] = data[i];
      }
      // 遍历原始数据
      for (let j = 0; j < len; j++) {
        let list = data[j];
        // 通过每条数据的 image_name 去obj中查询
        let parentList = obj[list['image_name']];
        if (parentList) {
          // 根据 image_name 找到的是父节点，list是子节点，
          if (!parentList['children']) {
            parentList['children'] = [];
          }
          // 将子节点插入 父节点的 children 字段中
          parentList['children'].push(list);
        } else {
          // image_name 找不到对应值，说明是根结点，直接插到根数组中
          result.push(list);
        }
      }
      this.treeData = {
        name: this.$t('device.originalImage'),
        children: result,
      };
    },

    // 将树形结构转为线性结构
    treeToList(arr, list) {
      // 判断数组是否存在
      if (!arr) {
        return;
      }
      // 循环查找是否包含子节点
      arr.forEach((item) => {
        list.push(item);
        if (item.children) {
          this.treeToList(item.children, list);
        }
      });
    },
    close() {
      this.snapshotList = [];
      this.$emit('snapshot-hide', false);
    },
    // 合并快照
    mergeSnapshotEvent() {
      let snapshot_name = '';
      if (this.snapshotList.length > 0) {
        snapshot_name = this.snapshotList[this.snapshotList.length - 1].name;
      }
      const params = {
        uuid: this.device.uuid,
        image_type: this.device.image_type,
        new_name: '',
        snapshot_name,
      };
      mergeSnapshot(params)
        .then((res) => {
          this.$emit('merge-snapshot');
        })
        .catch((error) => {
          this.$emit('merge-snapshot');
        });
    },
    initChart() {
      const arrData = [this.treeData];
      echarts.init(this.$refs.myChart, null).dispose();
      this.myChart = echarts.init(this.$refs.myChart, null);

      const newOption = {
        series: [
          {
            type: 'tree',
            orient: 'vertical',
            name: 'tree1',
            data: arrData,
            top: '10%',
            left: '8%',
            bottom: '22%',
            right: '20%',
            symbol: 'circle',
            symbolSize: 20,
            // edgeShape: 'polyline',
            // 默认展开所有
            initialTreeDepth: -1,
            // 是否收缩
            expandAndCollapse: false,
            roam: true,
            // 放大缩小范围
            scaleLimit: {
              min: 0.7,
              max: 3,
            },
            lineStyle: {
              width: 1,
              curveness: 0,
            },
            itemStyle: {
              color: this.$themed('primary-color'),
            },
            label: {
              backgroundColor: 'none',
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              color: this.$themed('--neutral8'),
              formatter: function (params) {
                return params.data.name.length > 4
                  ? params.data.name.substring(0, 4) + '...'
                  : params.data.name;
              },
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };
      // 树形结构遍历
      this.readNodes(arrData);

      this.myChart.setOption(newOption);
      this.myChart.on('click', (item) => {
        this.currentNodeName = item.data.name;
        this.createTime = item.data.created_at;
        this.description = item.data.description;
        this.snapshot_id = item.data.uuid;
        this.snapSource = item.data.scene_name
          ? item.data.scene_name
          : this.$t('device.imageManagement');
        this.tipVisiable = true;

        if (!item.data.children) {
          this.deleteVisiable = true;
        } else {
          this.deleteVisiable = false;
        }
      });
    },

    readNodes(nodes) {
      for (let item of nodes) {
        // js遍历树形数组结构

        if (item.children && item.children.length) {
          this.readNodes(item.children);
        }
        if (!item.scene_name) {
          item.itemStyle = {
            color: this.$themed('--blue-color'),
          };
          item.lineStyle = {
            color: this.$themed('--blue-color'),
          };
        }
        if (this.sceneId === item.scene_id) {
          item.lineStyle = {
            color: this.$themed('--primary-color'),
          };
        }
      }
    },
    // 节点删除
    deleteNode() {
      this.$confirm(this.$t('common.confirmDelete') + '?').then(() => {
        deleteshot({
          device_uuid: this.device.uuid,
          snapshot_name: this.currentNodeName,
          snapshot_uuid: this.snapshot_id,
        }).then((res) => {
          this.getSnapshotList();
          this.$message({
            type: 'success',
            message: this.$t('device.deleteSuccess'),
          });
          this.tipVisiable = false;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .merging-btn .el-button {
    cursor: default;
  }
}

.wrapper,
.myChart {
  width: 900px;
  height: 500px;
}

.node-detail {
  width: 250px;
  height: 200px;
  color: var(--neutral8);
  background: var(--bg-color-3);
  border-radius: 2px;
  border: 1px solid var(--neutral2);
  position: absolute;
  right: 20px;
  top: 80px;
  padding-left: 20px;
  padding-top: 10px;
  p {
    width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .delete_wrap {
    color: var(--primary-color);
    cursor: pointer;
  }
  .delete_disabled {
    color: var(--primary-color-4);
    cursor: not-allowed;
    .icon-color {
      color: var(--primary-color-4);
    }
  }
  .remove {
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    right: 0;
    top: 0;
    text-align: center;
    cursor: pointer;
  }
}
</style>
