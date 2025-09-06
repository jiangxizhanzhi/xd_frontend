<template>
  <div class="chart-wrapper" ref="attackRef"></div>
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
  name: 'AttackCount',
  props: {
    model: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop) {
    const attackRef = ref(null);
    const rate = inject('rate', 1);
    let chart;

    let split = {
      value: 1,
      name: '',
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      itemStyle: {
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
      },
    };

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
      legend: {
        top: 'bottom',
        data: [],
        textStyle: {
          color: '#ffffff',
          fontSize: 12 * rate,
        },
      },
      series: [
        {
          name: '攻击次数统计',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['50%', '40%'],
          minAngle: 2,
          data: [],
          itemStyle: {
            borderColor: '#0e2c63',
            borderWidth: 3,
          },
          label: {
            show: true,
            color: '#ffffff',
            fontSize: 12 * rate,
            formatter: (v) => {
              return v.value + '次';
            },
          },
        },
      ],
    };

    const setOption = (model) => {
      option.legend.data = model.map((el) => el.name);
      let data = [];
      model.forEach((el) => {
        data.push(el);
      });
      option.series[0].data = data;
      chart?.setOption(option);
    };

    watch(
      () => prop.model,
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
