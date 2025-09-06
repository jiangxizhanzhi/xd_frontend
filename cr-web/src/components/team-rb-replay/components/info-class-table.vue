<template>
  <div class="info-class-table">
    <div class="radio-group">
      <cb-radio-group v-model="active">
        <cb-radio-button :label="$t('test.interfaceList')"></cb-radio-button>
        <cb-radio-button :label="$t('test.portList')"></cb-radio-button>
        <cb-radio-button :label="$t('test.processList')"></cb-radio-button>
      </cb-radio-group>
    </div>
    <div v-show="active == $t('test.interfaceList')" class="network-port-table">
      <scroll-table
        class="flex-column"
        :data="networkPortData"
        :cols="networkPortCols"
      >
        <template v-slot:txPackets="scope">
          <div>{{ scope.data.tx.packets }}</div>
        </template>
        <template v-slot:rxPackets="scope">
          <div>{{ scope.data.rx.packets }}</div>
        </template>
        <template v-slot:txBytes="scope">
          <div>{{ scope.data.tx.bytes }}</div>
        </template>
        <template v-slot:rxBytes="scope">
          <div>{{ scope.data.rx.bytes }}</div>
        </template>
      </scroll-table>
    </div>
    <div v-show="active == $t('test.portList')" class="port-table">
      <scroll-table class="flex-column" :data="portData" :cols="portCols">
        <template v-slot:time="scope">
          <div>{{ (scope.data.scan && scope.data.scan.time) || '-' }}</div>
        </template>
        <template v-slot:localIp="scope">
          <div>{{ (scope.data.local && scope.data.local.ip) || '-' }}</div>
        </template>
        <template v-slot:localPort="scope">
          <div>{{ (scope.data.local && scope.data.local.port) || '-' }}</div>
        </template>
        <template v-slot:remoteIp="scope">
          <div>{{ (scope.data.remote && scope.data.remote.ip) || '-' }}</div>
        </template>
        <template v-slot:remotePort="scope">
          <div>{{ (scope.data.remote && scope.data.remote.port) || '-' }}</div>
        </template>
      </scroll-table>
    </div>
    <div v-show="active == $t('test.processList')" class="process-table">
      <scroll-table class="flex-column" :data="processData" :cols="processCols">
        <template v-slot:usage="scope">
          <div>
            {{ parseFloat((scope.data.vm_size / 1024).toFixed(2)) + 'MB' }}
          </div>
        </template>
      </scroll-table>
    </div>
  </div>
</template>

<script>
import ScrollTable from './scroll-table.vue';
import {
  getNetworkPortTableData,
  getPortTableData,
  getProcessTableData,
} from '@/api/web/replay';
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
      active: this.$t('test.interfaceList'),
      timeInterval: null,
      networkPortData: [],
      portData: [],
      processData: [],
      classOption: {
        step: 0.5,
        hoverStop: true,
        limitMoveNum: 10,
      },
      networkPortCols: [
        { label: this.$t('test.name'), width: 10, prop: 'name' },
        { label: this.$t('test.types'), width: 10, prop: 'type' },
        { label: this.$t('test.linkStatus'), width: 10, prop: 'state' },
        { label: this.$t('test.mtu'), width: 10, prop: 'mtu' },
        { label: this.$t('test.macAddress'), width: 10, prop: 'mac' },
        { label: this.$t('test.ipAddress'), width: 10, prop: 'ip' },
        {
          label: this.$t('common.packetsSent'),
          width: 10,
          slot: 'txPackets',
        },
        {
          label: this.$t('common.packetsReceived'),
          width: 10,
          slot: 'rxPackets',
        },
        { label: this.$t('test.byteSent'), width: 10, slot: 'txBytes' },
        { label: this.$t('test.byteReceive'), width: 10, slot: 'rxBytes' },
      ],
      portCols: [
        { label: this.$t('m.time'), width: 12, slot: 'time' },
        { label: this.$t('m.agreement'), width: 12, prop: 'protocol' },
        { label: this.$t('m.nativeIp'), width: 12, slot: 'localIp' },
        { label: this.$t('m.nativePort'), width: 12, slot: 'localPort' },
        { label: this.$t('m.remoteIp'), width: 12, slot: 'remoteIp' },
        { label: this.$t('m.remotePort'), width: 12, slot: 'remotePort' },
        { label: this.$t('m.state'), width: 12, prop: 'state' },
        { label: this.$t('m.process'), width: 12, prop: 'process' },
      ],
      processCols: [
        { label: this.$t('m.time'), width: 14, prop: 'start_time' },
        { label: 'PID', width: 14, prop: 'pid' },
        { label: this.$t('m.parentProcess'), width: 14, prop: 'ppid' },
        { label: this.$t('m.processUser'), width: 14, prop: 'euser' },
        { label: this.$t('m.memoryUsage'), width: 14, slot: 'usage' },
        { label: this.$t('m.commandLine'), width: 14, prop: 'cmd' },
        { label: this.$t('m.state'), width: 14, prop: 'state' },
      ],
    };
  },
  created() {},
  mounted() {},
  watch: {
    nodeId: {
      handler(val) {
        if (val && this.sceneId) {
          this.getNetPortData();
          this.getPortData();
          this.getProcessData();
          clearInterval(this.timeInterval);
          this.timeInterval = setInterval(() => {
            this.getNetPortData();
            this.getPortData();
            this.getProcessData();
          }, 1000 * 5);
        } else {
          clearInterval(this.timeInterval);
          this.networkPortData = [];
          this.portData = [];
          this.processData = [];
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
    //获取网络端口数据
    getNetPortData() {
      const params = {
        page: 1,
        per_page: 999,
        sceneIds: this.sceneId,
        nodeIds: [this.nodeId],
        endTime: this.replayTime,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getNetworkPortTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.networkPortData = data;
      });
    },
    //获取端口数据
    getPortData() {
      const params = {
        page: 1,
        per_page: 999,
        sceneIds: this.sceneId,
        nodeIds: [this.nodeId],
        endTime: this.replayTime,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getPortTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.portData = data;
      });
    },
    //获取进程数据
    getProcessData() {
      const params = {
        page: 1,
        per_page: 999,
        sceneIds: this.sceneId,
        nodeIds: [this.nodeId],
        endTime: this.replayTime,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getProcessTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.processData = data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.info-class-table {
  width: 100%;
  height: 100%;
  .radio-group {
    margin-bottom: 8px;
  }
  .network-port-table {
    height: 400px;
  }
  .port-table {
    height: 400px;
  }
  .process-table {
    height: 400px;
  }
}
</style>
