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
      :minInterval="minInterval"
      symbol="none"
    ></cb-echart-line>
  </div>
</template>

<script>
import { getStudyRecord } from '@/api/personal';
export default {
  name: 'line2',
  data() {
    return {
      minInterval: 1,
      ready: false,
      x2y: false,
      xAxisLineShow: true,
      ySplitLineShow: true,
      legendShow: true,
      barWidth: '19px',
      color: ['primary-color', 'green-color'],
      name: [
        this.$t('personal.course'),
        this.$t('personal.experimentalReport'),
      ],
      xData: [],
      barData: [],
      grid: {
        top: '15%',
        right: '3%',
        left: '1.5%',
        bottom: '8%',
        containLabel: true,
      },
    };
  },
  methods: {
    getStudyRecordEcharts() {
      getStudyRecord().then((res) => {
        const dailyData = res.data.data;
        this.xData = dailyData.xnames;
        this.barData.push(dailyData.yfirst_values);
        this.barData.push(dailyData.ysecond_values);
        this.ready = true;
      });
    },
  },
  created() {
    this.getStudyRecordEcharts();
  },
};
</script>
<style lang="scss" scoped>
.chartDiv {
  width: 100%;
  height: calc(100% - 20px);
}
</style>
