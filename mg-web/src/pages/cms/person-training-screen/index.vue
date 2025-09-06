<template>
  <cb-inner-page style="padding: 0">
    <div class="person-screen-box">
      <div class="person-screen">
        <div class="person-header">
          <div class="title-bg">
            <div class="title">
              {{ $t('personTrainingScreen.cyberPersonTraing') }}
            </div>
          </div>
        </div>
        <div class="person-screen-left">
          <div class="org-box common-box">
            <Title :name="$t('personTrainingScreen.cyberOrg')"></Title>
            <div class="org-content" v-loading="loading">
              <ScrollTable
                :tableData="org_ranking"
                rankType="org"
                :cols="orgColData"
              />
            </div>
          </div>

          <div class="position-box">
            <Title :name="$t('personTrainingScreen.cyberTalent')"></Title>
            <div class="position-content" v-loading="loading">
              <ScrollTable
                :tableData="multi_role_ranking"
                rankType="multi"
                :cols="multiColData"
              />
            </div>
          </div>
        </div>
        <div class="person-screen-middle">
          <div class="position-echart">
            <PositionEchart />
          </div>
          <div class="trend-box">
            <MiddleTitle :name="$t('personTrainingScreen.cyberTrend')" />
            <div class="trend-echart">
              <TrendEchart />
            </div>
          </div>
        </div>
        <div class="person-screen-right">
          <div class="rank-box common-box">
            <Title :name="$t('personTrainingScreen.cyberRank')"></Title>
            <div class="rank-content" v-loading="loading">
              <ScrollTable
                :tableData="user_ranking"
                rankType="user"
                :cols="userColData"
                :limitNum="13"
              />
            </div>
          </div>
          <div class="dynamics-box common-box">
            <Title :name="$t('personTrainingScreen.talentDynamics')"></Title>
            <div class="dynamics-content" v-loading="talendLoading">
              <TalentDynamics :dataList="talentList" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import Title from './components/title.vue';
import MiddleTitle from './components/middle-title.vue';
import ScrollTable from './components/scroll-table.vue';
import PositionEchart from './components/position-echart.vue';
import TrendEchart from './components/trend-echart.vue';
import TalentDynamics from './components/talent-dynamics.vue';
import { rankCollect, talentNews } from '@/api/person-training-screen';
import { orgCol, multiCol, userCol } from './constant';
import { getSysSettings } from '@cyber/helper';
import _ from 'lodash';
export default {
  components: {
    Title,
    MiddleTitle,
    ScrollTable,
    PositionEchart,
    TrendEchart,
    TalentDynamics,
  },
  data() {
    return {
      org_ranking: [],
      multi_role_ranking: [],
      user_ranking: [],
      // orgCol,
      // multiCol,
      // userCol,
      orgColData: [],
      multiColData: [],
      userColData: [],
      talentList: [],
      loading: false,
      talendLoading: false,
    };
  },
  mounted() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    this.getRankCollet();
    this.getTalentNews();
  },
  methods: {
    // 获取排名
    getRankCollet() {
      this.loading = true;
      rankCollect().then((res) => {
        this.loading = false;
        const data = _.get(res, 'data.data');
        if (data.org_ranking.length > 10) {
          this.org_ranking = data.org_ranking.slice(0, 10);
          this.orgColData = orgCol;
        } else {
          if (data.org_ranking.length === 0) {
            this.orgColData = [];
          } else {
            this.orgColData = orgCol;
          }
          this.org_ranking = data.org_ranking;
        }
        if (data.multi_role_ranking.length > 5) {
          this.multiColData = multiCol;
          this.multi_role_ranking = data.multi_role_ranking.slice(0, 5);
        } else {
          if (data.multi_role_ranking.length === 0) {
            this.multiColData = [];
          } else {
            this.multiColData = multiCol;
          }

          this.multi_role_ranking = data.multi_role_ranking;
        }
        if (data.user_ranking.length > 10) {
          this.userColData = userCol;
          this.user_ranking = data.user_ranking.slice(0, 10);
        } else {
          if (data.user_ranking.length === 0) {
            this.userColData = [];
          } else {
            this.userColData = userCol;
          }
          this.user_ranking = data.user_ranking;
        }
      });
    },
    // 获取动态
    getTalentNews() {
      this.talendLoading = true;
      talentNews().then((res) => {
        this.talendLoading = false;
        const data = _.get(res, 'data.data');
        if (data.length > 6) {
          this.talentList = data.slice(0, 6);
        } else {
          this.talentList = data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1440px) and (max-width: 1920px) {
  .person-screen-box {
    font-size: 16px;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  .person-screen-box {
    font-size: 13px;
  }
}

.person-screen-box {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/person-training/bg.png') no-repeat;
  background-size: cover;
  color: rgba(255, 255, 255, 0.9);
  .person-header {
    position: absolute;
    display: flex;
    width: 100%;
    height: 60px;
    .title-bg {
      display: flex;
      width: 100%;
      height: 100%;
      background: url('@/assets/img/person-training/title.png') no-repeat;
      background-size: cover;
      justify-content: center;
    }
    .title {
      font-size: 2.5em;
      font-family: youshebiaotihei !important;
      color: #ffffff;
      line-height: 1.5;
      letter-spacing: -2px;
      text-shadow: 0px 2px 8px rgba(21, 65, 111, 0.4);
      background: linear-gradient(180deg, #ffffff 0%, #cce6ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .person-screen {
    position: relative;
    display: flex;
    text-align: center;
    &-left,
    &-right {
      width: 22%;
    }
    &-middle {
      width: 56%;
      .position-echart {
        width: 100%;
        height: calc(100% - 25em);
      }
      .trend-box {
        .trend-echart {
          width: 100%;
          height: 18.75em;
        }
      }
    }
    .common-box {
      margin: 1.875em 0;
    }
    &-left {
      height: 100%;
      background: url('@/assets/img/person-training/left.png') no-repeat;
      background-size: cover;
      padding: 2.5em 0 2.5em 1.875em;
    }
    &-right {
      height: 100%;
      background: url('@/assets/img/person-training/right.png') no-repeat;
      background-size: cover;
      padding: 2.5em 1.875em 2.5em 0;
    }
  }
}
</style>
