<template>
  <cb-inner-page :background="false">
    <cb-search-table
      rowKey="resource_id"
      :cols="cols"
      :url="url"
      :baseURL="baseURL"
      :data.sync="query"
      ref="tableRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-select
          v-model="query.hostName"
          :first="{
            label: $t('systemOperation.monitorBusiness.allNodes'),
            value: '',
          }"
          :options="nodeList"
          clearable
        />
      </template>
      <template v-slot:state="scope">
        <span v-if="scope.data.state == 'RUNNING'">
          <span class="icon icon-normal"></span>
          <span>{{ $t('systemOperation.monitorBusiness.running') }}</span>
        </span>
        <span v-else-if="scope.data.state == 'RESTARTING'">
          <span>{{ $t('systemOperation.monitorBusiness.restarting') }}</span>
        </span>
        <span v-else>
          <span class="icon icon-abnormal"></span>
          <span>{{ $t('systemOperation.monitorBusiness.abnormal') }}</span>
        </span>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          :disabled="scope.data.disable_restart"
          :warnMsg="warnMessage"
          :completeMsg="completeMessage"
          type="text"
          @click="restart(scope.data, $event)"
        >
          {{ $t('systemOperation.monitorBusiness.restart') }}
        </cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
import { getNodeList, restart } from '@/api/system-op';
export default {
  data() {
    return {
      url: '/devops/cluster/biz_monitor/page',
      baseURL: '/api/mp',
      query: {
        hostName: '',
      },
      timer: null,
      nodeList: [],
      cols: [
        {
          label: this.$t('systemOperation.monitorBusiness.serviceName'),
          prop: 'name',
        },
        {
          label: this.$t('systemOperation.systemAlarm.nodeName'),
          prop: 'hostname',
        },
        {
          label: this.$t('systemOperation.monitorBusiness.ip'),
          prop: 'ip',
        },
        {
          label: this.$t('systemOperation.monitorBusiness.runTime'),
          getData: (row) => {
            return this.getFormateTime(row.uptime);
          },
        },
        {
          label: this.$t('systemOperation.monitorBusiness.serviceStatus'),
          slot: 'state',
        },
        {
          label: this.$t('systemOperation.monitorBusiness.operate'),
          slot: 'operate',
        },
      ],
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
  created() {},
  mounted() {
    this.getAllNode();
    this.timer = setInterval(() => {
      this.$refs.tableRef.reload();
    }, 180000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
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
    getAllNode() {
      getNodeList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        data.forEach((item) => {
          this.nodeList.push({
            label: item.name,
            value: item.name,
          });
        });
      });
    },
    restart(data, done) {
      const params = {
        hostname: data.hostname,
        service_list: [data.service_name],
      };
      restart(params)
        .then((res) => {
          this.$refs.tableRef.reload();
          done();
        })
        .catch((err) => {
          done(false);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  position: relative;
  top: -1px;
  right: 3px;
}
.icon-normal {
  background: var(--green-color);
}
.icon-abnormal {
  background: var(--red-color);
}
</style>
