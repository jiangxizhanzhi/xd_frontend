<template>
  <div>
    <div class="container">
      <div id="echart"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScorePie',
  data() {
    return {};
  },
  props: {
    scoreData: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  mounted() {
    this.getLoadEcharts();
  },
  watch: {
    scoreData(newValue, oldValue) {
      // this.scoreData = newValue
      this.getLoadEcharts();
    },
  },
  methods: {
    getLoadEcharts() {
      let myChart = this.$echarts.init(document.getElementById('echart'));
      let option = {
        title: [
          {
            text: `${Math.round(this.scoreData)}`, //分数四舍五入
            // subtext: '综合得分',
            subtext: this.$t('rbt.compositeScore'),

            x: 'center',
            y: '24%',
            textStyle: {
              fontSize: '24',
              color: this.$themed('--primary-color'),
              foontWeight: '600',
            },
            subtextStyle: {
              fontSize: 14,
              color: this.$themed('--neutral6'),
            },
          },
        ],
        // backgroundColor: 'red',
        polar: {
          radius: ['90%', '100%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 4,
            showBackground: true,
            backgroundStyle: {
              color: this.$themed('--neutral1'),
            },
            data: [this.scoreData],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: this.$themed('--primary-color'),
              },
            },
          },
          {
            name: '',
            type: 'pie',
            startAngle: 80,
            radius: ['78%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              color: this.$themed('--bg-color-4'),
            },
            data: [100],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style scoped>
.container {
  width: 100px;
  height: 100px;
  position: relative;
}
#echart {
  width: 100%;
  height: 100%;
}
</style>
