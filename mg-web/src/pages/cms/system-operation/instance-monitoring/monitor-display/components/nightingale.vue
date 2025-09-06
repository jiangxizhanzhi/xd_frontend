<template>
  <div ref="myChart" class="myChart"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([ToolboxComponent, LegendComponent, PieChart, CanvasRenderer]);
const COLOR = ['#29C593', '#F1BF38', '#0BDAFF', '#3AA5FF', '#FF3A5A'];

export default {
  name: 'nightingale',
  props: {
    pieData: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      myChart: null,
      debounceId: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.myChart = echarts.init(this.$refs.myChart);
    this.initChart();
    this.debounceId = _.debounce(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 300);
    window.addEventListener('resize', this.debounceId);
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
  watch: {
    pieData: {
      handler(newVal, oldVal) {
        if (this.myChart && newVal) {
          this.initChart();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initChart() {
      let _this = this;
      const basic = {
        type: 'pie',
        radius: [15, 50],
        center: ['20%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 0,
        },
        label: {
          show: false,
        },
      };
      const legend = {
        type: 'scroll',
        icon: 'circle',
        orient: 'vertical',
        right: '20%',
        top: 'center',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#fff',
        },
      };
      const grid = {
        top: '10%',
        bottom: '0%',
        left: '3%',
        right: '6%',
        containLabel: true,
      };
      const tooltip = {
        trigger: 'item',
        backgroundColor: '#2F3A4D',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
          opacity: 0.8,
        },
        formatter: '{b}: {c}',
      };
      let option = {
        color: COLOR,
        legend: {
          ...legend,
          formatter(name) {
            const tarValue = _this.pieData.filter((item) => {
              return item.name === name;
            })[0].value;
            return `${name}   ${tarValue}%`;
          },
        },
        tooltip: { ...tooltip },
        grid: { ...grid },
        series: [
          {
            ...basic,
            data: this.pieData,
          },
        ],
      };
      this.myChart.setOption(option);
    },
    arrCount(arr) {
      let count = 0;
      arr.forEach((item) => {
        count = count + item.value;
      });
      return count;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.myChart {
  width: 100%;
  height: 100%;
}
</style>
