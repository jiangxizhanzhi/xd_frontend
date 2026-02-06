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
    team_person_num_data: {
      type: Object,
      default() {
        return {
          xData: [],
          seriesData: [],
        }
      },
    },
    // 柱条颜色
    barColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      option: {
        color: ['#19ab76', '#19bad1', '#0d63c4'],
        grid: {
          show: false,
          top: 40,
          left: 16,
          right: 32,
          bottom: 16,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          right: 16,
          icon: 'rect', // 设置图例标记为正方形
          itemGap: 10 // 设置图例标记之间的间距
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      },
    };
  },
  watch: {
    // 处理数据
    team_person_num_data: {
      handler: function (nv, ov) {
        this.option.xAxis[0].data = nv.xData;
        this.option.series = nv.seriesData;
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
