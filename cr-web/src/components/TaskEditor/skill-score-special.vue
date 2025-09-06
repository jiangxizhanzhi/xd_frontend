<template>
  <div id="radar">
    <div id="chart" style="width: 100%; height: 180px; padding: 10px 0" />
  </div>
</template>

<script>
import { debounce } from '@/utils';
import { mapGetters } from 'vuex';
export default {
  props: {
    skillData: {
      type: Array,
      default: () => [],
    },
    pieLabelData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      redChart: null,
      options: {
        tooltip: {
          trigger: 'axis',
        },
        polar: [
          {
            indicator: [
              {
                text: this.pieLabelData[0],
                min: 0,
                max: 100,
                axisLabel: {
                  align: 'center',
                  verticalAlign: 'middle',
                  show: true,
                  fontSize: 8,
                  color: '#B8C4DF',
                  showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                  showMinLabel: true, //显示最小数字，即中心点显示0
                },
              },
              {
                text: this.pieLabelData[1],
                min: 0,
                max: 100,
              },
              {
                text: this.pieLabelData[2],
                min: 0,
                max: 100,
              },
              {
                text: this.pieLabelData[3],
                min: 0,
                max: 100,
              },
              {
                text: this.pieLabelData[4],
                min: 0,
                max: 100,
              },
              {
                text: this.pieLabelData[5],
                min: 0,
                max: 100,
              },
              {
                text: this.pieLabelData[6],
                min: 0,
                max: 100,
              },
            ],
            type: 'polygon',
            splitNumber: 5,
            nameGap: 6, // 图中工艺等字距离图的距离
            axisLine: {
              show: false,
            },
            name: {
              color: 'rgba(192,204,231,1)', // 文字颜色
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: 'rgba(58,188,255,0)', // 图表背景网格的颜色
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#305674', // 图表背景网格线的颜色
              },
            },
            center: ['50%', '50%'],
          },
        ],
        series: [
          {
            name: '',
            type: 'radar',
            symbol: 'none',
            symbolSize: 1,
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(57,239,255,1)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(58,188,255,1)', // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
              },
            },
            lineStyle: {
              normal: {
                opacity: 0,
              },
            },
            data: [
              {
                value: [2, 4, 3, 5, 3, 1],
                name: '红队',
              },
            ],
          },
        ],
        calculable: false,
      },
    };
  },
  computed: {
    ...mapGetters(['theme']),
    // currentThemeColor() {
    //   const currentColor = {
    //     dark: {
    //       optionTextColor: '#C0CCE7',
    //     },
    //     light: {
    //       optionTextColor: '#3e3f41',
    //     },
    //   };
    //   return currentColor[this.theme];
    // },
  },
  watch: {
    skillData: {
      handler(val, oldval) {
        if (val) {
          this.initRedChart();
        }
      },
      immediate: true,
      deep: true,
    },
    theme: {
      handler() {
        this.initChart();
      },
    },
  },
  mounted() {
    this.initRedChart();
    this.__resizeHandler = debounce(() => {
      // 监控改变窗口大小改变事件 修改echart宽度
      if (this.redChart) {
        this.redChart.resize();
      }
      if (this.blueChart) {
        this.blueChart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  methods: {
    initRedChart() {
      this.$nextTick(() => {
        this.options.series[0].data[0].value = this.skillData;
        // this.options.polar[0].name.color = this.currentThemeColor.optionTextColor;
        this.redChart = this.$echarts.init(document.getElementById('chart'));
        this.redChart.setOption(this.options);
      });
    },
  },
};
</script>
<style lang="scss">
#radar {
  width: 100%;
}
</style>
