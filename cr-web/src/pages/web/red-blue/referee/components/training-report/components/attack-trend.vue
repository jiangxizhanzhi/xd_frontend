<template>
  <div class="attack-trend">
    <chart-demo ref="demoRef" :option="option"></chart-demo>
  </div>
</template>

<script>
import chartDemo from './chart-demo';
export default {
  components: {
    chartDemo,
  },
  props: {
    lineData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      option: {
        color: [this.$themed('primary-color')],
        // 网格
        grid: {
          show: false,
          top: 50,
          left: 45,
          right: 28,
          bottom: 16,
          containLabel: true,
        },
        tooltip: {
          //鼠标移动到坐标轴触发时提示框是否有虚线
          trigger: 'axis',
          //背景颜色
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
          boundaryGap: false,
          // name: 's', // x轴名称
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
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: 'kb',
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
            data: [],
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: this.$themed('primary-color'),
            },
            symbol: 'none',
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
    lineData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.option.xAxis.data = newVal.xData;
            this.option.series[0].data = newVal.yData;
            this.$refs.demoRef.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.attack-trend {
  width: 100%;
  height: calc(100% - 36px);
}
</style>
