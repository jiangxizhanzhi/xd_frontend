<template>
  <div style="width: 100%">
    <cb-echart-line
      ref="cbEchartLineRef"
      :xData="statusLineData.xData"
      :name="name"
      :lineData="statusLineData.yData"
      :grid="grid"
      :legendShow="legendShow"
      :xAxisLine="axisLine"
      :yAxisLine="axisLine"
      :areaStyle="areaStyle"
      :color="color"
      :tooltip="tooltip"
      :symbol="symbol"
      :xAxisLabel="xAxisLabel"
      :yAxisLabel="yAxisLabel"
    ></cb-echart-line>
  </div>
</template>
<script>
export default {
  name: 'real-status',
  props: {
    statusLineData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chartSize: {
        width: '500px',
        height: '400px',
      },
      symbol: 'none',
      color: ['red-color', 'orange-color', 'green-color'],
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      //legend的显示位置
      legendLocation: 'center',
      ySplitLineShow: true,
      legendIcon: '',
      name: [
        this.$t('systemOperation.monitorReplay.cpu'),
        this.$t('systemOperation.monitorReplay.ram'),
        this.$t('systemOperation.monitorReplay.disk'),
      ],
      areaStyle: true,
      /**
       * 每种柱子的颜色和值
       */

      yAxisIndex: [0, 0, 1],

      grid: {
        top: 30,
        bottom: 10,
        left: 50,
        right: 70,
        containLabel: true,
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolSize: [5, 10],
        symbolOffset: [0, 10],
        lineStyle: { color: '#727E9A' },
      },
      xAxisLabel: {
        color: '#fff',
        opacity: 0.4,
        showMaxLabel: true,
        fontSize: 14,
      },
      yAxisLabel: {
        color: '#fff',
        opacity: 0.4,
        fontSize: 14,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#242e43',
        borderWidth: 0,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
            width: 1,
            type: 'solid',
          },
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.cbEchartLineRef.optionSet.legend.textStyle.color =
        'rgba(255, 255, 255, 0.7)';
    });
  },
};
</script>
<style lang="scss" scoped></style>
