<template>
  <div class="student-monitor-wrapper">
    <div class="header-wrap">
      <span class="title">人员学习分析详情</span>
      <cb-tabs v-model="activeName">
        <cb-tab-pane
          :label="$t('基本详情')"
          name="basic"
        > </cb-tab-pane>
        <cb-tab-pane
          :label="$t('课程学习')"
          name="study"
        ></cb-tab-pane>
      </cb-tabs>
    </div>
    <template v-if="activeName === 'basic'">
      <div class="name-box">
        <span class="name">{{ studyData.name }}</span>
        <div class="right-area">
          <div
            class="item"
            :class="{
              'active': active === index
            }"
            :key="index"
            v-for="(item, index) in list"
            @click="handlerClick(index)"
          >
            {{ item }}
          </div>
          <cb-date-picker
            style="width: 100%"
            v-model="form.date"
            type="datetimerange"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            popper-class="hide-clear-btn"
          >
          </cb-date-picker>
        </div>
      </div>

      <div class="analysis-wrap">
        <span class="title">教学分析</span>
        <div class="line"></div>
        <div class="course-wrap">
          <div class="course-item">
            <div class="outer">
              <span class="label">
                参与课程</span>
              <span class="value">{{ studyData.course_nums }}</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                完成课程</span>
              <span class="value">{{ studyData.finished_course_nums }}</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                参与课时</span>
              <span class="value">{{ studyData.lessonNums }}</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                完成课时</span>
              <span class="value">{{ studyData.finished_lesson_nums }}</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                训练时长（h）</span>
              <span class="value">10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="train-task-analysis">
        <div class="left-wrap">
          <span class="title">训练任务分析</span>
          <div class="line"></div>
          <div class="task-wrap">
            <div class="task-item">
              <div class="outer">
                <span class="label">
                  接收任务数量</span>
                <span class="value">{{ studyData.taskNums }}</span>
              </div>
            </div>
            <div class="task-item">
              <div class="outer">
                <span class="label">
                  成功任务数量</span>
                <span class="value">{{ studyData.finished_task_nums }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-wrap">
          <span class="title">训练得分分析</span>
          <div class="line"></div>
          <div
            class="chart-wrap"
            ref="chartref"
          >
          </div>
        </div>
      </div>
    </template>
    <template v-if="activeName === 'study'">
      <div class="table-box">
        <cb-search-table
          :cols="columns"
          :url="`/oj/course/user/course/progress?user_id=${user_id}`"
          baseURL="/api/ojj"
        >
        </cb-search-table>
      </div>
    </template>
  </div>
</template>

<script>
import { goToStudentStudyAnalysisApi } from '@/api/course.js'
export default {
  name: "student-monitor",
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    activeName: {
      handler(nv, ov) {
        if (nv && nv === 'basic') {
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
    },
  },
  data() {
    return {
      activeName: 'basic',
      list: ['全部', '近1月', '近3月', '近12月'],
      form: {
        date: [],
      },
      active: 0,
      option: {
        title: {
          text: '训练次数',
          subtext: '23',
          left: '39%',
          top: 'center',
          textAlign: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
          formatter: (name) => {
            const data = this.option.series[0].data;
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const item = data.find(item => item.name === name);
            const percent = (item.value / total * 100).toFixed(2);
            return `${name}   ${percent}%   ${item.value}`;
          }
        },
        series: [
          {
            name: '训练得分分析',
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['40%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: 1048, name: '0~59' },
              { value: 735, name: '60~69' },
              { value: 580, name: '70~79' },
              { value: 484, name: '80~89' },
              { value: 300, name: '90~100' }
            ],
          }
        ]
      },
      columns: [
        {
          label: this.$t('课程名称'),
          prop: 'course_name',
        },
        {
          label: this.$t('参与时间'),
          slot: 'start_time',
        },
        {
          label: this.$t('进度'),
          prop: 'progress',
        },
        {
          label: this.$t('完成时间'),
          prop: 'finished_time',
        },
        {
          label: this.$t('学习课时'),
          prop: 'learned_lessons',
        },
        {
          label: this.$t('学习时长（h）'),
          prop: 'learn_time',
        },
      ],
      user_id: this.$route.params && this.$route.params.resource_id,
      studyData: {
        name: '', //"用户姓名",
        user_name: '',//"登录用户名",
        avatar_url: '', //"头像地址",
        course_nums: '',//"参与课程",
        finished_course_nums: 0,//"完成课程数量",
        lessonNums: 0,//"参与课时数量",
        finished_lesson_nums: 0, //"完成课时数量",
        taskNums: 0,//"接受任务数量",
        finished_task_nums: 0,//"完成任务数量",
        score_statistics: {
          zero_to_sixty_nums: 12,  //任务得分0-59 次数
          sixty_to_seventy_nums: 5, //任务得分60-69 次数
          seventy_to_eighty_nums: 10, //任务得分70-79 次数
          eighty_to_ninety_nums: 1, //任务得分80-89次数
          ninety_to_one_hundred_nums: 1 //任务得分90-100次数
        }
      }
    }
  },
  mounted() {
    this.user_id = this.$route.params && this.$route.params.resource_id;
    this.getStudyAnalysisData();
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  methods: {
    getStudyAnalysisData() {
      goToStudentStudyAnalysisApi({
        user_id: this.user_id
      }).then(res => {
        const data = _.get(res, 'data.data', {});
        this.studyData = data;

        this.option.series[0].data = [
          { value: this.studyData.score_statistics?.zero_to_sixty_nums, name: '0~59' },
          { value: this.studyData.score_statistics?.sixty_to_seventy_nums, name: '60~69' },
          { value: this.studyData.score_statistics?.seventy_to_eighty_nums, name: '70~79' },
          { value: this.studyData.score_statistics?.eighty_to_ninety_nums, name: '80~89' },
          { value: this.studyData.score_statistics?.ninety_to_one_hundred_nums, name: '90~100' }
        ]

        this.option.title.subtext = this.studyData.score_statistics?.zero_to_sixty_nums || 0 +
          this.studyData.score_statistics?.sixty_to_seventy_nums || 0 +
          this.studyData.score_statistics?.seventy_to_eighty_nums || 0 +
          this.studyData.score_statistics?.eighty_to_ninety_nums || 0 +
          this.studyData.score_statistics?.ninety_to_one_hundred_nums || 0;
        this.initChart();
      })
    },
    handlerClick(index) {
      this.active = index;
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartref);
      this.chart.setOption(this.option);
    },
  }
}
</script>

<style scoped lang="scss">
.header-wrap {
  height: 124px;
  background: var(--bg-color-2);
  padding: 12px 0 0 16px;
  margin-bottom: 16px;

  .title {
    font-weight: 600;
    font-size: 16px;
    display: inline-block;
    margin-bottom: 51px;
  }
}

.name-box {
  height: 60px;
  background: var(--bg-color-2);
  position: relative;
  margin-bottom: 16px;

  .name {
    position: absolute;
    left: 36px;
    top: 20px;
    font-size: 14px;
  }

  .right-area {
    position: absolute;
    top: 6px;
    right: 36px;
    height: 48px;
    display: flex;
    align-items: center;

    .item {
      padding: 6px 12px;
      margin-right: 8px;
      white-space: nowrap;
      font-size: 14px;
      color: #7f7f7f;
      border: 1px solid #7f7f7f;
      border-radius: 2px;
      cursor: pointer;
    }

    .item.active {
      color: #ffffff;
      background: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
  }
}

.analysis-wrap {
  height: 200px;
  background: var(--bg-color-2);
  padding: 12px 16px 0 16px;
  margin-bottom: 16px;

  .title {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .line {
    width: 100%;
    height: 2px;
    background: #f2f2f2;
    margin-bottom: 20px;
  }

  .course-wrap {
    height: 110px;
    background: #f2f2f2;
    display: flex;

    .course-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .outer {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;

        .label {
          font-size: 14px;
        }

        .value {
          font-size: 26px;
        }

      }
    }
  }
}

.train-task-analysis {
  width: 100%;
  height: 328px;
  display: flex;

  .left-wrap {
    background: var(--bg-color-2);
    margin-right: 16px;
    width: 50%;
    padding: 12px 16px 0 16px;

    .title {
      display: inline-block;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .line {
      width: 100%;
      height: 2px;
      background: #f2f2f2;
      margin-bottom: 20px;
    }

    .task-wrap {
      height: 234px;
      display: flex;

      .task-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .outer {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;

          .label {
            font-size: 14px;
          }

          .value {
            font-size: 26px;
          }

        }
      }
    }
  }

  .right-wrap {
    background: var(--bg-color-2);
    width: 50%;
    padding: 12px 16px 0 16px;

    .title {
      display: inline-block;
      font-size: 14px;
      margin-bottom: 24px;

    }

    .line {
      width: 100%;
      height: 2px;
      background: #f2f2f2;
      margin-bottom: 20px;
    }

    .chart-wrap {
      width: 100%;
      height: 234px;
    }
  }
}

.table-box {
  padding: 0 16px;
  background: var(--bg-color-2);
}
</style>
