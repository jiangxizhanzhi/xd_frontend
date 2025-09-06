<template>
  <div class="flow-analysis el-tabs__content">
    <div class="left-area">
      <cb-scrollbar>
        <div class="tree-data">
          <!-- 左侧主机数据 -->
          <cb-tree
            :data="treeData"
            show-checkbox
            :default-expand-all="true"
            :expand-on-click-node="false"
            @check="handleCheckChange"
            node-key="id"
            :empty-text="$t('m.noData')"
            ref="tree"
            :check-on-click-node="true"
          >
            <span class="host-name" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </cb-tree>
        </div>
      </cb-scrollbar>
    </div>
    <div class="right-area">
      <cb-scrollbar>
        <div class="table">
          <!-- 表格数据 -->
          <cb-search-table
            ref="flowTable"
            :cols="flowColumns"
            :url="flowUrl"
            :data="flowModel"
            baseURL="/api/mp"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <div class="search">
                <!-- 类型选择 -->
                <cb-select
                  v-model="flowModel.attackTypes"
                  :options="typeOptions"
                  :first="{ label: $t('rbt.allTypes'), value: '' }"
                ></cb-select>
                <!-- 协议选择 -->
                <cb-select v-model="flowModel.protocol" :options="flowOptions">
                </cb-select>
                <!-- 级别选择 -->
                <cb-select
                  width="180px"
                  v-model="flowModel.severity"
                  :options="levelOptions"
                  :first="{ label: $t('rbt.allLevel'), value: '' }"
                />
                <!-- 时间选择 -->
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
                <!-- 输入源ip -->
                <cb-input
                  class="inputStyle"
                  v-model="flowModel.sourceIps"
                  clearable
                  :placeholder="$t('test.enterSourceIp')"
                />
                <!-- 输入目的ip -->
                <cb-input
                  class="inputStyle"
                  v-model="flowModel.targetIps"
                  clearable
                  :placeholder="$t('test.enterDestinationIp')"
                />
                <!-- 输入端口 -->
                <cb-input
                  class="inputStyle"
                  v-model="flowModel.port"
                  clearable
                  :placeholder="$t('test.enterPort')"
                />
              </div>
            </template>
            <!-- 类型 attack_type-->
            <template v-slot:attack_type="scope">
              <span :title="scope.data.attack_info.attack_type">
                {{ scope.data.attack_info.attack_type }}</span
              >
            </template>
            <!-- 级别  severity-->
            <template v-slot:severity="scope">
              <span
                v-if="Number(scope.data.attack_info.severity) === 1"
                :title="$t('rbt.high')"
                >{{ $t('rbt.high') }}</span
              >
              <span
                v-if="Number(scope.data.attack_info.severity) === 2"
                :title="$t('rbt.middle')"
                >{{ $t('rbt.middle') }}</span
              >
              <span
                v-if="
                  Number(scope.data.attack_info.severity) === 3 ||
                  Number(scope.data.attack_info.severity) === 4
                "
                :title="$t('rbt.low')"
                >{{ $t('rbt.low') }}</span
              >
            </template>
          </cb-search-table>
        </div>
      </cb-scrollbar>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { getTrafficHostList } from '@/api/web/red-blue';
import { getTypeListDataApi } from '@/api/web/team-training';
import { getFlowProtocols } from '../../../../../../api/traffic/traffic';
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
      severity: '',
      flowValue: null,
      attackTypes: '',
      sourceIp: '',
      DestinationIp: '',
      port: '',
      flowUrl: '',
      startEndTime: '',
      startTime: '',
      endTime: '',
      //级别
      levelOptions: [
        {
          label: this.$t('test.high'),
          value: '1',
        },
        {
          label: this.$t('test.middle'),
          value: '2',
        },
        {
          label: this.$t('test.low'),
          value: '3,4',
        },
      ],
      typeOptions: [], //类型
      // 协议
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
        target_node_ids: '',
        id: '',
        protocol: null,
        sourceIps: '',
        targetIps: '',
        startTime: '',
        endTime: '',
        port: '',
        severity: '',
        attackTypes: '',
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
          label: this.$t('rbt.type'),
          // prop: 'protocol',
          slot: 'attack_type',
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
        // 级别
        {
          label: this.$t('rbt.level'),
          slot: 'severity',
        },
        // 协议
        {
          label: this.$t('rbt.agreement'),
          prop: 'protocol',
        },
        // 源ip
        {
          label: this.$t('test.sourceIp'),
          prop: 'source_ip',
        },
        // 源端口
        {
          label: this.$t('test.sourcePort'),
          prop: 'source_port',
        },
        // 目的ip
        {
          label: this.$t('test.destinationIp'),
          prop: 'target_ip',
        },
        // 目的端口
        {
          label: this.$t('rbt.destinationPort'),
          prop: 'target_port',
        },
        // 文件
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
    this.getTypeData();
    this.getFlowOptions();
    // this.resource_id = this.$route.params && this.$route.params.resource_id;
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
    clearKey(key) {
      this.flowModel[key] = '';
    },
    // 获取全部类型下来框数据
    getTypeData() {
      getTypeListDataApi({}).then((res) => {
        const data = _.get(res, 'data.data.types', []);
        if (data.length > 0) {
          data.forEach((item) => {
            this.typeOptions.push({
              label: item.name,
              value: item.value,
            });
          });
        }
      });
    },
    handleCheckChange() {
      //树形控件去除根节点id
      const treeIds = this.$refs.tree
        .getCheckedKeys()
        .filter((item) => item != 'tree');
      this.flowModel.target_node_ids = treeIds.length ? treeIds.join() : 'null';
    },
    getMachineList() {
      getTrafficHostList(this.sceneId).then((res) => {
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
              this.flowModel.target_node_ids = treeIds.join();
            }
          });
        }
      });
    },
    // 流量选择
    changeAgreement() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.protocol = this.flowValue;
    },
    // 类型选择
    changeType() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.attackTypes = this.attackTypes;
    },
    // 级别选择
    changeLevel() {
      this.flowModel.severity = this.severity;
    },
    // 源ip搜素
    searchSourceIp() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.sourceIps = this.sourceIp;
    },
    // 目的ip搜索
    searchDesIp() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.targetIps = this.DestinationIp;
    },
    // 端口搜索
    searchPort() {
      if (!this.sceneId) {
        return;
      }
      this.flowModel.port = this.port;
    },
    // 时间选择
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
.flow-analysis {
  border-radius: 4px;
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
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
    padding: 0 15px 15px 15px;
    .search {
      display: flex;
      width: 100%;
      .cb-select {
        margin-right: 5px;
      }
      .time {
        margin-right: 5px;
      }
      .inputStyle {
        width: 200px;
        margin-right: 5px;
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
