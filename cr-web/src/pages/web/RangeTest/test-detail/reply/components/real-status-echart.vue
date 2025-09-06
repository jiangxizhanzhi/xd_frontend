<template>
  <div style="width: 100%; height: 185px">
    <cb-echart-line
      v-if="ready"
      :xData="statusLineData.xData"
      :name="name"
      :lineData="statusLineData.yData"
      :grid="grid"
      :legendShow="legendShow"
      :xAxisLine="axisLine"
      :yAxisLine="axisLine"
      :areaStyle="areaStyle"
      :color="color"
      :symbol="symbol"
      :xAxisLabel="xAxisLabel"
      :yAxisLabel="yAxisLabel"
    ></cb-echart-line>
  </div>
</template>
<script>
export default {
  name: 'real-status',
  props: {
    statusLineData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    theme: {
      handler(val) {
        this.ready = true;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      ready: true,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      chartSize: {
        width: '500px',
        height: '400px',
      },
      symbol: 'none',
      color: ['red-color', 'orange-color', 'green-color'],
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      // xType: 'time',
      //legend的显示位置
      legendLocation: 'center',
      ySplitLineShow: true,
      legendIcon: '',
      name: [
        'cpu',
        this.$t('monitorReplay.ram'),
        this.$t('monitorReplay.disk'),
      ],
      areaStyle: true,
      /**
       * 每种柱子的颜色和值
       */

      yAxisIndex: [0, 0, 1],
      // x轴y轴标签样式
      xAxisLabel: {
        fontSize: 10,
        color: this.$themed('neutral5'),
      },
      yAxisLabel: {
        fontSize: 10,
        color: this.$themed('neutral5'),
      },

      grid: {
        top: '16%',
        bottom: '5%',
        left: '9%',
        right: '12%',
        containLabel: true,
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolSize: [5, 10],
        symbolOffset: [0, 10],
        lineStyle: { color: this.$themed('neutral2') },
      },
    };
  },

  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，切换背景
    listenFunc() {
      this.ready = false;
      this.xAxisLabel.color = this.$themed('neutral5');
      this.yAxisLabel.color = this.$themed('neutral5');
      this.axisLine.lineStyle.color = this.$themed('neutral2');
      this.$nextTick(() => {
        this.ready = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
