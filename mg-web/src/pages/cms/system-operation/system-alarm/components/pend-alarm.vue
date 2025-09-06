<template>
  <div class="pending-alarm-page">
    <div class="title">
      <span></span>
      <span>{{ $t('systemOperation.systemAlarm.alarmMessage') }}</span>
    </div>
    <div class="table">
      <div class="mb15">
        <cb-radio-group v-model="activeAlarm">
          <cb-radio-button
            :label="$t('systemOperation.systemAlarm.pendAlarm')"
          ></cb-radio-button>
          <cb-radio-button
            :label="$t('systemOperation.systemAlarm.alarmRecord')"
          ></cb-radio-button>
        </cb-radio-group>
      </div>
      <cb-search-table
        v-if="activeAlarm === $t('systemOperation.systemAlarm.pendAlarm')"
        :cols.sync="cols"
        :showIndex="true"
        url="/devops/cluster/system_alarm/page"
        baseURL="/api/mp"
        row-key="log_name"
        :searchBarBg="false"
      >
        <template v-slot:operate="scope">
          <cb-button type="text" @click="seeDetail(scope.data.alarm_type)">{{
            $t('systemOperation.systemAlarm.detail')
          }}</cb-button>
        </template>
      </cb-search-table>
      <cb-search-table
        v-else-if="
          activeAlarm === $t('systemOperation.systemAlarm.alarmRecord')
        "
        :cols.sync="colsRecord"
        :showIndex="true"
        url="/devops/cluster/system_alarm/page"
        :data="queryAlarm"
        baseURL="/api/mp"
        row-key="log_name"
        :searchBarBg="false"
      >
      </cb-search-table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
  data() {
    return {
      activeAlarm: this.$t('systemOperation.systemAlarm.pendAlarm'),
      queryAlarm: {
        alarmStatus: 1,
      },
      comCols: [
        {
          label: this.$t('systemOperation.systemAlarm.alarmType'),
          getData: (row) => {
            if (row.alarm_type == '0') {
              return this.$t('systemOperation.systemAlarm.cloudService');
            } else if (row.alarm_type == '1') {
              return this.$t('systemOperation.systemAlarm.businessService');
            } else if (row.alarm_type == '2') {
              return this.$t('systemOperation.systemAlarm.server');
            }
          },
        },
        {
          label: this.$t('systemOperation.monitorBusiness.serviceName'),
          prop: 'servername',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('systemOperation.systemAlarm.nodeName'),
          prop: 'hostname',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('systemOperation.systemAlarm.alarmInfo'),
          prop: 'alarm_msg',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('systemOperation.systemAlarm.startTime'),
          prop: 'create_time',
        },
      ],
      cols: [],
      colsRecord: [],
    };
  },
  created() {
    this.cols = [
      ...this.comCols,
      {
        label: this.$t('systemOperation.systemAlarm.operate'),
        slot: 'operate',
      },
    ];
    this.colsRecord = [...this.comCols];
  },
  mounted() {},
  methods: {
    seeDetail(data) {
      if (data == 1) {
        this.$router.push({
          name: 'business-service-monitoring',
        });
      } else {
        this.$router.push({
          name: 'cloud-platform-monitoring',
        });
      }
    },
    getFormateTime(val) {
      const formateTime = dayjs.duration(val, 's');
      const asDays = parseInt(dayjs.duration(val, 's').asDays());
      const days = asDays;
      const hours = formateTime.$d.hours;
      const minutes = formateTime.$d.minutes;
      const seconds = formateTime.$d.seconds;
      const getDay =
        days > 0 ? `${days}${this.$t('systemOperation.scene.day')}` : '';
      const getHour =
        hours > 0 ? `${hours}${this.$t('systemOperation.scene.hour')}` : '';
      const getMin =
        minutes > 0 ? `${minutes}${this.$t('systemOperation.scene.min')}` : '';
      const getSec =
        seconds > 0
          ? `${seconds}${this.$t('systemOperation.scene.second')}`
          : '';
      const timeFormat = `${getDay}${getHour}${getMin}${getSec}`;
      return timeFormat;
    },
  },
};
</script>
<style lang="scss" scoped>
.pending-alarm-page {
  width: 100%;
  color: var(--neutral8);
  padding: 16px;
  background: var(--bg-color-2);
  .table {
    margin-top: 15px;
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
