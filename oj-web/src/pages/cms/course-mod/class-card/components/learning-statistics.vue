<template>
  <div class="class-learn-content">
    <div class="learning-statistics common-chunk fl">
      <div class="descript">{{ $t('m.statisticsLearning') }}</div>
      <div class="content">
        <div class="content-detail one-overflow">
          <i class="iconfont iconjiqunguanli"></i
          ><span>{{ $t('m.learninUnit') }}</span>
          <cb-tooltip
            class="item"
            popper-class="group-user-tip"
            effect="dark"
            :content="sign_info.organization_info"
            placement="top-start"
            ><span>{{ sign_info.organization_info }}</span></cb-tooltip
          >
        </div>
        <div class="content-detail">
          <i class="iconfont iconqiandao"></i
          ><span>{{ $t('m.signinNumber') }}</span
          ><span class="sign-in">{{ sign_info.is_sign }}</span>
        </div>
        <div class="content-detail">
          <i class="iconfont icondanxuan"></i
          ><span>{{ $t('m.completionsNumber') }}</span
          ><span class="completions-num">{{ sign_info.finish_count }}</span>
        </div>
      </div>
    </div>
    <div class="user-statistics common-chunk fl">
      <div class="descript">{{ $t('m.userStatistics') }}</div>
      <div class="content-echart">
        <cb-echart-pie
          :gapShow="gapShow"
          :gapColor="gapColor"
          v-if="pieData.length != 0 && readyPie"
          :pieData="pieData"
          :pieName="pieName"
          legendLocation="right"
          :radius="radius"
        ></cb-echart-pie>
      </div>
    </div>
    <div class="personnel-performance common-chunk fl">
      <div class="descript">{{ $t('m.staffPerformanceStatistics') }}</div>
      <div class="content-echart">
        <cb-chart-bar
          v-if="barReady"
          :name="[]"
          :barData="barData"
          :xData="xData"
          :yMax="100"
          :ySplitLineShow="true"
          barWidth="30px"
        ></cb-chart-bar>
      </div>
    </div>
    <div class="top-achievement common-chunk fl">
      <div class="descript">{{ $t('m.topResults') }}</div>
      <div class="content-echart">
        <cb-chart-bar
          v-if="barReady"
          :name="resultsName"
          :barData="TopBarData"
          :xData="xDataTop"
          :yMax="100"
          :ySplitLineShow="true"
          barWidth="30px"
        ></cb-chart-bar>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  components: {},
  data() {
    return {
      readyPie: true,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // 表示是否是浅色系
      light: true,
      gapShow: true,
      chartLoaded: false,
      barChartLoaded: false,
      topBarChartLoaded: false,
      sign_info: {
        finish_count: 0,
        is_sign: 0,
        not_sign: 0,
        organization_info: '',
      },
      grade_distribution: {
        excellent: 0,
        full_score: 0,
        good: 0,
        not_pass: 0,
        pass: 0,
      },
      top20: [],
      pieData: [],
      pieName: [],
      gapColor: 'bg-color-2',
      barReady: false,
      xData: [
        this.$t('m.learningNotPass'),
        this.$t('m.learningPass'),
        this.$t('m.learningGood'),
        this.$t('m.learningExcellent'),
        this.$t('m.learningFullMarks'),
      ],
      barData: [],
      resultsName: [this.$t('m.score')],
      TopBarData: [],
      xDataTop: [],
      radius: ['40%', '55%'],
    };
  },
  computed: {},
  created() {
    this.getDate();
    this.pieName.push(this.$t('m.learningNotCheckedIn'));
    this.pieName.push(this.$t('m.learningSignin'));
  },
  mounted() {
    this.listenFunc();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
      this.readyPie = false;
      this.barReady = false;
      this.$nextTick(() => {
        this.readyPie = true;
        this.barReady = true;
      });
    },
    getDate() {
      this.$request
        .get(
          '/oj/admin/course/classroom/classroom_statistic',
          {
            classroom_id: this.$route.params.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.sign_info = _.get(res, 'data.data.sign_info');
          this.grade_distribution = _.get(res, 'data.data.grade_distribution');
          this.top20 = _.get(res, 'data.data.top20');
          //初始用户统计图
          this.pieData.push(this.sign_info.not_sign);
          this.pieData.push(this.sign_info.is_sign);
          //初始化人员成绩统计图
          this.barData.push(this.grade_distribution.not_pass);
          this.barData.push(this.grade_distribution.pass);
          this.barData.push(this.grade_distribution.good);
          this.barData.push(this.grade_distribution.excellent);
          this.barData.push(this.grade_distribution.full_score);
          //初始化Top20成绩
          _.forEach(this.top20, (item) => {
            this.xDataTop.push(item.user_name);
            this.TopBarData.push(item.score);
          });
          this.barReady = true;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.class-learn-content {
  .common-chunk {
    background-color: var(--bg-color-3);
  }
  .learning-statistics {
    .sign-in {
      color: var(--green-color);
    }
    .completions-num {
      color: var(--blue-color);
    }
  }
}
</style>
<style scoped lang="scss">
.class-learn-content {
  .common-chunk {
    box-sizing: border-box;
    padding: 15px;
    margin-bottom: 20px;
    .descript {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
  }
  .learning-statistics {
    margin-right: 20px;
    width: 300px;
    height: 360px;
    .content {
      background: transparent;
      padding: 32px;
    }
    .content-detail {
      width: 100%;
      height: 16px;
      margin-bottom: 28px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      span {
        margin-left: 8px;
      }
    }
  }
  .user-statistics {
    width: 360px;
    height: 360px;
    margin-right: 20px;
    .content-echart {
      width: 100%;
      height: 300px;
    }
  }
  .personnel-performance {
    width: calc(100% - 360px - 300px - 40px);
    height: 360px;
    .content-echart {
      width: 100%;
      height: 300px;
    }
  }
  .top-achievement {
    width: 100%;
    height: 420px;
    .content-echart {
      width: 100%;
      height: 350px;
    }
  }
}
</style>
