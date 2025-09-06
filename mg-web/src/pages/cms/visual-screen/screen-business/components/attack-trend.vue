<template>
  <div class="chart-wrapper" ref="attackRef"></div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      options: {
        grid: {
          top: '15%',
          right: '5%',
          left: '5%',
          bottom: '1%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(85, 183, 255, 0.2)',
            },
          },
          axisLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.6)',
          },
          axisTick: {
            show: false,
          },
          data: [],
        },
        yAxis: {
          type: 'value',
          name: this.$t('screenBusiness.second'),
          nameGap: 8,
          nameTextStyle: {
            padding: [0, 8, 0, 0],
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 12,
          },
          axisLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.6)',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(85, 183, 255, 0.2)',
            },
          },
        },
        series: [
          {
            type: 'line',
            symbolSize: 0,
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
                    color: 'rgba(7, 230, 204, .5)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(7, 230, 204, 0)', // 100% 处的颜色
                  },
                ],
              },
            },
            lineStyle: {
              color: '#07E6CC',
              width: 1,
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.initChart(this.data);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  watch: {
    data: {
      handler(nv, ov) {
        if (this.chart) {
          this.setOption(nv);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.attackRef);
      this.setOption(this.data);
    },
    setOption(data) {
      this.options.xAxis.data = data.map((item) => {
        return item.name;
      });
      this.options.series[0].data = data;
      this.chart.setOption(this.options);
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-wrapper {
  height: 100%;
}
</style>
