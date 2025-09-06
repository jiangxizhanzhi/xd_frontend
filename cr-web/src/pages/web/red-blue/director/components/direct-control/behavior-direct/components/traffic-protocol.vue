<template>
  <!-- 团队流量协议图表-->
  <div class="traffic">
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
    xDataFlow: {
      type: Array,
      default: () => [],
    },
    yDataFlow: {
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
          left: 22,
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
          // name: 's', // x轴名称
          // data: ['HTTP', 'TCP', 'DNS', 'ipv4', 'Ethernet', 'ipv4', 'DNS'],
          data: this.xDataFlow,
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
          },
        },
        yAxis: {
          // name: 'Mbps',
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
            formatter: '{value} %',
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: 15, // 柱子宽度
            // data: [45, 86, 47, 62, 73, 34, 80, 36, 68],
            data: this.yDataFlow,
            //给柱状图整体设置颜色
            itemStyle: {
              normal: {
                color: this.$themed('green-color'),
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    xDataFlow: {
      handler(val, oldVal) {
        this.option.xAxis.data = val;
      },
      deep: true,
    },
    yDataFlow: {
      handler(val, oldVal) {
        this.option.series[0].data = val;
      },
      deep: true,
    },
    // option: {
    //   handler(val, oldVal) {
    //     this.option.xAxis.data = val.xDataFlow;
    //     this.option.series[0].data = val.yDataFlow;
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
.traffic {
  width: 100%;
  height: 100%;
}
</style>
