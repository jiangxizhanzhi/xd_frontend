<template>
  <div class="chart-wrapper" ref="statictisRef"></div>
</template>
<script>
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  inject,
} from '@vue/composition-api';
import * as echarts from 'echarts';
export default defineComponent({
  name: 'Statistic',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop) {
    const statictisRef = ref(null);
    let chart;
    const rate = inject('rate', 1);

    const option = {
      color: [
        '#4491FF',
        '#0CD39C',
        '#3DC7EC',
        '#3D72EC',
        '#9861C3',
        '#FFB400',
        '#F25549',
        '#92ACD8',
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 12 * rate,
        },
      },
      legend: {
        data: [],
        bottom: 0,
        textStyle: {
          color: '#ffffff',
          fontSize: 12 * rate,
        },
      },
      grid: {
        top: 0,
        left: 0,
        right: '5%',
        bottom: 60 * rate,
        containLabel: true,
      },
      xAxis: {
        name: '分',
        nameGap: 0,
        type: 'value',
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(85, 183, 255, 0.2)',
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: ['网络侦查', '抵近分析', '外网突破', '里应外合', '内网失陷'],
        axisLabel: {
          formatter: (v) => {
            return v.split('').join('\n');
          },
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12 * rate,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(85, 183, 255, 0.2)',
          },
        },
      },
      series: [],
    };

    const setOption = (data) => {
      option.legend.data = data.map((el) => el.name);
      option.series = data.map((el) => {
        return {
          name: el.name,
          type: 'bar',
          data: el.data,
          barCategoryGap: '5px',
        };
      });
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
      chart = echarts.init(statictisRef.value);
      chart.setOption(option);
    });

    return {
      statictisRef,
    };
  },
});
</script>
<style lang="scss" scoped></style>
