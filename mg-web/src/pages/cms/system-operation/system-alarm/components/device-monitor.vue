<template>
  <div class="device-monitor-page">
    <div class="select-area">
      <cb-select
        class="select"
        v-model="nodeValue"
        :options="nodeList"
        @change="changeNode"
      ></cb-select>
    </div>
    <div class="card-area">
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.cpuUsage)"
          :explain="$t('systemOperation.systemAlarm.cpuUsage')"
          :size-rate="cpuCore + $t('systemOperation.systemAlarm.core')"
          :progress-percentage="cpuUsage"
        />
      </div>
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.memoryUsage)"
          :explain="$t('systemOperation.systemAlarm.memoryUsage')"
          :size-rate="
            $t('systemOperation.systemAlarm.total') + memorySize + 'G'
          "
          :progress-percentage="memoryUsage"
        />
      </div>
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.diskUsage)"
          :explain="$t('systemOperation.systemAlarm.diskUsage')"
          :size-rate="$t('systemOperation.systemAlarm.total') + diskSize + 'T'"
          :progress-percentage="diskUsage"
        />
      </div>
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.diskIoUsage)"
          :explain="$t('systemOperation.systemAlarm.ioUsageRate')"
          :size-rate="hardDiskIo"
          :progress-percentage="diskIoUsage"
        />
      </div>
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.upIoUsage)"
          :explain="$t('systemOperation.systemAlarm.rateOfUplink')"
          :size-rate="networkUpIo"
          :progress-percentage="upIoUsage"
        />
      </div>
      <div class="com-monitor-card">
        <monitor-card
          :progress-color="getProgressColor(this.downIoUsage)"
          :explain="$t('systemOperation.systemAlarm.rateOfDescent')"
          :size-rate="networkDownIo"
          :progress-percentage="downIoUsage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getNewNodeList, getDeviceMonitorInfo } from '@/api/system-op';
import MonitorCard from './monitor-card.vue';
export default {
  components: {
    MonitorCard,
  },
  data() {
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      hardDiskIo: '',
      networkUpIo: '',
      networkDownIo: '',
      cpuCore: 0,
      memorySize: 0,
      diskSize: 0,
      nodeValue: '',
      nodeList: [],
      diskIoUsage: 0, // 磁盘IO使用率
      upIoUsage: 0, //上行速率
      downIoUsage: 0, // 下行速率
    };
  },
  created() {},
  mounted() {
    this.getMonitorInfo();
  },
  computed: {},
  methods: {
    getProgressColor(val) {
      if (val < 25) {
        return 'var(--cyan-color)';
      } else if (val >= 25 && val < 50) {
        return 'var(--blue-color)';
      } else if (val >= 50 && val < 75) {
        return 'var(--yellow-color)';
      } else {
        return 'var(--red-color)';
      }
    },
    getSpeed(size) {
      //把速率转换成正常大小
      const num = 1024.0; //byte
      if (size < num) {
        return size + 'B/s';
      } else if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(1) + 'K/s'; //KB
      } else if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(1) + 'M/s'; //M
      } else if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(1) + 'G/s'; //G
      } else {
        return (size / Math.pow(num, 4)).toFixed(1) + 'T/s'; //T
      }
    },
    changeNode() {
      this.getMonitorData();
    },
    getMonitorInfo() {
      getNewNodeList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        if (data.length > 0) {
          data.forEach((item) => {
            this.nodeList.push({
              label: item.name,
              value: item.name,
            });
          });
          this.nodeValue = data[0].name;
          this.getMonitorData();
        }
      });
    },
    getMonitorData() {
      const object = {
        agentNames: this.nodeValue,
      };
      getDeviceMonitorInfo(object).then((res) => {
        const data = _.get(res, 'data.data', []);
        if (data.length > 0) {
          this.cpuUsage = data[0].cpu_percent;
          this.memoryUsage = data[0].ram_percent;
          this.diskUsage = data[0].disk_percent;
          //byte/s 转换,硬盘IO为读写速率相加
          this.hardDiskIo = this.getSpeed(
            data[0].disk_read_bytes + data[0].disk_write_bytes,
          );
          //kb/s 去除单位后转换
          const download_speed = data[0].max_download_speed;
          const up_speed = data[0].max_upload_speed;
          const networkDownRate = download_speed.substring(
            0,
            download_speed.length - 4,
          );
          const networkUpRate = up_speed.substring(0, up_speed.length - 4);
          this.networkDownIo = this.getSpeed(networkDownRate * 1024);
          this.networkUpIo = this.getSpeed(networkUpRate * 1024);
          this.cpuCore = data[0].cpu;
          //MB转GB
          this.memorySize = (data[0].ram / 1024).toFixed(2);
          //GB转T
          this.diskSize = (data[0].disk / 1024).toFixed(2);

          this.diskIoUsage = data[0].disk_io_percent.toFixed(2);
          this.upIoUsage = data[0].upload_percent.toFixed(2);
          this.downIoUsage = data[0].download_percent.toFixed(2);
        }
      });
    },
    cpuFormat(percentage) {
      return (
        percentage +
        '%\n' +
        this.$t('systemOperation.systemAlarm.total') +
        this.cpuCore +
        this.$t('systemOperation.systemAlarm.core')
      );
    },
    memoryFormat(percentage) {
      return (
        percentage +
        '%\n' +
        this.$t('systemOperation.systemAlarm.total') +
        this.memorySize +
        'G'
      );
    },
    diskFormat(percentage) {
      return (
        percentage +
        '%\n' +
        this.$t('systemOperation.systemAlarm.total') +
        this.diskSize +
        'T'
      );
    },
    hardDiskFormat() {
      return this.hardDiskIo;
    },
    networkUpFormat() {
      return this.networkUpIo;
    },
    networkDownFormat() {
      return this.networkDownIo;
    },
  },
};
</script>
<style lang="scss" scoped>
.device-monitor-page {
  width: 100%;
  padding: 16px 0 0;
  background: var(--bg-color-2);
  color: var(--neutral8);
  position: relative;
  .select-area {
    position: absolute;
    top: -38px;
    right: 0;
  }
  .card-area {
    display: flex;
    justify-content: space-between;
    .com-monitor-card {
      width: calc(16.67% - 6.67px);
      height: 100px;
      background: var(--neutral0);
      border-radius: 4px;
    }
  }
  .chart-area {
    display: flex;
    margin-top: 36px;
    justify-content: space-around;
    .progress-area {
      width: 15%;
      text-align: center;
    }
  }
  //css 进度条文字的样式
  ::v-deep .cb-progress-circle__text {
    white-space: pre;
    font-size: 14px !important;
    line-height: 20px;
  }
  ::v-deep .cb-progress-circle__text:first-line {
    font-size: 22px;
    line-height: 30px;
    color: var(--neutral8);
  }
  .title {
    font-size: 16px;
    display: flex;
    align-items: center;
    color: var(--font-color-primary);
    span:first-child {
      width: 6px;
      height: 8px;
      margin-right: 10px;
      background: var(--primary-color);
    }
  }
}
</style>
