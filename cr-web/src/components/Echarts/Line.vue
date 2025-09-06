<template>
  <div :id="id" style="width: 100%; height: 100%" />
</template>

<script>
import { debounce } from '@/utils';

export default {
  name: 'StaffScoreLine',
  props: {
    initData: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      options: {
        grid: {
          top: '5%',
          bottom: '10%',
          containLabel: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#99a0bd',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#99a0bd',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#343b55',
            },
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            symbol: 'circle',
            // 折点形状 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            itemStyle: {
              normal: {
                color: '#8cd5c2', // 改变折线点的颜色
                lineStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#3DC2E0', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#4466F4', // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
          },
        ],
      },
    };
  },
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
      this.options.xAxis.data = this.initData.xAxisData;
      this.options.series[0].data = this.initData.yAxisData;
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(this.options);
    },
  },
};
</script>

<style lang="scss"></style>
