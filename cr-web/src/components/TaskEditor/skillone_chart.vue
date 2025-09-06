<template>
  <div id="radar">
    <div id="blueChart" style="width: 80%; height: 240px" />
  </div>
</template>

<script>
import { debounce } from '@/utils';
import { mapGetters } from 'vuex';
import _ from 'lodash';
export default {
  props: {
    levelRate: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      blueChart: null,
      options: {
        tooltip: {
          trigger: 'axis',
        },
        polar: [
          {
            indicator: [
              {
                text: this.levelRate[0].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[1].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[2].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[3].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[4].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[5].type,
                min: 0,
                max: 5,
              },
              {
                text: this.levelRate[6].type,
                min: 0,
                max: 5,
              },
            ],
            type: 'polygon',
            splitNumber: 5,
            name: {
              color: 'rgba(192,204,231,1)',
            },
            axisLine: {
              show: false,
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
                      color: 'rgba(57,239,255,1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(58,188,255,1)',
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
  },
  watch: {
    theme: {
      handler() {
        this.initBlueChart();
      },
    },
  },
  mounted() {
    this.initBlueChart();
    this.__resizeHandler = debounce(() => {
      // 监控改变窗口大小改变事件 修改echart宽度
      if (this.blueChart) {
        this.blueChart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  methods: {
    initBlueChart() {
      const arr = [];
      this.$nextTick(() => {
        if (this.levelRate.length > 0) {
          _.forEach(this.levelRate, (i) => {
            arr.push(i.rate);
          });
          this.options.series[0].data[0].value = arr;
        }
        this.blueChart = this.$echarts.init(
          document.getElementById('blueChart'),
        );
        this.blueChart.setOption(this.options);
      });
    },
  },
};
</script>
