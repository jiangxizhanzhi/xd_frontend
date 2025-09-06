<template>
  <div class="flow-class-table">
    <div class="radio-group">
      {{ $t('flowEmulation.flowList') }}
    </div>
    <div class="search-area">
      <cb-search-input
        class="inputStyle"
        v-model="port"
        @keyup.enter.native="getFlowData"
        :placeholder="$t('test.enterPort')"
      />
    </div>
    <div class="flow-table">
      <scroll-table class="flex-column" :data="flowTableData" :cols="flowCols">
        <template v-slot:flowType="scope">
          <div>{{ scope.data.attack_info.attack_type }}</div>
        </template>
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
      </scroll-table>
    </div>
  </div>
</template>

<script>
import ScrollTable from './scroll-table.vue';
import { getFlowTableData } from '@/api/web/replay';
export default {
  props: {
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //节点id
    nodeId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //复盘时间
    replayTime: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    ScrollTable,
  },
  data() {
    return {
      flowTableData: [],
      timeInterval: null,
      port: '',
      classOption: {
        step: 0.5,
        hoverStop: true,
        limitMoveNum: 1,
      },
      flowCols: [
        { label: this.$t('test.times'), width: 12, prop: 'time' },
        { label: this.$t('test.flowType'), width: 12, slot: 'flowType' },
        { label: this.$t('test.level'), width: 12, slot: 'level' },
        { label: this.$t('m.agreement'), width: 12, prop: 'protocol' },
        { label: this.$t('test.sourceIp'), width: 12, prop: 'source_ip' },
        { label: this.$t('test.sourcePort'), width: 12, prop: 'source_port' },
        { label: this.$t('test.destinationIp'), width: 12, prop: 'target_ip' },
        { label: this.$t('common.destPort'), width: 12, prop: 'target_port' },
      ],
    };
  },
  created() {},
  mounted() {},
  watch: {
    nodeId: {
      handler(val) {
        if (val && this.sceneId) {
          this.getFlowData();
          clearInterval(this.timeInterval);
          this.timeInterval = setInterval(() => {
            this.getFlowData();
          }, 1000 * 5);
        } else {
          clearInterval(this.timeInterval);
          this.flowTableData = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    getFlowData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        id: this.sceneId,
        nodeIds: [this.nodeId],
        endTime: this.replayTime,
        port: this.port,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getFlowTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.flowTableData = data;
      });
    },
    getLevel(value) {
      if (value == 1) {
        return this.$t('test.high');
      } else if (value == 2) {
        return this.$t('test.middle');
      } else if (value == 3) {
        return this.$t('test.low');
      } else {
        return this.$t('test.low');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flow-class-table {
  width: 100%;
  height: 100%;
  .radio-group {
    height: 32px;
    line-height: 32px;
    margin-bottom: 8px;
  }
  .flow-table {
    height: 400px;
  }
  .search-area {
    position: absolute;
    top: 0px;
    right: 0px;
    .inputStyle {
      width: 250px;
    }
  }
}
</style>
