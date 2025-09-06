<template>
  <!-- 团队实时速率图表 -->
  <div class="real">
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
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
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
          top: 30,
          left: 28,
          right: 30,
          bottom: 5,
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          textStyle: {
            color: this.$themed('neutral8'),
          },
        },
        xAxis: {
          triggerEvent: true,
          // name: 's', // x轴名称
          // data: ['操作机A', '操作机B', '操作机C', '操作机D', '操作机E'],
          data: this.xData,
          // x轴名称样式
          nameTextStyle: {
            fontSize: 14,
            color: this.$themed('neutral5'),
            verticalAlign: 'top',
            padding: [6, 0, 0, -20],
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
            formatter: function (params) {
              return params.length > 4
                ? params.substring(0, 4) + '...'
                : params;
            },
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
            type: 'bar',
            barWidth: 15, // 柱子宽度
            // data: [45, 86, 47, 62, 73, 34, 80, 36, 68],
            data: this.yData,
            //给柱状图整体设置颜色
            itemStyle: {
              normal: {
                color: this.$themed('blue-color'),
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
    // option: {
    //   handler(val, oldVal) {
    //     this.option.xAxis.data = val.xData;
    //     this.option.series[0].data = val.yData;
    //   },
    //   deep: true,
    //   // immediate: true,
    // },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.real {
  width: 100%;
  height: 100%;
}
</style>
