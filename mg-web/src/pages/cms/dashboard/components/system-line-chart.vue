<template>
  <div class="chartDiv">
    <cb-echart-line
      v-if="ready"
      :yAxisLabelFormatter="yAxisLabelFormatter"
      :ySplitLineShow="ySplitLineShow"
      :legendShow="legendShow"
      :xData="xData"
      :name="name"
      :lineData="lineData"
      :symbol="symbol"
      :toolTipFormatter="toolTipFormatter"
      :areaStyle="true"
      :color="color"
      :grid="grid"
      :smooth="true"
    ></cb-echart-line>
  </div>
</template>

<script>
export default {
  name: 'line2',
  data() {
    return {
      ready: false,
      color: ['green-color', 'orange-color', 'primary-color'],
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      //legend的显示位置
      legendLocation: 'center',
      symbol: 'none',
      ySplitLineShow: true,
      legendIcon: 'rect',
      name: [
        this.$t('dashboard.cpu'),
        this.$t('dashboard.ram'),
        this.$t('dashboard.disk'),
      ],
      xData: [],
      yAxisIndex: [0, 0, 1],
      lineData: [],
      yAxisLabelFormatter: (val, index) => {
        return val + '%';
      },
      toolTipFormatter: '',
      grid: {
        right: '4%',
        left: '2%',
        bottom: '3%',
        containLabel: true,
      },
    };
  },
  created() {
    this.$request
      .get('/cscene/monitor/hoststate/cluster_trend', null, {
        baseURL: '/api/mp',
      })
      .then((res) => {
        const list = _.get(res, 'data.data', []);
        const lineDataCpu = [],
          lineDataMemory = [],
          lineDataDisk = [],
          xDataTime = [];
        list.forEach((item) => {
          xDataTime.push(item.time.substr(11, 5));
          // cpu
          lineDataCpu.push(item.cpu_percent);
          // 内存
          lineDataMemory.push(item.memory_percent);
          //硬盘
          lineDataDisk.push(item.disk_percent);
        });
        this.xData = xDataTime;
        this.lineData.push(lineDataCpu);
        this.lineData.push(lineDataMemory);
        this.lineData.push(lineDataDisk);

        this.toolTipFormatter = (params) => {
          var relVal = params[0].name;
          for (var i = 0, l = params.length; i < l; i++) {
            relVal +=
              '<br/>' +
              params[i].marker +
              params[i].seriesName +
              ' ' +
              params[i].value +
              '%';
          }
          return relVal;
        };
        this.ready = true;
      });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.chartDiv {
  width: 100%;
  height: calc(100% - 21px);
}
</style>
