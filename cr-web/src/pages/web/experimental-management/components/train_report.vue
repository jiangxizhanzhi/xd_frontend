<template>
  <div id="trainReportComponent">
    <div class="teacherInfo">
      <span
        style=""
        class="one-overflow fontColor"
        :title="$t('m.trainTeacher')"
        >{{ $t('m.trainTeacher') }}:</span
      >
      <span
        style="margin-right: 3%"
        class="one-overflow fontColor"
        :title="reportData.teacher_name || ''"
      >
        {{ reportData.teacher_name || $t('m.no') }}
      </span>
      <span style="" class="one-overflow fontColor" :title="$t('m.trainTime')">
        {{ $t('m.trainsTimes') }}:
      </span>
      <span
        style="margin-right: 3%"
        class="one-overflow fontColor"
        :title="reportData.scene_start_time || ''"
      >
        {{ reportData.scene_start_time || $t('m.no') }}
      </span>
      <span
        style=""
        class="one-overflow fontColor"
        :title="$t('m.trainDuration')"
      >
        {{ $t('m.trainDuration') }}:
      </span>
      <span
        class="one-overflow fontColor"
        :title="reportData.training_time || ''"
      >
        {{ reportData.training_time || $t('m.no') }}
      </span>
    </div>
    <cb-button
      size="medium"
      hollow
      class="export-button"
      @click="exportTemplate"
      >{{ $t('m.export') }}</cb-button
    >
    <div class="personnelStatistics">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.personnelStatistics')"
          class=""
        />
      </div>
      <div class="userCommon elc-table" style="background: none">
        <cb-search-table
          :cols="cols"
          :dataSource="reportData.users"
          :hidePaginOnDemand="true"
          border
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
          <template v-slot:trainRecord="scope">
            <cb-button
              type="text"
              icon="icon-chakan"
              @click="viewRecord(scope.data)"
              >{{ $t('m.check') }}</cb-button
            >
          </template>
        </cb-search-table>
      </div>
    </div>
    <div class="staffScore">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.staffScore')"
          class=""
        />
      </div>
      <div class="userScore echart border-contents">
        <student-score-histogram
          :theme="theme"
          :init-data="echartUserDataComputed"
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
    </div>
    <div class="taskStatistical">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.taskStatistical')"
          class=""
        />
      </div>
      <div
        style="width: calc(100% - 20px)
        height: 100%;overflow: hidden;"
        class="border-contents"
      >
        <div
          v-if="pieChartType.list.length > 0"
          style="width: 76%; height: 160px; margin-top: 6px"
        >
          <task-statistical-pie
            :theme="theme"
            :id="'taskType'"
            :init-data="pieChartType"
          />
        </div>
        <div style="width: 76%; height: 160px">
          <task-statistical-pie
            :id="'rightTaskStatistical'"
            :init-data="pieChartStatistical"
            :theme="theme"
          />
        </div>
      </div>
    </div>
    <cb-dialog
      :visible.sync="showRecordDialog"
      width="66%"
      class="task-answer-dialog"
      :append-to-body="true"
      center
    >
      <div slot="title" class="header-title">
        <span class="title-name">{{ $t('m.trainRecord') }}</span>
      </div>
      <train-record
        ref="trainRecord"
        :task-lists="taskLists"
        style="height: 500px"
      />
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import taskStatisticalPie from '@/components/Echarts/taskPie.vue';
import TrainRecord from '@/pages/web/team-train/components/train_record.vue';
import StudentScoreHistogram from '@/pages/web/team-train/components/student_score_histogram.vue';
import { singleFormatTime } from '@/assets/js/tools.js';
import ChartPrevious from '@/components/chart-step/chart-step-previous.vue';
import ChartNext from '@/components/chart-step/chart-step-next.vue';
export default {
  name: 'ScriptExecution',
  components: {
    TitleDirector,
    taskStatisticalPie,
    TrainRecord,
    StudentScoreHistogram,
    ChartPrevious,
    ChartNext,
  },
  data() {
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: '',
      teacherName: '',
      trainTime: '',
      trainAllTime: '',
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
      showRecordDialog: false,
      taskLists: [],
      resource_id: '',
      reportData: {
        training_time: '',
        users: [],
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
          label: that.$t('m.trainRecord'),
          prop: 'trainRecord',
          slot: 'trainRecord',
        },
        {
          label: that.$t('m.remark'),
          prop: 'comment',
        },
      ];
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.initReportData();
    this.initEchartsData();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 训练报告下载
    //综合演训,训练报告导出
    exportTemplate() {
      this.$request
        .binaryDownload(
          'get',
          '/cr/training_team/training_team/train2pdf',
          { room_id: this.resource_id },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
    },
    // 监听换肤，动态reload ecahrts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
    },
    // 初始化报告数据
    initReportData() {
      this.$request
        .get(
          '/cr/training_team/training_team/get_training_report',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const dataBakup = _.get(res, 'data.data', {});
          this.reportData = dataBakup;

          this.reportData.training_time = singleFormatTime(
            dataBakup.training_time,
            this,
          );
          // 人员得分数据
          _.forEach(dataBakup.users, (item) => {
            this.echartUserData.xAxisData.push(item.user_name);
            this.echartUserData.yAxisData.push(item.score || '0');
          });
        });
    },
    // 获取表格数据
    initEchartsData() {
      // 获取表格数据
      this.$request
        .get(
          '/cr/training_team/training_team/get_training_mission_report',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const dataBakup = _.get(res, 'data.data', {});
          // 任务分类
          const categoryArr = [];
          for (const i in dataBakup.missions_category) {
            categoryArr.push({
              value: dataBakup.missions_category[i],
              name: i,
            });
          }
          this.pieChartType.list = categoryArr;
          // 任务统计
          const statisticsArr = [];
          for (const i in dataBakup.missions_statistics) {
            statisticsArr.push({
              value: dataBakup.missions_statistics[i],
              name: this.missionsType.find((ele) => ele.value === i).label,
            });
          }
          this.pieChartStatistical.list = statisticsArr;
        });
    },
    viewRecord(row) {
      // 查看训练记录
      this.$request
        .get(
          '/cr/training_team/training_team/get_training_record',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: row.user_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )

        // 查看训练记录
        .then((res) => {
          _.forEach(res.data.data, (item) => {
            this.$set(item, 'level', 1);
            this.$set(item, 'name', item.stage);
            this.$set(item, 'children', item.missions);
            _.forEach(item.children, (list) => {
              this.$set(list, 'name', list.title);
              this.$set(list, 'level', 2);
              this.$set(list, 'state', 1);
            });
          });
          this.taskLists = res.data.data;
          // this.taskLists = res.data;
        })
        .catch(() => {
          // this.$message.error(this.$t('m.failedToGetTrainingRecords'));
        });

      this.showRecordDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
#trainReportComponent {
  position: relative;
  width: 100%;
  min-height: 100%;
  .teacherInfo {
    width: 100%;
    height: 25px;
    line-height: 22px;
    margin: 10px 0;
    font-size: 14px;
    text-align: left;
    // span {
    //   margin: 0 0 0 1%;
    // }
  }
  .personnelStatistics {
    width: 100%;
    height: 30%;
  }
  .userCommon {
    width: calc(100% - 20px);
    min-height: 160px;
    .btn-icon-look {
      vertical-align: middle;
      padding-right: 3px;
    }
  }
  .staffScore {
    width: 100%;
    min-height: 180px;
    .userScore {
      width: calc(100% - 20px);
      height: 180px;
      padding: 15px 10px;
    }
  }
  .common-title-div {
    padding-bottom: 6px;
    ::v-deep .common-title {
      // margin-left: 8px;
      .name-div {
        font-size: 14px !important;
        height: 30px;
        // line-height: 30px;
      }
    }
  }
  .echart {
    position: relative;
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
  .export-button {
    position: absolute;
    right: 20px;
    top: 0px;
  }
}
.task-answer-dialog {
  margin: 0 auto 0;
  ::v-deep .cb-dialog-body {
    height: 500px !important;
    padding: 0 20px 15px 5px !important;
    box-sizing: border-box;
    border-bottom: 0 !important;
  }
}
#trainReportComponent .border-contents {
  background: var(--bg-color-4);
  margin-bottom: 24px;
}
</style>
