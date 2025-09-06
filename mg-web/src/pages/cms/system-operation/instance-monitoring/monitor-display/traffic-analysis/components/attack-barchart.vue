<template>
  <div ref="myChart" class="my-chart"></div>
</template>

<script>
import Utils from '@/utils/utils';
import _ from 'lodash';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

export default {
  name: 'bar-chart',
  props: {
    barData: {
      type: Object,
      default: () => {},
    },
    isRed: {
      type: Boolean,
      default: false,
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
    barData: {
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
        trigger: 'item',
        backgroundColor: '#2F3A4D',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
          opacity: 0.8,
        },
        formatter: '{b}: {c}',
      };
      const grid = {
        top: 16,
        bottom: 4,
        left: 35,
        right: 40,
        containLabel: true,
      };
      const yAxis = {
        type: 'value',
        show: true,
        max: 100,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: '#C0CCE7',
          fontSize: '12px',
          formatter(value) {
            return `${value}%`;
          },
        },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 10],
          symbolOffset: [0, 10],
          lineStyle: { color: '#727E9A' },
        },
      };
      const xAxis = {
        type: 'category',
        data: _this.barData.xData,
        axisLabel: {
          show: true,
          color: '#C0CCE7',
          fontSize: '12px',
          rotate: 30,
          formatter: function (value) {
            const a = Utils.truncStringByWidth(
              value,
              '12px',
              'Microsoft YaHei',
              '30',
            );
            return a + '...';
          },
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
        type: 'bar',
        barWidth: '15',
        itemStyle: {
          color: function (params) {
            if (_this.isRed) {
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 89, 100, 0.9)' },
                { offset: 1, color: 'rgba(255, 48, 69, 0.9)' },
              ]);
            }
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(11, 218, 255, 0.9)' },
              { offset: 1, color: 'rgba(0, 162, 255, 0.9)' },
            ]);
          },
        },
        label: {
          show: false,
        },
      };
      let option = {
        tooltip: { ...tooltip },
        grid: { ...grid },
        xAxis: { ...xAxis },
        yAxis: { ...yAxis },
        series: [
          {
            ...basic,
            data: _this.barData.yData,
          },
        ],
      };
      this.myChart.setOption(option);
      this.myChart.resize();
    },
    arrCount(arr) {
      let count = 0;
      arr.forEach((item) => {
        count = count + item.value;
      });
      return count;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-chart {
  width: 100%;
  height: 100%;
}
</style>
