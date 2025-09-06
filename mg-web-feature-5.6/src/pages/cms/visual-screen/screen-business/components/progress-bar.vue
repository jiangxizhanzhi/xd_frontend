<template>
  <div class="chart-box">
    <div class="chart" ref="chartRef" style="width: 100%; height: 100%"></div>
    <div class="legend-area">
      <div>
        <div class="icon"></div>
        <div>{{ `${$t('screenBusiness.issued')}  ${dataList.released}` }}</div>
      </div>
      <div>
        <div class="icon"></div>
        <div>
          {{ `${$t('screenBusiness.unissued')}  ${dataList.unreleased}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    // 由于是进度条，只接收2条数据
    dataList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '',
          textStyle: {
            color: '#07E6CC',
            fontSize: 24,
            fontFamily: 'OPPOSans',
          },
          subtext: this.$t('screenBusiness.totalTasks'),
          subtextStyle: {
            color: '#fff',
            fontSize: 12,
          },
          itemGap: 10, // 主副标题距离
          left: 'center',
          top: '34%',
        },
        tooltip: {
          show: true,
        },
        legend: [{ show: false }, { show: false }],
        angleAxis: {
          max: '', // 满分
          clockwise: false, // 逆时针
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: 'category',
          show: true,
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '140%', //图形大小
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                name: this.$t('screenBusiness.issued'),
                value: '',
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#17F6FF00',
                      },
                      {
                        offset: 1,
                        color: '#17F6FFFF',
                      },
                    ]),
                  },
                },
              },
            ],
            tooltip: {
              trigger: 'item',
              formatter: '',
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 15,
            barGap: '-100%', // 两环重叠
            z: 2,
          },
          {
            // 灰色环
            type: 'bar',
            data: [
              {
                value: 45,
                name: this.$t('screenBusiness.unissued'),
                itemStyle: {
                  color: '#e2e2e2',
                  opacity: 0.13,
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 5,
                  shadowOffsetY: 2,
                },
              },
            ],
            tooltip: {
              trigger: 'item',
              formatter: '',
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 15,
            barGap: '-100%', // 两环重叠
            z: 1,
          },
        ],
      },
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  watch: {
    dataList: {
      handler(nv, ov) {
        if (nv) {
          this.options.title.text = nv.total || 0;
          this.options.angleAxis.max = nv.total || 0;
          this.options.series[0].data[0].value = nv.released || 0;
          this.options.series[0].tooltip.formatter = `${this.$t(
            'screenBusiness.issued',
          )}  ${nv.released || 0}`;
          this.options.series[1].data[0].value = nv.total;
          this.options.series[1].tooltip.formatter = `${this.$t(
            'screenBusiness.unissued',
          )}  ${nv.unreleased || 0}`;
          this.$nextTick(() => {
            if (this.chart) {
              this.chart.setOption(this.options);
            } else {
              this.initChart();
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartRef);
        this.chart.setOption(this.options);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;
  height: 100%;
  position: relative;
  .legend-area {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    display: flex;
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    & > div:first-child {
      margin-right: 20px;
      .icon {
        background: #17f6ff;
      }
    }
    & > div:nth-child(2) {
      .icon {
        background: #f8f8f8;
      }
    }
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
}
</style>
