<template>
  <div ref="redGrade" class="grade-page red-grade-page">
    <div class="page-title">
      <h2>{{ $t('m.redGrade') }}</h2>
      <div class="time">{{ current_time }}</div>
    </div>
    <div class="content">
      <div class="page-left">
        <div class="title">{{ $t('m.teamMembers') }}</div>
        <div class="score-list">
          <cb-carousel
            :interval="5000"
            :initial-index="initialIndex"
            arrow="never"
            indicator-position="none"
            height="100%"
          >
            <cb-carousel-item
              v-for="(item, index) in groupDataList"
              :key="index"
            >
              <div>
                <!-- 表头数据 -->
                <div class="list-head">
                  <div></div>
                  <div>{{ $t('dataVis.name') }}</div>
                  <div>{{ $t('m.taskCount') }}</div>
                  <div>{{ $t('dataVis.score') }}</div>
                </div>
                <!-- groupDataList中的数据展示 -->
                <div
                  :class="
                    index === 0 ? 'list-wrap list-first-wrap' : 'list-wrap'
                  "
                >
                  <div
                    class="data-content"
                    v-for="(line, index) in item"
                    :key="index"
                  >
                    <div>
                      <div class="logo">
                        <img :src="line.logo ? line.logo : defaultImg" />
                      </div>
                    </div>
                    <div :title="line.name">{{ line.name }}</div>
                    <div>{{ line.completed_mission }}</div>
                    <div>{{ line.score }}</div>
                  </div>
                </div>
              </div>
            </cb-carousel-item>
          </cb-carousel>
        </div>
      </div>
      <div v-loading="loading" class="page-middle">
        <div class="title">
          {{ $t('m.redScore') }}
        </div>
        <div class="score-box">
          {{ total_score }}
        </div>
      </div>
      <div class="page-right">
        <div class="task-count task">
          <div class="title">{{ $t('m.taskStatistics') }}</div>
          <div class="chart">
            <char-pie
              :id="taskCount"
              v-loading="pieLoading"
              :task-data="taskData"
              :color="redColor"
            />
          </div>
        </div>
        <div class="task-pending task">
          <div class="title">{{ $t('m.taskPending') }}</div>
          <div class="chart">
            <char-line-smooth
              v-loading="smothLoading"
              :data-info="pointLineSmoothData"
            />
          </div>
        </div>
        <div class="task-score task">
          <div class="title">{{ $t('m.scoreTrend') }}</div>
          <div class="chart">
            <char-line-point
              v-loading="lineLoading"
              :data-info="pointLineData"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import CharPie from './components/char_pie';
import CharLinePoint from './components/char_line_point.vue';
import CharLineSmooth from './components/char_line_smooth.vue';
import { errorMessage } from '@/assets/js/tools.js';

function group(array, subGroupLength) {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}
export default {
  components: {
    CharPie,
    CharLinePoint,
    CharLineSmooth,
  },
  data() {
    return {
      timeStamp: '',
      isFirefox: /Firefox/i.test(navigator.userAgent),
      role_type: this.$CONSTANT.DataDisplay.REDTEAM.value,
      loading: false,
      pieLoading: false,
      smothLoading: false,
      lineLoading: false,
      redGrade: null,
      defaultImg: require('@/assets/img/userlogo/userhead.png').default,
      initialIndex: 0,
      totalTableData: [],
      groupDataList: [],
      tableData: [],
      total_score: '',
      current_time: '',
      taskCount: 'defenseResult',
      taskData: {},
      // redColor: ['#6D0004', '#830005', '#BF0007', '#DC0008', '#FF0009'],
      redColor: ['#FF7800', '#FF0000', '#B00000', '#8A0000', '#FF9C00'],

      pointLineData: {
        dataLabel: [],
        dataValue: [],
        axisLineColor: 'rgba(67,154,255,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        lineColor: '#FF6744', // 折线的颜色
        pointColor: '#FF6744', // 拐点颜色
        pointBorderColor: '#1E213B', // 拐点边框颜色
        marNumber: 10,
      },
      pointLineSmoothData: {
        dataLabel: [],
        dataValue1: [],
        dataValue2: [],
        total_mission: '',
        axisLineColor: 'rgba(67,154,255,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        lineColor1: '#D6DEE5', // 折线的颜色
        lineColor2: '#FF6744', // 折线的颜色
        pointColor: '#FF6744', // 拐点颜色
        pointBorderColor: '#1E213B', // 拐点边框颜色
        marNumber: 10,
        timer: null,
      },
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.role_group = this.$route.params && this.$route.params.role;
    this.getRedTableData('init');
    this.getRedTaskData();
    this.getTaskProgress();
    this.getRedScore();
    this.getTimes();
    this.timer = setInterval(() => {
      this.getAllData();
    }, 1000 * 60);
  },
  mounted() {
    const { isFirefox } = this;
    this.redGrade = this.$refs['redGrade'];
    this.redGrade.addEventListener(
      isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      this.handleScroll,
      false,
    );
  },
  beforeDestroy() {
    const { isFirefox } = this;
    this.redGrade.removeEventListener(
      isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      function () {},
      false,
    );
    if (this.current_time) {
      clearInterval(this.getTimesInterval);
    }
    clearInterval(this.timer);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getAllData() {
      this.getRedTableData();
      this.getRedTaskData();
      this.getTaskProgress();
      this.getRedScore();
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    getTimesInterval(timeStamp) {
      this.timeStamp = this.timeStamp + 1000;
      const that = this;
      const year = new Date(this.timeStamp).getFullYear(); // 获取当前时间的年份
      const month = new Date(this.timeStamp).getMonth() + 1; // 获取当前时间的月份
      const day = new Date(this.timeStamp).getDate(); // 获取当前时间的天数
      let hours = new Date(this.timeStamp).getHours(); // 获取当前时间的小时
      let minutes = new Date(this.timeStamp).getMinutes(); // 获取当前时间的分数
      let seconds = new Date(this.timeStamp).getSeconds(); // 获取当前时间的秒数
      // 当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      // 拼接格式化当前时间
      that.current_time =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds;
    },
    handleScroll(e) {
      // // 用来判断滚轮是向上滑动还是向下
      const { isFirefox } = this;
      const direction = isFirefox
        ? e.detail > 0
          ? 'down'
          : 'up'
        : e.deltaY > 0
        ? 'down'
        : 'up';
      if (parseInt(this.role_group) === 2 || parseInt(this.role_group) === 3) {
        // 鼠标滚轮向下或后
        if (direction === 'down') {
          this.$router.push({ name: 'blue-grade' });
          // setTimeout(() => {
          //   this.$router.push({ name: 'blue-grade' });
          // }, 200);
        } else {
          this.$router.push({ name: 'battle' });
        }
      }
      if (parseInt(this.role_group) === 4) {
        // 鼠标滚轮向下或后
        if (direction === 'down') {
          this.$router.push({ name: 'red-rank' });
          // setTimeout(() => {
          //   this.$router.push({ name: 'red-rank' });
          // }, 200);
        } else {
          this.$router.push({ name: 'red-rank' });
        }
      }
    },
    // 获取红方得分数据
    getRedTableData(flag) {
      const that = this;
      that.loading = true;
      const scene_hash = that.resource_id;
      const role_type = that.role_type;
      that.tableData = [];
      that.total_score = 0;
      // 红方成绩战队成员
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_members_ranking',
          {
            resource_id: scene_hash,
            role_type: role_type,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          that.totalTableData = _.get(res, 'data.data.ranking_data', []);
          // that.tableData = _.get(res, 'data.ranking_data', []).slice(0, 10)
          that.total_score = _.get(res, 'data.data.total_score', '');
          that.groupDataList = group(that.totalTableData, 10);
          //获取的时间戳
          // if (flag == 'init') {
          this.timeStamp = res.data.timestamp;
          // }
        })
        .catch((error) => {
          // errorMessage(error, that);
        })
        .finally(() => {
          that.loading = false;
        });
    },
    // 获取红方任务数据
    getRedTaskData() {
      const that = this;
      that.pieLoading = true;
      const scene_hash = that.resource_id;
      const role_type = that.role_type;
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_evaluation',
          { resource_id: scene_hash, role_type: role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          that.taskData = _.get(res, 'data.data', {});
        })
        .catch((error) => {
          errorMessage(error, that);
        })
        .finally(() => {
          that.pieLoading = false;
        });
    },
    // 获取红方任务进展
    getTaskProgress() {
      const that = this;
      that.smothLoading = true;
      that.pointLineSmoothData.dataLabel = [];
      that.pointLineSmoothData.dataValue1 = [];
      that.pointLineSmoothData.dataValue2 = [];
      that.pointLineSmoothData.marNumber = 10;
      const scene_hash = that.resource_id;
      const role_type = that.role_type;
      // 红方成绩任务进展
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_progress',
          { resource_id: scene_hash, role_type: role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const labels = _.get(res, 'data.data.x_data', []);
          const arrayComplete = _.get(res, 'data.data.y_complete', []);
          const arrayTotal = _.get(res, 'data.data.y_total', []);
          that.pointLineSmoothData.dataLabel = labels;
          that.pointLineSmoothData.dataValue1 = arrayTotal;
          that.pointLineSmoothData.dataValue2 = arrayComplete;
          that.pointLineSmoothData.marNumber = parseInt(
            that.pointLineSmoothData.dataLabel.length / 10,
          );
        })
        .catch((error) => {
          errorMessage(error, that);
        })
        .finally(() => {
          that.smothLoading = false;
        });
    },
    // 获取红队得分趋势
    getRedScore() {
      const that = this;
      that.lineLoading = true;
      const scene_hash = that.resource_id;
      const role_type = that.role_type;
      that.pointLineData.dataLabel = [];
      that.pointLineData.dataValue = [];
      that.pointLineData.marNumber = 0;
      // 红方成绩得分趋势
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_score_progress',
          { resource_id: this.resource_id, role_type: this.role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const labels = _.get(res, 'data.data.x_data', []);
          const arrayValues = _.get(res, 'data.data.y_data', []);
          that.pointLineData.dataLabel = labels;
          that.pointLineData.dataValue = arrayValues;
          that.pointLineData.marNumber = parseInt(
            that.pointLineData.dataLabel.length / 10,
          );
        })
        .catch((error) => {
          errorMessage(error, that);
        })
        .finally(() => {
          that.lineLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.grade-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 10px 30px;
  overflow: hidden;
  .page-title {
    width: 100%;
    margin: 0 auto;
    height: 120px;
    background: url('~@/assets/img/dataDisplay/red-title-bg.png') center center
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    h2 {
      font-size: 32px;
      letter-spacing: 12px;
      line-height: 120px;
      color: rgba(255, 255, 255, 1);
      text-shadow: 0px 0px 30px rgba(12, 21, 48, 0.6);
      background: linear-gradient(
        0deg,
        rgba(255, 103, 68, 1) 0%,
        rgba(255, 32, 32, 1) 100%
      );
      font-family: Microsoft YaHei;
      font-weight: bold;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 0;
    }
    .time {
      padding-top: 10px;
      font-size: 22px;
      font-weight: 400;
      color: #ff6744;
      opacity: 0.6;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    .page-left {
      width: 30%;
      // text-align: center;
      .title {
        width: 146px;
        height: 38px;
        margin: 0 auto;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: rgba(240, 241, 247, 1);
        line-height: 38px;
        background: url('~@/assets/img/dataDisplay/red-name-bg.png') center
          center no-repeat;
        background-size: cover;
      }
      .logo {
        width: 60px;
        height: 60px;
        position: relative;
        // top: -10px;
        top: -3px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .page-middle {
      width: 40%;
      .title {
        width: 292px;
        height: 76px;
        margin: 0 auto;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: rgba(255, 52, 52, 1);
        text-shadow: 0px 0px 30px rgba(12, 21, 48, 0.6);
        line-height: 76px;
        background: url('~@/assets/img/dataDisplay/red-name-bg.png') center
          center no-repeat;
        background-size: cover;
        margin-top: 60px;
        letter-spacing: 12px;
      }
      .score-box {
        width: 292px;
        height: 418px;
        margin: 40px auto;
        background: url('~@/assets/img/dataDisplay/red-score-bg.png') center
          center no-repeat;
        background-size: cover;
        text-align: center;
        line-height: 418px;
        font-size: 75px;
        font-family: Impact;
        font-weight: 400;
        color: rgba(255, 35, 24, 1);
        text-shadow: 0px 0px 40px rgba(12, 21, 48, 0.3);
      }
    }
    .page-right {
      width: 30%;
      .task {
        width: 100%;
        height: 33.33%;
        .title {
          width: 146px;
          height: 38px;
          margin: 10px auto;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: rgba(240, 241, 247, 1);
          line-height: 38px;
          background: url('~@/assets/img/dataDisplay/red-name-bg.png') center
            center no-repeat;
          background-size: cover;
        }
        .chart {
          height: 100%;
        }
      }
    }
  }
}
.red-grade-page {
  background: url('~@/assets/img/dataDisplay/red-grade-bg.png') center center
    no-repeat;
  // background-size: 1200px 900px 100% 100%;
}
</style>
<style lang="scss" scoped>
.red-grade-page {
  .score-list {
    width: 100%;
    height: 100%;
    .el-carousel {
      height: 100%;
      .el-carousel__container {
        .list-head,
        .data-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          color: rgba(254, 254, 254);
          div {
            flex: 1;
          }
        }
        .list-head {
          height: 48px;
          opacity: 0.6;
        }
        .list-wrap {
          & > div:nth-child(odd) {
            background: rgba(255, 5, 15, 0.12) !important;
          }
          & > div:nth-child(n) {
            opacity: 0.6;
          }
        }
        .list-first-wrap {
          & > div:nth-child(-n + 3) {
            opacity: 1;
          }
        }
        .data-content {
          height: 72px;
          .logo {
            width: 60px;
            height: 60px;
            position: relative;
            top: -3px;
            img {
              width: 100%;
            }
          }
          & > div:nth-child(2) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
