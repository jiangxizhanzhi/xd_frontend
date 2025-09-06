<template>
  <div ref="myChart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
import {
  onMounted,
  watch,
  ref,
  reactive,
  onBeforeUnmount,
} from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
import * as echarts from 'echarts';
export default {
  name: 'BarChart',
  props: {
    barData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    let myChart = ref(null);
    let mineChart = null;
    let debounceId = null;
    function drawLine() {
      mineChart = echarts.init(myChart.value);
      // 绘制图表
      mineChart.setOption({
        xAxis: {
          type: 'category',
          data: ['待评估', '成功', '失败', '驳回'],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#818595',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          show: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#818595',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        series: [
          {
            // data: [120, 200, 150, 80],
            data: props.barData,
            type: 'bar',
            barWidth: 14, //柱图宽度
            itemStyle: {
              normal: {
                color: ' #85E3A5', //状态图颜色，
              },
            },
          },
        ],
        grid: {
          top: 18,
          left: '10%',
          bottom: '18%',
        },
      });

      mineChart.resize();
    }
    // onMounted(() => {

    //   drawLine();
    // });
    onMounted(() => {
      drawLine();
      debounceId = _.debounce(() => {
        if (mineChart) {
          mineChart.resize();
        }
      }, 300);
      window.addEventListener('resize', debounceId);
    });
    onBeforeUnmount(() => {
      if (mineChart) {
        mineChart.dispose();
        mineChart = null;
      }
      window.removeEventListener('resize', debounceId);
    });
    watch(props, (val, oldval) => {
      if (val) props.barData = val.barData;
      drawLine();
    });
    return {
      drawLine,
      myChart,
      debounceId,
      mineChart,
    };
  },
};
</script>

<style scoped></style>
