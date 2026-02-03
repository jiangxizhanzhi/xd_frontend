<template>
  <div ref="radar_div" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as Echarts from 'echarts';
import _ from 'lodash';
import Utils from '../../../utils/utils.js';
import { bus } from '../../../utils/bus.js';
/**
 * @displayName cb-echart-radar 雷达图
 * @classify Visualize/可视化
 */
export default {
  name: 'CbEchartRadar',
  props: {
    //规定雷达图的显示形状，flat 和 sharp 两个值，默认奇数尖角显示，偶数是平角显示
    radarShape: {
      type: String,
      default: '',
    },
    /**
     * 自定义颜色，可以不设置，会用默认颜色
     */
    color: {
      type: Array,
      default: () => [],
    },
    /**
     * 雷达图的数据，是一个二维数组[[600, 730, 85, 400, 50, 70]],目前值支持一项
     */
    radarData: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * 表格大小，width 和 height,代表容器的高度和宽度，可以传可以不传，width 和height可以只传一个
     */
    chartSize: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * 周围文字描述样式设置，不传也会显示，只有show的false 才不会显示
     */
    axisName: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 规定雷达图有几项,需要用户传值,值得顺序是从上开始，逆时针旋转
     * 雷达图的指示器，用来指定雷达图中的多个变量（维度）
     */
    indicator: {
      type: Array,
      default: () => [],
    },
    /**
     * 表示可视区尺寸（容器高宽中较小一项）的长度百分比。
     * 数组的第一项是内半径，第二项是外半径。
     */
    radarRadius: {
      type: Array,
      default: () => ['0%', '70%'],
    },
  },
  data() {
    return {
      //axisName初始化值
      axisNameBackup: {},
      myChart: null,
      //初始化optionSet
      optionSet: {},
    };
  },
  created() {
    bus.$on('theme_change', () => {
      if (this.myChart != null) {
        this.axisNameBackup = this.getaxisNameBackup();
        this.optionSet = this.getoptionSet();
        this.loadEchart();
      }
    });
  },
  mounted() {
    let _this = this;
    this.axisNameBackup = this.getaxisNameBackup();
    this.optionSet = this.getoptionSet();
    this.myChart = Echarts.init(this.$refs.radar_div);
    this.loadEchart();
    _this.__resizeHandler = Utils.debounce(() => {
      if (_this.myChart) {
        _this.myChart.resize();
      }
    }, 50);
    window.addEventListener('resize', _this.__resizeHandler);
  },
  //实现series data改变时，图表动态更新
  watch: {
    radarData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.myChart) {
          if (newVal) {
            //设置series
            this.seriesSet(newVal);

            //设置option
            this.myChart.setOption(this.optionSet);
          } else {
            this.myChart.setOption(this.optionSet);
          }
        }
      },
    },
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    bus.$off('theme_change');
  },
  methods: {
    getoptionSet() {
      return {
        //不传title不显示，show的false 不显示,位置字体等暂不支持配置
        title: {
          show: false,
          left: 'center',
          bottom: 0,
          text: '',
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: '14px',
          },
        },
        // 不传不显示 弹出框样式设置,show的false 不显示
        tooltip: {
          // show: true,
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
          //周围文字描述样式设置，不传也会显示，只有show的false 才不会显示
          axisName: {},
          /*规定雷达图有几项,需要用户传值,值得顺序是从上开始，逆时针旋转
           * 雷达图的指示器，用来指定雷达图中的多个变量（维度）
           */
          indicator: [],
          // center: ['50%', '50%'], //雷达图位置，是否居中
          //雷达图大小
          radius: this.radarRadius,
          startAngle: 90, //坐标系起始角度，也就是第一个指示器轴的角度，indicator长度是6的话设置60，其他设置90
          // 分割线设置
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
        },
        //雷达图数据定义,
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
      };
    },
    getaxisNameBackup() {
      return {
        show: true,
        color: this.$themed('neutral7'),
        fontSize: '14px',
        padding: [3, 5],
      };
    },
    //设置tooltip弹出框显示的格式
    formatSet(params) {
      let res = '';
      let color = this.$themed('primary-color');
      params.marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
      if (this.optionSet.series.length !== 0) {
        params.value.forEach((item, index) => {
          if (typeof this.indicator[index] !== 'undefined') {
            res +=
              params.marker +
              this.indicator[index].name +
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
    // 雷达图的指示器，用来指定雷达图中的多个变量（维度）
    indicatorSet() {
      if (this.indicator.length !== 0) {
        this.optionSet.radar.indicator = this.indicator;
      }
    },
    // 设置坐标系起始角度，也就是第一个指示器轴的角度，indicator长度是6的话设置60，其他设置90
    startAngleSet() {
      //flat 和 sharp 两个值，默认奇数尖角显示，偶数是平角显示
      //如果radarShape是空，使用默认值
      let len = this.indicator.length;
      let degree = parseInt((180 * (len - 2)) / (2 * len));
      if (this.radarShape === '') {
        //偶数,flat
        if (len % 2 === 0 && len > 2) {
          this.optionSet.radar.startAngle = degree;
        }
      } else if (this.radarShape === 'flat') {
        this.optionSet.radar.startAngle = degree;
      }
    },
    seriesSet(seriesD) {
      if (seriesD.length !== 0) {
        // 遍历radarData item = [600, 730, 85, 400, 50, 70]
        //二维数组
        if (Array.isArray(seriesD[0])) {
          seriesD.forEach((item, index) => {
            const seriesData = item;
            // series 不止一项的时候,将第一项拷贝到其他项进行初始化
            if (index !== 0) {
              this.optionSet.series[index] = _.cloneDeep(
                this.optionSet.series[0],
              );
            }
            if (seriesData.length !== 0) {
              this.optionSet.series[index].data[index] = {};
              this.optionSet.series[index].data[index].value = seriesData;
            }
            //没有传用默认的
            if (this.color.length !== 0) {
              this.optionSet.series[index].areaStyle.color =
                typeof this.color[index] !== 'undefined'
                  ? this.$themed(this.color[index])
                  : this.$themed('bg-color-1');
              this.optionSet.series[index].lineStyle.color =
                typeof this.color[index] !== 'undefined'
                  ? this.$themed(this.color[index])
                  : this.$themed('bg-color-1');
            }
          });
        } else {
          const seriesData = seriesD;
          if (seriesData.length !== 0) {
            this.optionSet.series[0].data[0] = {};
            this.optionSet.series[0].data[0].value = seriesData;
          }
          if (this.color.length !== 0) {
            this.optionSet.series[0].areaStyle.color =
              typeof this.color[0] !== 'undefined'
                ? this.$themed(this.color[0])
                : this.$themed('bg-color-1');
            this.optionSet.series[0].lineStyle.color =
              typeof this.color[0] !== 'undefined'
                ? this.$themed(this.color[0])
                : this.$themed('bg-color-1');
          }
        }
      }
    },
    // 设置axisName
    axisNameSet() {
      this.optionSet.radar.axisName = _.cloneDeep(this.axisName);
      //遍历axisName的默认设置
      for (let item in this.axisNameBackup) {
        //如果没有配置item这个属性,则使用默认的设置
        if (!this.axisName.hasOwnProperty(item)) {
          this.optionSet.radar.axisName[item] = this.axisNameBackup[item];
        }
      }
    },
    //设置title
    tileSet() {
      const titleStyleMeta = ['fontSize', 'fontWeight', 'color'];
      if (_.isPlainObject(this.title) && !_.isEmpty(this.title)) {
        //传了title值
        if (_.get(this.title, 'text', '') !== '') {
          this.optionSet.title.show = true;
          this.optionSet.title.text = this.title.text;
          //默认是居中
          if (this.title.left) {
            this.optionSet.title.left = this.title.left;
          } else if (this.title.right) {
            this.optionSet.title.right = this.title.right;
          } else {
            this.optionSet.title.left = 'center';
          }
          //默认是靠下
          if (this.title.top) {
            this.optionSet.title.top = this.title.top;
          } else if (this.title.bottom) {
            this.optionSet.title.bottom = this.title.bottom;
          } else {
            this.optionSet.title.bottom = 0;
          }
          //判断title key的长度，决定是否设置textStyle
          // if (Object.keys(this.title).length !== 0) {
          if (this.title.textStyle !== undefined) {
            titleStyleMeta.forEach((item) => {
              if (item in this.title.textStyle) {
                this.optionSet.title.textStyle[item] =
                  this.title.textStyle[item];
              }
            });
          }
        }
      }
    },

    loadEchart() {
      //设置axisName
      this.axisNameSet();
      //设置indicator
      this.indicatorSet();
      //设置startAngle
      this.startAngleSet();
      //设置series
      this.seriesSet(this.radarData);
      //设置option
      this.myChart.setOption(this.optionSet);
    },
  },
};
</script>

<style></style>
