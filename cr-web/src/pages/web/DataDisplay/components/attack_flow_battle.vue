<template>
  <div ref="attackFlowHistogram" style="height: 100%" />
</template>

<script>
import { debounce } from '@/utils';
export default {
  name: 'AttackFlowHistogram',
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      attackResultChar: null,
      attackOption: {
        grid: {
          y: 35,
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter: '{b}: {c}',
        },
        xAxis: {
          type: 'category',
          data: this.dataInfo.dataLabel,
          axisLabel: {
            // x轴label// 字体颜色
            interval: 0,
            rotate: 35,
            fontWeight: 100,
            fontSize: 9,
            textStyle: {
              color: this.dataInfo.axisLabelColor,
            },
          },
          splitLine: { show: false }, // 是否显示网格线
          axisTick: {
            // 刻度线
            lineStyle: {
              color: this.dataInfo.axisTickColor,
            },
          },
          axisLine: {
            // 坐标轴
            show: false,
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
            data: this.dataInfo.dataValue,
            type: 'bar',
            barWidth: 5, // 柱图宽度

            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.dataInfo.linearColors[0],
                  },
                  {
                    offset: 1,
                    color: this.dataInfo.linearColors[1],
                  },
                ]),
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    dataInfo: {
      handler: function (val, oldval) {
        this.$nextTick(() => {
          this.attackOption.xAxis.data = val.dataLabel;
          this.attackOption.series[0].data = val.dataValue;
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
      this.attackResultChar = this.$echarts.init(
        this.$refs.attackFlowHistogram,
      );
      this.attackResultChar.setOption(this.attackOption);
    },
  },
};
</script>

<style scoped lang="scss"></style>
