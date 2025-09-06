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
  name: 'attack-echarts',
  props: {
    color: {
      type: Array,
      default: function () {
        return [
          ['#39EFFF', '#3AA5FF'],
          ['#85ECEB', '#3AA5FF'],
          ['#48B7F6', '#3AA5FF'],
          ['#7D61DA', '#3AA5FF'],
          ['#B674F3', '#3AA5FF'],
        ];
      },
    },
    labelColor: {
      type: Array,
      default: function () {
        return ['#609BF3', '#F5A45B'];
      },
    },
    echartsData: {
      type: Array,
      default: function () {
        return [
          {
            value: 17,
            name: '病毒',
          },
          {
            value: 17,
            name: '钓鱼',
          },
          {
            value: 22,
            name: '诈骗',
          },
          {
            value: 15,
            name: 'APT',
          },
          {
            value: 10,
            name: 'DDOS',
          },
        ];
      },
    },
    radius: {
      type: Array,
      default: function () {
        return ['55%', '70%'];
      },
    },
    tootipShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let myChart = null;
    let debounceId = null;
    let labelSize = 14;
    let screen = getScreenInfo();
    let divRef = ref(null);
    watch(props.echartsData, (newVal, oldVal) => {
      if (myChart && newVal) {
        initEchart();
      }
    });
    watch(screen, (newVal, oldVal) => {
      labelSize = 14;
      initEchart();
    });

    function initEchart() {
      myChart = echarts.init(divRef.value);
      let option;

      option = {
        tooltip: {
          show: props.tootipShow,
          trigger: 'item',
        },
        series: [
          {
            name: '攻防统计',
            type: 'pie',
            radius: props.radius,
            avoidLabelOverlap: false,
            label: {
              show: true,
              // formatter: '{d}%\n{time|{b}}',
              formatter: function (data) {
                let a = data.name;
                let b = data.percent.toFixed(0) + '%';
                let c = b + '\n' + `{time|${a}}`;
                return c;
              },
              fontSize: props.labelSize,
              color: props.labelColor[0],
              rich: {
                time: {
                  fontSize: props.labelSize,
                  color: props.labelColor[1],
                },
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let index = params.dataIndex;
                  if (params.dataIndex >= props.color.length) {
                    index = params.dataIndex - props.color.length;
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
            labelLine: {
              show: false,
            },
            emphasis: {
              scale: false,
            },
            data: props.echartsData,
          },
          {
            name: '攻防统计',
            type: 'pie',
            color: 'rgba(30,53,95,.4)',
            cursor: 'default',
            radius: ['0%', '40%'],
            avoidLabelOverlap: false,
            labelLine: {
              show: false,
            },
            emphasis: {
              scale: false,
            },
            cursor: 'default',
            data: [1],
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.resize();
    }
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

<style lang="scss" scoped></style>
