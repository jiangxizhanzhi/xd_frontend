<template>
  <div class="visual-screen-center-group">
    <!-- 团队左侧 -->
    <div class="sc-left">
      <div class="training-people">
        <div class="triangle"></div>
        <Header :level="2" title="训练人数" />
        <task-progress
          :number="student_count"
          :percentage="percentage"
        ></task-progress>
      </div>

      <div class="task-status flex-column">
        <Header :level="1" title="任务状态" />
        <bar-chart class="flex-fill-col" :barData="barData"> </bar-chart>
      </div>

      <div class="skill-type flex-column">
        <Header :level="1" title="技能类别" />
        <skills-chart
          class="flex-fill-col"
          :skillTypeData="skillTypeData"
        ></skills-chart>
      </div>

      <div class="battle-traffic flex-column">
        <Header :level="1" title="战场流量" />
        <attack-echart-line
          :color="eventcolor"
          :xData="lineDataInfo.lineXData"
          :lineData="lineDataInfo.lineData"
          :name="eventname"
          class="flex-fill-col"
        ></attack-echart-line>
      </div>
      <div class="rank flex-column">
        <Header :level="1" title="排行榜" />
        <attack-grand-scroll class="flex-fill-col" :listData="grandListData">
        </attack-grand-scroll>
      </div>
    </div>
    <!-- 中间 -->
    <div class="sc-center"></div>

    <div class="sc-right">
      <training-scense></training-scense>
      <training-personal></training-personal>
      <training-skill></training-skill>
      <training-dynamic></training-dynamic>
    </div>
    <iframe id="ueframe" class="ueframe" :src="url" frameborder="0"></iframe>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import {
  onMounted,
  ref,
  onBeforeUnmount,
  reactive,
} from '@vue/composition-api';
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
import { redBlueTraffic, getTime } from '@/api/screen-center';
import { getTrafficBaseNew } from '../hooks/getTraffic';
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
  created() {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {},
  setup() {
    //训练人数
    let student_count = ref(0);
    // 完成任务
    let percentage = ref(0);
    let barData = ref([]);
    let timer = null;
    let timerTraffic = null;

    // 排行榜滚动数据
    let grandListData = ref([]);
    //技能类别
    let skillTypeData = ref([]);
    //场景id
    let sourceId = ref('3dde20172064d97aafa0a02bd6080874');
    //战场流量API
    let trafficAPI = ref('/systemOperation/scene/pageFlowMonitor/');

    // 折线图战场流量
    const eventcolor = ['danger-color'];
    const eventname = ['攻击事件趋势'];
    let lineDataInfo = reactive({
      lineXData: [],
      lineData: [[]],
    });

    const url = ref('http://10.100.1.100/situation');
    function getData() {
      //任务状态
      trainingTeamMission('b21a7d72756fa5b828edd4433194ff33').then((res) => {
        percentage.value = res.data.percentage;
        barData.value = [
          res.data.wait,
          res.data.success,
          res.data.fail,
          res.data.reject,
        ];
      });
      //学员得分排名
      trainingTeamStudentRank('b21a7d72756fa5b828edd4433194ff33').then(
        (res) => {
          grandListData.value = res.data;
        },
      );
      //综合演训技能类别
      trainingTeamSkill('b21a7d72756fa5b828edd4433194ff33').then((res) => {
        skillTypeData.value = res.data.category;
      });
    }
    // 战场流量
    function getTraffic() {
      // 攻击事件 每次获取当前时间前一个小时内的流量
      let preNow = dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
      // 战场流量 需要获取作战开始到当前时间的流量
      getTime('90d8f51db9b8563a435f18c5ccd0b6fe').then((res) => {
        preNow = res.data.create_time;
        getTrafficBaseNew(
          lineDataInfo,
          preNow,
          sourceId.value,
          trafficAPI.value,
        );
      });
    }
    onMounted(() => {
      //综合演训人数
      trainingTeamUser('b21a7d72756fa5b828edd4433194ff33').then((res) => {
        student_count.value = res.data.student_count;
      });
      getData();
      getTraffic();
      timer = setInterval(getData, 30000);
      timerTraffic = setInterval(getTraffic, 30000);

      window.onload = () => {
        document
          .getElementById('ueframe')
          .contentWindow.postMessage('0', url.value);
      };
    });
    onBeforeUnmount(() => {
      clearInterval(timer);
      clearInterval(timerTraffic);
    });
    return {
      student_count,
      percentage,
      barData,
      url,
      grandListData,
      skillTypeData,
      eventcolor,
      eventname,
      lineDataInfo,
    };
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
