<template>
  <div ref="divRef" style="height: 100%; width: 100%" v-loading="loading"></div>
</template>

<script>
import * as Echarts from 'echarts';
import { talentTrend } from '@/api/person-training-screen';
import _ from 'lodash';
export default {
  data() {
    return {
      myChart: null,
      loading: false,
      option: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#000',
          borderWidth: 0,
          textStyle: {
            color: '#FFFFFF',
          },
          axisPointer: {
            lineStyle: {
              color:
                'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
              width: 1,
              type: 'solid',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: 'rgba(255,255,255,0.6000)',
              showMaxLabel: true, //显示最后一个x轴标签
              fontSize: 12,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#55B7FF',
              },
            },

            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: 'rgba(255,255,255,0.6000)',
              showMaxLabel: true, //显示最后一个x轴标签
              fontSize: 12,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#55B7FF',
              },
            },
          },
        ],
        series: [
          {
            name: this.$t('personTrainingScreen.EligiblePeople'),
            type: 'line',
            stack: 'Total',
            color: '#448AFF',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getTalentTrend();
  },
  methods: {
    getTalentTrend() {
      this.loading = true;
      talentTrend().then((res) => {
        this.loading = true;
        const data = _.get(res, 'data.data');
        const xData = data.xdates;
        const yData = data.ynums;
        this.option.xAxis[0].data = xData;
        this.option.series[0].data = yData;
        this.loadEchart();
      });
    },
    loadEchart() {
      this.$nextTick(() => {
        this.myChart = Echarts.init(this.$refs.divRef);
        this.myChart.setOption(this.option);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
