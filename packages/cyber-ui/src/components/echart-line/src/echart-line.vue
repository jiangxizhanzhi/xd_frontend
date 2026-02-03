<template>
  <div ref="line_div" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as Echarts from 'echarts';
import _ from 'lodash';
import Utils from '../../../utils/utils.js';
import { bus } from '../../../utils/bus.js';
import { HEXToRGB } from '../../../utils';
/**
 * @displayName cb-echart-line 折线图
 * @classify Visualize/可视化
 */
export default {
  name: 'CbEchartLine',

  props: {
    /**
     * 折线图线条是否显示平滑
     */
    smooth: {
      type: Boolean,
      default: false,
    },
    /**
     * x轴是否显示,默认不显示
     */
    axisLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * 自定义颜色，可以不设置，会用默认颜色,传入颜色变量,例如y3等
     */
    color: {
      type: Array,
      default: () => [],
    },
    /**
     * x轴类型，支持'category'和‘time' 默认是category
     */
    xType: {
      type: String,
      default: 'category',
    },
    /**
     * 当x轴类型是category，xData是类目的具体
     */
    xData: {
      type: Array,
      default: () => [],
    },
    /**
     * name 是折线图的名字，用于legend和tooltip
     */
    name: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * lineData 是折线图的数据
     */
    lineData: {
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
     * legend 是否显示
     */
    legendShow: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否设置区域填充色
     */
    areaStyle: {
      type: Boolean,
      default: false,
    },
    /**
     * legend 的位置显示,默认值right,支持center
     */
    legendLocation: {
      type: String,
      default: 'right',
    },
    /**
     * 图例项的 icon,取值如下
     * 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
     */
    legendIcon: {
      type: String,
      default: '',
    },
    /**
     * 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
     * 数组内容是0或者1,number类型,0代表左边的y轴,1代表右边的y轴
     */
    yAxisIndex: {
      type: Array,
      default: () => [],
    },
    /**
     * y轴分界线是否显示
     */
    ySplitLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * y轴最小间隔
     */
    minInterval: {
      type: Number,
      default: 1,
    },
    /**
     * x轴分界线是否显示
     */
    xSplitLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * 配置y轴数据格式
     */
    yAxisLabelFormatter: {
      type: null,
      default: null,
    },
    /**
     * 配置tooptip的数据显示格式
     */
    toolTipFormatter: {
      type: null,
      default: null,
    },
    /**
     * 图形标记,line 上是否显示点或者其图案
     * 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
     */
    symbol: {
      type: String,
      default: '',
    },
    /**
     * x轴线的颜色和是否显示设置
     */
    xAxisLine: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * y轴线的颜色和是否显示设置
     */
    yAxisLine: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * x轴label的样式显示,不传时用默认的配置，会直接替换x轴的axisLabel
     */
    xAxisLabel: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * y轴label的样式显示,不传时用默认的配置，会直接替换y轴的axisLabel
     */
    yAxisLabel: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * tooltip显示样式设置,如果该对象不是{}空对象,默认的tooltip会覆盖
     */
    tooltip: {
      Type: Object,
      default: () => ({}),
    },
    /**
     *  组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
     */
    dataZoom: {
      type: Array,
      default: () => [],
    },
    /**
     * 直角坐标系内绘图网格,可配置图表与画布间的距离
     */
    grid: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * y轴name的配置
     */
    yAxisName: {
      Type: [String, Array],
      default: '',
    },
  },
  data() {
    return {
      myChart: null,
      //柱状图柱子颜色的默认值数组，默认值先添加8个
      itemColor: [],
      //为显示2条y轴准备
      yAxisBakup: {},
      //配置项
      optionSet: {},
    };
  },
  created() {
    bus.$on('theme_change', () => {
      if (this.myChart != null) {
        this.yAxisBakup = this.getyAxisBakup();
        this.itemColor = this.getitemColor();
        this.optionSet = this.getOptionSet();
        this.loadEchart();
      }
    });
  },
  mounted() {
    let _this = this;
    this.yAxisBakup = this.getyAxisBakup();
    this.itemColor = this.getitemColor();
    this.optionSet = this.getOptionSet();
    this.myChart = Echarts.init(this.$refs.line_div);
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
    lineData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.myChart) {
          if (newVal) {
            this.loadEchart();
          } else {
            this.loadEchart();
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
    getitemColor() {
      return [
        'primary-color',
        'green-color',
        'yellow-color',
        'orange-color',
        'red-color',
        'blue-color',
      ];
    },
    getyAxisBakup() {
      return {
        name: _.isArray(this.yAxisName) ? this.yAxisName[1] : this.yAxisName,
        nameTextStyle: {
          color: this.$themed('neutral2'),
          fontSize: 14,
        },
        position: 'right',
        //y轴标签颜色，暂不支持修改
        axisLabel: {
          color: this.$themed('neutral2'),
          fontSize: 14,
        },
        min: function (value) {
          return 0;
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: this.$themed('neutral2'),
          },
        },
        // y轴分界线
        splitLine: {
          show: false,
        },
        //y轴偏移
        offset: 22,
      };
    },
    getOptionSet() {
      return {
        /**
         * 提示框的设置
         */
        tooltip: {
          //鼠标移动到坐标轴触发时提示框是否有虚线
          trigger: 'axis',
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        legend: {
          show: this.legendShow,
          right: 10,
          top: 10,
          icon: this.legendIcon,
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: 14,
          },
          //暂不支持设置data，显示legend时，series的name必须设置
          // data: [],
        },
        grid: {
          left: 20,
          right: 23,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          //坐标轴类型
          type: 'category',
          //设置内容距离坐标轴是否有距离true是有,false是没有
          boundaryGap: false,
          axisLabel: {
            color: this.$themed('neutral5'),
            showMaxLabel: true, //显示最后一个x轴标签
            fontSize: 14,
          },
          // x轴是否显示，默认不显示
          axisLine: {
            show: this.axisLineShow,
            lineStyle: {
              //x轴线的颜色设置 ，暂不支持修改
              color: this.$themed('neutral2'),
              //延长x轴 配合y轴的offset
              shadowOffsetX: 22,
              shadowColor: this.$themed('neutral2'),
            },
          },
          // x轴上的刻度是否显示，默认不显示
          axisTick: {
            show: false,
          },
          // x轴分界线
          splitLine: {
            show: this.xSplitLineShow,
            lineStyle: {
              color: this.$themed('neutral2'),
              type: 'soild',
            },
          },
          //刻度偏移
          offset: 0,
        },
        yAxis: [
          {
            minInterval: this.minInterval,
            name: _.isArray(this.yAxisName)
              ? this.yAxisName[0]
              : this.yAxisName,
            nameTextStyle: {
              color: this.$themed('neutral5'),
              fontSize: 14,
            },
            //y轴标签颜色，暂不支持修改
            axisLabel: {
              color: this.$themed('neutral5'),
              fontSize: 14,
            },
            min: function (value) {
              return 0;
            },
            // y轴颜色和是否显示设置
            axisLine: {
              show: this.axisLineShow,
              lineStyle: {
                color: this.$themed('neutral2'),
              },
            },
            // y轴分界线
            splitLine: {
              show: this.ySplitLineShow,
              lineStyle: {
                color: this.$themed('neutral0'),
                type: 'soild',
              },
            },
          },
        ],
        series: [],
      };
    },
    //x轴类目显示
    xFormatter(value, index) {
      //value 是距离1970的时间戳
      if (this.optionSet.xAxis.type === 'time') {
        // 格式化成月.日，只在第一个刻度加空格，防止挡住纵坐标刻度值
        var date = new Date(value);
        var texts;
        texts = [
          ('0' + (date.getMonth() + 1)).slice(-2),
          ('0' + date.getDate()).slice(-2),
        ];
        return texts.join('.');
      } else {
        return value;
      }
    },
    setOption(option) {
      // 设置series
      this.seriesSet(option);
      this.myChart.setOption(this.optionSet);
    },
    //toolTip文字格式
    toolTipFormatterSet() {
      if (this.toolTipFormatter) {
        this.optionSet.tooltip['formatter'] = this.toolTipFormatter;
      }
    },
    //seris 设置
    seriesSet(data) {
      if (_.isArray(data) && data.length !== 0) {
        data.forEach((item, index) => {
          this.optionSet.series[index] = {};
          this.optionSet.series[index].data = item;
          this.optionSet.series[index].type = 'line';
          //设置折线转弯处是否有点
          this.optionSet.series[index].symbol = this.symbol;
          if (this.smooth) {
            this.optionSet.series[index].smooth = true;
          }
          //设置yAxisIndex
          if (this.yAxisIndex.length !== 0 && this.yAxisIndex[index]) {
            this.optionSet.series[index].yAxisIndex = this.yAxisIndex[index];
          }
          //传入颜色就用传入的颜色，没有的话用默认的this.itemColor，超过this.itemColor的长度，用echarts默认的颜色
          let colorIndex =
            this.color[index] ||
            (this.itemColor[index] ? this.itemColor[index] : '');
          if (colorIndex !== '') {
            //判断下color的变量样式:cy1变量,还是'#fff'值的形式
            //不等于-1说明是值是#fff的形式
            if (colorIndex.indexOf('#') !== -1) {
              this.optionSet.series[index].color = colorIndex;
            } else {
              this.optionSet.series[index].color = this.$themed(colorIndex);
            }
          }

          this.optionSet.series[index].name = this.name[index] || '';
          if (this.areaStyle) {
            this.optionSet.series[index].areaStyle = {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: HEXToRGB(this.$themed(`${colorIndex}`), 0.3), // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: HEXToRGB(this.$themed(`${colorIndex}`), 0.0), // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            };
          }
        });
      }
    },
    //设置tooltip弹出框显示的格式
    formatSet(params) {
      let res = '';
      if (this.series.length !== 0) {
        this.lineData.forEach((item, index) => {
          if (typeof params[index] !== 'undefined') {
            if (this.optionSet.xAxis.type === 'category') {
              res +=
                (typeof params[index].marker !== 'undefined'
                  ? params[index].marker
                  : '') +
                params[index].seriesName +
                ' ' +
                params[index].value +
                '<br/>';
            } else {
              res +=
                (typeof params[index].marker !== 'undefined'
                  ? params[index].marker
                  : '') +
                params[index].seriesName +
                ' ' +
                params[index].value[1] +
                '<br/>';
            }
          }
        });
      }
      return res;
    },
    xAxisSet() {
      if (this.xType !== 'time') {
        this.optionSet.xAxis.type = 'category';
        //设置x轴类目
        this.optionSet.xAxis.data = this.xData;
      }
    },
    legendSet() {
      //设置了legendIcon就要设置大小为5
      if (this.legendLocation === 'center') {
        this.optionSet.legend.right = 'center';
      }
      if (this.legendIcon !== '') {
        this.optionSet.legend.itemHeight = 10;
      } else if (this.legendIcon === '') {
        //legend 显示一天线
        this.optionSet.legend.itemHeight = 0;
      }
    },
    yAxisIndexSet() {
      if (this.yAxisIndex.length !== 0) {
        //x轴显示并且显示两条y轴
        this.optionSet.yAxis[1].axisLine.show =
          this.axisLineShow && this.yAxisIndex.includes(1);
      }
    },
    yAxisLabelFormatterSet() {
      if (this.yAxisLabelFormatter) {
        this.optionSet.yAxis.forEach((item) => {
          item.axisLabel['formatter'] = this.yAxisLabelFormatter;
        });
      }
    },

    loadEchart() {
      //设置xAxis的type和data等
      this.xAxisSet();
      //legend 设置
      this.legendSet();
      //y轴数据显示格式设置
      this.yAxisLabelFormatterSet();
      //设置tooltip的数据格式
      this.toolTipFormatterSet();

      //如果toolTip不是空对象,则覆盖默认配置
      if (_.isPlainObject(this.tooltip) && !_.isEmpty(this.tooltip)) {
        this.optionSet.tooltip = this.tooltip;
      }

      //x轴线的设置,xAxisLine不是空对象
      if (_.isPlainObject(this.xAxisLine) && !_.isEmpty(this.xAxisLine)) {
        this.optionSet.xAxis.axisLine = this.xAxisLine;
      }

      //yAxisIndex不是0 并且this.yAxisIndex.includes(1),有y轴靠右
      if (this.yAxisIndex.length !== 0 && this.yAxisIndex.includes(1)) {
        //x轴显示并且显示两条y轴
        if (this.optionSet.yAxis.length == 2) {
          this.optionSet.yAxis.pop();
        }
        this.optionSet.yAxis.push(this.yAxisBakup);
      }
      //y轴线的设置,yAxisLine不是空对象
      if (_.isPlainObject(this.yAxisLine) && !_.isEmpty(this.yAxisLine)) {
        this.optionSet.yAxis[0].axisLine = this.yAxisLine;
        if (this.yAxisIndex.length !== 0 && this.yAxisIndex.includes(1)) {
          this.optionSet.yAxis[1].axisLine = this.yAxisLine;
        }
      }

      //x轴label的设置,xAxisLabel不是空对象
      if (_.isPlainObject(this.xAxisLabel) && !_.isEmpty(this.xAxisLabel)) {
        this.optionSet.xAxis.axisLabel = this.xAxisLabel;
      }

      //y轴label的设置,yAxisLabel不是空对象
      if (_.isPlainObject(this.yAxisLabel) && !_.isEmpty(this.yAxisLabel)) {
        this.optionSet.yAxis[0].axisLabel = this.yAxisLabel;
        if (this.yAxisIndex.length !== 0 && this.yAxisIndex.includes(1)) {
          this.optionSet.yAxis[1].axisLabel = this.yAxisLabel;
        }
      }

      //判断dataZoom 是否为空对象
      if (!_.isEmpty(this.dataZoom)) {
        this.optionSet.dataZoom = this.dataZoom;
      }

      // 配置grid
      if (!_.isEmpty(this.grid)) {
        this.optionSet.grid = this.grid;
      }

      //y轴显示几条
      this.yAxisIndexSet();

      // 设置series
      this.seriesSet(this.lineData);
      //设置option
      this.myChart.setOption(this.optionSet);
    },
  },
};
</script>
