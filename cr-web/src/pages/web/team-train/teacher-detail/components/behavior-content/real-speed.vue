<template>
  <div class="real-speed-chart">
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
    realTimeRate: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      option: {
        // 网格
        grid: {
          show: false,
          top: 5,
          left: 0,
          right: 40,
          bottom: 5,
          containLabel: true,
        },
        tooltip: {
          show: false,
          trigger: 'item',
        },
        xAxis: {
          boundaryGap: false,
          // name: 's', // x轴名称
          // data: [-40, -35, -30, -25, -20, -15, -10, -5, 0],
          data: [],
          // x轴名称样式
          nameTextStyle: {
            fontSize: 14,
            color: this.$themed('neutral5'),
            verticalAlign: 'top',
            padding: [6, 0, 0, 0],
          },
          // 坐标轴轴线
          axisLine: {
            show: false,
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
            show: false,
            interval: 0,
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: this.yName,
          nameTextStyle: {
            fontSize: 12,
            color: this.$themed('neutral5'),
            padding: [0, 55, 0, 20],
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
            show: false,
            lineStyle: {
              color: this.$themed('neutral0'),
            },
          },
          axisLabel: {
            show: false,
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        series: [
          {
            type: 'line',
            // data: [45, 86, 47, 62, 73, 34, 80, 36, 68],
            data: [],
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: this.$themed('primary-color'),
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
    realTimeRate: {
      handler(val, oldVal) {
        this.option.xAxis.data = [];
        this.option.series[0].data = [];
        this.realTimeRate = val;
        this.realTimeRate.forEach((item) => {
          this.option.xAxis.data.push(item.second);
          this.option.series[0].data.push(item.tx_bps);
        });
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.real-speed-chart {
  width: 100%;
  height: 100%;
}
</style>
