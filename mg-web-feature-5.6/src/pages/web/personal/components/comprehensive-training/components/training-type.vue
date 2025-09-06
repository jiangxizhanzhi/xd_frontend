<template>
  <div class="training-type">
    <div class="chart-box" ref="pieChart"></div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as echarts from 'echarts';
import { ListenDomChange } from '@cyber/ui';
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      chart: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      chartOptions: {
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '42%',
            style: {
              text: this.dataList.reduce(
                (prev, curr) => prev + parseInt(curr.value),
                0,
              ),
              fontSize: 24,
              fill: this.$themed('neutral8'),
              textAlign: 'center',
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '52%',
            style: {
              text: this.title,
              fontSize: 14,
              fill: this.$themed('neutral7'),
              textAlign: 'center',
            },
          },
        ],
        color: [
          this.$themed('green-color'),
          this.$themed('primary-color'),
          this.$themed('yellow-color'),
          this.$themed('red-color'),
          this.$themed('orange-color'),
        ],
        series: [
          {
            type: 'pie',
            radius: ['43%', '56%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: this.$themed('bg-color-3'),
              borderWidth: 3,
            },
            data: this.dataList,
            label: {
              formatter: '{b|{b}：}{per|{d}%}',
              minMargin: 0,
              edgeDistance: 30,
              color: this.$themed('neutral7'),
              fontSize: 14,
              lineHeight: 22,
              rich: {
                b: {
                  fontSize: 14,
                  padding: [-15, 0, 0, 0],
                  color: this.$themed('neutral7'),
                },
                per: {
                  padding: [-15, 0, 0, 0],
                  color: this.$themed('neutral7'),
                },
              },
            },
            labelLine: {
              length: 30,
              length2: 40,
              maxSurfaceAngle: 80,
            },
            labelLayout: (params) => {
              params.align = 'left';
              const isLeft = params.labelRect.x < this.chart.getWidth() / 2;
              const points = params.labelLinePoints;
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
          },
        ],
      },
    };
  },
  watch: {
    dataList: {
      handler(val) {
        this.handleFormatData();
      },
      deep: true,
    },
    listen: {
      handler() {
        this.handleFormatData();
      },
      deep: true,
    },
  },
  created() {
    this.updateColor();
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
    this.listen.createListen();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler);
    if (!this.chart) {
      return;
    }

    this.chart.dispose();
    this.chart = null;
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.updateColor();
    },
    updateColor() {
      this.colorNeutral8 = this.$themed('neutral8');
      this.colorNeutral7 = this.$themed('neutral7');
      this.bgColor3 = this.$themed('bg-color-3');
      let { graphic, series } = this.chartOptions;
      graphic[0].style.fill = this.colorNeutral8;
      graphic[1].style.fill = this.colorNeutral7;
      series[0].label.rich.b.color = this.colorNeutral7;
      series[0].label.rich.per.color = this.colorNeutral7;
      series[0].label.color = this.colorNeutral7;
      series[0].itemStyle.borderColor = this.bgColor3;
      this.chartOptions.color = [
        this.$themed('green-color'),
        this.$themed('primary-color'),
        this.$themed('yellow-color'),
        this.$themed('red-color'),
        this.$themed('orange-color'),
      ];
    },
    handleFormatData() {
      this.$nextTick(() => {
        let { graphic, series } = this.chartOptions;
        graphic[0].style.text = this.dataList.length;
        series[0].data = this.dataList;
        this.initChart();
      });
    },
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.pieChart);
      }
      this.chart.setOption(this.chartOptions);
    },
  },
};
</script>

<style scoped lang="scss">
.training-type {
  width: 100%;
  height: 100%;
  .chart-box {
    width: 100%;
    height: 100%;
  }
}
</style>
