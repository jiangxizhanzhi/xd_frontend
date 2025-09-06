<template>
  <div class="resourceContain">
    <div class="resource">
      <div style="width: 100%; height: 100%" class="cy-common-theme__dark">
        <cb-echart-line
          ref="cbEchartLineRef"
          :xData="xData"
          :name="name"
          :lineData="lineData"
          :grid="grid"
          :legendShow="legendShow"
          :xAxisLine="axisLine"
          :yAxisLine="axisLine"
          :areaStyle="areaStyle"
          :color="color"
          :symbol="symbol"
          :tooltip="tooltip"
          :dataZoom="dataZoom"
          :xAxisLabel="xAxisLabel"
          :yAxisLabel="yAxisLabel"
          :yAxisLabelFormatter="yAxisLabelFormatter"
        ></cb-echart-line>
      </div>
    </div>
    <div style="margin-top: 20px">
      <cb-scroll
        ref="table"
        class="scroll-box"
        :data="hostData"
        v-if="hostData.length"
        :classOption="classOption"
        style="height: 300px; overflow: hidden"
      >
        <div class="deailCon">
          <device-info
            v-for="item in hostData"
            :key="item.id"
            :deviceInfoDetail="item"
          ></device-info>
        </div>
      </cb-scroll>
      <div v-else class="no-data-content">
        {{ $t('systemOperation.monitor.noData') }}
      </div>
    </div>
  </div>
</template>

<script>
import DeviceInfo from './detail/device-info';
import LineChartShadowOpcity from './detail/line-chart-shadow-opcity.vue';
export default {
  props: {
    hostData: {
      type: Array,
      default() {
        return [];
      },
    },
    lineData: {
      type: Array,
      default() {
        return [];
      },
    },
    xData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      classOption: {
        limitMoveNum: 4,
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
        this.$t('systemOperation.monitorScene.cpu'),
        this.$t('systemOperation.monitorScene.ram'),
        this.$t('systemOperation.monitorScene.disk'),
      ],
      areaStyle: true,
      grid: {
        top: 35,
        bottom: 10,
        left: 40,
        right: 70,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          show: false,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
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
        showMaxLabel: true, //显示最后一个x轴标签
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
      yAxisLabelFormatter: (val, index) => {
        return val + '%';
      },
    };
  },
  components: {
    DeviceInfo,
    LineChartShadowOpcity,
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.cbEchartLineRef.optionSet.legend.textStyle.color =
        'rgba(255, 255, 255, 0.7)';
    });
  },
};
</script>

<style lang="scss" scoped>
.resourceContain {
  height: calc(100% - 42px);
  .resource {
    height: 55%;
  }
  .deailCon {
    display: flex;
    justify-content: space-evenly;
    flex-flow: row wrap;
    height: 45%;
    margin-left: 20px;
  }
  .no-data-content {
    text-align: center;
    line-height: 100px;
  }
}
</style>
