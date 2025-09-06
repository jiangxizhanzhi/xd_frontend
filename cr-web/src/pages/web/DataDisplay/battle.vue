<template>
  <div ref="battleRef" class="battleing">
    <div class="title-bj">
      <h2>{{ $t('m.redAndBlueLiveAction') }}</h2>
      <div class="time .fr">{{ current_time }}</div>
    </div>
    <div class="center">
      <!-- 红方 -->
      <div class="red-left">
        <red-battle />
      </div>
      <!-- 红蓝battle -->
      <div class="middle">
        <div v-loading="loading" class="battle-top">
          <!-- 红卡片 -->
          <div class="red-ll">
            <div class="score-box">
              <div
                v-if="flag === $CONSTANT.DataDisplay.REDTEAM.value"
                class="win"
              />
              <div class="tip">{{ $t('m.red') }}</div>
              <div class="grade">{{ red_total_score }}</div>
            </div>
          </div>
          <!-- 时间 -->
          <div class="time-ll">
            <div class="title">{{ $t('m.gameTime') }}</div>
            <div class="timing">
              <span id="_h" class="count">{{
                durationDisplay.hours || '00'
              }}</span>
              <span class="dot1">:</span>
              <span id="_m" class="count">{{
                durationDisplay.mins || '00'
              }}</span>
              <span class="dot2">:</span>
              <span id="_s" class="count">{{
                durationDisplay.secs || '00'
              }}</span>
            </div>
          </div>
          <!-- 蓝卡片 -->
          <div class="blue-ll">
            <div class="score-box">
              <div
                v-if="flag === $CONSTANT.DataDisplay.BLUETEAM.value"
                class="win"
              />
              <div class="tip">{{ $t('m.blue') }}</div>
              <div class="grade">{{ blue_total_score }}</div>
            </div>
          </div>
        </div>
        <div class="middel-battle" />
        <div class="battle-bottom">
          <div class="title">{{ $t('m.redAndBlueScore') }}</div>
          <div class="chart">
            <score-trends v-loading="loading" :data="scoreTrendsData" />
          </div>
        </div>
      </div>
      <!-- 蓝方 -->
      <div class="blue-right">
        <blue-battle />
      </div>
    </div>
  </div>
</template>
<script>
import ScoreTrends from '@/pages/web/DataDisplay/components/score-battle.vue';
import RedBattle from '@/pages/web/DataDisplay/red-battle.vue';
import BlueBattle from '@/pages/web/DataDisplay/blue-battle.vue';
import _ from 'lodash';
import { errorMessage } from '@/assets/js/tools.js';
export default {
  components: {
    ScoreTrends,
    RedBattle,
    BlueBattle,
  },
  data() {
    return {
      isFirefox: /Firefox/i.test(navigator.userAgent),
      current_time: '',
      loading: false,
      timer: null,
      role_type: 6,
      battleRef: null,
      time: null,
      time_h: null,
      time_m: null,
      time_s: null,
      taskCount: 'defenseResult',
      redColor: [
        '#6D0004',
        '#830005',
        '#980006',
        '#A60006',
        '#BF0007',
        '#DC0008',
        '#FF0009',
      ],
      scoreTrendsData: {
        days_list: [],
        mission_week_total: [],
        mission_before_total: [],
        marNumber: 10,
      },
      red_total_score: 0,
      blue_total_score: 0,
      flag: 0,
      status: -1,
      runningTime: 0,
      updateClockInterval: null,
    };
  },
  computed: {
    durationDisplay() {
      const { status, runningTime } = this;
      if (status === 0) {
        return {
          hours: '00',
          mins: '00',
          secs: '00',
        };
      }
      const hourRate = 60 * 60 * 1000;
      const minRate = 60 * 1000;
      let hours = Math.floor(runningTime / hourRate);
      let mins = Math.floor((runningTime - hours * hourRate) / minRate);
      let secs = Math.floor(
        (runningTime - hours * hourRate - mins * minRate) / 1000,
      );

      if (hours > 99) {
        hours = 99;
      }
      return {
        hours: `${hours}`.padStart(2, '0'),
        mins: `${mins}`.padStart(2, '0'),
        secs: `${secs}`.padStart(2, '0'),
      };
    },
  },
  mounted() {
    const that = this;
    that.updateClockInterval = setInterval(() => {
      if (that.status === 2 || that.status === 0) {
        clearInterval(that.updateClockInterval);
      } else {
        that.runningTime += 1 * 1000;
      }
    }, 1000);
    this.battleRef = this.$refs['battleRef'];
    this.battleRef.addEventListener(
      that.isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      this.handleScroll,
      false,
    );
  },
  beforeDestroy() {
    const that = this;
    this.battleRef.removeEventListener(
      that.isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      function () {},
      false,
    );
    if (this.current_time) {
      clearInterval(this.getTimesInterval);
    }
    clearInterval(this.timer);
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.role_group = this.$route.params && this.$route.params.role;
    this.getbattle();
    this.getStartTime();
    this.getTimes();
    this.timer = setInterval(() => {
      this.getAllData();
    }, 1000 * 60);
    // this.getTime()
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getStartTime() {
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/rb_time_data',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.runningTime = _.get(res, 'data.data.running', 0) * 1000;
        })
        .catch((ex) => {
          // this.running = new Date().getTime() - 1000 * 60 * 60 * 1.5
        });
    },
    getAllData() {
      this.getbattle();
    },
    getbattle() {
      this.loading = true;
      this.scoreTrendsData.days_list = [];
      this.scoreTrendsData.mission_week_total = [];
      this.scoreTrendsData.mission_before_total = [];
      this.scoreTrendsData.marNumber = 10;
      this.red_total_score = 0;
      this.blue_total_score = 0;
      // 红蓝实时状况红蓝得分
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_score_progress',
          { resource_id: this.resource_id, role_type: this.role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.scoreTrendsData.days_list = _.get(res, 'data.data.x_data', []);
          this.scoreTrendsData.mission_week_total = _.get(
            res,
            'data.data.y_blue_score',
            [],
          );
          this.scoreTrendsData.mission_before_total = _.get(
            res,
            'data.data.y_red_score',
            [],
          );
          this.scoreTrendsData.marNumber = parseInt(
            this.scoreTrendsData.days_list.length / 10,
          );
          this.red_total_score = _.get(res, 'data.data.red_total_score', 0);
          this.blue_total_score = _.get(res, 'data.data.blue_total_score', 0);
          this.status = _.get(res, 'data.data.status', -1);

          if (this.red_total_score || this.blue_total_score) {
            if (
              this.red_total_score > this.blue_total_score &&
              this.red_total_score !== this.blue_total_score
            ) {
              this.flag = this.$CONSTANT.DataDisplay.REDTEAM.value;
            } else {
              this.flag = this.$CONSTANT.DataDisplay.BLUETEAM.value;
            }
          }
        })
        .catch((error) => {
          errorMessage(error, this);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    getTimesInterval() {
      const that = this;
      const year = new Date().getFullYear(); // 获取当前时间的年份
      const month = new Date().getMonth() + 1; // 获取当前时间的月份
      const day = new Date().getDate(); // 获取当前时间的天数
      let hours = new Date().getHours(); // 获取当前时间的小时
      let minutes = new Date().getMinutes(); // 获取当前时间的分数
      let seconds = new Date().getSeconds(); // 获取当前时间的秒数
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
      // 鼠标滚轮向下或后
      if (direction === 'down') {
        this.$router.push({ name: 'red-grade' });
        // setTimeout(() => {
        //   // this.$router.push({ name: 'red-grade' },params)
        //   this.$router.push({
        //     path:
        //       '/data-display/red-grade/' +
        //       this.resource_id +
        //       '/' +
        //       this.role_group,
        //   });
        // }, 200);
      } else {
        this.$router.push({ name: 'blue-rank' });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.battleing {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/dataDisplay/battle.png') center center;
  background-size: cover;
  background-attachment: fixed;
  .title-bj {
    position: relative;
    width: 100%;
    height: 120px;
    margin: 0 auto;
    text-align: center;
    background: url('~@/assets/img/dataDisplay/battle-title.png') no-repeat;
    background-size: 100% 100% !important;
    h2 {
      text-indent: 12px;
      letter-spacing: 14px;
      font-size: 32px;
      line-height: 120px;
      color: rgba(255, 255, 255, 1);
      text-shadow: 0px 0px 30px rgba(12, 21, 48, 0.6);
      font-family: Microsoft YaHei;
      font-weight: bold;
      margin-top: 0;
    }
    .time {
      position: absolute;
      top: 25px;
      right: 30px;
      height: 21px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .center {
    width: 100%;
    height: calc(100% - 130px);
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    .red-left,
    .blue-right {
      width: 22%;
    }
    .middle {
      width: 56%;
      .battle-top {
        width: 100%;
        height: 35%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        .red-ll {
          width: 20%;
          height: 100%;
          // flex-grow:1;
          flex-shrink: 1;
          margin: 0 auto;
          position: relative;
          .score-box {
            // width: 100px;
            height: 292px;
            margin: 10px auto 0;
            background: url('~@/assets/img/dataDisplay/red-small.bg.png') center
              center no-repeat;
            background-size: 100% 100%;
            text-align: center;
            text-shadow: 0px 0px 40px rgba(12, 21, 48, 0.3);
            box-sizing: border-box;
            .tip {
              padding-top: 40px;
              font-size: 20px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(255, 53, 53, 1);
            }
            .grade {
              padding-top: 70px;
              font-size: 50px;
              font-family: Impact;
              font-weight: 400;
              color: rgba(255, 35, 24, 1);
            }
            .win {
              position: absolute;
              top: -25px;
              right: -8px;
              width: 141px;
              height: 108px;
              background: url('~@/assets/img/dataDisplay/NO.1.png');
            }
          }
        }
        .time-ll {
          // width: 50%;
          // height: 100%;
          flex-shrink: 0;
          margin: 0 auto;
          // margin: 0 10px;
          // background-color: darkorange;
          .title {
            width: 150px;
            height: 44px;
            margin: 30px auto 0;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 10px;
            color: rgba(240, 241, 247, 1);
            line-height: 38px;
            background: url('~@/assets/img/dataDisplay/battle-time.png') center
              center no-repeat;
            background-size: cover;
          }
          .timing {
            // width: 486px;
            height: 114px;
            margin: 10px auto;
            text-align: center;
            font-size: 60px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(240, 241, 247, 1);
            line-height: 114px;
            background: url('~@/assets/img/dataDisplay/timing.png') center
              center no-repeat;
            // background-size: 486px 114px;
            .count {
              letter-spacing: 30px;
              position: relative;
              top: 0;
              right: 0;
              box-sizing: border-box;
              font-weight: bolder;
            }
            #_h {
              right: -26px !important;
            }
            #_m {
              right: -14px !important;
            }
            #_s {
              right: -7px !important;
            }
            .dot1 {
              position: relative;
              top: -2px;
              right: -5px;
            }
            .dot2 {
              position: relative;
              top: -2px;
              right: 4px;
            }
          }
        }
        .blue-ll {
          width: 20%;
          height: 100%;
          flex-shrink: 1;
          position: relative;
          margin: 0 auto;
          .score-box {
            // width:204px ;
            height: 292px;
            margin: 10px auto 0;
            background: url('~@/assets/img/dataDisplay/blue-small.bg.png')
              center center no-repeat;
            background-size: 100% 100%;
            text-align: center;
            font-size: 50px;
            font-family: Impact;
            font-weight: 400;
            color: rgba(0, 192, 255, 1);
            text-shadow: 0px 0px 40px rgba(12, 21, 48, 0.3);
            box-sizing: border-box;
            .tip {
              padding-top: 40px;
              font-size: 20px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(56, 183, 255, 1);
            }
            .grade {
              padding-top: 70px;
              font-size: 50px;
              font-family: Impact;
              font-weight: 400;
              color: rgba(0, 192, 255, 1);
            }
          }
          .win {
            position: absolute;
            top: -25px;
            right: -21px;
            width: 141px;
            height: 108px;
            background: url('~@/assets/img/dataDisplay/NO.1.png');
          }
        }
      }
      .middel-battle {
        width: 100%;
        height: 35%;
      }
      .battle-bottom {
        width: 100%;
        height: calc(30% - 50px);
        .title {
          width: 150px;
          height: 44px;
          margin: 0 auto;
          text-align: center;
          font-size: 18px;
          font-weight: normal;
          color: rgba(240, 241, 247, 1);
          line-height: 38px;
          background: url('~@/assets/img/dataDisplay/red-blue-title.png') center
            center no-repeat;
          background-size: cover;
        }
        .chart {
          width: 100%;
          height: 100%;
        }
      }
    }
    // .blue-right{
    //   width: 22%;
    //   .red-four-middel,.red-four-botton{
    //   .task{
    //     .title{
    //       width: 146px;
    //       height: 38px;
    //       margin: 10px auto 0;
    //       text-align: center;
    //       font-size: 18px;
    //       font-weight:normal;
    //       color:rgba(240,241,247,1);
    //       line-height: 38px;
    //       background: url('~@/assets/img/dataDisplay/blue-name-bg.png') center center no-repeat;
    //       background-size: cover;
    //     }
    //   }
    //   }
    //     .red-tow-top{
    //     .left-square,.middle-square,.right-square{
    //      background: url("~@/assets/img/dataDisplay/blue-number.png")
    //    }
    //  }
    // }
  }
  ::v-deep .el-loading-mask {
    background: none;
  }
}
</style>
