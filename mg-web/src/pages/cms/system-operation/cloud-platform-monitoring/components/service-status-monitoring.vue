<template>
  <cb-search-table
    ref="table"
    :cols="cols"
    url="/devops/cluster/monitor/cp_page/"
    row-key="resource_id"
    baseURL="/api/mp"
    :data="query"
    class="service-table"
    :searchBarBg="false"
  >
    <template slot="searchRightArea">
      <div class="search">
        <cb-select
          v-model="query.hostName"
          :options="options"
          clearable
          :first="{
            value: '',
            label: $t('systemOperation.cloudPlatform.allNode'),
          }"
        ></cb-select></div
    ></template>
    <template v-slot:state="scope">
      <div
        v-show="scope.data.state !== 'RESTARTING'"
        :class="
          scope.data.state === 'RUNNING'
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <div>
        <span v-if="scope.data.state === 'RUNNING'">{{
          $t('systemOperation.cloudPlatform.run')
        }}</span>
        <span v-else-if="scope.data.state === 'RESTARTING'">{{
          $t('systemOperation.monitorBusiness.restarting')
        }}</span>
        <span v-else>{{ $t('systemOperation.cloudPlatform.disabled') }}</span>
      </div>
    </template>
    <template v-slot:operate="scope">
      <cb-button
        :disabled="scope.data.disable_restart"
        :warnMsg="warnMessage"
        :completeMsg="completeMessage"
        @click="reStart(scope.data, $event)"
        type="text"
      >
        {{ $t('systemOperation.cloudPlatform.reStart') }}
      </cb-button>
    </template>
  </cb-search-table>
</template>

<script>
import _ from 'lodash';
import { restart, getNodeList } from '@/api/system-op';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
  data() {
    return {
      timer: null,
      cols: [],
      options: [],
      query: {
        hostName: '',
      },
    };
  },
  computed: {
    warnMessage() {
      return this.$t('systemOperation.cloudPlatform.confirmReStart');
    },
    completeMessage() {
      return this.$t('systemOperation.cloudPlatform.successRestart');
    },
  },
  created() {
    const that = this;

    that.cols = [
      {
        label: this.$t('systemOperation.cloudPlatform.servie'),
        prop: 'name',
      },
      {
        label: this.$t('systemOperation.systemAlarm.nodeName'),
        prop: 'hostname',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.IPAdress'),
        prop: 'ip',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.serverStatus'),
        slot: 'state',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.runTime'),
        getData(row) {
          return that.getFormatTime(row.uptime);
        },
      },
      {
        label: this.$t('systemOperation.cloudPlatform.operate'),
        slot: 'operate',
      },
    ];
  },
  mounted() {
    const that = this;
    that.getOptions();
    this.timer = setInterval(() => {
      this.$refs.table.reload();
    }, 180000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getOptions() {
      const that = this;
      getNodeList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        that.options = data.map((item) => {
          return {
            label: item.name,
            value: item.name,
          };
        });
      });
    },
    reStart(data, done) {
      const that = this;
      const object = {
        hostname: data.hostname,
        service_list: [data.service_name],
      };
      restart(object)
        .then((res) => {
          that.$refs.table.reload();
          done();
        })
        .catch((err) => {
          done(false);
        });
    },
    getFormatTime(val) {
      const formatDate = dayjs.duration(val, 's');
      const days = parseInt(dayjs.duration(val, 's').asDays());
      const hours = formatDate.$d.hours;
      const minutes = formatDate.$d.minutes;
      const seconds = formatDate.$d.seconds;
      const getDay =
        days > 0
          ? `${days}${this.$t('systemOperation.cloudPlatform.day')}`
          : '';
      const getHour =
        hours > 0
          ? `${hours}${this.$t('systemOperation.cloudPlatform.hour')}`
          : '';
      const getMinute =
        minutes > 0
          ? `${minutes}${this.$t('systemOperation.cloudPlatform.min')}`
          : '';
      const getSecond =
        seconds > 0
          ? `${seconds}${this.$t('systemOperation.cloudPlatform.second')}`
          : '';
      const timeFormat = `${getDay}${getHour}${getMinute}${getSecond}`;
      return timeFormat;
    },
  },
};
</script>
<style lang="scss" scoped>
.service-table {
  ::v-deep .ant-select-dropdown {
    z-index: 2001;
  }
}
.search {
  margin-top: -40px;
}
.circle {
  float: left;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 5px;
}
.color-disable {
  background-color: var(--red-color);
}
.color-running {
  background-color: var(--green-color);
}
</style>
