<template>
  <div class="environment">
    <chart-demo :option="option"></chart-demo>
  </div>
</template>

<script>
import chartDemo from './chart-demo';
export default {
  components: {
    chartDemo,
  },
  props: {
    xData: {
      type: Array,
      default() {
        return [];
      },
    },
    yData: {
      type: Array,
      default() {
        return [];
      },
    },
    isFresh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      option: {
        // 网格
        grid: {
          show: false,
          top: 30,
          left: 10,
          right: 10,
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
          // name: this.yData, // x轴名称
          data: this.xData,
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
              color: this.$themed('neutral5'),
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴刻度标签
          axisLabel: {
            // interval: 0, /展示全部坐标
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: this.$t('rbt.times'),
          nameTextStyle: {
            fontSize: 12,
            color: this.$themed('neutral5'),
            align: 'right',
            // padding: [0, 55, 0, 10],
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
          grid: {
            // left: 10,
            // right: 40,
            // bottom: 10,
            // containLabel: true,
          },
        },
        series: [
          {
            type: 'line',
            // data: [45, 486, 1047, 162, 73, 734, 80, 536, 768],
            data: this.yData,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: this.$themed('--orange-color'),
            },
            itemStyle: {
              normal: {
                color: this.$themed('--orange-color'),
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
    xData: {
      handler(val, oldVal) {
        this.option.xAxis.data = val;
      },
      deep: true,
    },

    yData: {
      handler(val, oldVal) {
        this.option.series[0].data = val;
      },
      deep: true,
    },

    isFresh: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.option.xAxis.data = this.xData;
          this.option.series[0].data = this.yData;
        }
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
