<template>
  <div style="width: 100%; height: 100%">
    <div class="line" ref="line" v-if="initData.xData.length"></div>
    <!-- 无数据 -->
    <div v-if="!initData.xData.length && showNoData" class="no-data">
      <div class="info">
        <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
        <div>{{ $t('m.noData') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
export default {
  props: {
    //图表数据
    initData: {
      type: Object,
      default: () => {},
    },
    //图表名称
    name: {
      type: Array,
      default: () => [],
    },
    //图标颜色
    color: {
      type: Array,
      default: () => [],
    },
    //是否展示X轴
    showXAxis: {
      type: Boolean,
      default: () => true,
    },
    //是否展示X轴刻度
    showXAxisLabel: {
      type: Boolean,
      default: () => true,
    },
    //是否展示Y轴
    showYAxis: {
      type: Boolean,
      default: () => false,
    },
    //是否展示Y轴刻度
    showYAxisLabel: {
      type: Boolean,
      default: () => true,
    },
    //配置y轴数据格式
    yAxisLabelFormatter: {
      type: null,
      default: null,
    },
    //是否展示分割线
    showSplitLine: {
      type: Boolean,
      default: () => true,
    },
    //是否显示区域填充
    showAreaStyle: {
      type: Boolean,
      default: () => true,
    },
    //是否显示提示框
    showToolTip: {
      type: Boolean,
      default: () => true,
    },
    //配置tooptip的数据显示格式
    toolTipFormatter: {
      type: null,
      default: null,
    },
    //无数据时是否显示无数据样式
    showNoData: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      chart: null,
      options: {
        tooltip: {
          triggerOn: 'mousemove',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: this.showToolTip,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          trigger: 'axis',
        },
        // title: {
        //   left: 'center',
        //   text: this.$t('systemOperation.systemAlarm.serviceAlarm'),
        //   top: 5,
        //   textStyle: {
        //     color: this.$themed('blue-color'),
        //     fontWeight: 'normal',
        //     fontSize: 14,
        //   },
        // },
        xAxis: {
          // show: this.showXAxis,
          boundaryGap: false,
          axisLine: {
            show: this.showXAxis,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: this.showXAxisLabel,
            fontSize: 14,
            inside: false,
            showMinLabel: true,
            showMaxLabel: true,
            verticalAlign: 'top',
            color: this.$themed('neutral5'),
          },
          data: [],
        },
        yAxis: {
          // name: this.$t('systemOperation.systemAlarm.times'),
          // nameTextStyle: {
          //   padding: [30, 0, 0, -30],
          //   color: this.$themed('neutral5'),
          // },
          // splitNumber: 5, // 手动指定刻度数量
          axisLine: {
            show: this.showYAxis,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: this.showYAxisLabel,
            fontSize: 14,
            color: this.$themed('neutral5'),
            formatter: this.yAxisLabelFormatter
              ? this.yAxisLabelFormatter
              : '{value}',
          },
          splitLine: {
            show: this.showSplitLine,
            lineStyle: {
              color: this.$themed('neutral2'),
              type: 'soild',
            },
          },
          minInterval: 1,
          // inverse: false,
        },
        color: this.color,
        series: [
          {
            name: this.name.length ? this.name[0] : '',
            type: 'line',
            symbol: 'none',
            data: [0, 20, 10, 20, 10, 20],
            smooth: true,
            areaStyle: {
              color: this.showAreaStyle
                ? {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: this.HEXToRGB(this.color[0], 0.3),
                      },
                      {
                        offset: 1,
                        color: this.HEXToRGB(this.color[0], 0.0),
                      },
                    ],
                    global: false, // 缺省为 false
                  }
                : 'transparent',
            },
          },
        ],
        // 网格
        grid: {
          show: false,
          top: 15,
          left: 5,
          right: 20,
          bottom: 0,
          containLabel: true,
        },
      },
    };
  },
  watch: {
    initData: {
      handler(val, oldval) {
        if (val.xData.length) {
          this.$nextTick(() => {
            this.updateChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.listen.createListen();
  },
  mounted() {
    this.$nextTick(() => {
      this.initLine();
    });
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    HEXToRGB(color, opacity) {
      color = color;
      let r = parseInt(color.substring(1, 3), 16);
      let g = parseInt(color.substring(3, 5), 16);
      let b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    listenFunc() {
      const nameTextStyle = {
        padding: [30, 0, 0, -30],
        color: this.$themed('neutral5'),
      };
      const xAxisLabel = {
        fontSize: 14,
        inside: false,
        showMinLabel: true,
        showMaxLabel: true,
        verticalAlign: 'top',
        color: this.$themed('neutral5'),
      };
      const yAxisLabel = {
        fontSize: 14,
        color: this.$themed('neutral5'),
      };
      const splitData = {
        lineStyle: {
          color: this.$themed('neutral2'),
          type: 'soild',
        },
      };
      const tooltip = {
        triggerOn: 'mousemove',
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        trigger: 'axis',
      };
      this.options.yAxis.nameTextStyle = nameTextStyle;
      this.options.xAxis.axisLabel = xAxisLabel;
      this.options.yAxis.axisLabel = yAxisLabel;
      this.options.tooltip = tooltip;
      this.options.yAxis.splitLine = splitData;
      this.options.color = this.color;
      this.chart.setOption(this.options);
    },
    initLine() {
      if (this.$refs.line) {
        if (!this.chart) {
          this.chart = Echarts.init(this.$refs.line);
        }
        this.chart.setOption(this.options);
      }
    },
    updateChart() {
      if (this.toolTipFormatter) {
        this.options.tooltip['formatter'] = this.toolTipFormatter;
      }
      this.options.xAxis.data = this.initData.xData;
      this.options.series[0].data = this.initData.yData[0];
      if (this.initData.yData.length > 1) {
        this.options.series[1] = {
          name: this.name.length > 1 ? this.name[1] : '',
          type: 'line',
          symbol: 'none',
          data: this.initData.yData[1],
          smooth: true,
          areaStyle: {
            color: this.showAreaStyle
              ? {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: this.HEXToRGB(this.color[1], 0.3),
                    },
                    {
                      offset: 1,
                      color: this.HEXToRGB(this.color[1], 0.0),
                    },
                  ],
                  global: false, // 缺省为 false
                }
              : 'transparent',
          },
        };
      }
      if (this.$refs.line) {
        if (!this.chart) {
          this.chart = Echarts.init(this.$refs.line);
        }
        this.chart.setOption(this.options);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
}
.no-data {
  height: 100%;
  width: 100%;
  text-align: center;
  position: relative;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }
}
</style>
