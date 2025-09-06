<template>
  <div class="chart-wrapper" ref="attackRef"></div>
</template>
<script>
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  inject,
} from '@vue/composition-api';
import * as echarts from 'echarts';
export default defineComponent({
  name: 'AttackFlow',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop) {
    const attackRef = ref(null);
    const rate = inject('rate', 1);
    let chart;
    const option = {
      color: ['#0CD39C'],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 12 * rate,
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },

      grid: {
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        name: '/s',
        nameGap: 0,
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(85, 183, 255, 0.2)',
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
      },
      yAxis: {
        name: '/kb',
        nameGap: 0,
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(85, 183, 255, 0.2)',
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
      },
      series: [
        {
          name: '流量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(12, 211, 156, 0.3)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(12, 211, 156, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: [],
        },
      ],
    };

    const setOption = (data) => {
      option.xAxis.data = data.map((el) => el.name);
      option.series[0].data = data;
      chart?.setOption(option);
    };

    watch(
      () => prop.data,
      (val) => {
        setOption(val);
      },
      {
        immediate: true,
        deep: true,
      },
    );

    onMounted(() => {
      chart = echarts.init(attackRef.value);
      chart.setOption(option);
    });

    return {
      attackRef,
    };
  },
});
</script>
<style lang="scss" scoped></style>
