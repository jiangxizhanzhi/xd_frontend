<template>
  <div class="get-traffic-container">
    <div class="traffic-census">
      <round-census
        :normalNum="(trafficLevelCount && trafficLevelCount.low_count) || 0"
        :warnNum="(trafficLevelCount && trafficLevelCount.medium_count) || 0"
        :dangerNum="(trafficLevelCount && trafficLevelCount.high_count) || 0"
      ></round-census>
    </div>
    <div class="traffic-line">
      <line-chart :lineData="lineData"></line-chart>
    </div>
  </div>
</template>
<script>
import RoundCensus from '../../components/round-census.vue';
import LineChart from '../../components/line-chart-shadow-soild.vue';
export default {
  props: {
    trafficLevelCount: {
      type: Object,
      default: () => {},
    },
    nodeTrafficTrend: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    RoundCensus,
    LineChart,
  },
  data() {
    return {
      type: [1, 2, 3],
      lineData: {
        xData: ['00:20', '00:20'],
        yData: [25, 12],
      },
    };
  },
  watch: {
    nodeTrafficTrend: {
      handler: function (nv, ov) {
        this.lineData.xData = _.map(nv, (item) => {
          return item.time;
        });
        this.lineData.yData = _.map(nv, (item) => {
          return item.data_size;
        });
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.get-traffic-container {
  width: 100%;
  height: calc(100% - 32px);
  .traffic-census {
    width: 100%;
    height: 48%;
  }
  .traffic-line {
    width: 100%;
    height: 52%;
  }
}
</style>
