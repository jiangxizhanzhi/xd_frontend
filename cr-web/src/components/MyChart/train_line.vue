<template>
  <div ref="main" style="width: 100%; height: 100%" />
</template>
<script>
import { debounce } from '@/utils/index.js';
export default {
  props: {
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0],
    },
    instanceData: {
      type: Object,
      default: () => {},
    },
    light: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      scoreChart: null,
      linearColors: [],
      option: {},
    };
  },
  computed: {},
  watch: {
    theme: {
      handler() {
        this.renderEcharts();
      },
    },
    light(nvalue, oldValue) {
      this.renderEcharts();
    },
    xData: {
      handler(nvalue, oldValue) {
        this.renderEcharts();
      },
      deep: true,
    },
    yData: {
      handler(nvalue, oldValue) {
        this.renderEcharts();
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.renderEcharts();
    });
    this.__resizeHandler = debounce(() => {
      if (this.scoreChart) {
        this.scoreChart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (this.scoreChart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.attackChart.dispose();
    this.scoreChart = null;
  },
  methods: {
    renderEcharts() {
      this.scoreChart = this.$echarts.init(this.$refs.main);
      this.option = this.getOptions();
      this.scoreChart.setOption(this.option);
    },
    HEXToRGB(color, opacity) {
      color = color.trim();
      let r = parseInt(color.substring(1, 3), 16);
      let g = parseInt(color.substring(3, 5), 16);
      let b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    getOptions() {
      return {
        textStyle: {
          fontSize: 14,
          color: this.$themed('neutral5'),
        },
        title: {
          left: 'left',
          text: this.$t('m.dailyTrainingVolumeChart'),
          textStyle: {
            fontSize: 14,
            color: this.$themed('neutral8'),
            fontWeight: 'normal',
            fontFamily: 'Microsoft YaHei',
            lineHeight: 20,
            height: 20,
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          formatter: function (params) {
            var result = '';
            params.forEach(function (item) {
              result +=
                item.axisValue +
                `<span style="display:inline-block;margin:0 6px 1px 10px;border-radius:2px;width:6px;height:6px;background-color:#448aff;"></span>` +
                item.data;
            });
            return result;
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
          padding: [6, 10],
          textStyle: {
            color: this.$themed('neutral5'),
            fontSize: 12,
            lineHeight: 12,
          },
        },
        legend: {
          top: 20,
          right: 20,
          data: [
            {
              name: this.$t('m.trainTime'),
              icon: 'roundRect',
              textStyle: {
                color: this.$themed('neutral5'),
              },
            },
          ],
        },
        grid: {
          show: false,
          top: 50,
          bottom: 35,
          right: 60,
          left: 35,
        },
        xAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: this.$themed('neutral5'),
              fontFamily: 'Microsoft YaHei',
            },
          },
          // boundaryGap: false, //X轴数据显示位置
          axisLine: {
            lineStyle: {
              color: this.$themed('neutral5'),
              opacity: 0.5,
            },
          },
          // 设置x轴的刻度表隐藏
          axisTick: {
            show: false,
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            interval: 0,
            textStyle: {
              color: this.$themed('neutral5'),
              fontFamily: 'Microsoft YaHei',
            },
          },
          splitLine: {
            show: true, //网格线
            lineStyle: {
              color: this.$themed('neutral2'),
              opacity: 0.5,
            },
          },
          axisLine: {
            show: false, //坐标轴是否显示
            lineStyle: {
              color: this.$themed('neutral2'),
            },
          },
          axisTick: {
            show: false,
            interval: 0,
          },
        },
        series: [
          {
            data: this.yData,
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 8, //设置折线圆点的大小
            itemStyle: {
              normal: {
                color: this.$themed('primary-color'), // 改变折线点的颜色
                lineStyle: {
                  color: this.$themed('primary-color'),
                  width: 1.5,
                },
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
                        color: 'transparent',
                        // color: this.HEXToRGB(
                        //   this.$themed('primary-color'),
                        //   0.3,
                        // ), // 0% 区域处的颜色
                      },
                      {
                        offset: 1,
                        color: 'transparent',
                        // color: this.HEXToRGB(
                        //   this.$themed('primary-color'),
                        //   0.0,
                        // ),
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
          },
        ],
      };
    },
  },
};
</script>
