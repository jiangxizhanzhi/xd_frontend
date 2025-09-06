<template>
  <div class="line-chart">
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
            fontSize: 12,
            color: this.$themed('neutral8'),
          },
          extraCssText:
            'max-width: 420px;white-space: normal;word-break: break-all;line-height: 24px;',
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
              color: this.colorNeutral2,
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
            color: this.colorNeutral5,
            formatter: function (params) {
              return params.length > 10 ? params.substr(0, 10) + '...' : params;
            },
          },
        },
        yAxis: {
          name: this.yName,
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 14,
            color: this.colorNeutral5,
            align: 'left',
          },
          type: 'value',
          // max: 600,
          minInterval: 1,
          splitNumber: 4,
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // grid区域分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: this.colorNeutral0,
            },
          },
          axisLabel: {
            fontSize: 14,
            color: this.colorNeutral5,
          },
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: 24,
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
      this.extension(this.chart);
    },
    handleFormatData() {
      this.$nextTick(() => {
        this.option.xAxis.data = this.dataList.map((item) => {
          return item.name;
        });
        this.option.series[0].data = this.dataList.map((item) => {
          return item.value;
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
          splitLine: { lineStyle: yLineStyle },
          axisLabel: yAxisLabel,
        },
        series,
      } = this.option;
      tooltip.backgroundColor = this.$themed('bg-color-1');
      tooltip.textStyle.color = this.$themed('neutral8');
      xLineStyle.color = this.colorNeutral2;
      xAxisLabel.color = this.colorNeutral5;
      nameTextStyle.color = this.colorNeutral5;
      yLineStyle.color = this.colorNeutral0;
      yAxisLabel.color = this.colorNeutral5;
      series[0].itemStyle.color = this.$themed(this.barColor);
    },
    listenFunc() {
      this.updateColor();
    },
    extension(chart) {
      // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为yAxis
      // 判断是否创建过div框,如果创建过就不再创建了
      // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
      var elementDiv = document.getElementById('extension');
      if (!elementDiv) {
        var div = document.createElement('div');
        div.setAttribute('id', 'extension');
        div.style.display = 'block';
        document.querySelector('html').appendChild(div);
      }
      chart.on('mouseover', function (params) {
        if (params.componentType == 'xAxis') {
          var elementDiv = document.querySelector('#extension');
          //设置悬浮文本的位置以及样式
          var elementStyle =
            'position: absolute;z-index: 99999;color: var(--neutral8);font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: var(--bg-color-1);box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px';
          elementDiv.style.cssText = elementStyle;
          elementDiv.innerHTML = params.value;
          document.querySelector('html').onmousemove = function (event) {
            var elementDiv = document.querySelector('#extension');
            var xx = event.pageX - 10;
            var yy = event.pageY - 35;
            elementDiv.style.top = yy + 'px';
            elementDiv.style.left = xx + 'px';
          };
        }
      });
      chart.on('mouseout', function (params) {
        //注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
        if (params.componentType == 'xAxis') {
          var elementDiv = document.querySelector('#extension');

          elementDiv.style.cssText = 'display:none';
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
