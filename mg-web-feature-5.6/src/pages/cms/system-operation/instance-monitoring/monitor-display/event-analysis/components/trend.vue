<template>
  <div class="trend-box">
    <cb-echart-line
      :xData="xData"
      :name="name"
      :lineData="lineData"
      :grid="grid"
      :xAxisLine="axisLine"
      :yAxisLine="axisLine"
      :xAxisLabel="xAxisLabel"
      :yAxisLabel="yAxisLabel"
      :symbol="symbol"
      :areaStyle="true"
    ></cb-echart-line>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  props: {
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      symbol: 'none',
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      legendLocation: 'center',
      ySplitLineShow: true,
      legendIcon: '',
      name: ['数量'],
      areaStyle: true,
      /**
       * 每种柱子的颜色和值
       */
      xData: [],
      yAxisIndex: [0],
      lineData: [[]],
      grid: {
        top: '10%',
        bottom: '2%',
        left: '8%',
        right: '14%',
        containLabel: true,
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolSize: [5, 10],
        symbolOffset: [0, 10],
        lineStyle: { color: '#727E9A' },
      },
      xAxisLabel: {
        color: '#fff',
        opacity: 0.8,
        showMaxLabel: true, //显示最后一个x轴标签
        fontSize: 12,
      },
      yAxisLabel: {
        color: '#fff',
        opacity: 0.8,
        fontSize: 12,
      },

      timer: null,
    };
  },
  computed: {},
  created() {
    this.getTrend();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getTrend();
    }, 30000);
  },
  watch: {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    //采集事件趋势图
    getTrend() {
      this.$request
        .get(
          `/cscene/monitor/event/event_trend`,
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          this.xData = [];
          this.lineData = [[]];
          const data = _.get(res, 'data.data', []);
          data.forEach((element) => {
            this.xData.push(element.time);
            this.lineData[0].push(element.count);
          });
        });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.trend-box {
  height: calc(100% - 32px);
  width: 100%;
  padding-bottom: 4px;
}
</style>
