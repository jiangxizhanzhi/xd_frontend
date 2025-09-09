<template>
  <div id="studentScoreHistogram" style="width: 100%; height: 180px" />
</template>

<script>
import Utils from '@/utils/utils.js';
import { debounce } from '@/utils';
import { getLanguage, getTheme } from '@cyber/helper';
export default {
  name: 'StudentScoreHistogram',
  props: {
    initData: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      language: getLanguage(),
    };
  },
  computed: {},
  watch: {
    initData: {
      handler(val, oldval) {
        if (val) {
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    theme: {
      handler() {
        this.initChart();
      },
    },
  },
  mounted() {
    // 监控改变窗口大小改变事件 修改echart宽度
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    // 页面销毁后清除事件
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      const option = {
        grid: {
          top: '4%',
          bottom: '30px',
          left: '10px',
          right: '10px',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        legend: {
          top: '14%',
          // left: '-48px',
          data: this.initData.xAxisData,
        },
        xAxis: {
          // data: this.initData.xAxisData,
          data: this.initData.xAxisData,
          type: 'category',
          axisLine: {
            // 坐标轴
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: this.$themed('neutral7'),
            interval: 0,
            // rotate: 35,
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
        },
        yAxis: {
          type: 'value',
          axisLine: {
            // 坐标轴
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
          // position: 'left',
          // offset:'58',
          splitLine: {
            show: false,
          },
          minInterval: 1,
          axisLabel: {
            interval: 0,
            color: this.$themed('neutral7'),
          },
        },
        series: [
          {
            type: 'line',
            barWidth: 10,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: this.$themed('primary-color') },
                  { offset: 1, color: this.$themed('blue-color') },
                ]),
              },
            },
            data: this.initData.yAxisData,
          },
        ],
      };
      this.chart = this.$echarts.init(
        document.getElementById('studentScoreHistogram'),
      );
      this.chart.setOption(option);
    },
  },
};
</script>

<style lang="scss"></style>
