<template>
  <div class="traffic">
    <div class="traffic-top">
      <round-census
        :type="type"
        :normalNum="normalNum"
        :warnNum="warnNum"
        :dangerNum="dangerNum"
      ></round-census>
    </div>
    <div class="traffic-bottom">
      <line-chart :lineData="lineData"></line-chart>
    </div>
  </div>
</template>

<script>
import RoundCensus from '../../components/round-census.vue';
import LineChart from '../../components/line-chart-shadow-soild.vue';
export default {
  components: {
    RoundCensus,
    LineChart,
  },
  props: {
    riskData: {
      type: Object,
      default() {
        return {};
      },
    },
    lineData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      type: [1, 2, 3],
    };
  },
  computed: {
    normalNum() {
      return this.riskData && this.riskData.low_count;
    },
    warnNum() {
      return this.riskData && this.riskData.medium_count;
    },
    dangerNum() {
      return this.riskData && this.riskData.high_count;
    },
  },
};
</script>

<style lang="scss" scoped>
.traffic {
  height: calc(100% - 32px);
  .traffic-top {
    height: 45%;
  }
  .traffic-bottom {
    height: 55%;
  }
}
</style>
