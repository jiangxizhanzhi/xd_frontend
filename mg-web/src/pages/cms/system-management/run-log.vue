<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols="cols"
      :data.sync="query"
      :selector="selector"
      :selection.sync="selection"
      url="/devops/log/runtime_log/logs"
      baseURL="/api/mp"
      ref="logListRef"
      row-key="id"
      :searchBarBg="true"
      :show-search-btn="true"
      :queryStrKeep="['startDate', 'endDate', 'type']"
      @reset="handleReset"
    >
      <template v-slot:search>
        <cb-button
          :loading="true"
          @click="exportLog(selection, $event)"
          :disabled="selection.length === 0"
          >{{ $t('systemManagement.system.batchDownload') }}</cb-button
        >
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="query.type"
          style="margin-right: 10px"
          :first="{
            label: $t('systemManagement.system.allModules'),
            value: '',
          }"
          :options="options"
          clearable
        />
        <cb-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          :start-placeholder="
            $t('systemOperation.eventAnalysis.selectStartTime')
          "
          :end-placeholder="$t('systemOperation.eventAnalysis.selectEndTime')"
        ></cb-date-picker>
      </template>
      <template v-slot:category="scope">
        <span>{{ optionsLabels[scope.data.log_report_type_enum] || '-' }}</span>
      </template>
      <template v-slot:download="scope">
        <cb-button type="text" @click="exportLog(scope.data, $event)">{{
          $t('systemManagement.system.download')
        }}</cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getRunLogTypes } from '@/api/system-management.ts';
export default {
  data() {
    return {
      query: {
        type: '',
        startDate: '',
        endDate: '',
      },
      options: [],
      optionsLabels: {},
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('systemManagement.system.moduleName'),
          //MP:中台，BC:实训&靶场，CP:云平台，AD:竞赛
          // getData: (row) => {
          //   return this.optionsLabels[row.log_report_type_enum];
          // },
          slot: 'category',
        },
        {
          label: this.$t('systemManagement.system.logName'),
          prop: 'log_name',
        },
        {
          label: this.$t('systemManagement.system.ipAddress'),
          prop: 'host_ip',
        },
        {
          label: this.$t('systemManagement.system.updateDate'),
          prop: 'last_modify_time',
        },
        {
          label: this.$t('systemManagement.system.logSize'),
          prop: 'size',
          getData: (row, size) => {
            const bytes = parseInt(size);
            if (!bytes) {
              return 0;
            }
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
          },
        },
        {
          label: this.$t('systemManagement.system.operate'),
          slot: 'download',
        },
      ],
      resource_id: '',
    };
  },
  created() {
    this.getRunLogOptions();
  },
  computed: {
    dateRange: {
      get() {
        const { startDate, endDate } = this.query;
        return [startDate, endDate];
      },
      set(arr) {
        this.query.startDate = _.get(arr, '[0]', '')
          ? _.get(arr, '[0]', '') + ' ' + '00:00:00'
          : '';
        this.query.endDate = _.get(arr, '[1]', '')
          ? _.get(arr, '[1]', '') + ' ' + '23:59:59'
          : '';
      },
    },
  },
  methods: {
    handleReset() {
      this.query.type = '';
      this.dateRange = ['',''];
    },
    getRunLogOptions() {
      getRunLogTypes().then((res) => {
        const tempList = _.get(res, 'data.data', []);
        this.options = tempList.map((item) => {
          this.optionsLabels[item.code] = item.name;
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },
    exportLog(data, done) {
      //单独下载
      if (!Array.isArray(data)) {
        const temp = [];
        temp.push(data);
        data = temp;
      }
      //此处遍历下载文件不合理，接口正在优化
      _.forEach(data, (item) => {
        let axiosBaseUrl = '';
        if (item.log_report_type_enum === 'MP') {
          axiosBaseUrl = '/api/mp';
        } else if (item.log_report_type_enum === 'BC') {
          axiosBaseUrl = '/api/ojj';
        } else if (item.log_report_type_enum === 'AD') {
          axiosBaseUrl = '/api/ct';
        } else if (item.log_report_type_enum === 'CP') {
          axiosBaseUrl = '/api/mp';
        } else if (item.log_report_type_enum === 'OJ') {
          //待提供
        }
        this.$request
          .binaryDownload(
            'get',
            item.download_url,
            {},
            {
              baseURL: axiosBaseUrl,
            },
          )
          .finally(() => {
            done();
          });
      });
    },
  },
};
</script>
