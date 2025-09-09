<template>
  <div class="bar-chart">
    <div ref="chartref" :style="{ width, height }"></div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as echarts from 'echarts';
import { ListenDomChange } from '@cyber/ui';
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
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 柱条颜色
    barColor: {
      type: String,
      default: '',
    },
    yName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      option: {
        // 网格
        grid: {
          show: false,
          top: 30,
          left: 16,
          right: 16,
          bottom: 16,
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
          //触发事件，为鼠标经过横坐标文字触发鼠标经过事件
          triggerEvent: true,
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
            show: true,
          },
          // 坐标轴刻度标签
          axisLabel: {
            interval: 0,
            fontSize: 12,
            rotate: 50,
            color: this.colorNeutral5,
            padding: [0, 0, 0, 30],
          },
        },
        yAxis: {
          name: this.yName,
          nameLocation: 'end',
          nameTextStyle: {
            padding: [30, 0, 0, -20],
            fontSize: 14,
            color: this.colorNeutral5,
            align: 'left',
          },
          type: 'value',
          minInterval: 1,
          // splitNumber: 4,
          // 坐标轴轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral2'),
            },
          },
          // grid区域分隔线
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.colorNeutral5,
          },
          //刻度偏移
          // offset: 10,
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: 30,
            itemStyle: {
              color: '',
            },
          },
        ],
      },
    };
  },
  watch: {
    // 处理数据
    dataList: {
      handler: function () {
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
  created() {
    this.updateColor();
  },
  mounted() {
    this.initChart();
    this.extension(this.chart);
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
    this.listen.createListen();
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
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.chart.setOption(this.option);
    },
    handleFormatData() {
      this.$nextTick(() => {
        this.option.xAxis.data = this.dataList.map((item) => {
          return item.time;
        });
        this.option.series[0].data = this.dataList.map((item) => {
          return item.count;
        });
        this.initChart();
      });
    },
    updateColor() {
      // 255, 255, 255, 0.15
      this.colorNeutral2 = this.$themed('neutral2');
      // 255,255,255,0.4
      this.colorNeutral5 = this.$themed('neutral5');
      // 255,255,255,0.05
      this.colorNeutral0 = this.$themed('neutral0');
      let {
        tooltip,
        xAxis: {
          axisLine: { lineStyle: xLineStyle },
          axisLabel: xAxisLabel,
        },
        yAxis: {
          nameTextStyle,
          axisLine: { lineStyle: yLineStyle },
          axisLabel: yAxisLabel,
        },
        series,
      } = this.option;
      tooltip.backgroundColor = this.$themed('bg-color-1');
      tooltip.textStyle.color = this.$themed('neutral8');
      xLineStyle.color = this.colorNeutral2;
      xAxisLabel.color = this.colorNeutral5;
      yLineStyle.color = this.colorNeutral2;
      nameTextStyle.color = this.colorNeutral5;
      yAxisLabel.color = this.colorNeutral5;
      series[0].itemStyle.color = this.$themed(this.barColor);
    },
    listenFunc() {
      this.updateColor();
    },
    extension(myChart) {
      myChart.on('mouseover', (params) => {
        if (params.componentType === 'xAxis') {
          xLabel = params.value;
          let offsetX = params.event.offsetX + 20;
          let offsetY = params.event.offsetY + 20;
          myChart.setOption({
            tooltip: {
              formatter: formateTooltip,
              alwaysShowContent: true,
              confine: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0,
            position: [offsetX, offsetY],
          });
        } else if (params.componentType === 'series') {
          myChart.setOption({
            tooltip: {
              formatter: null,
              alwaysShowContent: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
          });
        }
      });
      myChart.on('mouseout', (params) => {
        myChart.setOption({
          tooltip: {
            alwaysShowContent: false,
          },
        });
        if (params.componentType === 'xAxis') {
          xLabel = '';
        }
      });
      var xLabel = '';
      function formateTooltip(params) {
        return xLabel;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
