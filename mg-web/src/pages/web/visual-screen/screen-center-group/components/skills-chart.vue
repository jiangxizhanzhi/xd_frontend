<template>
  <div ref="mineChart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts';
import {
  onMounted,
  watch,
  ref,
  reactive,
  onBeforeUnmount,
} from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
export default {
  name: 'SkillsChart',
  props: {
    skillTypeData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    let mineChart = ref(null);
    let debounceId = null;
    let myChart = null;
    function drawLine() {
      let yData = [];
      let xData = [];
      props.skillTypeData.length &&
        props.skillTypeData.forEach((item) => {
          yData.push(item.name);
          xData.push(item.count);
        });
      myChart = echarts.init(mineChart.value);
      // 绘制图表
      myChart.setOption({
        grid: {
          top: 15,
          left: '4%',
          right: '4%',
          bottom: '6%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'category',
          data: yData,
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
          // splitLine: {
          //   show: false,
          // },
        },
        series: [
          {
            type: 'bar',
            data: xData,
            barWidth: 4, //柱图宽度
            itemStyle: {
              normal: {
                color: '#E59538', //状态图颜色，
              },
            },
          },
        ],
      });
    }
    watch(props, (val, oldval) => {
      if (val && val.skillTypeData) props.skillTypeData = val.skillTypeData;
      drawLine();
    });
    onMounted(() => {
      drawLine();
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
    return {
      drawLine,
      mineChart,
    };
  },
};
</script>

<style scoped></style>
