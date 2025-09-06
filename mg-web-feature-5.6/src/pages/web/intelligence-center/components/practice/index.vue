<template>
  <div class="box practice">
    <div class="title">
      {{ index }}. {{ $t('intelligence.report.practice.title') }}
    </div>
    <div class="first-title">
      {{ index }}.1 {{ $t('intelligence.report.practice.titleTheory')[0] }}
    </div>
    <!--2.1.1总体练习情况-->
    <div class="sub-box">
      <div class="sub-title">
        {{ index }}.1.1 {{ $t('intelligence.report.practice.titleTheory')[1] }}
      </div>
      <div class="card chart">
        <div class="left-info progress-box">
          <cb-progress
            type="circle"
            :percentage="percentage"
            :strokeWidth="11"
            strokeLinecap="round"
          >
            <template v-slot:circle-text>
              <div class="progress-text">
                <div class="top-sum">
                  {{ getValue('theory_overall_stats.sum.count') }}
                </div>
                <div class="line"></div>
                <div class="bottom-sum">
                  {{ getValue('theory_overall_stats.sum.sum') }}
                </div>
              </div>
            </template>
          </cb-progress>
        </div>
        <div class="right-info">
          <div class="item">
            <span class="green">{{ $t('intelligence.difficulty')[0] }}</span>
            <span>
              {{ getValue('theory_overall_stats.simple.count') }}
              <span class="right-count">{{
                getValue('theory_overall_stats.simple.sum')
              }}</span>
            </span>
          </div>
          <div class="item">
            <span class="orange">{{ $t('intelligence.difficulty')[1] }}</span>
            <span>
              {{ getValue('theory_overall_stats.medium.count') }}
              <span class="right-count">{{
                getValue('theory_overall_stats.medium.sum')
              }}</span>
            </span>
          </div>
          <div class="item">
            <span class="red">{{ $t('intelligence.difficulty')[2] }}</span>
            <span>
              {{ getValue('theory_overall_stats.difficulty.count') }}
              <span class="right-count">{{
                getValue('theory_overall_stats.difficulty.sum')
              }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--2.1.2各方向题目练习情况-->
    <div class="sub-box">
      <div class="sub-title">
        {{ index }}.1.2 {{ $t('intelligence.report.practice.titleTheory')[2] }}
      </div>
      <div class="card table">
        <cb-search-table
          :cols="directCols"
          :data-source="data.theory_direction_stats"
          :hidePaginOnDemand="true"
          :searchBarBg="false"
        >
        </cb-search-table>
      </div>
    </div>
    <!--2.2实操题-->
    <div class="first-title">
      {{ index }}.2 {{ $t('intelligence.report.practice.titlePractice')[0] }}
    </div>
    <!--2.2.1总体练习情况-->
    <div class="sub-box">
      <div class="sub-title">
        {{ index }}.2.1
        {{ $t('intelligence.report.practice.titlePractice')[1] }}
      </div>
      <div class="card radar">
        <cb-echart-radar
          :radarShape="radarShape"
          :indicator="indicator"
          :radarData="radarData"
          :radarRadius="radarRadius"
          :chartSize="{ height: '100px' }"
        ></cb-echart-radar>
      </div>
    </div>
    <!--2.2.2实操题练习数量-->
    <div class="sub-box">
      <div class="sub-title">
        {{ index }}.2.2
        {{ $t('intelligence.report.practice.titlePractice')[2] }}
      </div>
      <div class="card table">
        <cb-search-table
          :cols="practicalCols"
          :data-source="data.practical_direction_stats"
          :hidePaginOnDemand="true"
          :searchBarBg="false"
        >
        </cb-search-table>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'practice-card',
  components: {},
  props: {
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      directCols: [
        {
          label: this.$t('intelligence.report.practice.directCols')[0],
          prop: 'direction',
        },
        {
          label: this.$t('intelligence.report.practice.directCols')[1],
          prop: 'count',
        },
        {
          label: this.$t('intelligence.report.practice.directCols')[2],
          prop: 'practice_count',
        },
        {
          label: this.$t('intelligence.report.practice.directCols')[3],
          prop: 'error_count',
        },
      ],
      radarShape: 'sharp',
      radarRadius: ['0%', '53%'],
      practicalCols: [
        {
          label: this.$t('intelligence.report.practice.practicalCols')[0],
          prop: 'direction',
        },
        {
          label: this.$t('intelligence.report.practice.practicalCols')[1],
          prop: 'count',
        },
        {
          label: this.$t('intelligence.report.practice.practicalCols')[2],
          prop: 'solved',
        },
      ],
    };
  },
  computed: {
    percentage() {
      return (
        ((this.data.theory_overall_stats.sum.count || 0) /
          (this.data.theory_overall_stats.sum.sum || 1)) *
        100?.toFixed(1)
      );
    },
    indicator() {
      return (
        this.data.practical_overall_stats?.map((item) => ({
          name: item.name,
          max: item.sum,
        })) || []
      );
    },
    radarData() {
      return this.data.practical_overall_stats?.map((item) => item.count) || [];
    },
  },
  methods: {
    getValue(path) {
      return _.get(this.data, path, '-');
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .sub-box {
    margin-bottom: 16px;
    .card {
      margin: 8px 0;
      padding: 8px 16px;
      line-height: 1.8;
      background-color: var(--neutral0);
      &.table {
        padding: 0;
      }
      &.radar {
        height: 168px;
      }
      &.chart {
        display: flex;
        height: 145px;
        padding-left: 70px;
        align-items: center;
        justify-content: space-around;
      }
      .progress-text {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .progress-box {
        display: flex;
        align-items: center;
        justify-content: center;
        .top-sum {
          font-size: 24px;
          font-weight: 600;
          color: var(--neutral8);
        }
        .line {
          width: 32px;
          height: 1px;
          background: var(--neutral1);
          margin-bottom: 4px;
        }
        .bottom-sum {
          font-size: 12px;
          font-weight: 400;
          color: var(--neutral5);
        }
      }
    }
  }

  .left-info {
    flex: 1;
    height: 100%;
  }
  .right-info {
    flex: 2;
    display: flex;
    justify-content: space-around;
    .item {
      display: flex;
      flex-direction: column;
      .green {
        color: var(--green-color);
      }
      .orange {
        color: var(--orange-color);
      }
      .red {
        color: var(--red-color);
      }
      .right-count {
        margin-left: 4px;
        padding-left: 8px;
        border-left: 1px solid var(--neutral1);
        font-size: 12px;
        font-weight: 400;
        color: var(--neutral5);
      }
    }
  }

  .first-title {
    margin: 8px 0;
    font-weight: 600;
  }
}
</style>
