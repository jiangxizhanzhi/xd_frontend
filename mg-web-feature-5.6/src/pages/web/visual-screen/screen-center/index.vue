<template>
  <div class="visual-screen-center">
    <div class="visual-screen-center-left">
      <!-- 1 -->
      <div class="score-progress">
        <div class="block"></div>
        <div style="width: 100%">
          <Score class="scores" :count="red_total_score"></Score>
          <task-progress :percentage="percentage_red" color="red"
            >progress</task-progress
          >
        </div>
      </div>
      <!-- 2 -->
      <div class="task-score-trend">
        <div class="block"></div>
        <Header :level="2" title="攻击得分趋势"></Header>
        <attack-echart-line
          :color="scorecolor"
          :xData="x_red_data"
          :lineData="y_red_score"
          :name="scorename"
        ></attack-echart-line>
      </div>

      <!-- 3 -->
      <div class="task-event">
        <div class="block"></div>
        <Header :level="2" title="攻击成功率" />
        <attack-rate :attakRateData="attackRateRed"></attack-rate>
      </div>
      <!--4  -->
      <div class="task-status">
        <div class="block"></div>
        <Header :level="2" title="任务状态" />
        <task-status-pie lineColor="red" :pieData="pieData1"></task-status-pie>
      </div>
      <!--  5-->
      <div class="attack-grand">
        <Header :level="2" title="演练动态" />
        <attack-grand-scroll :listData="listDatasRed"> </attack-grand-scroll>
      </div>
    </div>
    <!-- 中间 -->
    <div class="visual-screen-center-center"></div>
    <div class="visual-screen-center-right">
      <!-- 1 -->
      <div class="score-progress">
        <div class="block"></div>
        <div style="width: 100%">
          <Score
            class="scores"
            icon="icon-fangyu"
            type="blue"
            :count="blue_total_score"
          ></Score>
          <task-progress :percentage="percentage_blue" color="blue"
            >progress</task-progress
          >
        </div>
      </div>

      <!-- 2 -->
      <div class="task-status">
        <div class="block"></div>
        <Header :level="2" title="攻击事件趋势" />
        <attack-echart-line
          :color="eventcolor"
          :xData="attackDataInfo.attackxData"
          :lineData="attackDataInfo.attacklineData"
          :name="eventname"
        ></attack-echart-line>
      </div>
      <!-- 3 -->
      <div class="task-event">
        <div class="block"></div>
        <Header :level="2" title="攻击成功率" />
        <attack-rate
          teamType="blue"
          :attakRateData="attackRateBlue"
        ></attack-rate>
      </div>
      <!-- 4 -->
      <div class="task-score-trend">
        <Header :level="2" title="任务状态" />
        <task-status-pie lineColor="blue" :pieData="pieData1"></task-status-pie>
        <div class="block"></div>
        <!-- <Header :level="2" title="防御得分趋势" />
        <attack-echart-line
          :color="defensecolor"
          :xData="x_blue_data"
          :lineData="[y_blue_score]"
          :name="scorename"
        ></attack-echart-line>
        <div class="block"></div> -->
      </div>
      <!-- 5 -->
      <div class="attack-grand">
        <Header :level="2" title="战场流量" />
        <attack-echart-line-traffic
          :chartData="refuseChartData"
        ></attack-echart-line-traffic>
        <div class="block"></div>
      </div>
    </div>
    <div class="time-progress">
      <time-progress :scaleTimes="scaleTimes"> </time-progress>
    </div>
    <!-- <iframe id="ueframe" class="ueframe" :src="url" frameborder="0"></iframe> -->
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
import moment from 'moment';
import TaskProgress from './components/task-progress.vue';
import AttackScore from './components/attack-score.vue';
import AttackEchartLine from './components/attack-echart-line.vue';
import AttackGrandScroll from './components/attack-grand-scroll.vue';
import TaskStatusPie from './components/task-status-pie.vue';
import TimeProgress from './components/time-progress.vue';
import Header from './../components/header.vue';
import Score from './../components/score.vue';
import AttackEchartLineTraffic from './components/attack-echart-line-traffic.vue';
import AttackRate from './components/attack-rate.vue';
import { getTrafficBaseNew, getTrafficEvent } from '../hooks/getTraffic';
import {
  teamScoreProgress,
  teamMissionProgress,
  teamMissionEvaluation,
  redBlueDirectors,
  trainingTrends,
  getTime,
} from '@/api/screen-center';
export default {
  components: {
    TaskProgress,
    AttackEchartLine,
    AttackGrandScroll,
    TaskStatusPie,
    AttackScore,
    TimeProgress,
    Header,
    Score,
    AttackEchartLineTraffic,
    AttackRate,
  },
  created() {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {},
  setup() {
    // 时间轴
    // let scaleTimes = reactive({});
    let scaleTimes = ref({});
    // 中间大屏
    let url = ref('http://10.100.1.100/situation');

    // 攻击成功率
    const attackRateRed = ref([
      {
        type: 1,
        text: '攻击次数',
        count: 1234,
      },
      {
        type: 2,
        text: '成功率',
        count: 1234,
      },
      {
        type: 3,
        text: '平均用时',
        count: 1234,
      },
      {
        type: 4,
        text: '控机数量',
        count: 1234,
      },
    ]);
    const attackRateBlue = ref([
      {
        type: 1,
        text: '防御次数',
        count: 1234,
      },
      {
        type: 2,
        text: '成功率',
        count: 1234,
      },
      {
        type: 3,
        text: '无效防御',
        count: 1234,
      },
      {
        type: 4,
        text: '失陷主机',
        count: 1234,
      },
    ]);

    //任务进度
    let percentage_red = ref(0);
    let percentage_blue = ref(0);
    // 红蓝得分
    let red_total_score = ref(0);
    let blue_total_score = ref(0);

    // 任务状态
    let pieData = ref([
      // { value: 20, name: '成果', type: '1' },
      // { value: 20, name: '成果', type: '2' },
      // { value: 20, name: '成果', type: '3' },
    ]);
    let pieData1 = ref([
      { value: 0, name: '失败', type: '4' },
      { value: 20, name: '成功', type: '2' },
      { value: 20, name: '驳回', type: '3' },
      { value: 20, name: '待上报', type: '1' },
      { value: 20, name: '待审核', type: '5' },
    ]);
    let pieBlueData = ref([]);

    // 攻击事件 战场流量
    //场景id
    let sourceId = ref('3dde20172064d97aafa0a02bd6080874');
    //战场流量API
    let trafficAPI = ref('/systemOperation/scene/pageFlowMonitor/');
    let eventcolor = ['#f15e5f', '#116eff'];
    let scorecolor = ['#f15e5f', '#116eff'];
    let trafficcolor = ['success-color'];
    let defensecolor = ['primary-color'];
    let eventname = ['攻击事件趋势'];
    let lineDataInfo = reactive({
      lineXData: [],
      lineData: [[]],
    });
    let attackDataInfo = reactive({
      attackxData: ['08:00', '10:00', '12:00', '14:00'],
      attacklineData: [
        [20, 30, 40, 50],
        [30, 40, 50, 60],
      ],
    });

    // 战场流量模拟数据
    let refuseChartData = ref([
      {
        name: '背景流量',
        xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
        yData: [120, 132, 101, 134, 90, 230, 110],
      },
      {
        name: '攻击流量',
        xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
        yData: [220, 182, 191, 134, 290, 330, 58],
      },
    ]);
    // 折线图攻击得分趋势数据
    let scorename = ['攻击得分趋势'];
    let timerAttack = null;
    let timerTraffic = null;
    // 攻击战绩滚动数据
    let list = [];

    // 攻击得分趋势，防御得分趋势
    let x_red_data = ref(['08:00', '10:00', '12:00', '14:00']);
    let x_blue_data = ref([]);
    let y_blue_score = ref([]);
    let y_red_score = ref([
      [20, 30, 40, 50],
      [30, 40, 50, 60],
    ]);

    // 演练动态
    let listDatasRed = ref([]);
    let listDatasBlue = ref([]);

    function exchangePieDataName(key) {
      if (key === 'fail') {
        return '失败';
      } else if (key === 'reject') {
        return '驳回';
      } else if (key === 'success') {
        return '成功';
      } else if (key === 'wait') {
        return '待上报';
      }
    }
    function exchangePieDataType(key) {
      if (key === 'fail') {
        return 4;
      } else if (key === 'reject') {
        return 3;
      } else if (key === 'success') {
        return 2;
      } else if (key === 'wait') {
        return 1;
      }
    }
    function getData() {
      //红蓝攻击得分,折线图得分数据,6
      teamScoreProgress('919d8f90fe83eb9951f8cd5e9d5be023', 6).then((res) => {
        red_total_score.value = res.data.red_total_score;
        blue_total_score.value = res.data.blue_total_score;
        const y_blue = res.data.y_blue_score;

        y_blue_score.value = y_blue.filter((item) => {
          return item != null;
        });
        const y_red = res.data.y_red_score;
        y_red_score.value = y_red.filter((item) => {
          return item != null;
        });

        x_red_data.value = res.data.x_data.slice(0, y_red_score.length);
        x_blue_data.value = res.data.x_data.slice(0, y_blue_score.length);
      });

      //红色任务进度,4
      teamMissionProgress('5b3fce162a93193dbc867e2f8d853ff8', 4).then((res) => {
        percentage_red.value = parseInt(
          (res.data.completed_mission / res.data.total_mission) * 100,
        );
      });
      //蓝方任务进度,5
      teamMissionProgress('5b3fce162a93193dbc867e2f8d853ff8', 5).then((res) => {
        percentage_blue.value = parseInt(
          (res.data.completed_mission / res.data.total_mission) * 100,
        );
      });

      //红方饼图状态,4
      teamMissionEvaluation('5b3fce162a93193dbc867e2f8d853ff8', 4).then(
        (res) => {
          const data = [];
          for (let key in res.data) {
            if (key !== 'total' && key !== 'unreported') {
              data.push({
                value: res.data[key],
                name: exchangePieDataName(key),
                type: exchangePieDataType(key),
              });
            }
          }
          pieData.value = data;
        },
      );
      //蓝方饼图状态,5
      teamMissionEvaluation('5b3fce162a93193dbc867e2f8d853ff8', 5).then(
        (res) => {
          const data = [];
          for (let key in res.data) {
            if (key !== 'total' && key !== 'unreported') {
              data.push({
                value: res.data[key],
                name: exchangePieDataName(key),
                type: exchangePieDataType(key),
              });
            }
          }
          pieBlueData.value = data;
        },
      );
      //演练动态 红方
      trainingTrends('5b3fce162a93193dbc867e2f8d853ff8', 4).then((res) => {
        const timeData = res.data.map((item, index) => {
          return {
            ...item,
            action_time: moment(item.action_time).format('YYYY-MM-DD HH:mm:ss'),
          };
        });
        listDatasRed.value = [...timeData];
      });
      //演练动态 蓝方
      trainingTrends('5b3fce162a93193dbc867e2f8d853ff8', 5).then((res) => {
        const timeData = res.data.map((item, index) => {
          return {
            ...item,
            action_time: moment(item.action_time).format('YYYY-MM-DD HH:mm:ss'),
          };
        });
        listDatasBlue.value = [...timeData];
      });
      // 时间轴
      redBlueDirectors('5b3fce162a93193dbc867e2f8d853ff8').then((res) => {
        scaleTimes.value = {
          ...res.data,
        };
      });
    }
    // 攻击事件
    function getAttackEvent() {
      // 攻击事件 每次获取当前时间前一个小时内的流量
      let preNow = dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

      getTrafficEvent(attackDataInfo, preNow, sourceId.value, trafficAPI.value);
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
    let timer = null;
    onMounted(() => {
      getData();
      timer = setInterval(getData, 30000);
      getTraffic();
      getAttackEvent();
      timerTraffic = setInterval(getTraffic, 3600000);
      timerAttack = setInterval(getAttackEvent, 3600000);

      window.onload = () => {
        document
          .getElementById('ueframe')
          .contentWindow.postMessage('0', url.value);
      };
    });
    onBeforeUnmount(() => {
      clearInterval(timer);
      clearInterval(timerTraffic);
      clearInterval(timerAttack);
    });
    return {
      red_total_score,
      blue_total_score,
      x_red_data,
      x_blue_data,
      y_blue_score,
      y_red_score,
      url,
      pieData,
      pieBlueData,
      listDatasRed,
      listDatasBlue,
      percentage_blue,
      percentage_red,
      scaleTimes,
      lineDataInfo,
      eventcolor,
      scorecolor,
      trafficcolor,
      defensecolor,
      eventname,
      scorename,
      attackDataInfo,
      pieData1,
      refuseChartData,
      attackRateBlue,
      attackRateRed,
    };
  },
};
</script>
<style lang="scss" scoped></style>
