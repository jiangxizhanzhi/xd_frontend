<template>
  <div ref="charLinePonit" style="height: 100%" />
</template>

<script>
import { debounce } from '@/utils';
export default {
  name: 'CharLinePoint',
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    // var tooltipBg = this.dataInfo.tooltipColors
    return {
      attackResultChar: null,
      attackOption: {
        grid: {
          y: 35,
        },
        tooltip: {
          trigger: 'axis',
        },
        // tooltip: {
        //   show: true,
        //   backgroundColor: 'rgba(225,225,225,0)',
        //   formatter: function(params) {
        //     return '<div style="padding: 5px 10px;background: ' + tooltipBg + '">' +
        //         params.name + '&nbsp:&nbsp' + params.data +
        //         '</div>'
        //   },
        // },
        xAxis: {
          type: 'category',
          data: this.dataInfo.dataLabel,
          axisLabel: {
            // x轴label// 字体颜色
            interval: this.dataInfo.marNumber,
            rotate: 35,
            textStyle: {
              color: this.dataInfo.axisLabelColor,
            },
            axisTick: {
              // 刻度线
              lineStyle: {
                color: this.dataInfo.axisTickColor,
              },
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(139, 148, 177, 0)',
            },
          },
        },
        yAxis: {
          minInterval: 1,
          type: 'value',
          splitLine: {
            lineStyle: {
              color: this.dataInfo.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.dataInfo.axisLabelColor,
            },
          },
          axisTick: {
            lineStyle: {
              color: this.dataInfo.axisTickColor,
            },
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            data: this.dataInfo.dataValue,
            type: 'line',
            symbol: 'circle',
            symbolSize: 8, // 拐点圆的大小
            lineStyle: {
              normal: {
                color: this.dataInfo.lineColor, // 折线的颜色
                width: 2, // 折线粗细
              },
            },
            itemStyle: {
              normal: {
                color: this.dataInfo.pointColor, // 拐点颜色
                borderColor: this.dataInfo.pointBorderColor, // 拐点边框颜色
                borderWidth: 3, // 拐点边框大小
                // label: { show: true },
              },
            },
            // showAllsymbol: true,
          },
        ],
      },
    };
  },
  watch: {
    dataInfo: {
      handler(val, old) {
        this.attackOption.xAxis.data = val.dataLabel;
        this.attackOption.xAxis.axisLabel.textStyle.color = val.axisLabelColor;
        this.attackOption.xAxis.axisLabel.axisTick.lineStyle.color =
          val.axisTickColor;
        this.attackOption.yAxis.splitLine.lineStyle.color = val.axisLineColor;
        this.attackOption.yAxis.axisLabel.textStyle.color = val.axisLabelColor;
        this.attackOption.yAxis.axisTick.lineStyle.color = val.axisTickColor;
        this.attackOption.xAxis.axisLabel.interval = val.marNumber;
        this.attackOption.series[0].data = val.dataValue;
        this.attackOption.series[0].lineStyle.normal.color = val.lineColor;
        this.attackOption.series[0].itemStyle.normal.color = val.pointColor;
        this.attackOption.series[0].itemStyle.borderColor =
          val.pointBorderColor;
        this.initEcharts();
      },
      // immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initEcharts();
    this.__resizeHandler = debounce(() => {
      if (this.attackResultChar) {
        this.attackResultChar.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (this.attackResultChar) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.attackResultChar.dispose();
    this.attackResultChar = null;
  },
  methods: {
    initEcharts() {
      this.attackResultChar = this.$echarts.init(this.$refs.charLinePonit);
      this.attackResultChar.setOption(this.attackOption);
    },
  },
};
</script>

<style scoped lang="scss"></style>
