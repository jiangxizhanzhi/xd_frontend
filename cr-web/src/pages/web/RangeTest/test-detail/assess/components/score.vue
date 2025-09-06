<template>
  <div>
    <div class="container">
      <div id="echart"></div>
      <img id="img" :src="backImg" alt="" />
    </div>
  </div>
</template>
<script>
import backImg from './../assets/back-new.png';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';

export default {
  name: 'ScorePie',
  data() {
    return {
      backImg,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  props: {
    scoreData: {
      type: String,
      default() {
        return '0';
      },
    },
  },
  mounted() {
    this.getLoadEcharts();
  },
  watch: {
    scoreData(val) {
      this.getLoadEcharts();
    },
  },

  methods: {
    getLoadEcharts() {
      let myChart = this.$echarts.init(document.getElementById('echart'));
      let option = {
        title: [
          {
            text: this.scoreData !== 'undefined' ? `${this.scoreData}%` : '-',
            x: 'center',
            y: '25%',
            textStyle: {
              fontSize: '25',
              color: this.$themed('--neutral8'),
              fontFamily: 'DINAlternate-Bold, DINAlternate',
              fontWeight: '600',
            },
          },
        ],
        backgroundColor: this.$themed('--bg-color-2'),
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
            barWidth: 2,
            showBackground: true,
            backgroundStyle: {
              color: this.$themed('--primary-color-2'),
              //剩余百分比
            },
            data: [this.scoreData],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: this.$themed('--primary-color'),
                //所占百分比
              },
            },
          },
          {
            name: '',
            type: 'pie',
            startAngle: 80,
            radius: ['85%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              color: this.$themed('--primary-color-2'), //内圈背景色
            },
            data: [100],
          },
        ],
      };
      myChart.setOption(option);
    },
    listenFunc() {
      this.getLoadEcharts();
    },
  },
  created() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
};
</script>
<style scoped>
.container {
  width: 100px;
  height: 100px;
  /* margin-left: 30px; */
  position: relative;
}
#echart {
  width: 100%;
  height: 100%;
}
#img {
  position: absolute;
  width: 78%;
  top: 10px;
  left: 11px;
}
</style>
