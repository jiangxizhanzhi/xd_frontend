<template>
  <div class="pie">
    <cb-iconfont
      type="icon-hongfang"
      v-if="lineColor === 'red'"
      size="50"
    ></cb-iconfont>
    <cb-iconfont
      type="icon-lanfang"
      v-else="lineColor === 'blue'"
      size="50"
    ></cb-iconfont>
    <div
      ref="myChart"
      :style="{ width: '100%', height: '100%' }"
      class="pieChart"
    ></div>
  </div>
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
  name: 'TaskStatusPie',
  props: {
    pieData: {
      type: Array,
      default: () => [],
    },
    lineColor: {
      type: String,
      default: 'red',
    },
  },

  setup(props) {
    let myChart = ref(null);
    let mineChart = null;
    let debounceId = null;
    let pieBlueColor = [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#000', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#fff', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#000', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#11D4BB', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#92FCA4', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#000', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#5EA0F1', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#000', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    ];
    //饼图颜色  红方
    let pieRedColor = [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#000', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#fff', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#000', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'yellow', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgb(241,161,91)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#000', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'red', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#000', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    ];

    // 方法
    function drawLine() {
      // 基于准备好的dom，初始化echarts实例
      mineChart = echarts.init(myChart.value);
      mineChart.setOption({
        tooltip: {
          trigger: 'item',
          show: false,
        },
        legend: {
          show: false,
        },
        color: props.lineColor === 'red' ? pieRedColor : pieBlueColor,
        series: [
          {
            name: '外圆环',
            radius: ['55%', '60%'],
            type: 'pie',
            silent: true,
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            animation: false,
            tooltip: {
              show: false,
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  color: 'rgba(45,53,62)',
                },
              },
            ],
          },
          {
            name: '内边框',
            radius: ['35%', '40%'],
            type: 'pie',
            silent: true,
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            animation: false,
            tooltip: {
              show: false,
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  color: 'rgba(45,53,62)',
                },
              },
            ],
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '55%'],
            avoidLabelOverlap: false,
            silent: true,

            //外面字体
            label: {
              normal: {
                padding: [0, 0, 0, 0],
                formatter: (params) => {
                  if (props.lineColor === 'red') {
                    if (params?.data?.type && params?.data?.type == 1) {
                      return `{type1|${params.percent}%}\n{type1|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 2) {
                      return `{type2|${params.percent}%}\n{type2|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 3) {
                      return `{type3|${params.percent}%}\n{type3|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 4) {
                      return `{type4|${params.percent}%}\n{type4|${params.data.name}}`;
                    }
                  } else {
                    //蓝色
                    if (params?.data?.type && params?.data?.type == 1) {
                      return `{type5|${params.percent}%}\n{type5|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 2) {
                      return `{type6|${params.percent}%}\n{type6|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 3) {
                      return `{type7|${params.percent}%}\n{type7|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 4) {
                      return `{type8|${params.percent}%}\n{type8|${params.data.name}}`;
                    }
                  }
                },
                rich: {
                  type1: {
                    color: '#fff',
                    fontSize: 14,
                  },
                  type2: {
                    color: 'yellow',
                    fontSize: 14,
                  },
                  type3: {
                    color: 'rgb(241,161,91)',
                    fontSize: 14,
                  },
                  type4: {
                    color: 'red',
                    fontSize: 14,
                  },
                  type5: {
                    color: '#fff',
                    fontSize: 14,
                  },
                  type6: {
                    color: '#11D4BB',
                    fontSize: 14,
                  },
                  type7: {
                    color: '#92FCA4',
                    fontSize: 14,
                  },
                  type8: {
                    color: '#5EA0F1',
                    fontSize: 14,
                  },
                },
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '10',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: props.pieData,
          },
        ],
      });

      mineChart.resize();
    }
    onMounted(() => {
      drawLine();
      debounceId = _.debounce(() => {
        if (mineChart) {
          mineChart.resize();
        }
      }, 300);
      window.addEventListener('resize', debounceId);
    });

    watch(props, (val, oldval) => {
      if (val) props.pieData = val.pieData;
      drawLine();
    });

    onBeforeUnmount(() => {
      if (mineChart) {
        mineChart.dispose();
        mineChart = null;
      }
      window.removeEventListener('resize', debounceId);
    });

    return {
      mineChart,
      debounceId,
      pieBlueColor,
      pieRedColor,
      drawLine,
      myChart,
    };
  },
};
</script>

<style scoped lang="scss">
.pie {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: -30px;
  .cb-iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
