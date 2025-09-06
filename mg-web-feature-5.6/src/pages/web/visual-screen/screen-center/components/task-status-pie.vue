<template>
  <div class="pie">
    <div
      ref="myChart"
      :style="{ width: '100%', height: '100%' }"
      class="pieChart"
    ></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { onMounted, watch, ref, onBeforeUnmount } from '@vue/composition-api';
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
    let iconSize = ref(50);
    // type6: {
    //                 color: '#FFB1E4',
    //                 fontSize: 12,
    //               },
    //               type7: {
    //                 color: '#92FCA4',
    //                 fontSize: 12,
    //               },
    //               type8: {
    //                 color: '#11D4BB',
    //                 fontSize: 12,
    //               },
    //               type9: {
    //                 color: '#F1FBCA',
    //                 fontSize: 12,
    //               },
    //               type10: {
    //                 color: '#9FA8F8',
    //                 fontSize: 12,
    //               },
    let pieBlueColor = ['#11D4BB', '#FFB1E4', '#92FCA4', '#F1FBCA', '#9FA8F8'];
    //饼图颜色  红方
    let pieRedColor = ['#FCF5C8', '#6F64FB', '#DED320', '#F5A45B', '#F15E5F'];

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
          orient: 'vertical',
          left: 'left',
          icon: 'roundRect',
          itemHeight: 4,
          itemWidth: 8,
          top: 30,
          left: 20,
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        color: props.lineColor === 'red' ? pieRedColor : pieBlueColor,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '45%'],
            center: ['60%', '50%'],
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
                    } else if (params?.data?.type && params?.data?.type == 5) {
                      return `{type5|${params.percent}%}\n{type5|${params.data.name}}`;
                    }
                  } else {
                    //蓝色
                    if (params?.data?.type && params?.data?.type == 1) {
                      return `{type9|${params.percent}%}\n{type9|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 2) {
                      return `{type6|${params.percent}%}\n{type6|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 3) {
                      return `{type7|${params.percent}%}\n{type7|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 4) {
                      return `{type8|${params.percent}%}\n{type8|${params.data.name}}`;
                    } else if (params?.data?.type && params?.data?.type == 5) {
                      return `{type10|${params.percent}%}\n{type10|${params.data.name}}`;
                    }
                  }
                },
                rich: {
                  type1: {
                    color: '#F5A45B',
                    fontSize: 12,
                  },
                  type2: {
                    color: '#6F64FB',
                    fontSize: 12,
                  },
                  type3: {
                    color: '#DED320',
                    fontSize: 12,
                  },
                  type4: {
                    color: '#FCF5C8',
                    fontSize: 12,
                  },
                  type5: {
                    color: '#F15E5F',
                    fontSize: 12,
                  },
                  type6: {
                    color: '#FFB1E4',
                    fontSize: 12,
                  },
                  type7: {
                    color: '#92FCA4',
                    fontSize: 12,
                  },
                  type8: {
                    color: '#11D4BB',
                    fontSize: 12,
                  },
                  type9: {
                    color: '#F1FBCA',
                    fontSize: 12,
                  },
                  type10: {
                    color: '#9FA8F8',
                    fontSize: 12,
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
              show: true,
              normal: {
                length: 20,
                length2: 0,
              },
            },
            data: props.pieData,
          },
        ],
      });

      mineChart.resize();
    }

    function getIconSize() {
      iconSize.value = parseInt(myChart.value.offsetHeight * 0.35);
    }
    onMounted(() => {
      drawLine();
      getIconSize();
      debounceId = _.debounce(() => {
        if (mineChart) {
          mineChart.resize();
          getIconSize();
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
      iconSize,
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
