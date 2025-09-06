<template>
  <div class="wrapper">
    <div ref="myChart" :class="showTab ? 'myChart' : 'myChartAll'"></div>
  </div>
</template>

<script>
import Utils from '@/utils/utils';
import Tabs from '../components/tabs.vue';
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
const COLOR = [
  'rgba(11, 218, 255, 0.2)',
  'rgba(11, 218, 255, 0.4)',
  'rgba(11, 218, 255, 0.58)',
  'rgba(11, 218, 255, 0.8)',
  'rgba(11, 218, 255, 1)',
];
const COLOR_RED = [
  'rgba(255, 48, 69, 0.2)',
  'rgba(255, 48, 69, 0.4)',
  'rgba(255, 48, 69, 0.58)',
  'rgba(255, 48, 69, 0.8)',
  'rgba(255, 48, 69, 1)',
];

export default {
  name: 'bar-chart',
  props: {
    barData: {
      type: Object,
      default: () => {},
    },
    /**
     * 是否在超过80的时候显示为红色
     */
    isRed: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示tab
     */
    showTab: {
      type: Boolean,
      default: false,
    },
    /**
     * tab 的数据
     */
    tabs: {
      type: Array,
      default: () => [],
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
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.myChart);
      this.initChart();
      this.debounceId = _.debounce(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      }, 300);
      window.addEventListener('resize', this.debounceId);
    });
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
        confine: true,
        formatter: (params) => {
          let result = '';
          let numSpace = 65;
          let num = Math.floor(params.name.length / numSpace);
          let last = params.name.slice(num * numSpace);
          if (num > 0) {
            for (let i = 0; i < num; i++) {
              result +=
                params.name.slice(numSpace * i, numSpace * (i + 1)) + '<br\>';
            }
            result += last + ': ' + params.value;
          } else {
            result = params.name + ': ' + params.value;
          }
          // return `<span style="font-size:12px; width:450px;height:400pxword-break:break-all;word-wrap: break-word;">${result}</span>`;
          return result;
        },
        position: 'top',
      };
      const grid = {
        top: '15%',
        bottom: '5%',
        left: '3%',
        right: '8%',
        containLabel: true,
      };
      const xAxis = {
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
      const yAxis = {
        type: 'category',
        data: _this.barData.xData,
        axisLabel: {
          show: true,
          color: '#C0CCE7',
          fontSize: '12px',
          formatter: function (value) {
            const a = Utils.truncStringByWidth(
              value,
              '12px',
              'Microsoft YaHei',
              '100',
            );
            let result = '';
            if (a == value) {
              result = value;
            } else {
              result = a + '...';
            }
            return result;
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
        barWidth: '8',
        itemStyle: {
          color: function (params) {
            if (_this.isRed && params.value >= 80) {
              return COLOR_RED[params.dataIndex];
            }
            return COLOR[params.dataIndex];
          },
        },
        label: {
          show: true,
          position: 'right',
          formatter(value) {
            return `${value.value}%`;
          },
          color: '#fff',
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
  components: { Tabs },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: calc(100% - 31px);
  box-sizing: content-box;

  .myChart {
    width: 100%;
    height: 100%;
  }
  .myChartAll {
    height: 100%;
  }
}
</style>
