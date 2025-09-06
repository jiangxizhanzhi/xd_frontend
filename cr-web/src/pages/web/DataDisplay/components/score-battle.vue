<template>
  <div ref="scoreTrendsCharts" style="width: 100%; height: 100%" />
</template>
<script>
import { debounce } from '@/utils';
export default {
  name: 'ScoreTrendsCharts',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      scoreTrends: null,
      options: {
        grid: {
          show: false,
          left: '20',
          right: '20',
          bottom: '1%',
          containLabel: true,
        },
        legend: {
          // top: 10,
          right: '4%',
          icon: 'rect',
          itemWidth: 15,
          itemHeight: 4,
          textStyle: {
            color: 'rgba(255,255,255,1)',
          },
          orient: 'horizontal',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [], // TODO
          axisLabel: {
            // x轴label// 字体颜色
            interval: this.data.marNumber,
            rotate: 35,
            textStyle: {
              color: 'rgba(255,255,255,1)',
            },
          },
          splitLine: { show: false }, // 是否显示网格线
          axisTick: {
            // 刻度线
            show: false,
            lineStyle: {
              color: 'rgba(9,203,254,0.2)',
            },
          },
          axisLine: {
            // 坐标轴
            show: true,
          },
        },
        yAxis: {
          minInterval: 1,
          type: 'value',
          splitLine: { show: false }, // 是否显示网格线
          axisLabel: {
            textStyle: {
              color: 'rgba(255,255,255,1)',
            },
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: 'rgba(9,203,254,0.2)',
            },
          },
          axisLine: {
            show: true,
          },
        },
        color: ['rgba(67,154,255,0.56)', 'rgba(236,98,252,.56)'],
        series: [
          {
            name: this.$t('m.red'),
            type: 'line',
            smooth: true,
            symbolSize: 1,
            symbol: 'circle',
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: 'rgba(206, 48, 48,0.1)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(206, 48, 48, 0.8)', // 100% 处的颜色
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                // opacity: '0.56',
                lineStyle: {
                  width: 2,
                  color: 'rgba(223, 40, 43, 1)',
                },
              },
            },
            itemStyle: {
              normal: {
                color: 'rgba(223, 40, 43, 1)',
              },
            },
            data: [], // TODO
          },
          {
            type: 'line',
            smooth: true,
            name: this.$t('m.blue'),
            symbolSize: 1,
            symbol: 'circle',
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: 'rgba(57, 239, 255, 0)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(58, 165, 255, 0.98)', // 100% 处的颜色
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                // opacity: '0.56',
                lineStyle: {
                  width: 2,
                  color: 'rgba(67, 154, 255, 1)',
                },
              },
            },
            itemStyle: {
              normal: {
                color: 'rgba(96, 170, 255, 1)',
              },
            },
            data: [], // TODO
          },
        ],
      },
    };
  },
  watch: {
    data: {
      handler: function (val, oldval) {
        this.$nextTick(() => {
          this.options.xAxis.data = this.data.days_list;
          this.options.series[0].data = this.data.mission_before_total;
          this.options.series[1].data = this.data.mission_week_total;
          this.options.xAxis.axisLabel.interval = this.data.marNumber;
          this.initEcharts();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initEcharts();
    this.__resizeHandler = debounce(() => {
      if (this.scoreTrends) {
        this.scoreTrends.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    // 页面销毁后清除事件
    if (!this.scoreTrends) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.scoreTrends.dispose();
    this.scoreTrends = null;
  },
  methods: {
    initEcharts() {
      this.scoreTrends = this.$echarts.init(this.$refs.scoreTrendsCharts);
      this.scoreTrends.setOption(this.options);
    },
  },
};
</script>
