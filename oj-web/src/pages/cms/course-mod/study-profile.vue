<template>
  <div>
    <div class="analysis-card">
      <div class="title">教学分析</div>
      <div class="list">
        <div class="box">
          <span class="label">课程参与人次</span>
          <span class="count">{{ studyData.student_nums }}</span>
        </div>
        <div class="box">
          <span class="label">课程完成人次</span>
          <span class="count">{{ studyData.course_finished_nums }}</span>
        </div>
        <div class="box">
          <span class="label">训练时长（h）</span>
          <span class="count">{{ studyData.train_time }}</span>
        </div>
      </div>
    </div>
    <div class="training-wrapper">
      <div class="task-card">
        <div class="title">训练任务分析</div>
        <div class="list">
          <div class="box">
            <span class="label">下发任务数量</span>
            <span class="count">{{ studyData.train_task_statistics.publish_task_nums }}</span>
          </div>
          <div class="box">
            <span class="label">成功任务数量</span>
            <span class="count">{{ studyData.train_task_statistics.publish_task_nums }}</span>
          </div>
        </div>
      </div>
      <div class="score-card">
        <div class="title">训练得分分析</div>
        <div
          class="chart-box"
          ref="chartref"
        >
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <cb-search-bar class="custom-table-search-bar">
        <cb-search-input
          slot="searchRightArea"
          class="search-container"
          v-model="query.pattern"
          placeholder="请输入账号名称"
        ></cb-search-input>
      </cb-search-bar>
      <div
        class="table-card"
        :key="item.user_id"
        v-for="item in studyData.person_statistics"
      >
        <div class="title">{{ item.name }}</div>
        <div class="item">
          <!-- <div class="box">
            <span class="label">完成课程</span>
            <span class="count">{{123}}</span>
          </div> -->
          <div class="box">
            <span class="label">完成课时</span>
            <span class="count">{{ item.finished_lesson_nums }}</span>
          </div>
          <div class="box">
            <span class="label">完成任务</span>
            <span class="count">{{ item.finished_task_nums }}</span>
          </div>
          <div class="box">
            <span class="label">总训练时长（h）</span>
            <span class="count">{{ item.train_time_sum }}</span>
          </div>
          <div class="box">
            <span class="label">训练平均得分</span>
            <span class="count">{{ item.average_train_score }}</span>
          </div>
          <div class="box">
            <span class="label">综合排名</span>
            <span class="count">{{ item.ranking }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudyProfileData } from '@/api/course';

export default {
  name: "study-profile",
  components: {},
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    return {}
  },
  data() {
    return {
      studyData: {
        student_nums: 0,  //课程参与人次
        course_finished_nums: 0, //课程完成人次,
        train_time: 0,    //训练时长，单位小时
        train_task_statistics: {
          publish_task_nums: 0, //下发任务次数
          success_task_nums: 0	//成功任务次数
        },
        score_statistics: {
          zero_to_sixty_nums: 0,  //任务得分0-59 次数
          sixty_to_seventy_nums: 0, //任务得分60-69 次数
          seventy_to_eighty_nums: 0, //任务得分70-79 次数
          eighty_to_ninety_nums: 0, //任务得分80-89次数
          ninety_to_one_hundred_nums: 0 //任务得分90-100次数
        },
        person_statistics: [],
      },
      query: {
        pattern: ''
      },
      chart: null,
      option: {
        color: ['#f55353', '#2ec7c9', '#1c92ff', '#d87a80', '#ffb980'],
        title: {
          text: '训练次数',
          subtext: '',
          left: '30%',
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
            radius: ['55%', '80%'],
            center: ['30%', '50%'],
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
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getStudyProfileData({ resource_id: this.courseId }).then(res => {
        this.studyData = res.data.data;
        this.option.series[0].data = [
          { value: this.studyData.score_statistics.zero_to_sixty_nums, name: '0~59' },
          { value: this.studyData.score_statistics.sixty_to_seventy_nums, name: '60~69' },
          { value: this.studyData.score_statistics.seventy_to_eighty_nums, name: '70~79' },
          { value: this.studyData.score_statistics.eighty_to_ninety_nums, name: '80~89' },
          { value: this.studyData.score_statistics.ninety_to_one_hundred_nums, name: '90~100' }
        ]

        this.option.title.subtext = this.studyData.score_statistics.zero_to_sixty_nums +
          this.studyData.score_statistics.sixty_to_seventy_nums +
          this.studyData.score_statistics.seventy_to_eighty_nums +
          this.studyData.score_statistics.eighty_to_ninety_nums +
          this.studyData.score_statistics.ninety_to_one_hundred_nums;
        this.initChart();
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartref);
      this.chart.setOption(this.option);
    },
  }
}
</script>

<style scoped lang="scss">
.title {
  border-bottom: 1px solid var(--neutral1);
  margin-bottom: 16px;
  padding-bottom: 16px;
}

.list {
  display: flex;
  background-color: var(--bg-color-1);
  padding: 24px;
  width: 100%;
  justify-content: space-around;

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .count {
      padding-top: 8px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.analysis-card {
  background-color: var(--white-color);
  padding: 16px;
  margin-bottom: 16px;
}

.training-wrapper {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  .task-card,
  .score-card {
    flex: 1;
    padding: 16px;
    background-color: var(--white-color);
    height: 280px;
  }

  .task-card {
    .list {
      height: calc(100% - 80px);
      vertical-align: middle;
      align-items: center;
      //background-color: transparent;
    }
  }

  .score-card {
    .title {
      margin-bottom: 0;
    }

    .chart-box {
      height: 220px;
      width: 100%;
    }
  }
}

.table-card {
  background-color: var(--white-color);
  padding: 16px;
  margin-bottom: 16px;

  .item {
    display: flex;
    width: 100%;

    .box {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-color-1);
      padding: 16px;

      .count {
        font-size: 18px;
        padding-top: 8px;
      }
    }
  }
}
</style>
