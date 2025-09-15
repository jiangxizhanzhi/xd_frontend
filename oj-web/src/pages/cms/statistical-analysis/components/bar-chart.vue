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
    barColor: {
      type: String,
      default: '',
    },
    yName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      option: {
        grid: {
          show: false,
          top: 40,
          left: 16,
          right: 16,
          bottom: 16,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          right: 16,
          icon: 'rect', // 设置图例标记为正方形
          itemGap: 10,// 设置图例标记之间的间距
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        barWidth: 16,
        series: [
          {
            name: '单元实验',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
          },
          {
            name: '科目训练',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310, 101, 134, 90, 230, 210]
          },
          {
            name: '综合演训',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410, 101, 134, 90, 230, 210]
          },
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
