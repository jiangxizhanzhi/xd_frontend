<template>
  <div class="line-chart">
    <div
      ref="chartref"
      :style="{ width, height }"
    ></div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as echarts from 'echarts';
export default {
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 柱条颜色
    colorList: {
      type: Array,
      default: ['#f59a23'],
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      option: {
        color: ['#f59a23'],
        grid: {
          show: false,
          top: 30,
          left: 16,
          right: 20,
          bottom: 16,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        barWidth: 14,
        legend: {
          show: false
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
          axisLabel: {
            color: '#6e7079'
          },
          axisLine: {
            lineStyle: {
              color: '#d2d2d2', // 轴线颜色
              type: 'dashed' // 设置为虚线
            }
          },
          axisTick: {
            show: false // 不显示刻度
          }
        },
        series: [
          {
            type: 'bar',
            data: [100, 50, 165, 70, 168, 30]
          }
        ]
      },
    };
  },
  watch: {
    // 处理数据
    dataList: {
      handler: function () {
        this.handleFormatData();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.option.color = this.colorList;
      this.chart.setOption(this.option);
    },
    handleFormatData() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
