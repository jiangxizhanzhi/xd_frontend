<template>
  <div ref="stuScoreComp" style="width: 100%; height: 110%" />
</template>
<script>
import { debounce } from '@/utils/index.js';
export default {
  props: {
    xData: {
      default: () => [],
      type: Array,
    },
    finishAssgin: {
      default: () => [],
      type: Array,
    },
    scoreData: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      option: {
        color: '#fff',
        title: {
          left: 'left',
          top: 20,
          text: this.$t('m.studentRatingChart'),
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'normal',
          },
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{a}:{c}',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
              fontSize: 12,
            },
          },
        },
        grid: {
          show: true,
          top: '60',
          bottom: '60',
          right: '50',
          left: '50',
        },
        legend: {
          top: 20,
          right: 20,
          data: [
            {
              name: this.$t('m.goal'),
              textStyle: {
                color: '#fff',
              },
            },
            {
              name: this.$t('m.completionRate'),
              icon: 'line',
              textStyle: {
                color: '#fff',
              },
            },
          ],
        },
        xAxis: {
          // splitLine: { show: false },
          type: 'category',
          data: this.xData, // x_data
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            interval: 0, // 横轴信息全部显示
            rotate: 45, // -45度角倾斜显示
          },
          // 改变x轴颜色
          axisLine: {
            lineStyle: {
              color: '#ACB6DB', // x轴颜色
              width: 1, // 这里是为了突出显示加上的
            },
          },
          // //设置x轴的刻度表隐藏
          // axisTick: {
          //   show: false,
          //   interval: 0,
          // },
        },
        // 设置两个y轴，左边显示数量，右边显示概率
        yAxis: [
          {
            splitLine: { show: false },
            type: 'value',
            max: 100,
            min: 0,
            show: true,
            interval: 20,
            // 改变y轴颜色
            axisLine: {
              lineStyle: {
                color: '#ACB6DB',
                width: 1, // 这里是为了突出显示加上的
              },
            },
          },
          // 右边显示概率
          {
            splitLine: { show: false },
            type: 'value',
            min: 0,
            max: 100,
            interval: 10,
            // 改变y轴颜色
            axisLine: {
              lineStyle: {
                color: '#ACB6DB',
                width: 1, // 这里是为了突出显示加上的
              },
            },
            axisLabel: {
              formatter: '{value} %',
            },
          },
        ],
        // 每个设备分数量、概率2个指标，只要让他们的name一致，即可通过，legeng进行统一的切换
        series: [
          {
            name: this.$t('m.goal'),
            type: 'bar',
            symbol: 'circle', // 折线点设置为实心点
            symbolSize: 0, // 折线点的大小
            data: this.finishAssgin, // y_data
            barWidth: '50%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#00E0E8', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0073D4', // 100% 处的颜色
                    },
                  ],
                  false,
                ),
              },
            },
          },
          {
            // 折线
            name: this.$t('m.completionRate'),
            type: 'line',
            symbol: 'circle', // 折线点设置为实心点
            symbolSize: 8, // 折线点的大小
            yAxisIndex: 1, // 这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
            data: this.scoreData, // y2_data
            itemStyle: {
              // 折线拐点标志的样式
              color: '#0CE49F',
            },
            lineStyle: {
              color: '#0CE49F',
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.stuScore = this.$echarts.init(this.$refs.stuScoreComp);
      this.stuScore.setOption(this.option);
    });
    this.__resizeHandler = debounce(() => {
      if (this.stuScore) {
        this.stuScore.resize();
      }
    });
  },
  methods: {
    // https://blog.csdn.net/qq_36538012/article/details/101469434
  },
  beforeDestory() {
    if (this.stuScore) return;
    window.removeEventListener('resize', this.__resizeHandler);
    this.stuScore.dispose();
    this.stuScore = null;
  },
};
</script>
<style lang="scss" scoped></style>
