<template>
  <div ref="battleCharHistogram" class="char-histogram" style="height: 100%" />
</template>

<script>
import _ from 'lodash';
import { debounce } from '@/utils/index.js';

export default {
  name: 'BattleCharHistogram',
  props: {
    dataInfo: {
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
      attackChart: null,
      attackOption: {},
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
    dataInfo: {
      handler(val, oldval) {
        if (!_.isEmpty(val)) {
          if (val.dataLabel || val.dataValue) {
            this.$nextTick(() => {
              this.renderEcharts();
              this.attackOption.grid.bottom = val.bottomValue || 55;
              this.attackOption.xAxis.data = val.dataLabel;
              this.attackOption.xAxis.axisTick.lineStyle.color =
                val.axisTickColor;
              this.attackOption.yAxis.axisTick.lineStyle.color =
                val.axisTickColor;
              this.attackOption.series[0].data = val.dataValue;
              this.attackChart = this.$echarts.init(
                this.$refs.battleCharHistogram,
              );
              this.attackChart.setOption(this.attackOption);
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.attackChart) {
        this.attackChart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (this.attackChart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.attackChart.dispose();
    this.attackChart = null;
  },
  methods: {
    renderEcharts() {
      this.attackChart = this.$echarts.init(this.$refs.battleCharHistogram);
      this.attackOption = this.getOptions();
      this.attackChart.setOption(this.attackOption);
    },
    getOptions() {
      return {
        grid: {
          y: this.dataInfo.gridY || 35,
          bottom: this.dataInfo.gridBottom || 55,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
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
        xAxis: {
          type: 'category',
          data: this.dataInfo.dataLabel,
          axisLabel: {
            // x轴label// 字体颜色
            interval: 0,
            rotate: this.dataInfo.Xrotate || 0,
            formatter: function (value) {
              return value.length > 6 ? value.slice(0, 6) + '...' : value;
            },
            textStyle: {
              color: this.$themed('neutral7'),
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
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: 1,
          minInterval: 1,
          min: 0,
          scale: true,
          splitLine: {
            lineStyle: {
              color: this.dataInfo.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.$themed('neutral7'),
            },
          },
          axisTick: {
            lineStyle: {
              color: this.dataInfo.axisTickColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
        },
        series: [
          {
            data: this.dataInfo.dataValue,
            type: 'bar',
            barWidth: this.dataInfo.barWidth || 25, // 柱图宽度
            itemStyle: {
              color: (params) => {
                let colorValue = [];
                if (
                  this.dataInfo.dataRole[params.dataIndex] ===
                  this.$CONSTANT.Role.RedVsBlue.REDUSER.value
                ) {
                  colorValue = [
                    this.$themed('orange-color'),
                    this.$themed('orange-color'),
                  ];
                } else {
                  colorValue = [
                    this.$themed('primary-color'),
                    this.$themed('primary-color'),
                  ];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorValue[0],
                  },
                  {
                    offset: 1,
                    color: colorValue[1],
                  },
                ]);
              },
            },
          },
        ],
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
