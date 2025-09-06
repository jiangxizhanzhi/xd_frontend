<template>
  <!-- 行为导调流量仿真统计图表 -->
  <div class="line-chart">
    <div ref="chartref" :style="{ width, height }"></div>
  </div>
</template>

<script>
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
    option: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      debounceId: null,
    };
  },
  created() {},
  mounted() {
    this.initChart();
    this.extension(this.chart);
    this.debounceId = _.debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.debounceId);
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.chart.setOption(this.option);
      this.chart.resize();
    },

    // 鼠标划过X轴坐标,展示完整坐标名称
    extension(myChart) {
      myChart.on('mouseover', (params) => {
        if (params.componentType === 'xAxis') {
          xLabel = params.value;
          let offsetX = params.event.offsetX + 20;
          let offsetY = params.event.offsetY + 20;
          myChart.setOption({
            tooltip: {
              formatter: formateTooltip,
              alwaysShowContent: true,
              confine: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0,
            position: [offsetX, offsetY],
          });
        } else if (params.componentType === 'series') {
          myChart.setOption({
            tooltip: {
              formatter: null,
              alwaysShowContent: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
          });
        }
      });
      myChart.on('mouseout', (params) => {
        myChart.setOption({
          tooltip: {
            alwaysShowContent: false,
          },
        });
        if (params.componentType === 'xAxis') {
          xLabel = '';
        }
      });
      var xLabel = '';
      function formateTooltip(params) {
        return xLabel;
      }
    },
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
  watch: {
    option: {
      handler(val, oldval) {
        if (this.chart) {
          this.chart.dispose();
          this.chart = null;
        }
        this.initChart();
        this.extension(this.chart);
      },
      deep: true,
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
