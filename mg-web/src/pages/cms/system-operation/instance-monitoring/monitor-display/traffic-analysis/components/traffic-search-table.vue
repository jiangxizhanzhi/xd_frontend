<template>
  <div class="traffic cy-common-theme__dark">
    <cb-search-table
      ref="trafficTable"
      class="node-search-table"
      :scroll="{ y: scrollY }"
      :background="false"
      url="/cscene/monitor/flow/page"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      :cols="columns"
      :data="query"
      @data-loaded="dataLoaded"
      baseURL="/api/mp"
      :searchBarBg="false"
    >
      <template v-slot:filter>
        <div>
          <cb-select
            :placeholder="$t('systemOperation.trafficAnalysis.tafficType')"
            v-model="query.protocol"
            :options="optionsTraffic"
          >
          </cb-select>
        </div>
        <cb-date-picker
          v-model="query.startTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('systemOperation.eventAnalysis.selectStartTime')"
        >
        </cb-date-picker>
        <div>
          <cb-select
            :placeholder="$t('systemOperation.trafficAnalysis.sourceIp')"
            v-model="query.sourceIps"
            :options="optionsSIp"
          >
          </cb-select>
        </div>
        <div>
          <cb-input
            v-model="query.sourcePort"
            :placeholder="$t('systemOperation.trafficAnalysis.sourceport')"
            clearable
          ></cb-input>
        </div>
        <div>
          <cb-select
            :placeholder="$t('systemOperation.trafficAnalysis.destIp')"
            v-model="query.targetIps"
            :options="optionsTIp"
          >
          </cb-select>
        </div>
        <div>
          <cb-input
            v-model="query.targetPort"
            :placeholder="$t('systemOperation.trafficAnalysis.destPort')"
            clearable
          ></cb-input>
        </div>
      </template>
      <template slot="searchRightArea">
        <cb-button
          :disabled="exportDisable"
          @click="exportTraffic"
          icon="icon-daochu"
        >
          {{ $t('systemOperation.trafficAnalysis.exportTraffic') }}
        </cb-button>
        <cb-button icon="icon-shuaxin" @click="refreshTraffic">{{
          $t('systemOperation.trafficAnalysis.refresh')
        }}</cb-button>
      </template>
      <template v-slot:level="scope">
        <div :class="getLevelStyle(scope.data.attack_info.severity)">
          {{ getLevel(scope.data.attack_info.severity) }}
        </div>
      </template>
    </cb-search-table>
    <!-- 弹窗 -->
    <cb-dialog
      v-if="monitoringModal"
      :visible="monitoringModal"
      :before-close="handleDialog"
    >
      <template slot="title">{{
        $t('systemOperation.trafficAnalysis.checkFile')
      }}</template>
    </cb-dialog>
  </div>
</template>

<script>
import {
  exportAllTraffic,
  getTrafficFileGenerateProgress,
} from '@/api/monitor';
import { getFlowProtocols } from '../../../../../../../api/system-op';
export default {
  name: 'NodeSearchTable',
  props: {
    scrollY: {
      type: Number,
      default: 0,
    },
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      interval: null,
      //流量导出按钮灰化
      exportDisable: true,
      monitoringModal: false,
      tableSelector: {},
      multipleSelection: [],
      optionsTraffic: [],
      optionsSIp: [],
      optionsTIp: [],
      query: {
        protocol: '',
        id: this.sceneId,
        startTime: '',
        sourceIps: '', //源ip
        targetIps: '', //目标ip
        sourcePort: '',
        targetPort: '',
      },
      columns: [
        {
          label: this.$t('systemOperation.scene.flowType'),
          prop: 'protocol',
        },
        {
          label: this.$t('systemOperation.scene.warnLevel'),
          slot: 'level',
        },
        {
          label: this.$t('systemOperation.scene.startTime'),
          prop: 'time',
        },

        {
          label: this.$t('systemOperation.scene.resourceIp'),
          prop: 'source_ip',
        },
        {
          label: this.$t('systemOperation.scene.resourcePort'),
          prop: 'source_port',
        },
        {
          label: this.$t('systemOperation.scene.targetIp'),
          prop: 'target_ip',
        },
        {
          label: this.$t('systemOperation.scene.targetPort'),
          prop: 'target_port',
        },
        {
          label: `${this.$t('systemOperation.scene.packetSize')}(Byte)`,
          prop: 'size',
        },
      ],
    };
  },
  computed: {
    getLevelStyle() {
      return function (level) {
        if (level == 1) {
          return 'levelHigh';
        } else if (level == 2) {
          return 'levelMid';
        } else {
          return 'levelLow';
        }
      };
    },
    getLevel() {
      return function (level) {
        if (level == 1) {
          return this.$t('systemOperation.scene.high');
        } else if (level == 2) {
          return this.$t('systemOperation.scene.medium');
        } else {
          return this.$t('systemOperation.scene.low');
        }
      };
    },
  },
  created() {
    this.getTrafficIp();
    this.getFlowOptions();
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {},
  methods: {
    getFlowOptions() {
      getFlowProtocols().then((res) => {
        this.optionsTraffic = res.data?.data?.flow_options || [];
      });
    },
    getFileGenerateProcess(taskId) {
      const params = {
        id: taskId,
      };
      getTrafficFileGenerateProgress(params)
        .then((res) => {
          const process = res?.data?.data?.process;
          this.$emit('processHandle', process);
          if (process == 100) {
            const url = res?.data?.data?.download_url;
            this.$emit('processHandle', process, url);
            clearInterval(this.interval);
          }
        })
        .catch(() => {
          this.$emit('processHandle', process);
        });
    },
    //导出全部流量
    exportTraffic() {
      this.$confirm(this.$t('systemOperation.scene.trafficWaitTip'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
      })
        .then(() => {
          const params = {
            id: this.sceneId,
          };
          exportAllTraffic(params).then((res) => {
            let task_id = res?.data?.data?.task_id;
            if (task_id) {
              this.getFileGenerateProcess(task_id);
              this.interval = setInterval(() => {
                this.getFileGenerateProcess(task_id);
              }, 1000);
            }
          });
        })
        .catch(() => {});
    },
    refreshTraffic() {
      this.$refs.trafficTable.reload();
    },
    handleDialog() {
      this.monitoringModal = !this.monitoringModal;
    },
    dataLoaded(data) {
      if (data.tableData.length == 0) {
        //无数据灰化导出按钮
        this.exportDisable = true;
      } else {
        this.exportDisable = false;
      }
    },
    // 获取流量分页列表ip
    getTrafficIp() {
      this.$request
        .get(
          `/cscene/monitor/scene/ips`,
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.optionsIp = data.map((item) => {
            return {
              label: item,
              value: item,
            };
          });
          this.optionsTIp = _.cloneDeep(this.optionsIp);
          this.optionsSIp = _.cloneDeep(this.optionsIp);
          this.optionsSIp.unshift({
            label: this.$t('systemOperation.trafficAnalysis.allSourceIp'),
            value: '',
          });
          this.optionsTIp.unshift({
            label: this.$t('systemOperation.trafficAnalysis.allTargetIp'),
            value: '',
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.node-search-table ::v-deep {
}
.levelHigh {
  color: var(--red-color);
}
.levelMid {
  color: var(--orange-color);
}
.levelMidLow {
  color: var(--primary-color);
}
.levelLow {
  color: var(--green-color);
}
.traffic {
  .node-search-table {
    ::v-deep.cb-a-table-container {
      .cb-table-no-data {
        padding: 10px 0;
      }
    }
  }
}
</style>
