<template>
  <div ref="blueRank" class="ranking">
    <div class="title-bj">
      <h2>{{ $t('m.blueRankingList') }}</h2>
      <div class="time">{{ current_time }}</div>
    </div>
    <div class="center">
      <div class="rank-left">
        <div class="title">{{ $t('m.highScores') }}</div>
        <div class="score-list">
          <div class="list-head">
            <div>{{ $t('m.ranking') }}</div>
            <div></div>
            <div>{{ $t('dataVis.name') }}</div>
            <div>{{ $t('dataVis.score') }}</div>
          </div>
          <div class="list-content">
            <div
              class="line-content"
              v-for="(item, index) in teamData"
              :key="index"
            >
              <div class="rank">
                <template v-if="item.ranking <= 3">
                  <div class="ranking-logo">
                    <img v-if="item.ranking && item.ranking > 3" />
                    <img
                      v-else-if="item.ranking && item.ranking === 1"
                      :src="one_ranking"
                    />
                    <img
                      v-else-if="item.ranking && item.ranking === 2"
                      :src="two_ranking"
                    />
                    <img v-else :src="three_ranking" />
                  </div>
                </template>
                <template v-else>
                  <div>{{ item.ranking }}</div>
                </template>
              </div>
              <div>
                <div class="logo">
                  <img :src="item.logo ? item.logo : defaultImg" />
                </div>
              </div>
              <div :title="item.name">{{ item.name }}</div>
              <div>{{ item.score }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rank-right">
        <div class="title">{{ $t('m.taskProgressRanking') }}</div>
        <div class="score-list">
          <div class="list-head">
            <div>{{ $t('m.ranking') }}</div>
            <div></div>
            <div>{{ $t('dataVis.name') }}</div>
            <div>{{ $t('m.taskProgressRanking') }}</div>
          </div>
          <div class="list-content">
            <div
              class="line-content"
              v-for="(item, index) in rankData"
              :key="index"
            >
              <div class="rank">
                <template v-if="item.ranking <= 3">
                  <div class="ranking-logo">
                    <img v-if="item.ranking && item.ranking > 3" />
                    <img
                      v-else-if="item.ranking && item.ranking === 1"
                      :src="one_ranking"
                    />
                    <img
                      v-else-if="item.ranking && item.ranking === 2"
                      :src="two_ranking"
                    />
                    <img v-else :src="three_ranking" />
                  </div>
                </template>
                <template v-else>
                  <div>{{ item.ranking }}</div>
                </template>
              </div>
              <div>
                <div class="logo">
                  <img :src="item.logo ? item.logo : defaultImg" />
                </div>
              </div>
              <div>{{ item.name }}</div>
              <div>{{ item.mission_ratio }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  data() {
    return {
      timeStamp: '',
      isFirefox: /Firefox/i.test(navigator.userAgent),
      loading: false,
      timer: null,
      current_time: '',
      role_type: this.$CONSTANT.DataDisplay.BLUETEAM.value,
      blueRank: null,
      teamData: [
        // {
        //   ranking: 1,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 2,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 3,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 4,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 5,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 6,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 7,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 8,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 9,
        //   name: 'RedOne',
        //   score: 98,
        // },
        // {
        //   ranking: 10,
        //   name: 'RedOne',
        //   score: 98,
        // },
      ],
      rankData: [],
      defaultImg: require('@/assets/img/userlogo/userhead.png').default,
      one_ranking: require('@/assets/img/dataDisplay/NO1.png').default,
      two_ranking: require('@/assets/img/dataDisplay/NO2.png').default,
      three_ranking: require('@/assets/img/dataDisplay/NO3.png').default,
    };
  },
  mounted() {
    const { isFirefox } = this;
    this.blueRank = this.$refs['blueRank'];
    this.blueRank.addEventListener(
      isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      this.handleScroll,
      false,
    );
  },
  beforeDestroy() {
    const { isFirefox } = this;
    this.blueRank.removeEventListener(
      isFirefox ? 'DOMMouseScroll' : 'mousewheel',
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
    this.getBlueRank('init');
    this.getTimes();
    this.timer = setInterval(() => {
      this.getAllData();
    }, 1000 * 60);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getAllData() {
      this.getBlueRank();
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    getTimesInterval() {
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
          this.$router.push({ name: 'battle' });
          // setTimeout(() => {
          //   this.$router.push({ name: 'battle' });
          // }, 200);
        } else {
          this.$router.push({ name: 'red-rank' });
        }
      }
      if (parseInt(this.role_group) === 5) {
        // 鼠标滚轮向下或后
        if (direction === 'down') {
          this.$router.push({ name: 'blue-grade' });
          // setTimeout(() => {
          //   this.$router.push({ name: 'blue-grade' });
          // }, 200);
        } else {
          this.$router.push({ name: 'blue-grade' });
        }
      }
    },
    getBlueRank(flag) {
      this.loading = true;
      const scene_hash = this.resource_id;
      const role_type = this.role_type;
      this.teamData = [];
      this.rankData = [];
      // 蓝方排行榜
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_leader_board',
          { resource_id: scene_hash, role_type: role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.teamData = _.get(res, 'data.data.ranking_data', []);
          this.rankData = _.get(res, 'data.data.mission_data', []);
          //获取的时间戳
          if (flag == 'init') {
            this.timeStamp = res.data.timestamp;
          }
        })
        .catch((error) => {
          // errorMessage(error, this);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.ranking {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/dataDisplay/blue-rank-bg.png') center center;
  background-size: cover;
  background-attachment: fixed;
  position: fixed;
  .title-bj {
    width: 100%;
    height: 120px;
    margin: 0 auto;
    text-align: center;
    background: url('~@/assets/img/dataDisplay/blue-title-bg.png') no-repeat;
    background-size: 100% 100% !important;
    h2 {
      letter-spacing: 12px;
      font-size: 32px;
      line-height: 120px;
      color: rgba(255, 255, 255, 1);
      text-shadow: 0px 0px 30px rgba(12, 21, 48, 0.6);
      background: linear-gradient(
        0deg,
        rgba(194, 255, 251, 1) 0%,
        rgba(46, 209, 238, 1) 100%
      );
      font-family: Microsoft YaHei;
      font-weight: bold;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 0;
    }
    .time {
      font-size: 22px;
      height: 21px;
      padding-top: 10px;
      color: rgba(46, 209, 238, 0.7);
    }
  }
  .center {
    width: 100%;
    height: calc(100% - 120px);
    padding: 0 100px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    // background-color: rgba(0,0,0,.5);
    .rank-right {
      margin-left: 86px;
    }
    .rank-left,
    .rank-right {
      width: 50%;
      text-align: center;
      .title {
        width: 292px;
        height: 76px;
        margin: 0 auto;
        text-align: center;
        letter-spacing: 6px;
        font-size: 18px;
        font-weight: bold;
        color: rgba(46, 209, 238, 0.8);
        text-shadow: 0px 0px 30px rgba(12, 21, 48, 0.6);
        line-height: 76px;
        background: url('~@/assets/img/dataDisplay/blue-rank-smalltitle.png')
          center center no-repeat;
        background-size: cover;
      }
    }
    .rank-right {
      width: 50%;
    }
    .ranking-logo {
      position: relative;
    }
    .logo {
      width: 60px;
      height: 60px;
      position: relative;
      border-radius: 50%;
      // top: -7px;
      top: -4px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.rank-left,
.rank-right {
  .score-list {
    width: 100%;
    height: 100%;
    .list-head,
    .line-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      color: rgba(254, 254, 254);
      font-size: 20px;
      font-weight: 700;
      div {
        flex: 1;
      }
    }
    .list-head {
      height: 38px;
      opacity: 0.6;
    }
    .list-content {
      height: 700px;
      overflow-y: auto;
      & > div:nth-child(odd) {
        background: rgba(47, 204, 236, 0.12) !important;
      }
      & > div:nth-child(n + 4) {
        opacity: 0.6;
      }
    }
    .line-content {
      .logo {
        width: 60px;
        height: 60px;
        position: relative;
        top: -4px;
        img {
          width: 100%;
        }
      }
      height: 70px;
      & > div:nth-child(3) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .list-content::-webkit-scrollbar {
      width: 4px;
    }
    .list-content::-webkit-scrollbar-thumb {
      position: relative;
      display: block;
      width: 0;
      height: 0;
      cursor: pointer;
      border-radius: inherit;
      background-color: var(--scrollbar-color);
      transition: 0.3s background-color;
    }
  }
}
</style>
