<template>
  <cb-inner-page :background="false">
    <div class="wrapper-boxs">
      <Block :title="$t('systemOperation.scene.nodeList')">
        <cb-search-table
          ref="nodeListRef"
          :data="query"
          :cols="nodeCols"
          url="/systemOperation/scene/pageHostMonitor/"
          baseURL="/api/mp"
          :background="true"
        >
          <template v-slot:total="scope">
            <div>
              {{ scope.data && sumTotal(scope.data) }}
            </div>
          </template>
          <template v-slot:operation="scope">
            <cb-button
              type="text"
              icon="icon-xuexijiankong"
              @click="goToMonitor(scope.data.monitor_url)"
            >
              {{ $t('systemOperation.scene.monitor') }}
            </cb-button>
          </template>
        </cb-search-table>
      </Block>
    </div>
    <div class="wrapper-boxs">
      <Block :title="$t('systemOperation.scene.flowMonitor')">
        <cb-search-table
          ref="flowListRef"
          :cols="flowCols"
          :data="flowQuery"
          url="/systemOperation/scene/pageFlowMonitor/"
          baseURL="/api/mp"
          :background="true"
        >
          <template v-slot:search>
            <cb-select
              class="backgroundColor"
              v-model="flowQuery.protocol"
              clearable
              :first="{
                value: '',
                label: $t('systemOperation.scene.allType'),
              }"
              :options="options"
            />
            <cb-date-picker
              class="backgroundColor"
              v-model="flowTime"
              type="datetimerange"
              range-separator="-"
              @change="handleChangeFlowTime"
              :start-placeholder="$t('systemOperation.scene.startTime')"
              :end-placeholder="$t('systemOperation.scene.endTime')"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </cb-date-picker>
          </template>
        </cb-search-table>
      </Block>
    </div>
    <div class="wrapper-boxs">
      <Block :title="$t('systemOperation.scene.eventMonitor')">
        <cb-search-table
          ref="eventListRef"
          :cols="eventCols"
          showIndex
          :data="eventQuery"
          url="/systemOperation/scene/pageEventMonitor/"
          baseURL="/api/mp"
          :background="true"
        >
          <template v-slot:search>
            <cb-date-picker
              class="backgroundColor"
              v-model="eventTime"
              type="datetimerange"
              range-separator="-"
              @change="handleChangeEventTime"
              :start-placeholder="$t('systemOperation.scene.startTime')"
              :end-placeholder="$t('systemOperation.scene.endTime')"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </cb-date-picker>
          </template>
        </cb-search-table>
      </Block>
    </div>
    <div class="wrapper-boxs">
      <Block :title="$t('systemOperation.scene.flowTableMonitor')">
        <cb-search-table
          ref="monitorListRef"
          :cols="flowTableCols"
          showIndex
          url="/devops/cluster/openflow/action/"
          baseURL="/api/mp"
          :background="true"
        >
        </cb-search-table>
      </Block>
    </div>
  </cb-inner-page>
</template>
<script>
import Block from '@/components/block';
import Utils from '@/utils/utils';
import { protocolsList } from '../constant';
const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
const end = new Date(
  new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1,
);
export default {
  components: {
    Block,
  },
  data() {
    return {
      flowTime: [Utils.formatDate(start), Utils.formatDate(end)],
      eventTime: [Utils.formatDate(start), Utils.formatDate(end)],
      query: {
        sceneId: '',
      },
      flowQuery: {
        sceneId: '',
        protocol: '',
        start_time: Utils.formatDate(start),
        end_time: Utils.formatDate(end),
      },
      eventQuery: {
        sceneId: '',
        start_time: Utils.formatDate(start),
        end_time: Utils.formatDate(end),
      },
      options: protocolsList,
    };
  },
  computed: {
    nodeCols() {
      // 节点列表
      const that = this;
      return [
        {
          label: this.$t('systemOperation.scene.nodeName'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.scene.type'),
          prop: 'image_type',
          getData(row) {
            if (row.image_type === 'vm') {
              return that.$t('systemOperation.scene.vm');
            }
            if (row.image_type === 'container') {
              return that.$t('systemOperation.scene.container');
            }
            if (row.image_type === 'entity') {
              return that.$t('systemOperation.scene.entity');
            }
          },
        },
        {
          label: this.$t('systemOperation.scene.cpuRamDisk'),
          slot: 'total',
        },
        {
          label: this.$t('systemOperation.scene.cpuPercent'),
          prop: 'cpu_total_percent',
          getData(row) {
            return `${Math.round(row.cpu_total_percent)}%`;
          },
        },
        {
          label: this.$t('systemOperation.scene.ramPercent'),
          prop: 'memory_percent',
          getData(row) {
            return `${Math.round(row.memory_percent)}%`;
          },
        },
        {
          label: this.$t('systemOperation.scene.operate'),
          slot: 'operation',
          width: '200px',
        },
      ];
    },

    flowCols() {
      // 流量监控
      return [
        {
          label: this.$t('systemOperation.scene.flowType'),
          prop: 'protocol_type',
        },
        {
          label: this.$t('systemOperation.scene.time'),
          prop: 'timestamp',
          getData(row) {
            return Utils.formatDate(row.timestamp);
          },
        },
        {
          label: this.$t('systemOperation.scene.resourceIp'),
          prop: 'source_ip',
        },
        {
          label: this.$t('systemOperation.scene.resourcePort'),
          prop: 'src_port',
        },
        {
          label: this.$t('systemOperation.scene.targetIp'),
          prop: 'target_ip',
        },
        {
          label: this.$t('systemOperation.scene.targetPort'),
          prop: 'target_mac',
        },
        // {
        //   label: this.$t('scene.tunnelkey'),
        //   prop: 'name',
        // },
        {
          label: this.$t('systemOperation.scene.packetSize'),
          prop: 'total_bytes',
        },
      ];
    },
    eventCols() {
      // 事件监控
      return [
        {
          label: this.$t('systemOperation.scene.eventType'),
          prop: 'file_event_type',
        },
        {
          label: this.$t('systemOperation.scene.time'),
          prop: 'update_time',
        },
        {
          label: this.$t('systemOperation.scene.node'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.scene.info'),
          prop: 'action',
        },
      ];
    },
    flowTableCols() {
      // 流表监控
      return [
        {
          label: this.$t('systemOperation.scene.inPort'),
          prop: 'in_port',
        },
        {
          label: this.$t('systemOperation.scene.actions'),
          prop: 'actions',
        },
        {
          label: this.$t('systemOperation.scene.priority'),
          prop: 'priority',
        },
        {
          label: this.$t('systemOperation.scene.physicalNode'),
          prop: 'hostname',
        },
      ];
    },
  },
  created() {
    this.query.sceneId = this.$route.params.id;
    this.flowQuery.sceneId = this.$route.params.id;
    this.eventQuery.sceneId = this.$route.params.id;
  },
  methods: {
    handleChangeFlowTime(value) {
      this.flowQuery.start_time = value[0];
      this.flowQuery.end_time = value[1];
    },
    handleChangeEventTime(value) {
      this.eventQuery.start_time = value[0];
      this.eventQuery.end_time = value[1];
    },
    sumTotal(data) {
      return `${data.cpu_count}${this.$t(
        'systemOperation.scene.core',
      )}/${Math.round(data.memory_total / 1024 / 1024 / 1024)}G/${Math.round(
        data.disk_space / 1024 / 1024 / 1024,
      )}G`;
    },
    goToMonitor(url) {
      if (url) {
        window.open(url);
      } else {
        this.$message.error(this.$t('systemOperation.scene.noDataInfo'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper-boxs {
  padding: 15px 20px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.wrapper-boxs {
  background: var(--bg-color-third);
}
</style>
