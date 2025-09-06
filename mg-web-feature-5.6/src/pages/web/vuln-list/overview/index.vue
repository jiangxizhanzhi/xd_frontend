<template>
  <cb-inner-page class="vuln-web-index-page" :background="false">
    <div class="vuln-web-index-container">
      <!--      <div class="index-top-search">
        <search-input-bar @search="search"></search-input-bar>
      </div>-->
      <div class="index-bottom-charts">
        <!-- 弱点枚举top10 -->
        <div class="bottom-left__ranking index-block-bg">
          <h3>{{ $t('vulnIndex.weaknessRank') }}</h3>
          <rank-list></rank-list>
        </div>
        <div class="bottom-mid">
          <!-- 漏洞数量总览 -->
          <div class="bottom-mid__overview index-block-bg">
            <div class="title-box">
              <h3>{{ $t('vulnIndex.vulnTotalNum') }}</h3>
              <span
                >{{ $t('vulnIndex.lastRevisionDate') + $t('common.colon')
                }}{{ updateTime }}</span
              >
            </div>
            <quantity-overview
              :category="category"
              :total="total"
            ></quantity-overview>
          </div>
          <!-- 发布趋势 -->
          <div class="bottom-mid__trend index-block-bg">
            <h3>{{ $t('vulnIndex.publishTrend') }}</h3>
            <publish-trend></publish-trend>
          </div>
        </div>
        <div class="bottom-right">
          <!-- 数据统计 -->
          <div class="bottom-right__chart index-block-bg">
            <h3>{{ $t('vulnIndex.dataStatistic') }}</h3>
            <data-statistic></data-statistic>
          </div>
          <!-- 利用类型统计 -->
          <div class="bottom-right__percent index-block-bg">
            <h3>{{ $t('vulnIndex.useTypeStatistic') }}</h3>
            <use-type-statistic></use-type-statistic>
          </div>
          <!-- 等级统计 -->
          <div class="bottom-right__level index-block-bg">
            <h3>{{ $t('vulnIndex.levelStatistic') }}</h3>
            <level-statistic></level-statistic>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import RankList from './components/rank-list.vue';
import QuantityOverview from './components/quantity-overview.vue';
import PublishTrend from './components/publish-trend.vue';
import DataStatistic from './components/data-statistic.vue';
import UseTypeStatistic from './components/use-type-statistic.vue';
import LevelStatistic from './components/level-statistic.vue';
import { getVulnOverviewIndustry } from '@/api/vuln';

export default {
  components: {
    RankList,
    QuantityOverview,
    PublishTrend,
    DataStatistic,
    UseTypeStatistic,
    LevelStatistic,
  },
  data() {
    return {
      category: {},
      total: 0,
      updateTime: '',
    };
  },
  mounted() {
    this.getIndustryData();
  },
  methods: {
    getIndustryData() {
      getVulnOverviewIndustry().then((res) => {
        this.total = _.get(res, 'data.data.total', 0);
        this.updateTime = _.get(res, 'data.data.update_dime', '');
        this.updateTime = this.updateTime && this.updateTime.slice(0, 10);
        let categoryList = _.get(res, 'data.data.statistics', []);
        if (categoryList.length > 0) {
          categoryList.map((item) => {
            this.category[item.industry] = item.count;
          });
        }
      });
    },
    search() {
      this.$router.push({
        name: 'vuln-list',
      });
    },
  },
};
</script>

<style scoped lang="scss">
.vuln-web-index-container {
  min-height: 710px;
  width: 100%;
  height: inherit;
  .index-top-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    margin-top: 4px;
    margin-bottom: 20px;
  }
  .index-bottom-charts {
    width: 100%;
    height: calc(100% - 36px);
    display: flex;
    $mr: 1vw;
    overflow: hidden;
    // 弱点枚举top10
    .bottom-left__ranking {
      height: 100%;
      width: 26%;
    }
    .bottom-mid {
      width: calc(100% - 26% - 26% - 2 *#{$mr});
      height: 100%;
      margin: 0 $mr;
      // 漏洞数量总览
      .bottom-mid__overview {
        height: calc(64% + #{$mr});
        width: 100%;
      }
      // 发布趋势
      .bottom-mid__trend {
        height: calc(100% - 64% - 2 *#{$mr});
        width: 100%;
        margin-top: $mr;
      }
    }
    .bottom-right {
      height: 100%;
      width: 26%;
      // 数据统计 利用类型统计
      .bottom-right__chart {
        width: 100%;
        height: 30%;
        margin-bottom: $mr;
      }
      .bottom-right__percent {
        width: 100%;
        height: 34%;
        margin-bottom: $mr;
      }
      // 等级统计
      .bottom-right__level {
        width: 100%;
        height: calc(100% - 64% - 2 *#{$mr});
      }
    }
  }
  .index-block-bg {
    background-color: var(--bg-color-2);
    h3,
    .title-box > h3 {
      margin: 0 1vw 0;
      line-height: 48px;
      font-size: 16px;
      font-weight: 700;
      color: var(--neutral8);
    }
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        margin-bottom: 0;
      }
      span {
        margin-right: 16px;
        line-height: 48px;
        font-size: 12px;
        color: var(--neutral8);
      }
    }
  }
}
</style>
