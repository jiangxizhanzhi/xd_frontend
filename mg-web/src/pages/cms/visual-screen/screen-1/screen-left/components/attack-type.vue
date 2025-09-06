<template>
  <div class="flex-fill-col">
    <div ref="divRef" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
import * as echarts from 'echarts';
export default {
  name: 'attack-type',
  props: {
    chartData: {
      type: Array,
      default: function () {
        return [
          {
            name: '应用漏洞扫描',
            value: 40,
          },
          {
            name: '拒绝服务攻击',
            value: 25,
          },
          {
            name: '电子服务攻击',
            value: 10,
          },
          {
            name: '端口扫描',
            value: 50,
          },
          {
            name: '应用漏洞攻击',
            value: 26,
          },
          {
            name: '口令攻击',
            value: 38,
          },
          {
            name: '启动项变更',
            value: 31,
          },
          {
            name: '安装后门',
            value: 15,
          },
        ];
      },
    },
    color: {
      type: Array,
      default: function () {
        return [
          ['rgba(126, 95, 236, 0.74)', 'rgba(190, 114, 242, 0.3)'],
          ['#64D7FB', 'rgba(45, 210, 222, 0.3)'],
          ['#3BD685', 'rgba(59, 214, 133, 0.3)'],
          ['#BE76EF', 'rgba(50, 111, 202, 0.3)'],
          ['#00A9F7', 'rgba(0, 169, 247, 0.3)'],
          ['#F7D35A', 'rgba(246, 211, 90, 0.3)'],
          ['#3BD685', 'rgba(59, 214, 133, 0.3)'],
          ['#2DCDD9', '#2EDAE5'],
        ];
      },
    },
    barWidth: {
      type: Number,
      default: 14,
    },
    labelColor: {
      type: String,
      default: '#609BF3',
    },
    outBgColor: {
      type: String,
      default: '#25386A',
    },
  },
  setup(props) {
    let myChart = null;
    let debounceId = null;
    let labelSize = 14;
    let screen = getScreenInfo();
    let divRef = ref(null);
    watch(props.chartData, (newVal, oldVal) => {
      if (myChart && newVal) {
        initEchart();
      }
    });
    watch(screen, (newVal, oldVal) => {
      labelSize = 14;
      initEchart();
    });
    onMounted(() => {
      initEchart();
      debounceId = _.debounce(() => {
        if (myChart) {
          myChart.resize();
        }
      }, 300);
      window.addEventListener('resize', debounceId);
    });
    onBeforeUnmount(() => {
      if (myChart) {
        myChart.dispose();
        myChart = null;
      }
      window.removeEventListener('resize', debounceId);
    });

    function initEchart() {
      myChart = echarts.init(divRef.value);
      let option;
      let yName = props.chartData.map((item) => item.name);
      let xData = props.chartData.map((item) => item.value);

      option = {
        xAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        grid: {
          containLabel: true,
          left: '3%',
          top: 0,
          right: '6%',
          bottom: '3%',
        },
        yAxis: [
          {
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: labelSize,
                color: props.labelColor,
              },
            },
            data: yName,
          },
        ],
        series: [
          {
            //内
            type: 'bar',
            barWidth: props.barWidth,
            legendHoverLink: false,
            symbolRepeat: true,
            silent: true,
            data: props.chartData,
            z: 1,
            animationEasing: 'elasticOut',
            itemStyle: {
              normal: {
                // barBorderRadius: 2,
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  let index = params.dataIndex;
                  if (params.dataIndex >= props.color.length) {
                    index = params.dataIndex - props.color.length;
                  }
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      offset: 0,
                      color: props.color[index][0],
                    },
                    {
                      offset: 1,
                      color: props.color[index][1],
                    },
                  ]);
                },
              },
            },
          },
          {
            // 背景
            type: 'pictorialBar',
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '20%',
            symbol: 'roundRect',
            symbolSize: [4, props.barWidth],
            itemStyle: {
              normal: {
                color: props.outBgColor,
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            data: xData,
            z: 0,
            animationEasing: 'elasticOut',
          },
          {
            //分隔
            type: 'pictorialBar',
            itemStyle: {
              color: '#272647',
            },
            symbolRepeat: 'fixed',
            symbolMargin: 2,
            symbol: 'roundRect',
            symbolClip: true,
            symbolSize: [2, props.barWidth],
            symbolPosition: 'start',
            symbolOffset: [-3, 0],
            data: props.chartData,
            z: 2,
            animationEasing: 'elasticOut',
          },
        ],
      };
      option && myChart.setOption(option);
      myChart.resize();
    }
    return {
      myChart,
      debounceId,
      divRef,
      screen,
      labelSize,
    };
  },
};
</script>
