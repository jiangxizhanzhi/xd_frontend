<template>
  <div class="line-chart">
    <div ref="chartref" :style="{ width, height }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    option: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
    };
  },
  watch: {
    option: {
      handler(val, oldval) {
        if (this.chart) {
          this.chart.dispose();
          this.chart = null;
        }
        this.initChart();
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.initChart();
    this.debounceId = _.debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.debounceId);
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.chart.setOption(this.option);
      this.chart.resize();
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
};
</script>
<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
