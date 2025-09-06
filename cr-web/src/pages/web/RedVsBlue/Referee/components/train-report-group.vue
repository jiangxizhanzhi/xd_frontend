<template>
  <div class="train-report-group cyber-scroll-bar">
    <div class="person-static">
      <title-name :name="$t('m.personnelStatistics')" />
      <div class="com-box">
        <cb-search-table
          :cols="cols"
          :dataSource="reportData.users"
          :hidePaginOnDemand="true"
          :searchBarBg="false"
        >
          <template v-slot:goal="scope">
            <span :class="scope.data.score < 60 ? 'red-color' : 'cy-color'">{{
              scope.data.score
            }}</span>
          </template>
          <template v-slot:missionCompleted="scope">
            <span class="cy-color">{{
              scope.data.mission_completed[0] || '0'
            }}</span>
            /
            {{ scope.data.mission_completed[1] || '0' }}
          </template>
        </cb-search-table>
      </div>
    </div>
    <div class="person-score mt10">
      <title-name :name="$t('m.staffScore')" />
      <div
        v-if="echartUserData.xAxisData && echartUserData.xAxisData.length"
        class="com-box echart"
      >
        <student-score-histogram
          :theme="theme"
          :init-data="echartUserDataComputed"
          style="height: 200px"
        />
        <chart-previous
          class="previous"
          :idx="taskFinishedEchartsIdx"
          @click="taskFinishedEchartsIdx = taskFinishedEchartsIdx - 1"
        />
        <chart-next
          class="next"
          :len="echartUserData.xAxisData ? echartUserData.xAxisData.length : 0"
          :idx="taskFinishedEchartsIdx"
          @click="taskFinishedEchartsIdx = taskFinishedEchartsIdx + 1"
        />
      </div>
      <!-- 无数据 -->
      <div v-else class="no-data">
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          <div>{{ $t('m.noData') }}</div>
        </div>
      </div>
    </div>
    <div class="task-static mt10">
      <title-name :name="$t('m.taskStatistical')" />
      <div class="com-box" style="height: 190px">
        <div style="width: 50%; height: 100%" class="fl">
          <task-statistical-pie
            :theme="theme"
            :id="'taskType'"
            :init-data="pieChartType"
            :isTeam="false"
          />
        </div>
        <div style="width: 50%; height: 100%" class="fl">
          <task-statistical-pie
            :id="'rightTaskStatistical'"
            :init-data="pieChartStatistical"
            :theme="theme"
            :isTeam="false"
          />
        </div>
      </div>
    </div>
    <div class="btn-box" style="margin-top: 16px; padding-bottom: 50px">
      <cb-button hollow @click="exportTemplate">
        {{ $t('m.export') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
import TitleName from './TitleName';
import StudentScoreHistogram from '@/pages/web/team-train/components/student_score_histogram.vue';
import ChartPrevious from '@/components/chart-step/chart-step-previous.vue';
import ChartNext from '@/components/chart-step/chart-step-next.vue';
import taskStatisticalPie from '@/components/Echarts/taskPie.vue';

export default {
  components: {
    TitleName,
    StudentScoreHistogram,
    ChartPrevious,
    ChartNext,
    taskStatisticalPie,
  },
  props: {
    current: {
      type: [Number],
      default: 4,
    },
  },
  data() {
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: '',
      reportData: {
        users: [],
      },
      taskFinishedEchartsIdx: 0,
      echartUserData: {
        xAxisData: [],
        yAxisData: [],
      },
      pieChartType: {
        name: this.$t('m.taskCategory'),
        list: [],
      },
      pieChartStatistical: {
        name: this.$t('m.taskStatistics'),
        list: [],
      },
      missionsType: [
        { label: this.$t('m.notIssued'), value: 'unpublished_proportion' },
        { label: this.$t('m.unsubmitted'), value: 'not_submit_proportion' },
        { label: this.$t('m.undone'), value: 'not_finish_proportion' },
        { label: this.$t('m.hasReport'), value: 'finish_proportion' },
      ],
    };
  },
  computed: {
    echartUserDataComputed() {
      const { echartUserData, taskFinishedEchartsIdx } = this;
      const step = 10;
      const copy = JSON.parse(JSON.stringify(echartUserData));
      const dataLabel = _.get(echartUserData, 'xAxisData', []);
      if (dataLabel.length > step) {
        const start = taskFinishedEchartsIdx * step;
        const end = (taskFinishedEchartsIdx + 1) * step;
        copy.xAxisData = copy.xAxisData.slice(start, end);
        copy.yAxisData = copy.yAxisData.slice(start, end);
      }
      return copy;
    },
    cols() {
      const that = this;
      return [
        {
          label: that.$t('m.member'),
          prop: 'user_name',
        },
        {
          label: that.$t('m.role'),
          prop: 'role_name',
        },
        {
          label: that.$t('m.goal'),
          slot: 'goal',
        },
        {
          label: that.$t('m.taskComplete'),
          prop: 'mission_completed',
          slot: 'missionCompleted',
        },
        {
          label: that.$t('m.remark'),
          getData(row) {
            return row.comment || '-';
          },
        },
      ];
    },
  },
  watch: {
    current: {
      handler(nv) {
        this.echartUserData.xAxisData = [];
        this.echartUserData.yAxisData = [];
        this.pieChartType.list = [];
        this.pieChartStatistical.list = [];
        this.reportData.user = [];
        this.initReportData();
        this.initEchartsData();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.listen.createListen();
  },
  mounted() {},
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 初始化报告数据
    initReportData() {
      this.$request
        .get(
          `/cr/red_vs_blue/red_vs_blue/get_training_report`,
          {
            resource_id: this.$route.params.resource_id,
            role_group: this.current,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.reportData = JSON.parse(JSON.stringify(data));
          // 人员得分数据
          _.forEach(data.users, (item) => {
            this.echartUserData.xAxisData.push(item.user_name);
            this.echartUserData.yAxisData.push(item.score || '0');
          });
        });
    },
    // 获取表格数据
    initEchartsData() {
      this.$request
        .get(
          `/cr/red_vs_blue/red_vs_blue/get_training_mission_report`,
          {
            resource_id: this.$route.params.resource_id,
            role_group: this.current,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          // 任务分类
          const categoryArr = [];
          for (const i in data.missions_category) {
            categoryArr.push({ value: data.missions_category[i], name: i });
          }
          this.pieChartType.list = categoryArr;
          // 任务统计
          const statisticsArr = [];
          for (const i in data.missions_statistics) {
            statisticsArr.push({
              value: data.missions_statistics[i],
              name: this.missionsType.find((ele) => ele.value === i).label,
            });
          }
          this.pieChartStatistical.list = statisticsArr;
        });
    },
    // 红蓝对抗任务报告导出
    exportTemplate() {
      this.$request
        .binaryDownload(
          'get',
          '/cr/red_vs_blue/red_vs_blue/train2pdf',
          { room_id: this.$route.params.resource_id, role_group: this.current },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
    },
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
    },
  },
};
</script>
<style lang="scss">
.train-report-group {
  .host-title {
    padding-left: 0;
  }
}
</style>
<style lang="scss" scoped>
.mt10 {
  margin-top: 10px;
}
.train-report-group {
  padding: 20px 15px;
  height: 100%;
  overflow-y: auto;
  .com-box {
    background: var(--bg-color-3);
  }
  .person-score {
    .echart {
      position: relative;
      height: 220px;
      padding: 20px 32px 0 32px;
      .previous {
        position: absolute;
        left: 32px;
        bottom: 5px;
        cursor: pointer;
      }
      .next {
        position: absolute;
        right: 45px;
        bottom: 5px;
        cursor: pointer;
      }
    }
    .no-data {
      position: relative;
      background: var(--bg-color-3);
      width: 100%;
      height: 200px;
      font-size: 14px;
      .info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .btn-box {
    display: flex;
    justify-content: end;
  }
}
</style>
