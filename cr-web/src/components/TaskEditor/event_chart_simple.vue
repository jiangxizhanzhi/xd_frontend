<template>
  <div :id="id" style="width: 100%; height: 100%" />
</template>

<script>
import _ from 'lodash';
import { debounce } from '@/utils';
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    flowData: {
      type: Object,
      default: () => {},
    },
    light: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      leftChart: null,
      rightChart: null,
      attackCount: 0,
      bgCount: 0,
      runningCount: 0,
      notRunCount: 0,
    };
  },
  watch: {
    light(nvalue, oldValue) {
      this.initData();
      if (this.id === 'leftId') {
        this.initLeftChart();
      }
      if (this.id === 'rightId') {
        this.initRightChart();
      }
    },

    flowData: {
      handler(val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val)) {
            this.$nextTick(() => {
              this.initData();
              if (this.id === 'leftId') {
                this.initLeftChart();
              }
              if (this.id === 'rightId') {
                this.initRightChart();
              }
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      // 监控改变窗口大小改变事件 修改echart宽度
      if (this.leftChart || this.rightChart) {
        if (this.id === 'leftId') {
          this.leftChart.resize();
        } else if (this.id === 'rightId') {
          this.rightChart.resize();
        }
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    // 页面销毁后清除事件
    if (!this.leftChart || !this.rightChart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    if (this.id === 'leftId') {
      this.leftChart.dispose();
      this.leftChart = null;
    } else if (this.id === 'rightId') {
      this.rightChart.dispose();
      this.rightChart = null;
    }
  },
  methods: {
    initData() {
      this.attackCount = this.flowData.ig_traffic;
      this.bgCount = this.flowData.bg_traffic;
      this.runningCount = this.flowData.running_count;
      this.notRunCount = this.flowData.not_start_count;
    },
    initLeftChart() {
      const options = {
        tooltip: {
          trigger: 'item',
          borderWidth: 0,
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          formatter: '{b}: {c}',
        },
        legend: {
          orient: 'vertical',
          x: 'center',
          y: '75%',
          icon: 'circle',
          data: [this.$t('m.attack'), this.$t('m.amountBackground')],
          formatter: (name) => {
            var index = 0;
            var clientlabels = [
              this.$t('m.attack'),
              this.$t('m.amountBackground'),
            ];
            var clientcounts = [this.attackCount, this.bgCount];
            clientlabels.forEach(function (value, i) {
              if (value === name) {
                index = i;
              }
            });
            var arr = [
              '{a|' + name + '  ' + '}{b|' + clientcounts[index] + '}',
            ];
            return arr;
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 15,
                color: this.$themed('neutral7'),
              },
              b: {
                fontSize: 12,
                color: this.$themed('neutral8'),
              },
            },
          },
        },
        graphic: {
          // 图形中间文字
          type: 'text',
          left: 'center',
          top: '38%',
          style: {
            text: this.$t('m.trafficType'),
            textAlign: 'center',
            fill: this.$themed('neutral8'),
            fontSize: 13,
          },
        },
        series: [
          {
            name: this.$t('m.accessSource'),
            type: 'pie',
            radius: ['60%', '45%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'normal',
                },
              },
            },
            itemStyle: {
              normal: {
                borderColor: this.$themed('neutral0'),
                borderWidth: 5,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: this.attackCount, name: this.$t('m.attack') },
              { value: this.bgCount, name: this.$t('m.amountBackground') },
            ],
          },
        ],
        color: [this.$themed('green-color'), this.$themed('primary-color')],
      };
      this.leftChart = this.$echarts.init(document.getElementById('leftId'));
      this.leftChart.setOption(options);
    },
    initRightChart() {
      this.$nextTick(() => {
        const options1 = {
          legend: {
            orient: 'vertical',
            x: 'center',
            y: '75%',
            icon: 'circle',
            data: [this.$t('m.running'), this.$t('m.notRun')],
            formatter: (name) => {
              var index = 0;
              var clientlabels = [this.$t('m.running'), this.$t('m.notRun')];
              var clientcounts = [this.runningCount, this.notRunCount];
              clientlabels.forEach(function (value, i) {
                if (value === name) {
                  index = i;
                }
              });
              var arr = [
                '{a|' + name + '  ' + '}{b|' + clientcounts[index] + '}',
              ];
              return arr;
            },
            textStyle: {
              rich: {
                a: {
                  fontSize: 15,
                  color: this.$themed('neutral7'),
                },
                b: {
                  fontSize: 12,
                  color: this.$themed('neutral8'),
                },
              },
            },
          },
          tooltip: {
            trigger: 'item',
            borderWidth: 0,
            //背景颜色
            backgroundColor: this.$themed('bg-color-1'),
            show: true,
            //tooltip的文本颜色
            textStyle: {
              color: this.$themed('neutral8'),
            },

            formatter: '{b}: {c}',
          },
          graphic: {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '38%',
            style: {
              text: this.$t('m.runState'),
              textAlign: 'center',
              fill: this.$themed('neutral8'),
              fontSize: 13,
            },
          },
          series: [
            {
              name: this.$t('m.accessSource'),
              type: 'pie',
              radius: ['60%', '45%'],
              center: ['50%', '40%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '12',
                    fontWeight: 'bold',
                  },
                },
              },
              itemStyle: {
                normal: {
                  borderColor: this.$themed('neutral0'),
                  borderWidth: 5,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: [
                { value: this.runningCount, name: this.$t('m.running') },
                { value: this.notRunCount, name: this.$t('m.notRun') },
              ],
            },
          ],
          // calculable: false,
          color: [this.$themed('green-color'), this.$themed('primary-color')],
        };
        this.rightChart = this.$echarts.init(
          document.getElementById('rightId'),
        );
        this.rightChart.setOption(options1);
      });
    },
  },
};
</script>
