<template>
  <div class="competent-content">
    <div class="echart-boxs" v-loading="skillLoading">
      <div
        class="chart-box"
        v-if="load && skillData.length > 0"
        ref="radarChart"
      ></div>
      <div
        v-else
        class="empty-comp"
        style="width: 100%; height: 94%; color: var(--neutral8)"
      >
        <empty-page ref="emptyComp" />
      </div>
    </div>
  </div>
</template>

<script>
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import { getJobRadar } from '@/api/personal';
import emptyPage from '@/pages/web/Empty';
import * as echarts from 'echarts';

export default {
  components: {
    emptyPage,
  },
  props: {
    updateInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      load: false,
      skillLoading: false,
      skillData: [],
      skillValue: [],
      option: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          formatter: this.formatSet,
          confine: true,
        },
        radar: {
          indicator: [],
          radius: ['0%', '60%'],
          startAngle: 90,
          splitLine: {
            lineStyle: {
              width: 1,
              color: [
                this.$themed('neutral1'),
                this.$themed('neutral1'),
                this.$themed('neutral1'),
                this.$themed('neutral1'),
                this.$themed('neutral1'),
                this.$themed('neutral2'),
              ], //数组的最后一个颜色值是最外圈颜色
              // opacity: 0.3
            },
          },
          //轴线设置
          axisLine: {
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
          //分隔区域设置
          splitArea: {
            areaStyle: {
              color: 'transparent',
            },
          },
          axisName: {
            show: true,
            color: this.$themed('neutral7'),
            fontSize: '14px',
            padding: [3, 5],
          },
        },
        series: [
          {
            name: '',
            type: 'radar',
            tooltip: {
              trigger: 'item',
            },
            //标记图形的形状
            symbol: 'none',
            //区域颜色,透明度
            areaStyle: {
              color: this.$themed('echart-active-bg-color'),
              // opacity: '0.5'
            },
            //lineStyle 颜色要和区域颜色一样
            lineStyle: {
              color: this.$themed('primary-color'),
              width: 1,
              // opacity: '0.5'
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    updateInfo(val) {
      if (val) {
        this.getRaderEcharts();
      }
    },
    listen: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
  },
  created() {
    this.updateColor();
  },
  mounted() {
    this.listen.createListen();
    this.getRaderEcharts();
    this.__resizeHandler = _.debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
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
    updateColor() {
      let {
        tooltip,
        radar: {
          splitLine: { lineStyle: radarSplitLine },
          axisLine: { lineStyle: radarAxisLine },
          axisName: radarAxisName,
        },
        series: [{ areaStyle: seriesAreaStyle, lineStyle: seriesLineStyle }],
      } = this.option;
      tooltip.backgroundColor = this.$themed('bg-color-1');
      tooltip.textStyle.color = this.$themed('neutral8');
      radarSplitLine.color = [
        this.$themed('neutral1'),
        this.$themed('neutral1'),
        this.$themed('neutral1'),
        this.$themed('neutral1'),
        this.$themed('neutral1'),
        this.$themed('neutral2'),
      ];
      radarAxisLine.color = this.$themed('neutral1');
      radarAxisName.color = this.$themed('neutral7');
      seriesAreaStyle.color = this.$themed('echart-active-bg-color');
      seriesLineStyle.color = this.$themed('primary-color');
    },
    //设置tooltip弹出框显示的格式
    formatSet(params) {
      let res = '';
      let color = this.$themed('primary-color');
      params.marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
      if (this.option.series.length !== 0) {
        params.value.forEach((item, index) => {
          if (typeof this.option.radar.indicator[index] !== 'undefined') {
            res +=
              params.marker +
              this.option.radar.indicator[index].name +
              ' ' +
              '&nbsp;<span style="display:inline-block; float:right">' +
              item +
              '</span>' +
              '<br/>';
          }
        });
      }
      return res;
    },
    // 监听换肤，动态reload ecahrts
    listenFunc() {
      this.updateColor();
    },
    initChart() {
      if (this.$refs.radarChart) {
        if (!this.chart) {
          this.chart = echarts.init(this.$refs.radarChart);
        }
        this.chart.setOption(this.option);
      }
    },
    // 获取雷达图数据
    getRaderEcharts() {
      this.skillData = [];
      this.skillLoading = true;
      this.load = false;
      getJobRadar()
        .then((res) => {
          const data = _.get(res, 'data.data') || [];
          data.map((item) => {
            this.skillData.push({
              max: 100,
              name: `${item.tree_name}`,
            });
            this.skillValue.push(parseInt(item.match_percent));
          });
          this.option.radar.indicator = this.skillData;
          this.option.series[0].data[0] = this.skillValue;
          this.load = true;
          this.skillLoading = false;
          this.$nextTick(() => {
            this.initChart();
          });
        })
        .catch(() => {
          this.skillLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.competent-content {
  width: 100%;
  height: calc(100% - 10px);
  .echart-boxs {
    position: relative;
    width: 100%;
    height: 100%;
    .chart-box {
      width: 100%;
      height: 100%;
    }
  }
  .no-radar {
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--neutral7);
    img {
      width: 145px;
      height: 95px;
    }
  }
}
</style>
