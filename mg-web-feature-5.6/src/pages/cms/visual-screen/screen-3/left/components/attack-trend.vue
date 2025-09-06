<template>
  <div class="chart-wrapper" ref="attackRef"></div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  inject,
} from '@vue/composition-api';
import * as echarts from 'echarts';
export default defineComponent({
  name: 'AttackTrend',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const attackRef = ref(null);
    const rate = inject('rate', 1);

    let chart;

    const setOption = (data) => {
      chart?.setOption({
        xAxis: {
          data: data.map((el) => el.name),
        },
        series: [
          {
            data: data,
          },
        ],
      });
    };

    watch(() => props.data, setOption, { immediate: true, deep: true });

    onMounted(() => {
      chart = echarts.init(attackRef.value);
      chart.setOption({
        grid: {
          top: '12%',
          right: '5%',
          left: '5%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(85, 183, 255, 0.2)',
            },
          },
          axisLabel: {
            fontSize: 12 * rate,
            color: 'rgba(255, 255, 255, 0.6)',
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          name: '次',
          nameGap: 8,
          nameTextStyle: {
            padding: [0, 8, 0, 0],
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 12 * rate,
          },
          axisLabel: {
            fontSize: 12 * rate,
            color: 'rgba(255, 255, 255, 0.6)',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(85, 183, 255, 0.2)',
            },
          },
        },
        series: [
          {
            type: 'line',
            symbolSize: 0,
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
                    color: 'rgba(7, 230, 204, .5)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(7, 230, 204, 0)', // 100% 处的颜色
                  },
                ],
              },
            },
            lineStyle: {
              color: '#07E6CC',
              width: 1,
            },
          },
        ],
      });
    });

    return {
      attackRef,
    };
  },
});
</script>
<style lang="scss" scoped></style>
