<template>
  <div class="environment">
    <!-- 团队环境总率图表 -->
    <chart-behavior :option="option"></chart-behavior>
  </div>
</template>

<script>
import chartBehavior from './chart-behavior';
export default {
  components: {
    chartBehavior,
  },
  props: {
    unit: {
      type: String,
      default: '',
    },

    environmentXdata: {
      type: Array,
      default() {
        return {};
      },
    },
    environmentYdata: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      option: {
        // 网格
        grid: {
          show: false,
          top: 30,
          left: 28,
          right: 30,
          bottom: 5,
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        xAxis: {
          boundaryGap: false,
          name: this.unit, // x轴名称
          // data: [-40, -35, -30, -25, -20, -15, -10, -5, 0],
          data: this.environmentXdata,
          // x轴名称样式
          nameTextStyle: {
            fontSize: 14,
            color: this.$themed('neutral5'),
            verticalAlign: 'top',
            padding: [6, 0, 0, 0],
          },
          // 坐标轴轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: '',
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴刻度标签
          axisLabel: {
            interval: 0,
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: 'Mbps',
          nameTextStyle: {
            fontSize: 12,
            color: this.$themed('neutral5'),
            padding: [0, 55, 0, 0],
          },
          type: 'value',
          // max: 600,
          minInterval: 1,
          // splitNumber: 4,
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // grid区域分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral0'),
            },
          },
          axisLabel: {
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        series: [
          {
            type: 'line',
            // data: [45, 86, 47, 62, 73, 34, 80, 36, 68],
            data: this.environmentYdata,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: this.$themed('orange-color'),
            },
            itemStyle: {
              normal: {
                color: this.$themed('orange-color'),
              },
            },
            smooth: true,
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
                    color: 'rgba(255, 125, 44, 0.2)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 125, 44, 0)',
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    environmentXdata: {
      handler(val, oldVal) {
        this.option.xAxis.data = val;
      },
      deep: true,
    },
    environmentYdata: {
      handler(val, oldVal) {
        this.option.series[0].data = val;
      },
      deep: true,
    },
    unit: {
      handler(val, oldVal) {
        this.option.xAxis.name = val;
      },
      deep: true,
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.environment {
  width: 100%;
  height: 100%;
}
</style>
