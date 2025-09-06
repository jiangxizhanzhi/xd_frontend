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
  name: 'HostStatus',
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
        color: ['#07E6CC', '#E04026', '#E68800', '#0BB2FF'],
        grid: {
          top: '13%',
          right: '5%',
          left: '5%',
          bottom: '5%',
          containLabel: true,
        },
        legend: {
          icon: 'circle',
          bottom: '2%',
          left: 'center',
          itemWidth: 8 * rate,
          itemHeight: 8 * rate,
          formatter: ['{a|{name}}'].join('\n'),
          textStyle: {
            fontSize: 12 * rate,
            height: 8 * rate,
            color: 'rgba(255, 255, 255, 0.6)',
            rich: {
              a: {
                verticalAlign: 'bottom',
              },
            },
          },
        },
        series: [
          {
            top: '6%',
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: 'rgba(255, 255, 255, .6)',
              fontSize: 12 * rate,
              formatter: (v) => v.value,
            },
            labelLine: {
              show: true,
            },
            data: [],
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
