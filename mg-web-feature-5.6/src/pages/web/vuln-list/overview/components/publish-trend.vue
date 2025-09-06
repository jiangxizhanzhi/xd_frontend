<template>
  <div
    class="publish-trend"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,.1)"
  >
    <div class="chart-box" ref="publishTrendChart"></div>
    <!-- no-data -->
    <div v-if="!trendData && !loading" class="no-data">
      <empty></empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Empty from '@/components/empty';
import * as echarts from 'echarts';
import { getVulnOverviewTime } from '@/api/vuln';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: true,
      trendData: null,
      publishTrend: null,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      options: {
        grid: {
          top: 10,
          bottom: 30,
          right: 20,
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          // 网格线
          splitLine: { show: false },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: this.$themed('neutral8'),
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: this.$themed('neutral8'),
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
          },
        },
        series: [],
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 14,
            color: this.$themed('neutral8'),
          },
          extraCssText:
            'max-width: 420px;white-space: normal;word-break: break-all;line-height: 22px;',
          confine: true,
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: this.$themed('bg-color-1'),
        },
      },
    };
  },
  watch: {
    listen: {
      handler() {
        this.handleChartsData();
      },
      deep: true,
    },
  },
  created() {
    this.listen.createListen();
    this.fetchData();
  },
  mounted() {
    this.__resizeHandler = _.debounce(() => {
      this.publishTrend.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    this.listen.destroyListen();
    // 页面销毁后清除事件
    window.removeEventListener('resize', this.__resizeHandler);
    if (!this.publishTrend) {
      return;
    }
    this.publishTrend.dispose();
    this.publishTrend = null;
  },
  methods: {
    listenFunc() {
      this.options.xAxis.axisLabel.color = this.$themed('neutral8');
      this.options.yAxis.axisLabel.color = this.$themed('neutral8');
      this.options.tooltip.textStyle.color = this.$themed('neutral8');
      this.options.tooltip.backgroundColor = this.$themed('bg-color-1');
      this.options.tooltip.borderColor = this.$themed('bg-color-1');
      this.options.series = [];
    },
    fetchData() {
      getVulnOverviewTime()
        .then((res) => {
          this.trendData = _.get(res, 'data.data', {});
          this.handleChartsData();
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    handleChartsData() {
      if (!_.isEmpty(this.trendData)) {
        let { xdata, ydata } = this.trendData;
        this.options.xAxis.data = xdata;
        this.options.series.push({
          data: ydata,
          type: 'line',
          // 面积部分渐变色
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
                  color: 'rgba(22, 217, 51, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(22, 217, 51, 0)',
                },
              ],
              global: false,
            },
          },
          itemStyle: {
            // 线条颜色
            color: this.$themed('green-color'),
          },
        });
        this.initEcharts();
      }
    },
    initEcharts() {
      if (!this.publishTrend) {
        this.publishTrend = echarts.init(this.$refs.publishTrendChart);
      }
      this.publishTrend.setOption(this.options);
    },
  },
};
</script>

<style scoped lang="scss">
.publish-trend {
  position: relative;
  width: 100%;
  height: calc(100% - 48px);
  .chart-box {
    width: calc(100% - 2vw);
    margin-left: 1vw;
    height: 100%;
  }
  .no-data {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
