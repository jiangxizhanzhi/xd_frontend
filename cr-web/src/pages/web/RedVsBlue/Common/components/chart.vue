<template>
  <div ref="myChart" style="width: 320px; height: 245px" />
</template>
<script>
import { debounce } from '@/utils';
export default {
  name: 'ChartCom',
  props: {
    pieLabelData: {
      type: Array,
      default() {
        return [];
      },
    },
    skillPoints: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
        },
        radar: [
          {
            indicator: [
              { text: this.pieLabelData[0], max: 5 },
              { text: this.pieLabelData[1], max: 5 },
              { text: this.pieLabelData[2], max: 5 },
              { text: this.pieLabelData[3], max: 5 },
              { text: this.pieLabelData[4], max: 5 },
              { text: this.pieLabelData[5], max: 5 },
              { text: this.pieLabelData[6], max: 5 },
            ],
            radius: 80,
            center: ['50%', '46%'],
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
          },
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item',
            },
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
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: [1, 1, 1, 1, 1, 1, 1],
                name: 'skill',
              },
            ],
          },
        ],
      },
      chart: '',
    };
  },
  watch: {
    skillPoints: {
      handler(val) {
        if (this.chart) {
          this.options.series[0].data[0].value = val;
          this.chart.setOption(this.options);
        }
      },
    },
  },
  mounted() {
    this.drawLine();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        'transitionend',
        this.sidebarResizeHandler,
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        'transitionend',
        this.sidebarResizeHandler,
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      this.chart.setOption(this.options);
    },
  },
};
</script>
