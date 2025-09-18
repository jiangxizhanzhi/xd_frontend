<template>
  <div class="visual-screen-center-group">
    <!-- 团队左侧 -->
    <div class="sc-left">
      <!-- 第一块,训练人数进度条 -->
      <div class="training-people">
        <div class="triangle"></div>
        <Header :level="2" title="训练人数" />
        <task-progress
          :number="student_count"
          :percentage="percentage"
        ></task-progress>
      </div>

      <!--第二块，任务状态柱状图-->
      <div class="task-status flex-column">
        <Header :level="1" title="任务状态" />
        <bar-chart class="flex-fill-col" :barData="barData"> </bar-chart>
      </div>

      <!-- -第三块，技能类别 -->
      <div class="skill-type flex-column">
        <Header :level="1" title="技能类别" />
        <skills-chart
          class="flex-fill-col"
          :skillTypeData="skillTypeData"
        ></skills-chart>
      </div>

      <!-- 第四块，战场流量 折线图 -->
      <div class="battle-traffic flex-column">
        <Header :level="1" title="战场流量" />
        <attack-echart-line
          :color="eventcolor"
          :xData="eventxData"
          :lineData="eventlineData"
          :name="eventname"
          class="flex-fill-col"
        ></attack-echart-line>
      </div>
      <!-- 第五块，排行榜 -->
      <div class="rank flex-column">
        <Header :level="1" title="排行榜" />
        <attack-grand-scroll class="flex-fill-col" :listData="grandListData">
        </attack-grand-scroll>
      </div>
    </div>
    <!-- 中间 -->
    <div class="sc-center"></div>

    <div class="sc-right">
      <!-- 团队 -->
      <!-- 训练场景 -->
      <training-scense></training-scense>
      <!-- 训练人员 -->
      <training-personal></training-personal>
      <!-- 训练技能 -->
      <training-skill></training-skill>
      <!-- 任务状态 -->
      <training-dynamic></training-dynamic>
    </div>
    <iframe id="ueframe" class="ueframe" :src="url" frameborder="0"></iframe>
  </div>
</template>
<script>
import TaskProgress from './components/task-progress.vue';
import TrainingScense from './components/training-scense.vue';
import TrainingPersonal from './components/training-personal.vue';
import TrainingDynamic from './components/training-dynamic.vue';
import TrainingSkill from './components/training-skill.vue';
import AttackEchartLine from './components/attack-echart-line.vue';
import AttackGrandScroll from './components/attack-grand-scroll.vue';
import BarChart from './components/bar-chart.vue';
import SkillsChart from './components/skills-chart.vue';
import Header from './../components/header.vue';
import {
  trainingTeamUser,
  trainingTeamMission,
  trainingTeamStudentRank,
  trainingTeamSkill,
} from '@/api/screen-center-group';
export default {
  components: {
    BarChart,
    SkillsChart,
    TaskProgress,
    AttackEchartLine,
    AttackGrandScroll,
    TrainingScense,
    Header,
    TrainingPersonal,
    TrainingDynamic,
    TrainingSkill,
  },
  created() {
    //综合演训人数
    trainingTeamUser('71e31f363b51edd6cb464d26be0c6982').then((res) => {
      this.student_count = res.data.student_count;
    });
    this.getData();
    this.timer = setInterval(this.getData, 30000);
  },
  props: {},
  data() {
    return {
      //训练人数
      student_count: 0,
      // 完成任务
      percentage: 0,
      // 任务状态
      barData: [],

      // 折线图战场流量
      eventcolor: ['danger-color'],
      eventname: ['攻击事件趋势'],
      eventxData: ['00:20', '00:20', '00:20', '00:20', '00:20'],
      eventlineData: [[15, 800, 150, 90, 100, 800, 90]],

      // 排行榜滚动数据
      grandListData: [],
      skillTypeData: [],
      url: 'http://10.100.1.100/situation',
    };
  },
  computed: {},
  mounted() {
    window.onload = () => {
      document.getElementById('ueframe').contentWindow.postMessage(
        {
          mode: '1',
        },
        this.url,
      );
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {},
  methods: {
    getData() {
      //任务状态
      trainingTeamMission('71e31f363b51edd6cb464d26be0c6982').then((res) => {
        this.percentage = res.data.percentage;
        this.barData = [
          res.data.wait,
          res.data.success,
          res.data.fail,
          res.data.reject,
        ];
      });
      //学员得分排名
      trainingTeamStudentRank('71e31f363b51edd6cb464d26be0c6982').then(
        (res) => {
          this.grandListData = res.data;
        },
      );
      //综合演训技能类别
      trainingTeamSkill('71e31f363b51edd6cb464d26be0c6982').then((res) => {
        this.skillTypeData = res.data.category;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.visual-screen-center-group {
  //综合演训中间页面css变量定义
  //背景颜色
  --trainning-bg: linear-gradient(
    90deg,
    rgba(13, 20, 27, 0.4),
    rgba(3, 4, 10, 0.15)
  );
  // 训练场景行高
  --training-scense-line-height: 30px;

  // 训练动态,
  --train-font-color: #516c87;
  --train-bg-color: rgba(171, 216, 255, 0.1);
  --img-bg-color: #1b2d53;

  // 训练技能弹幕背景
  --train-barrage-bg: linear-gradient(
    90deg,
    #62d2c1 0%,
    rgba(98, 210, 193, 0.01) 99%
  );
}
</style>
