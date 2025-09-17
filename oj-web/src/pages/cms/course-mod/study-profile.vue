<template>
  <div>
    <div class="analysis-card">
      <div class="title">教学分析</div>
      <div class="list">
        <div class="box">
          <span class="label">课程参与人次</span>
          <span class="count">123</span>
        </div>
        <div class="box">
          <span class="label">课程完成人次</span>
          <span class="count">33</span>
        </div>
        <div class="box">
          <span class="label">训练时长（h）</span>
          <span class="count">125</span>
        </div>
      </div>
    </div>
    <div class="training-wrapper">
      <div class="task-card">
        <div class="title">训练任务分析</div>
        <div class="list">
          <div class="box">
            <span class="label">下发任务数量</span>
            <span class="count">123</span>
          </div>
          <div class="box">
            <span class="label">成功任务数量</span>
            <span class="count">33</span>
          </div>
        </div>
      </div>
      <div class="score-card">
        <div class="title">训练得分分析</div>
        <div class="chart-box">
          <cb-echart-pie
            :pieData="pieData"
            :pieName="pieName"
            :titleText="titleText"
            :titleShow="titleShow"
            :legendLocation="legendLocation"
            :labelShow="labelShow"
            :gapShow="gapShow"
            :color="color"
          ></cb-echart-pie>
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
      <div class="table-card" v-for="itm in ['', '', '', '', '', '', '', '']">
        <div class="title">张三</div>
        <div class="item">
          <div class="box">
            <span class="label">完成课程</span>
            <span class="count">123</span>
          </div>
          <div class="box">
            <span class="label">完成课时</span>
            <span class="count">33</span>
          </div>
          <div class="box">
            <span class="label">完成任务</span>
            <span class="count">125</span>
          </div>
          <div class="box">
            <span class="label">总训练时长（h）</span>
            <span class="count">125</span>
          </div>
          <div class="box">
            <span class="label">训练平均得分</span>
            <span class="count">125</span>
          </div>
          <div class="box">
            <span class="label">综合排名</span>
            <span class="count">125</span>
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
  setup(props, {emit}) {
    return {}
  },
  data() {
    return {
      studyData: {},
      query: {
        pattern: ''
      },
      color: ['primary-color', 'green-color', 'yellow-color', 'orange-color'],
      labelShow: false,
      double: true,
      gapShow: false,
      legendLocation: 'right',
      radius: ['60%', '70%'],
      // //自定义饼状图的颜色,也可以在series的data 中的itemStyle中定义,
      // color:["#ff0", "#f0f"],
      /**
       *标题设置
       */
      titleText: '1268',
      subTitleText: '场景统计',
      titleShow: true,
      // color:['yellow'],
      pieData: [30, 30, 40, 40],
      pieName: ['运行中', '已停止', '未sdfqe上线', '待上线'],
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getStudyProfileData({resource_id: this.courseId}).then(res=> {
        this.studyData = res.data.data;
      })
    }
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
  .task-card, .score-card {
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
