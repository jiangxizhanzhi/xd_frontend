<template>
  <div class="training-overview">
    <div class="chart-box" ref="barChart"></div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as echarts from 'echarts';
import { ListenDomChange } from '@cyber/ui';
export default {
  props: {
    trainingData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          show: true,
          x: 'right',
          padding: [5, 16, 0, 0],
          itemHeight: 4,
          itemWidth: 12,
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: 12,
          },
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '7%',
          containLabel: true,
        },
        // 提示框
        tooltip: {
          trigger: 'item',
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: 'rgba(50, 50, 50, 0)',
          textStyle: {
            // fontSize: 12,
            color: this.$themed('neutral8'),
          },
          extraCssText:
            'max-width: 420px;white-space: normal;word-break: break-all;',
        },
        xAxis: {
          type: 'category',
          data: [],
          // 坐标轴轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral2'),
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴刻度标签
          axisLabel: {
            interval: 0,
            fontSize: 14,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: this.$t('personal.times'),
          nameTextStyle: {
            padding: [30, 0, 0, -20],
            fontSize: 14,
            color: this.$themed('neutral5'),
            align: 'left',
          },
          type: 'value',
          minInterval: 1,
          // grid区域分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral2'),
            },
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('neutral5'),
          },
        },
        series: [
          {
            name: this.$t('personal.completed'),
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 20,
            color: this.$themed('green-color'),
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: this.$t('personal.unfinished'),
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 20,
            color: this.$themed('orange-color'),
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.updateColor();
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
    this.listen.createListen();
  },
  watch: {
    trainingData: {
      handler() {
        this.handleFormatData();
      },
      immediate: true,
      deep: true,
    },
    listen: {
      handler() {
        this.handleFormatData();
      },
      deep: true,
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler);
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    this.listen.destroyListen();
  },
  methods: {
    handleFormatData() {
      this.$nextTick(() => {
        let { xAxis, series } = this.option;
        xAxis.data = this.trainingData.completed.map((item) => item.app_name);
        series[0].data = this.trainingData.completed.map((item) => item.count);
        series[1].data = this.trainingData.incomplete.map((item) => item.count);
        this.initChart();
      });
    },
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.barChart);
      }
      this.chart.setOption(this.option);
    },
    listenFunc() {
      this.updateColor();
    },
    updateColor() {
      // 255, 255, 255, 0.15
      this.colorNeutral2 = this.$themed('neutral2');
      // 255,255,255,0.4
      this.colorNeutral5 = this.$themed('neutral5');
      let {
        tooltip,
        legend,
        xAxis: {
          axisLine: { lineStyle: xLineStyle },
          axisLabel: xAxisLabel,
        },
        yAxis: {
          nameTextStyle,
          axisLabel: yAxisLabel,
          splitLine: { lineStyle: splitLineStyle },
        },
        series,
      } = this.option;
      tooltip.backgroundColor = this.$themed('bg-color-1');
      tooltip.textStyle.color = this.$themed('neutral8');
      legend.textStyle.color = this.$themed('neutral7');
      xLineStyle.color = this.colorNeutral2;
      xAxisLabel.color = this.colorNeutral5;
      nameTextStyle.color = this.colorNeutral5;
      yAxisLabel.color = this.colorNeutral5;
      splitLineStyle.color = this.colorNeutral2;
      series[0].color = this.$themed('green-color');
      series[1].color = this.$themed('orange-color');
    },
  },
};
</script>
<style lang="scss" scoped>
.training-overview {
  width: 100%;
  height: 100%;
  .chart-box {
    width: 100%;
    height: 100%;
  }
}
</style>
