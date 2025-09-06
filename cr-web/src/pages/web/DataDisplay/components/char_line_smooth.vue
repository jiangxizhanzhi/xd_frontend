<template>
  <div ref="charLineSmoth" style="height: 100%" />
</template>
<script>
import { debounce } from '@/utils';
export default {
  name: 'CharLineSmoth',
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
        legend: {
          top: 10,
          right: '4%',
          icon: 'rect',
          itemWidth: 15,
          itemHeight: 4,
          textStyle: {
            color: 'rgba(255,255,255,1)',
          },
          orient: 'horizontal',
          data: [
            `${this.$t('m.hasBeenIssued')}`,
            `${this.$t('m.hasBeenFinished')}`,
          ],
        },
        xAxis: {
          type: 'category',
          data: this.dataInfo.dataLabel,
          axisLabel: {
            // x轴label// 字体颜色
            interval: this.dataInfo.marNumber,
            rotate: 35, // label倾斜角度
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
          type: 'value',
          minInterval: 1,
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
            name: `${this.$t('m.hasBeenIssued')}`,
            data: this.dataInfo.dataValue1,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: {
                color: this.dataInfo.lineColor1, // 折线的颜色
                width: 2, // 折线粗细
              },
            },
            // itemStyle: {
            //   normal: {
            //     color: this.dataInfo.pointColor, // 拐点颜色
            //     borderColor: this.dataInfo.pointBorderColor, // 拐点边框颜色
            //     borderWidth: 3, // 拐点边框大小
            //   },
            // },
            // markLine: { // 添加警戒线
            //   symbol: 'none', // 去掉警戒线最后面的箭头
            //   name: '已下发任务数',
            //   silent: true,
            //   label: {
            //     position: 'end', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
            //     formatter: '已下发\n任务数',
            //     color: '#D6DEE5',
            //     fontSize: 14,
            //   },
            //   data: [{
            //     silent: true, // 鼠标悬停事件  true没有，false有
            //     lineStyle: { // 警戒线的样式  ，虚实  颜色
            //       type: 'solid',
            //       color: '#D6DEE5',
            //       width: 2,
            //     },
            //     name: '已下发任务数',
            //     yAxis: 18,
            //   }],
            // },
          },
          {
            name: `${this.$t('m.hasBeenFinished')}`,
            data: this.dataInfo.dataValue2,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: {
                color: this.dataInfo.lineColor2, // 折线的颜色
                width: 2, // 折线粗细
              },
            },
            // itemStyle: {
            //   normal: {
            //     color: this.dataInfo.pointColor, // 拐点颜色
            //     borderColor: this.dataInfo.pointBorderColor, // 拐点边框颜色
            //     borderWidth: 3, // 拐点边框大小
            //   },
            // },
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
        this.attackOption.series[0].data = val.dataValue1;
        this.attackOption.series[0].lineStyle.normal.color = val.lineColor1;
        this.attackOption.xAxis.axisLabel.interval = val.marNumber;
        // this.dataInfo.marNumber
        // this.attackOption.series[0].itemStyle.normal.color = val.pointColor
        // this.attackOption.series[0].itemStyle.borderColor = val.pointBorderColor
        this.attackOption.series[1].data = val.dataValue2;
        this.attackOption.series[1].lineStyle.normal.color = val.lineColor2;
        // this.attackOption.series[1].itemStyle.normal.color = val.pointColor
        // this.attackOption.series[1].itemStyle.borderColor = val.pointBorderColor
        this.attackOption.color = [val.lineColor1, val.lineColor2];
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
      this.attackResultChar = this.$echarts.init(this.$refs.charLineSmoth);
      this.attackResultChar.setOption(this.attackOption);
    },
  },
};
</script>

<style scoped lang="scss"></style>
