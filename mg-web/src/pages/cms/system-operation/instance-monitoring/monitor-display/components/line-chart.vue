<template>
  <div class="wrapper">
    <div ref="myChart" class="myChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);
const COLOR = ['rgba(11, 218, 255, 1)'];
export default {
  name: 'line-chart',
  props: {
    lineData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      myChart: null,
      debounceId: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.myChart = echarts.init(this.$refs.myChart);
    this.initChart();
    this.debounceId = _.debounce(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 300);
    window.addEventListener('resize', this.debounceId);
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
  watch: {
    lineData: {
      handler(newVal, oldVal) {
        if (this.myChart && newVal) {
          this.initChart();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initChart() {
      let _this = this;
      const tooltip = {
        trigger: 'axis',
        backgroundColor: this.$themed('cy23-5'),
        borderWidth: 0,
        textStyle: {
          color: this.$themed('cy2'),
        },
        formatter: '{b}: {c}',
        axisPointer: {
          snap: true,
          lineStyle: {
            type: 'solid',
            width: 2,
            color: '#727E9A',
            opacity: 0.5,
          },
        },
      };
      const grid = {
        top: '11%',
        bottom: '6%',
        left: '6%',
        right: '8%',
        containLabel: true,
      };
      const xAxis = {
        type: 'category',
        data: _this.lineData.xData,
        show: true,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: '#C0CCE7',
          fontSize: '12px',
        },
        axisTick: { show: false },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 10],
          symbolOffset: [0, 10],
          lineStyle: { color: '#727E9A' },
        },
      };
      const yAxis = {
        type: 'value',
        min: 0,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: '#C0CCE7',
          fontSize: '12px',
        },
        axisTick: { show: false },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 10],
          symbolOffset: [0, 10],
          lineStyle: { color: '#727E9A' },
        },
      };
      const basic = {
        type: 'line',
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(11, 218, 255, 1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(11, 218, 255, 0)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        lineStyle: {
          width: 3,
        },
      };
      let option = {
        color: COLOR,
        tooltip: { ...tooltip },
        grid: { ...grid },
        xAxis: { ...xAxis },
        yAxis: { ...yAxis },
        series: [
          {
            ...basic,
            data: _this.lineData.yData,
          },
        ],
      };
      this.myChart.setOption(option);
      this.myChart.resize();
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.wrapper,
.myChart {
  width: 100%;
  height: 100%;
}
</style>
