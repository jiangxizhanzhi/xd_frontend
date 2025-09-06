<template>
  <div ref="myChart" class="myCharts"></div>
</template>
<script>
import { ListenDomChange } from '@cyber/ui';
import * as echarts from 'echarts';
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      myChart: null,
      debounceId: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // echartReady: false,
      result: this.data,
    };
  },
  computed: {
    // option() {
    //   if (!this.echartReady) {
    //     return false;
    //   }
    // },
  },
  mounted() {
    this.drawChart();
    this.$nextTick(() => {
      this.debounceId = _.debounce(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      }, 300);
      window.addEventListener('resize', this.debounceId);
    });
  },
  watch: {
    data: {
      handler(val, oldval) {
        this.result = val;
        this.drawChart();
      },
      // immediate: true,
      deep: true,
    },
  },
  created() {
    this.listen.createListen();
  },

  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
    this.listen.destroyListen();
  },
  methods: {
    drawChart() {
      echarts.init(this.$refs.myChart, null).dispose();
      this.myChart = echarts.init(this.$refs.myChart, null);

      // 指定图表的配置项和数据
      let option = {
        // backgroundColor: '#000416',
        tooltip: {
          show: true,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          backgroundColor: this.$themed('bg-color-3'),
          borderWidth: 0,
        },
        legend: {
          show: false,
        },
        grid: {
          left: '0%',
          right: '4%',
          bottom: '-14%',
          top: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            splitLine: {
              show: false,
            },
            type: 'value',
            show: false,
          },
        ],
        yAxis: [
          {
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            type: 'category',
            axisTick: {
              show: false,
            },
            inverse: true,
            data: this.result.map((item) => item.name),
            axisLabel: {
              color: this.$themed('--neutral8'),

              fontSize: 12,
              margin: 10,
              interval: 0,
              formatter: function (value) {
                const maxLength = 5; //每项显示文字个数
                const valLength = value.length; //X轴类目项的文字个数
                if (valLength > maxLength) {
                  return value.substring(0, maxLength) + '...';
                } else {
                  return value;
                }
              },
            },
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: this.$themed('--neutral8'),
                fontSize: 12,
                fontWeight: 600,
              },
              formatter: function (value) {
                return value;
              },
            },
            data: this.result.map((item) => item.value),
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: 10, // 柱子宽度
            MaxSize: 0,
            showBackground: true,
            backgroundStyle: {
              // color: 'red',
            },
            label: {
              show: false,
            },

            data: this.result.map((item, index) => {
              return {
                name: item.name,
                value: item.value,
                itemStyle: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: this.$themed('primary-color'),
                      },
                    ],
                  },
                },
              };
            }),
          },
        ],
      };
      this.myChart.setOption(option);
      this.myChart.resize();
    },
    listenFunc() {
      this.drawChart();
    },
  },
};
</script>
<style scoped lang="scss">
.regex {
  height: 225px;
}
.myCharts {
  height: 170px;
}
</style>
