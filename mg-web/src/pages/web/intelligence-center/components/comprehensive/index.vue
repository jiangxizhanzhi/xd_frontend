<template>
  <div>
    <!--综合训练-->
    <div class="box comprehensive">
      <div class="title">
        {{ index }}. {{ $t('intelligence.report.comprehensive.title') }}
      </div>
      <div class="first-title">
        {{ index }}.1 {{ $t('intelligence.report.comprehensive.titleList')[0] }}
      </div>
      <div class="sub-box">
        <div class="card chart general">
          <comprehensive-chart :data="data.overall_stats"></comprehensive-chart>
        </div>
      </div>
      <div class="sub-box">
        <div class="sub-title">
          {{ index }}.2
          {{ $t('intelligence.report.comprehensive.titleList')[1] }}
        </div>
        <div class="card">
          <cb-search-table
            :cols="taskCols"
            :data-source="data.task_completion"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          >
          </cb-search-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComprehensiveChart from './comprehensive-chart';

export default {
  name: 'comprehensive',
  components: {
    ComprehensiveChart,
  },
  props: {
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
      taskCols: [
        {
          label: this.$t('intelligence.report.comprehensive.taskCols')[0],
          prop: 'name',
          width: 180,
        },
        {
          label: this.$t('intelligence.report.comprehensive.taskCols')[1],
          prop: 'type',
        },
        {
          label: this.$t('intelligence.report.comprehensive.taskCols')[2],
          prop: 'total',
        },
        {
          label: this.$t('intelligence.report.comprehensive.taskCols')[3],
          prop: 'completed',
        },
        {
          label: this.$t('intelligence.report.comprehensive.taskCols')[4],
          prop: 'completion_rate',
          getData: (data) => {
            return data.completion_rate + '%';
          },
        },
      ],
    };
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
      line-height: 1.8;
      background-color: var(--neutral0);
      &.chart {
        display: flex;
        height: 218px;
        align-items: center;
        justify-content: space-around;
      }
      &.general {
        background-color: transparent;
      }
    }
  }
  .first-title {
    margin: 8px 0;
    font-weight: 600;
  }
}
</style>
