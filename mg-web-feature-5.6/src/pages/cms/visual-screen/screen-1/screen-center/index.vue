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
      <!--2  -->
      <div class="task-status">
        <div class="block"></div>
        <Header :level="2" title="任务状态" />
        <task-status-pie lineColor="red" :pieData="pieData"></task-status-pie>
      </div>
      <!-- 3 -->
      <div class="task-event">
        <div class="block"></div>
        <Header :level="2" title="攻击事件趋势" />
        <attack-echart-line
          :color="eventcolor"
          :xData="eventxData"
          :lineData="eventlineData"
          :name="eventname"
        ></attack-echart-line>
      </div>
      <!-- 4 -->
      <div class="task-score-trend">
        <div class="block"></div>
        <Header :level="2" title="攻击得分趋势"></Header>
        <attack-echart-line
          :color="scorecolor"
          :xData="x_data"
          :lineData="[y_red_score]"
          :name="scorename"
        ></attack-echart-line>
      </div>
      <!--  5-->
      <div class="attack-grand">
        <Header :level="2" title="攻防战报" />
        <attack-grand-scroll :listData="listDatas" :agTitle="'攻防战报'">
        </attack-grand-scroll>
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
        <Header :level="2" title="任务状态" />
        <task-status-pie
          lineColor="blue"
          :pieData="pieBlueData"
        ></task-status-pie>
        <div class="block"></div>
      </div>
      <!-- 3 -->
      <div class="task-event">
        <Header :level="2" title="战场流量" />
        <attack-echart-line
          :color="trafficcolor"
          :xData="eventxData"
          :lineData="eventlineData"
          :name="eventname"
        ></attack-echart-line>
        <div class="block"></div>
      </div>
      <!-- 4 -->
      <div class="task-score-trend">
        <Header :level="2" title="防御得分趋势" />
        <attack-echart-line
          :color="defensecolor"
          :xData="x_data"
          :lineData="[y_blue_score]"
          :name="scorename"
        ></attack-echart-line>
        <div class="block"></div>
      </div>
      <!-- 5 -->
      <div class="attack-grand">
        <Header :level="2" title="演练动态" />
        <attack-grand-scroll :listData="listDatas"> </attack-grand-scroll>
      </div>
    </div>
    <div class="time-progress">
      <time-progress :scaleTimes="scaleTimes"> </time-progress>
    </div>
    <iframe id="ueframe" class="ueframe" :src="url" frameborder="0"></iframe>
  </div>
</template>
<script>
import moment from 'moment';
import TaskProgress from './components/task-progress.vue';
import AttackScore from './components/attack-score.vue';
import AttackEchartLine from './components/attack-echart-line.vue';
import AttackGrandScroll from './components/attack-grand-scroll.vue';
import TaskStatusPie from './components/task-status-pie.vue';
import TimeProgress from './components/time-progress.vue';
import Header from './../components/header.vue';
import Score from './../components/score.vue';
import {
  teamScoreProgress,
  teamMissionProgress,
  teamMissionEvaluation,
  redBlueDirectors,
  trainingTrendsNoType,
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
  },
  created() {
    this.getData();
    this.timer = setInterval(this.getData, 30000);
  },
  props: {},
  data() {
    return {
      pieData: [],
      pieBlueData: [],
      red_total_score: 0,
      blue_total_score: 0,
      x_data: [],
      y_blue_score: [],
      y_red_score: [],
      percentage_red: 0,
      percentage_blue: 0,
      scaleTimes: {},
      listDatas: [],
      // 进度条数据
      // 折线图颜色
      eventcolor: ['danger-color'],
      scorecolor: ['warning-color'],
      trafficcolor: ['success-color'],
      defensecolor: ['primary-color'],
      // 折线图攻击事件趋势数据
      eventname: ['攻击事件趋势'],
      eventxData: ['00:20', '00:20', '00:20', '00:20', '00:20'],
      eventlineData: [[15, 800, 150, 90, 100, 800, 90]],
      // 折线图攻击得分趋势数据
      scorename: ['攻击得分趋势'],
      timer: null,
      // 攻击战绩滚动数据
      url: 'http://10.100.1.100/situation',
    };
  },
  computed: {},
  mounted() {
    window.onload = () => {
      document.getElementById('ueframe').contentWindow.postMessage(
        {
          mode: '0',
          color: {
            BaseColor: '#23bef1', // 自行修改颜色
            Intensity: 0,
            _Matallic: 0.5,
            _Smoothness: 0.5,
          },
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
      //红蓝攻击得分,折线图得分数据,6
      teamScoreProgress('90d8f51db9b8563a435f18c5ccd0b6fe', 6).then((res) => {
        this.red_total_score = res.data.red_total_score;
        this.blue_total_score = res.data.blue_total_score;
        this.x_data = res.data.x_data;
        this.y_blue_score = res.data.y_blue_score;
        this.y_red_score = res.data.y_red_score;
      });
      //红色任务进度,4
      teamMissionProgress('90d8f51db9b8563a435f18c5ccd0b6fe', 4).then((res) => {
        this.percentage_red =
          (res.data.completed_mission / res.data.total_mission) * 100;
      });
      //蓝方任务进度,5
      teamMissionProgress('90d8f51db9b8563a435f18c5ccd0b6fe', 5).then((res) => {
        this.percentage_blue =
          (res.data.completed_mission / res.data.completed_mission) * 100;
      });
      //红方饼图状态,4
      teamMissionEvaluation('90d8f51db9b8563a435f18c5ccd0b6fe', 4).then(
        (res) => {
          const data = [];
          for (let key in res.data) {
            if (key !== 'total' && key !== 'unreported') {
              data.push({
                value: res.data[key],
                name: this.exchangePieDataName(key),
                type: this.exchangePieDataType(key),
              });
            }
          }
          this.pieData = data;
        },
      );
      //蓝方饼图状态,5
      teamMissionEvaluation('90d8f51db9b8563a435f18c5ccd0b6fe', 5).then(
        (res) => {
          const data = [];
          for (let key in res.data) {
            if (key !== 'total' && key !== 'unreported') {
              data.push({
                value: res.data[key],
                name: this.exchangePieDataName(key),
                type: this.exchangePieDataType(key),
              });
            }
          }
          this.pieBlueData = data;
        },
      );
      // 时间轴
      redBlueDirectors('90d8f51db9b8563a435f18c5ccd0b6fe').then((res) => {
        const timeData = res.data.data.map((item, index) => {
          return {
            ...item,
            time: moment(item.time).format('MM-DD HH:mm:ss'),
          };
        });
        this.scaleTimes = {
          ...res.data,
        };
      });
      //演练动态
      trainingTrendsNoType('90d8f51db9b8563a435f18c5ccd0b6fe').then((res) => {
        const timeData = res.data.map((item, index) => {
          return {
            ...item,
            action_time: moment(item.action_time).format('YYYY-MM-DD HH:mm:ss'),
          };
        });
        this.listDatas = [...timeData];
      });
    },
    exchangePieDataName(key) {
      if (key === 'fail') {
        return '失败';
      } else if (key === 'reject') {
        return '驳回';
      } else if (key === 'success') {
        return '成功';
      } else if (key === 'wait') {
        return '待上报';
      }
    },
    exchangePieDataType(key) {
      if (key === 'fail') {
        return 4;
      } else if (key === 'reject') {
        return 3;
      } else if (key === 'success') {
        return 2;
      } else if (key === 'wait') {
        return 1;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
