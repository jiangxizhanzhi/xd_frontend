<template>
  <div class="environment">
    <!-- 团队流量仿真图表 -->
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
    titles: {
      type: String,
      default: '',
    },
    contentChart: {
      type: Array,
      default() {
        return [];
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
          left: 46,
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
          name: this.contentChart[2], // x轴名称
          // data: [-40, -35, -30, -25, -20, -15, -10, -5, 0],
          data: this.contentChart[0],
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
            interval: 0,
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: this.titles,
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
            // data: [45, 86, 47, 62, 73, 34, 80, 36, 68],
            data: this.contentChart[1],
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: this.$themed('--primary-color'),
            },
            itemStyle: {
              normal: {
                color: this.$themed('--primary-color'),
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
                    color: 'rgba(10, 207, 242, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(10, 207, 242, 0)',
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
    contentChart: {
      handler(val, oldVal) {
        this.option.xAxis.name = val[2];
        this.option.xAxis.data = val[0];
        this.option.series[0].data = val[1];
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
