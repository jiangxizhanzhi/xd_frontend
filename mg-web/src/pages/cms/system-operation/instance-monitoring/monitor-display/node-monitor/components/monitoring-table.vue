<template>
  <div>
    <div class="testing-object">
      <!-- 回放表格 -->
      <cb-search-table
        ref="recordTable"
        :cols="columns"
        row-key="resource_id"
        :selector="tableSelector"
        :selection.sync="selection"
        :data="query"
        :background="true"
        url="/cscene/cscene_instances/list_recordings"
        baseURL="/api/mp"
        showIndex
        :searchBarBg="false"
      >
        <!-- 日期选择 -->
        <template v-slot:search>
          <slot name="search">
            <cb-date-picker
              v-model="value2"
              type="daterange"
              align="right"
              unlink-panelsc
              :range-separator="$t('systemOperation.nodeMonitoring.to')"
              :start-placeholder="
                $t('systemOperation.nodeMonitoring.startDate')
              "
              :end-placeholder="$t('systemOperation.nodeMonitoring.endDate')"
              @change="changeTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </cb-date-picker>
            <cb-button icon="icon-daoru" @click="downLoad()"
              >{{ $t('systemOperation.nodeMonitoring.download') }}
            </cb-button>
          </slot>
        </template>
        <template v-slot:operation="scope">
          <cb-button type="text" @click="playVideo(scope.data)">
            {{ $t('systemOperation.nodeMonitoring.play') }}
          </cb-button>
        </template>
      </cb-search-table>
    </div>
  </div>
</template>
<script>
import Utils from '@/utils/utils';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
  name: 'MonitoringModal',
  props: {
    sceneId: {
      type: String,
      default: '',
    },
    elementId: {
      type: String,
      default: '',
    },
  },
  data() {
    const that = this;
    return {
      query: {
        search: '',
        value2: '',
        ids: [this.sceneId],
        nodeIds: [this.elementId],
        startTime: '',
        endTime: '',
      },
      selection: [],
      tableSelector: {
        maxSelect: 0,
      },
      columns: [
        {
          label: this.$t('systemOperation.nodeMonitoring.user'),
          prop: 'username',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.organization'),
          prop: 'org_name',
          getData: (data) => {
            const { org_name } = data;
            if (org_name) {
              const splitOrg = org_name.split('|');
              return splitOrg[splitOrg.length - 1];
            }
            return '';
          },
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.sceneName'),
          prop: 'scene_name',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.screenFile'),
          prop: 'filename',
          width: '148px',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.fileSize'),
          getData: (data) => {
            const { filesize } = data;
            return Utils.filterSize(filesize);
          },
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.screenTime'),
          prop: 'duration',
          getData: (data) => {
            const { duration } = data;
            return that.getFormateTime(duration);
          },
          width: '148px',
        },
        {
          label: this.$t('systemManagement.system.operate'),
          slot: 'operation',
        },
      ],
      value2: '',
    };
  },
  watch: {},
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
    changeTime(val) {
      if (val) {
        this.query.startTime = val[0];
        this.query.endTime = val[1];
      } else {
        this.query.startTime = '';
        this.query.endTime = '';
      }
    },
    downLoad() {
      if (this.selection <= 0) {
        this.$message.error(
          this.$t(
            'systemOperation.nodeMonitoring.selectTheFileYouWantToDownload',
          ),
        );
      } else {
      }
      this.selection.forEach((item) => {
        const iframeNode = document.createElement('iframe');
        iframeNode.src = item.file_url;
        document.body.appendChild(iframeNode);
        const timer = setInterval(() => {
          const iframeDoc =
            iframeNode.contentDocument || iframeNode.contentWindow.document;
          if (
            iframeDoc.readyState === 'complete' ||
            iframeDoc.readyState === 'interactive' ||
            iframeDoc.readyState === 'loaded'
          ) {
            clearInterval(timer);
            document.body.removeChild(iframeNode);
          }
        }, 500);
      });
    },
    playVideo(row) {
      this.$emit('playVideo', row);
    },
  },
};
</script>
