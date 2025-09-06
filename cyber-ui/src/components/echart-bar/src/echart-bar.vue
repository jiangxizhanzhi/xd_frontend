<template>
  <div ref="bar_div" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as Echarts from 'echarts';
import _ from 'lodash';
import Utils from '../../../utils/utils.js';
import { bus } from '../../../utils/bus.js';
import { HEXToRGB } from '../../../utils';
/**
 * @displayName cb-bar-chart 柱状图
 * @classify Visualize/可视化
 */
export default {
  name: 'CbChartBar',
  props: {
    /**
     * 定义柱子的宽度
     */
    barWidth: {
      type: String,
      default: '',
    },
    /**
     * 自定义颜色，可以不设置，会用默认颜色,传的是cy1 变量名
     */
    color: {
      type: Array,
      default: () => [],
    },
    /**
     * name 是柱形图的名字，用于legend和tooltip
     */
    name: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * 当x轴类型是category，xData是x轴类目的具体
     */
    xData: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * 柱形图数据
     */
    barData: {
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
     * legend 默认不显示
     */
    legendShow: {
      type: Boolean,
      default: false,
    },
    /**
     * x和y轴是否交换
     */
    x2y: {
      type: Boolean,
      default: false,
    },
    /**
     * x轴是否显示,x2y为false时,该配置生效
     */
    xAxisLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * y轴是否显示,
     */
    yAxisLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * y轴分割线是否显示
     */
    ySplitLineShow: {
      type: Boolean,
      default: false,
    },
    /**
     * y轴最大值设置,默认值0,代表自动分配
     */
    yMax: {
      type: Number,
      default: 0,
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
     * Y 轴相对于默认位置的偏移
     */
    yOffset: {
      type: Number,
      default: 15,
    },
    /**
     * 柱状图,柱子外是否包一圈边框,该参数设置为true是,barData只接收一维数组
     */
    borderOutside: {
      type: Boolean,
      default: false,
    },
    /**
     *外边框柱状图的最大值
     */
    borderData: {
      type: Number,
      default: 1000,
    },
    /**
     * 圆角半径，单位px，支持传入数组分别指定 4 个圆角半径。 如:
      borderRadius: 5, // 统一设置四个角的圆角大小
      borderRadius: [5, 5, 0, 0] //（顺时针左上，右上，右下，左下）
      默认是平角的
     */
    borderRadius: {
      type: [String, Number],
      default: 0,
    },
    /**
     * for tc190 柱状图外边框柱子series 设置
     */
    seriesItemBorderOutside: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * 直角坐标系内绘图网格,可配置图表与画布间的距离
     */
    grid: {
      Type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      //用于显示柱子外面的边框
      seriesItemBorderOutsideSeries: {
        type: 'bar',
        //不同系列的柱间距离，为百分比（如 '30%'，表示柱子宽度的 30%）
        // 如果想要两个系列的柱子重叠，可以设置 barGap 为 '-100%'。这在用柱子做背景的时候有用
        barGap: '-125%',
        barWidth: '30px',
        itemStyle: {
          normal: {
            //边框颜色
            borderColor: '#475C81',
            borderWidth: 1,
            //填充色设置与柱状图背景颜色一致,透明度是0
            color: HEXToRGB(this.$themed('blue-color'), 0.0),
          },
        },
        z: 1,
        data: [],
        tooltip: {
          show: false,
        },
      },
      //为了x轴和y轴交换
      xAxisBackup: {},
      yAxisBackup: {},
      //标志传的data是一维还是二维数组
      flag: '1',
      myChart: null,
      //柱状图柱子颜色的默认值数组，默认值先添加8个
      itemColor: [],
      //配置项
      optionSet: {},
    };
  },
  created() {
    bus.$on('theme_change', () => {
      this.yAxisBackup = this.getyAxisBackup();
      this.xAxisBackup = this.getxAxisBackup();
      this.itemColor = this.getitemColor();
      this.optionSet = this.getOptionSet();
      if (this.myChart != null) {
        this.loadEchart();
      }
    });
  },
  mounted() {
    let _this = this;
    this.yAxisBackup = this.getyAxisBackup();
    this.xAxisBackup = this.getxAxisBackup();
    this.itemColor = this.getitemColor();
    this.optionSet = this.getOptionSet();
    this.myChart = Echarts.init(this.$refs.bar_div);
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
    barData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.myChart) {
          if (newVal) {
            //当数据变化是，可能x轴数据和data都会变化,所以调用loadEchart
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
    getyAxisBackup() {
      return {
        type: 'category',
        data: this.xData || '',
        //y轴标签颜色
        axisLabel: {
          color: this.$themed('neutral5'),
          fontSize: 14,
        },
        // x轴是否显示，默认不显示
        axisLine: {
          lineStyle: {
            //x轴线的颜色设置
            color: this.$themed('neutral2'),
          },
        },
        // x轴上的刻度是否显示，默认不显示
        axisTick: {
          color: this.$themed('neutral5'),
        },
        // y轴分界线
        splitLine: {
          show: false,
          lineStyle: {
            color: this.$themed('neutral2'),
            type: 'bolid',
          },
        },
      };
    },
    getxAxisBackup() {
      return {
        type: 'value',
        // x轴分界线
        splitLine: {
          show: false,
        },
        //x轴标签颜色
        axisLabel: {
          color: this.$themed('neutral5'),
          fontSize: 14,
        },
        // x轴是否显示，默认不显示
        axisLine: {
          show: false,
          lineStyle: {
            //x轴线的颜色设置 ，暂不支持修改
            color: this.$themed('neutral2'),
          },
        },
        // x轴上的刻度是否显示，默认不显示
        axisTick: {
          show: false,
        },
      };
    },
    getOptionSet() {
      return {
        /**
         * 提示框的设置
         */
        tooltip: {
          triggerOn: 'mousemove',
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
        },
        //series 里面有name所以打他线不传
        legend: {
          type: 'plain',
          show: this.legendShow,
          // show: true,
          right: 10, //靠右显示，暂不支持修改
          top: 10,
          itemWidth: 14,
          icon: 'rect', //legend图标形状，方形，暂不支持修改
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: 14,
          },
        },
        grid: {
          left: 20,
          right: 23,
          bottom: 20,
          containLabel: true,
        },

        xAxis: {
          //坐标轴类型
          type: 'category',
          // x轴刻度显示值，类目数据,不传值就不显示
          data: this.xData ? this.xData : '',
          // 修改轴标签属性
          //x轴标签颜色固定#C0CCE7
          axisLabel: {
            color: this.$themed('neutral5'),
            fontSize: 14,
            //label 标签斜着显示
            // "rotate": 45,
          },
          // x轴是否显示，默认不显示
          axisLine: {
            show: false,
            lineStyle: {
              //x轴线的颜色设置 ，暂不支持修改
              color: this.$themed('neutral2'),
            },
          },
          // x轴上的刻度是否显示，默认不显示
          axisTick: {
            show: false,
          },
          // x轴分界线
          splitLine: {
            show: false,
          },
          //刻度偏移
          offset: 10,
        },
        yAxis: {
          //默认y轴不显示
          axisLine: {
            show: false,
            lineStyle: {
              //y轴线的颜色设置 ，暂不支持修改
              color: this.$themed('neutral2'),
            },
          },
          //y轴标签颜色
          axisLabel: {
            color: this.$themed('neutral5'),
            fontSize: 14,
          },
          min: function (value) {
            return 0;
          },
          // y轴分界线
          splitLine: {
            show: false,
            lineStyle: {
              color: this.$themed('neutral2'),
              type: 'soild',
            },
          },
          //刻度偏移
          offset: 15,
        },
        series: [],
      };
    },
    setOption(option) {
      // 设置series
      this.seriesSet(option);

      this.myChart.setOption(this.optionSet);
    },
    //toolTip文字颜色和背景
    toolTipSet() {
      if (_.isPlainObject(this.tooltip) && !_.isEmpty(this.tooltip)) {
        const toolBgc = _.get(this.tooltip, 'backgroundColor', '');
        if (toolBgc !== '') {
          this.optionSet.tooltip.backgroundColor = toolBgc;
        }
        if (this.tooltip.textStyle !== undefined) {
          const toolColor = _.get(this.tooltip.textStyle, 'color', '');
          if (toolColor !== '') {
            this.optionSet.tooltip.textStyle.color = toolColor;
          }
        }
      }
    },
    //seris 设置
    seriesSet(bData) {
      if (bData.length !== 0) {
        //是二维数组
        if (Array.isArray(bData[0]) && bData[0].length !== 0) {
          this.flag = '2'; //传的参数是二维数组
          bData.forEach((item, index) => {
            this.initBarData(index, item);
          });
        } else {
          this.flag = '1'; //传的参数是一维数组
          this.initBarData(0, bData);
        }
      } else {
        this.flag = '1'; //传的参数是一维数组
        this.initBarData(0, bData);
      }
    },
    initBarData(index, itemData) {
      this.optionSet.series[index] = {};
      this.optionSet.series[index].data = itemData;
      this.optionSet.series[index].type = 'bar';
      this.optionSet.series[index].barWidth =
        this.barWidth !== '' ? this.barWidth : '';

      this.optionSet.series[index].name = this.name[index] || '';
      this.optionSet.series[index].itemStyle = {};
      //修改柱子圆角
      this.optionSet.series[index].itemStyle.borderRadius = this.borderRadius;
      //如果color是二维数组,则认为是渐变的
      // 判断第一个是不是数组,且长度是2,不是1
      //颜色在TC190 dark.scss中没有定义,先不用.$themed
      if (Array.isArray(this.color[index]) && this.color[index].length !== 1) {
        //线性光设置
        this.optionSet.series[index].itemStyle.color = {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: this.color[index][0],
            },
            {
              offset: 1,
              color: this.color[index][1],
            },
          ],
        };
        // 渐变是键柱状图的圆角去掉
        this.optionSet.series[index].itemStyle.borderRadius = 0;
      }
      //传入颜色就用传入的颜色，没有的话用默认的this.itemColor，超过this.itemColor的长度，用echarts默认的颜色
      else {
        let cl = this.$themed(
          this.color[index] ||
            (this.itemColor[index] ? this.itemColor[index] : ''),
        );
        if (cl !== '') {
          this.optionSet.series[index].color = cl;
        }
      }
    },
    //borderBar series 设置
    borderBarSeriesSet() {
      // 父组件传了seriesItemBorderOutside
      if (
        _.isPlainObject(this.seriesItemBorderOutside) &&
        !_.isEmpty(this.seriesItemBorderOutside)
      ) {
        this.seriesItemBorderOutsideSeries = this.seriesItemBorderOutside;
      }
      //先清空数据
      this.seriesItemBorderOutsideSeries.data = [];
      //设置border bar data 的data数据,个数要个this.optionSet.series[index].data一致,可以做到每个柱子都有外边框
      for (let i = 0; i < this.optionSet.series[0].data.length; i++) {
        this.seriesItemBorderOutsideSeries.data.push(this.borderData);
      }
      this.optionSet.series.push(this.seriesItemBorderOutsideSeries);
    },
    //title 设置
    tileSet() {
      const titleStyleMeta = ['fontSize', 'fontWeight', 'color'];
      //传了title值
      if (_.get(this.title, 'text')) {
        this.optionSet.title = {};
        this.optionSet.title.text = this.title.text;
        //默认靠左
        this.optionSet.title.left = this.title.left ? this.title.left : 'left';
        this.optionSet.title.top = 'top';
        if (this.title.textStyle !== undefined) {
          this.optionSet.title.textStyle = {
            color: this.$themed('neutral8'),
          };
          titleStyleMeta.forEach((item) => {
            if (item in this.title.textStyle) {
              this.optionSet.title.textStyle[item] = this.title.textStyle[item];
            }
          });
        }
      }
    },
    //设置tooltip弹出框显示的格式
    formatSet(params) {
      let res = '';
      if (this.series.length !== 0) {
        if (this.flag === '2') {
          this.barData.forEach((item, index) => {
            res +=
              params[index].marker +
              params[index].seriesName +
              ' ' +
              '&nbsp;<span style="display:inline-block; float:right">' +
              params[index].value +
              '</span>' +
              '<br/>';
          });
        } else {
          res +=
            params[0].marker +
            params[0].seriesName +
            ' ' +
            '&nbsp;<span style="display:inline-block; float:right">' +
            params[0].value +
            '</span>' +
            '<br/>';
        }
      }
      return res;
    },

    loadEchart() {
      //设置y轴最大值
      //yMax !=0 说明 ymax有设置最大值
      if (this.yMax !== 0) {
        this.optionSet.yAxis.max = this.yMax;
        this.yAxisBackup.max = this.yMax;
      }

      //xdata赋值，当响应式的时候xData数据可能会变
      this.optionSet.xAxis.data = this.xData ? this.xData : '';
      this.yAxisBackup.data = this.xData ? this.xData : '';
      //x轴y轴互换
      if (this.x2y) {
        this.optionSet.xAxis = this.xAxisBackup;
        this.optionSet.yAxis = this.yAxisBackup;
      }
      //是否传xAxisLabel,设置x轴 标签的样式
      if (_.isPlainObject(this.xAxisLabel) && !_.isEmpty(this.xAxisLabel)) {
        this.optionSet.xAxis.axisLabel = this.xAxisLabel;
      }
      //是否传yAxisLabel,设置y轴 标签的样式
      if (_.isPlainObject(this.yAxisLabel) && !_.isEmpty(this.yAxisLabel)) {
        this.optionSet.yAxis.axisLabel = this.yAxisLabel;
      }

      //显示x轴
      if (this.xAxisLineShow) {
        this.optionSet.xAxis.axisLine.show = true;
        this.optionSet.xAxis.axisTick.show = true;
      }
      //显示y轴
      if (this.yAxisLineShow) {
        //y轴显示时,x轴的axisTick不显示,根据项目TC190设置的,同事把x轴颜色改成和y轴一样
        this.optionSet.yAxis.axisLine.show = true;
        this.optionSet.xAxis.axisTick.show = false;
        this.optionSet.xAxis.axisLine.lineStyle.color = '#697AA0';
      }
      //设置y轴的偏移,不等于15时,说明设置yOffset
      if (this.yOffset !== 15) {
        this.optionSet.yAxis.offset = this.yOffset;
      }

      //显示y轴分割线
      if (this.ySplitLineShow) {
        this.optionSet.yAxis.splitLine.show = true;
      }
      // 配置grid
      if (!_.isEmpty(this.grid)) {
        this.optionSet.grid = this.grid;
      }
      // 设置series
      this.seriesSet(this.barData);
      //如果borderOutside设置为true
      if (this.borderOutside) {
        //判断下series数组的个数，不是1的时候，去除最后一个元素
        if (this.optionSet.series.length !== 1) {
          this.optionSet.series.pop();
        }
        this.borderBarSeriesSet();
      }
      //设置option
      this.myChart.setOption(this.optionSet);
    },
  },
};
</script>
