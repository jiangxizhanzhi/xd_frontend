<template>
  <div class="flex-fill-col">
    <div ref="divRef" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
import * as echarts from 'echarts';
export default {
  name: 'line-echarts',
  props: {
    color: {
      type: Array,
      default: function () {
        return [
          ['#D3D147', 'rgba(211,209,71,0)'],
          ['#62D2C1', 'rgba(98,210,193,0)'],
          ['#057DEF', 'rgba(5,125,239,0)'],
          ['#65D650', 'rgba(101,214,80,0)'],
        ];
      },
    },
    chartData: {
      type: Array,
      default: function () {
        return [];
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
    let labelSize = 12;
    let legendSize = 14;
    let screen = getScreenInfo();
    let divRef = ref(null);
    watch(props.chartData, (newVal, oldVal) => {
      if (myChart && newVal) {
        initEchart();
      }
    });
    watch(screen, (newVal, oldVal) => {
      labelSize = 12;
      legendSize = 14;
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
      let option,
        xData,
        series = [];
      props.chartData.length && (xData = props.chartData[0].xData || []);
      props.chartData.length &&
        props.chartData.forEach((item, index) => {
          series.push({
            name: item.name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
              color: props.color[index][0],
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: props.color[index][0],
                },
                {
                  offset: 1,
                  color: props.color[index][1],
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: item.yData,
          });
        });

      option = {
        tooltip: {
          show: props.tootipShow,
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          type: 'plain',
          bottom: 0,
          itemHeight: 8,
          itemWidth: 8,
          textStyle: {
            color: '#609BF3',
            fontSize: legendSize,
          },
          icon: 'rect',
        },
        grid: {
          top: '16%',
          left: '3%',
          right: '6%',
          bottom: '23%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#609BF3',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '次',
            nameTextStyle: {
              fontSize: labelSize,
              color: '#609BF3',
              align: 'right',
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: labelSize,
              color: '609BF3',
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#609BF3',
              },
            },
          },
        ],
        series: series,
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
      legendSize,
    };
  },
};
</script>
