<template>
  <div class="wrapper">
    <div ref="myChart" class="myChart" style="width: 100%; height: 185px"></div>
  </div>
</template>

<script>
import { getTheme } from '@cyber/helper';

const COLOR = [
  '--cyan-color',
  '--cyan-color-2',
  '--cyan-color-4',
  '--cyan-color-8',
];

export default {
  name: 'line-chart',
  props: {
    lineData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      myChart: null,
      debounceId: null,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: getTheme() ? getTheme() : 'theme-dark',
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.listen.createListen();
    this.myChart = this.$echarts.init(this.$refs.myChart);
    this.initChart();
    this.debounceId = _.debounce(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 300);
    window.addEventListener('resize', this.debounceId);
  },
  beforeDestroy() {
    this.listen.destroyListen();
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
  watch: {
    lineData: {
      handler(newVal, oldVal) {
        if (this.myChart && newVal) {
          this.initChart();
        }
      },
      immediate: true,
      deep: true,
    },
    theme: {
      handler(val) {
        if (this.myChart) {
          this.initChart();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 监听换肤，切换背景
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'theme-dark';
      } else {
        this.theme = 'theme-light';
      }
    },
    initChart() {
      let _this = this;
      const tooltip = {
        trigger: 'axis',
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        formatter: (params) => {
          var relVal = '';
          for (var i = 0, l = params.length; i < l; i++) {
            relVal +=
              params[i].axisValue +
              ' ' +
              '&nbsp;' +
              params[i].marker +
              params[i].value;
          }
          return relVal;
        },
        axisPointer: {
          snap: true,
          lineStyle: {
            type: 'solid',
            width: 1,
            color: this.$themed('neutral4'),
          },
        },
      };
      const grid = {
        top: '11%',
        bottom: '6%',
        left: '9%',
        right: '8%',
        containLabel: true,
      };
      const xAxis = {
        type: 'category',
        data: _this.lineData.xData,
        show: true,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: this.$themed('neutral5'),
          fontSize: '10px',
        },
        axisTick: { show: false },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 10],
          symbolOffset: [0, 10],
          lineStyle: { color: this.$themed('cyan-color') },
        },
      };
      const yAxis = {
        type: 'value',
        min: 0,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: this.$themed('neutral5'),
          fontSize: '10px',
        },
        axisTick: { show: false },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 10],
          symbolOffset: [0, 10],
          lineStyle: { color: this.$themed('neutral2') },
        },
      };
      const basic = {
        type: 'line',
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
                color: this.$themed('cyan-color-8'), // 0% 处的颜色
              },
              {
                offset: 1,
                color: this.$themed('cyan-color'), // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        lineStyle: {
          width: 3,
        },
      };
      let option = {
        color: COLOR,
        tooltip: { ...tooltip },
        grid: { ...grid },
        xAxis: { ...xAxis },
        yAxis: { ...yAxis },
        series: [
          {
            ...basic,
            data: _this.lineData.yData,
            symbol: 'none',
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            show: false,
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
      };
      this.myChart.setOption(option);
      this.myChart.resize();
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.wrapper,
.myChart {
  width: 100%;
  height: 100%;
}
</style>
