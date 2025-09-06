<template>
  <cb-inner-page :background="false">
    <div class="system-alarm">
      <div class="alarm-info">
        <alarm-info
          :alarmData="alarm_data"
          :nearWeekAlarmData="nearWeekAlarmData"
        ></alarm-info>
      </div>
      <div class="pend-info">
        <pend-alarm></pend-alarm>
      </div>
      <div class="device-monitor"></div>
      <div class="alarm-trend">
        <alarm-trend :alarmData="alarm_data"></alarm-trend>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import AlarmInfo from './components/alarm-info.vue';
import PendAlarm from './components/pend-alarm.vue';
import AlarmTrend from './components/alarm-trend.vue';
import { getSystemAlarmInfo, getNearWeeklyAlarm } from '@/api/system-op';
import dayjs from 'dayjs';
export default {
  components: {
    AlarmInfo,
    PendAlarm,
    AlarmTrend,
  },
  data() {
    return {
      alarm_data: {},
      nearWeekAlarmData: {},
    };
  },
  created() {},
  mounted() {
    this.getAlarmData();
    this.getNearWeekly();
  },
  methods: {
    getAlarmData() {
      getSystemAlarmInfo().then((res) => {
        this.alarm_data = res.data.data;
      });
    },
    getNearWeekly() {
      // 获取近一周分布
      const currentDay = dayjs().format('YYYY-MM-DD HH:mm:ss');
      getNearWeeklyAlarm({
        endTime: currentDay, //'2022-11-02 15:53:02',
      }).then((res) => {
        this.nearWeekAlarmData = res.data.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.system-alarm {
  width: 100%;
  padding-right: 16px;
  .pend-info {
    margin-top: 16px;
  }
  .device-monitor {
    margin-top: 16px;
  }
  .alarm-trend {
    margin-top: 16px;
  }
}
</style>
