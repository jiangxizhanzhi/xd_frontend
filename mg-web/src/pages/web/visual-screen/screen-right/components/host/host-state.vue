<template>
  <div class="flex-fill-col" ref="hostState"></div>
</template>
<script>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
export default {
  props: {
    assetItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    let data = [
      {
        name: '受控',
        value: 1,
      },
      {
        name: '正常',
        value: 1,
      },
      {
        name: '中风险',
        value: 4,
      },
      {
        name: '低风险',
        value: 5,
      },
      {
        name: '疑似受控',
        value: 9,
      },
    ];
    let chart = null;
    let hostState = ref(null);
    let screen = getScreenInfo();

    const initChart = () => {
      chart = echarts.init(hostState.value);
      let option = {
        grid: {
          left: '0',
          right: '0',
          bottom: '30%',
          top: '35%',
          containLabel: false,
        },
        xAxis: {
          type: 'category',
          data: data.map((el) => el.name),
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 12,
            margin: 10,
          },
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data: data,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              borderColor: '#006BD0',
              borderWidth: 3,
              color: 'transparent',
            },
            itemStyle: {
              borderWidth: 5,
              borderColor: '#006BD0',
              color: '#2160AE',
            },
            // 柱状图柱子宽度
            barWidth: '24%',
            silent: true,
          },
          {
            data: data,
            type: 'pictorialBar',
            label: {
              show: true,
              position: 'top',
              offset: [0, 0],
              color: '#5FEE91',
              fontSize: 16,
              fontWeight: 'bold',
              formatter: (params) => {
                return data[params.dataIndex].value;
              },
            },
            itemStyle: {
              color: 'transparent',
            },
            animation: false,
          },
        ],
      };
      chart.setOption(option);
      let max = chart.getModel().getComponent('yAxis').axis.scale._extent[1];
      option.series[1].data = data.map(() => max);
      chart.setOption(option);
    };

    watch(screen, () => {
      if (chart && chart.resize) {
        chart.resize();
      } else {
        initChart();
      }
    });

    onMounted(() => {
      initChart();
    });

    return {
      screen,
      hostState,
      chart,
    };
  },
};
</script>
