<template>
  <div class="chart-wrapper" ref="courseChart"></div>
</template>
<script>
import { ListenDomChange } from '@cyber/ui';
const echarts = require('echarts');
export default {
  props: {
    xData: {
      type: Array,
      deafault: () => [],
    },
    yData: {
      type: Array,
      deafault: () => [],
    },
  },
  data() {
    return {
      chart: null,
      handler: new ListenDomChange({
        dom: document.body,
        callback: this.update,
      }),
    };
  },
  computed: {
    colorData() {
      let data = [];
      let color = [
        this.$themed('blue-color'),
        this.$themed('green-color'),
        this.$themed('orange-color'),
      ];
      this.xData.forEach((el, i) => {
        data.push({
          name: el,
          value: this.yData[i],
          itemStyle: {
            color: color[i],
          },
        });
      });
      return data;
    },
  },
  mounted() {
    this.initChart();
    this.handler.createListen();
  },
  watch: {
    xData() {
      this.update();
    },
    yData() {
      this.update();
    },
  },
  methods: {
    initChart() {
      let dom = this.$refs.courseChart;
      this.chart = echarts.init(dom);
      let option = {
        grid: {
          top: '15%',
          left: 0,
          bottom: 0,
          right: 0,
          containLabel: true,
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            return params.value + '%';
          },
          backgroundColor: this.$themed('bg-color-third'),
          borderColor: 'rgba(0,0,0,0)',
          textStyle: {
            color: this.$themed('font-color-primary'),
            fontWeight: 900,
          },
          padding: [5, 10],
        },
        xAxis: {
          type: 'category',
          data: this.xData,
          nameTextStyle: {
            color: this.$themed('font-color-regular'),
          },
          axisLine: {
            lineStyle: {
              color: this.$themed('font-color-regular'),
            },
          },
          axisLabel: {
            textStyle: {
              color: this.$themed('font-color-regular'),
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: this.$themed('font-color-regular'),
            },
            formatter: '{value}%',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.$themed('font-color-regular'),
            },
          },
          max: 100,
        },
        series: [
          {
            type: 'bar',
            barWidth: '15',
            data: this.colorData,
            showBackground: true,
            backgroundStyle: {
              color: this.$themed('bg-color-fifth'),
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
    HEXToRGB(color, opacity) {
      color = color;
      let r = parseInt(color.substring(1, 3), 16);
      let g = parseInt(color.substring(3, 5), 16);
      let b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    update() {
      this.chart.dispose();
      this.initChart();
    },
  },
  beforeDestroy() {
    this.handler.destroyListen();
  },
};
</script>
<style lang="scss" scoped>
.chart-wrapper {
  height: 100%;
  width: 100%;
}
</style>
