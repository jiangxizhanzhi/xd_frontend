<template>
  <div class="flex-fill-col">
    <div ref="divRef" style="height: 100%; width: 99.9%"></div>
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
  name: 'attack-stage',
  props: {
    color: {
      type: Array,
      default: function () {
        return ['rgba(92, 180, 247, 0.4)', 'rgba(140, 242, 170, 0.9)'];
      },
    },
    echartsData: {
      type: Array,
      default: function () {
        return [18203, 83489, 29034, 64970, 111744];
      },
    },
    yData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tootipShow: {
      type: Boolean,
      default: false,
    },
    barWidth: {
      type: Number,
      default: 14,
    },
  },
  setup(props) {
    let myChart = null;
    let debounceId = null;
    let labelSize = 12;
    let screen = getScreenInfo();
    let divRef = ref(null);
    watch(props.echartsData, (newVal, oldVal) => {
      if (myChart && newVal) {
        initEchart();
      }
    });
    watch(screen, (newVal, oldVal) => {
      labelSize = 12;
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
      let yData = ['角色1', '角色2', '角色3', '角色4', '角色5'];

      option = {
        tooltip: {
          show: props.tootipShow,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        color: props.color,
        grid: {
          top: 0,
          left: '1%',
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: labelSize,
            color: '#609BF3',
          },
          data: yData,
        },
        series: [
          {
            name: '攻击阶段',
            type: 'bar',
            barWidth: props.barWidth,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: props.color[0],
                  },
                  {
                    offset: 1,
                    color: props.color[1],
                  },
                ]),
              },
            },
            data: props.echartsData,
          },
          {
            type: 'scatter',
            name: '条形',
            symbol: 'roundRect',
            symbolSize: [2, 14],
            symbolOffset: [6, 0],
            symbolKeepAspect: true,
            color: props.color[1],
            data: props.echartsData,
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
