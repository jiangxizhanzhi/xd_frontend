<template>
  <div class="chartDiv">
    <cb-echart-line
      class="chart-line"
      :legendShow="legendShow"
      v-if="ready"
      :ySplitLineShow="ySplitLineShow"
      :name="name"
      :lineData="barData"
      :xData="xData"
      :color="color"
      :barWidth="barWidth"
      :smooth="true"
      :grid="grid"
      :areaStyle="true"
      symbol="none"
    ></cb-echart-line>
  </div>
</template>

<script>
export default {
  name: 'line2',
  data() {
    return {
      ready: false,
      x2y: false,
      xAxisLineShow: true,
      ySplitLineShow: true,
      legendShow: true,
      barWidth: '19px',
      color: ['primary-color', 'green-color'],
      name: [this.$t('dashboard.user'), this.$t('dashboard.sceneData')],
      xData: [],
      barData: [],
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
      .get('/agg/dashboard/daily_user_activity', null, {
        baseURL: '/api/mp',
      })
      .then((res) => {
        const dailyData = res.data.data;
        this.xData = dailyData.xaxis;

        this.barData.push(dailyData.user_count);
        this.barData.push(dailyData.scene_count);
        this.ready = true;
      });
  },
};
</script>
<style lang="scss" scoped>
.chartDiv {
  width: 100%;
  height: calc(100% - 20px);
  position: relative;
  .chart-line {
    // width: calc(100% - 20px) !important;
  }
}
</style>
