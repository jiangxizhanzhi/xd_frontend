<template>
  <div class="flow-collect-info">
    <div class="left-area">
      <cb-scrollbar>
        <div class="tree-data">
          <cb-tree
            :data="treeData"
            show-checkbox
            :default-expand-all="true"
            :expand-on-click-node="false"
            @check="handleCheckChange"
            node-key="id"
            :empty-text="$t('m.noData')"
            ref="tree"
          >
            <span class="host-name" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </cb-tree>
        </div>
      </cb-scrollbar>
    </div>
    <div class="right-area">
      <cb-search-table
        ref="flowTable"
        :cols="flowColumns"
        :url="flowUrl"
        :data="flowModel"
        baseURL="/api/mp"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <cb-select
            style="width: 100%"
            v-model="flowModel.protocol"
            :options="flowOptions"
          >
          </cb-select>
          <cb-input
            class="inputStyle"
            v-model="flowModel.sourceIps"
            clearable
            :placeholder="$t('test.enterSourceIp')"
          />
          <cb-input
            class="inputStyle"
            v-model="flowModel.targetIps"
            clearable
            :placeholder="$t('test.enterDestinationIp')"
          />
          <span class="time">
            <cb-date-picker
              v-model="startEndTime"
              type="daterange"
              :range-separator="$t('m.to')"
              :start-placeholder="$t('m.startTime')"
              :end-placeholder="$t('m.endTime')"
              @change="timeChange"
            >
            </cb-date-picker>
          </span>
          <cb-input
            class="inputStyle"
            v-model="flowModel.sourcePort"
            clearable
            :placeholder="$t('test.enterPort')"
          />
        </template>
      </cb-search-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { getFlowProtocols } from '../../../../../api/traffic/traffic';
export default {
  components: {},
  props: {
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      flowValue: null,
      sourceIp: '',
      DestinationIp: '',
      port: '',
      flowUrl: '',
      startEndTime: '',
      startTime: '',
      endTime: '',
      flowOptions: [],
      flowFirstOption: {
        label: this.$t('test.totalFlow'),
        value: null,
      },
      treeData: [
        {
          id: 'tree',
          label: this.$t('test.allHosts'),
          children: [],
        },
      ],
      flowModel: {
        nodeIds: '',
        id: '',
        protocol: null,
        sourceIps: '',
        targetIps: '',
        startTime: '',
        endTime: '',
        sourcePort: '',
      },
      getFileSize: (size) => {
        if (size === null || size === '' || size === undefined) {
          return '-';
        }
        //把字节转换成正常文件大小
        var num = 1024.0; //byte
        if (size < num) {
          return size + 'B';
        } else if (size < Math.pow(num, 2)) {
          return (size / num).toFixed(2) + 'KB'; //KB
        } else if (size < Math.pow(num, 3)) {
          return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
        } else if (size < Math.pow(num, 4)) {
          return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
        } else {
          return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
        }
      },
      flowColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'target_node_name',
        },
        {
          label: this.$t('test.flowType'),
          prop: 'protocol',
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
        {
          label: this.$t('test.sourceIp'),
          prop: 'source_ip',
        },
        {
          label: this.$t('test.destinationIp'),
          prop: 'target_ip',
        },
        {
          label: this.$t('test.sourcePort'),
          prop: 'source_port',
        },
        {
          label: this.$t('test.doc'),
          getData: (row) => {
            return this.getFileSize(row.size);
          },
        },
      ],
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getFlowOptions();
  },
  mounted() {},
  watch: {
    // 监听场景id
    sceneId: {
      handler: function (val, oldval) {
        if (val) {
          this.getMachineList();
          // this.flowUrl = 'cscene/monitor/flow/page';
          // this.flowModel.id = this.sceneId;
        } else {
          this.treeData = [
            {
              id: 'tree',
              label: this.$t('test.allHosts'),
              children: [],
            },
          ];
          this.flowUrl = '';
          this.flowModel.id = '';
          this.$nextTick(() => {
            this.$refs.flowTable.empty();
          });
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {},
  methods: {
    getFlowOptions() {
      getFlowProtocols().then((res) => {
        this.flowOptions = res.data?.data?.flow_options || [];
      });
    },
    handleCheckChange() {
      //树形控件去除根节点id
      const treeIds = this.$refs.tree
        .getCheckedKeys()
        .filter((item) => item != 'tree');
      this.flowModel.nodeIds = treeIds.join();
    },
    getMachineList() {
      this.$request
        .get(`cscene/monitor/scene/all_elements/${this.sceneId}`, null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          if (data.length) {
            const list = data.map((item) => {
              return {
                label: item.name,
                id: item.id,
              };
            });
            this.treeData[0].children = [...list];
            //默认选中全部主机
            this.$nextTick(() => {
              this.flowUrl = 'cscene/monitor/flow/page';
              this.flowModel.id = this.sceneId;
              if (this.$refs.tree != undefined) {
                this.$refs.tree.setCheckedNodes(this.treeData);
                const treeIds = this.$refs.tree
                  .getCheckedKeys()
                  .filter((item) => item != 'tree');
                this.flowModel.nodeIds = treeIds.join();
              }
            });
          }
        });
    },
    changeType() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.protocol = this.flowValue;
    },
    searchSourceIp() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.sourceIps = this.sourceIp;
    },
    searchDesIp() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.targetIps = this.DestinationIp;
    },
    searchPort() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.sourcePort = this.port;
    },
    timeChange() {
      if (!this.sceneId) {
        return;
      }
      if (this.startEndTime) {
        this.startTime = moment(this.startEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.endTime = moment(this.startEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.startTime = null;
        this.endTime = null;
      }
      this.flowModel.startTime = this.startTime;
      this.flowModel.endTime = this.endTime;
    },
  },
};
</script>

<style lang="scss" scoped>
.flow-collect-info {
  display: flex;
  width: 100%;
  height: 100%;
  .left-area {
    width: 15%;
    border-right: 1px solid var(--neutral3);
    padding: 5px 10px 5px 15px;
    font-size: 14px;
    .host-name {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    ::v-deep .el-tree-node {
      margin-top: 8px;
    }
  }
  .right-area {
    width: 85%;
    padding: 15px 15px;
    .search {
      .time {
        margin-left: 5px;
      }
      .inputStyle {
        width: 200px;
        margin-left: 5px;
      }
    }
    .table {
      margin-top: 15px;
    }
  }
  ::v-deep .el-tree-node__expand-icon {
    display: none;
  }
  ::v-deep .el-tree-node__content {
    padding-left: 0px !important;
  }
}
</style>
