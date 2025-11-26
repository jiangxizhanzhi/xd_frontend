<template>
  <div ref="pie_div" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as Echarts from 'echarts';
import _ from 'lodash';
import Utils from '../../../utils/utils.js';
import { bus } from '../../../utils/bus.js';
import ListenDomChange from '../../../utils/listen-dom';
/**
 * @displayName cb-echart-pie 饼状图
 * @classify Visualize/可视化
 */
export default {
  name: 'CbEchartPie',
  props: {
    /**
     * label 是否显示
     */
    labelShow: {
      type: Boolean,
      default: false,
    },
    /**
     * label的设置,参数和echarts一样
     */
    label: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * title 内容
     */
    titleText: {
      Type: String,
      default: '',
    },
    /**
     * 是否显示title
     */
    titleShow: {
      type: Boolean,
      default: true,
    },
    /**
     * 自定义颜色，可以不设置，会用默认颜色
     * 自定义饼状图颜色，
     */
    color: {
      type: Array,
      default: () => [],
    },
    /**
     * pieName: '运行中', '已停止'],name 是label的显示，value的数据,遵循echarts的数据格式
     */
    pieName: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * pieData 是折线图的数据，是一个二维数组, pieData: [[{ value: 30, name: '运行中',},{value: 50,name: '已停止'}]],name 是label的显示，value的数据
     */
    pieData: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * title 内容
     */
    titleText: {
      Type: String,
      default: '',
    },
    /**
     * subtitle 内容
     */
    subTitleText: {
      Type: String,
      default: '',
    },
    /**
     * legend的显示位置默认是top,暂时支持top 和right
     */
    legendLocation: {
      Type: String,
      default: 'top',
    },
    // 环是否有空隙
    gapShow: {
      Type: Boolean,
      default: false,
    },
    // 显示空隙的颜色,默认和图形的背景颜色一致
    gapColor: {
      Type: String,
      default: 'bg-color-2',
    },
    /**
     * legendShow 是否显示legend
     *
     */
    legendShow: {
      Type: Boolean,
      default: true,
    },
    /**
     * 饼形图半径
     */
    radius: {
      type: Array,
      default: () => ['50%', '65%'],
    },
    /**
     * double 是否显示双环
     *
     */
    double: {
      Type: Boolean,
      default: false,
    },
    /**
     * 配置legend的数据显示格式设置,不设置时用默认的
     */
    legendFormatter: {
      type: null,
      default: null,
    },
    /**
     * 配置legend的数据显示样式设置,不设置时用默认的
     */
    legendTextStyle: {
      Type: Object,
      default: () => ({}),
    },
    /**
     * legend的数据在右边显示时，位置设置
     */
    legendLocationLeft: {
      Type: String,
      default: '55%',
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      myChart: null,
      //是否环有空格
      itemStyleBackup: {},
      //饼状图颜色的默认值数组，默认值先添加8个
      itemColor: [],
      //初始化optionSet
      optionSet: {},
      gapColorResult: this.gapColor,
    };
  },
  //实现series data改变时，图表动态更新
  watch: {
    label: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.myChart) {
          this.reloadEchart();
          this.loadEchart();
        }
      },
    },
    pieData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.myChart) {
          if (newVal) {
            this.reloadEchart();
            this.loadEchart();
          } else {
            this.reloadEchart();
            this.loadEchart();
          }
        }
      },
    },
  },
  created() {
    // bus.$on('theme_change', () => {
    //   if (this.myChart != null) {
    //     this.gapColor = 'pie-gap-color';
    //     this.itemStyleBackup = this.getitemStyleBackup();
    //     this.itemColor = this.getitemColor();
    //     this.optionSet = this.getOptionSet();
    //     if (_.isPlainObject(this.label) && !_.isEmpty(this.label)) {
    //       console.log('ui this.label', this.label);
    //     }
    //     this.loadEchart();
    //   }
    // });
  },
  mounted() {
    this.listen.createListen();
    let _this = this;
    this.myChart = Echarts.init(this.$refs.pie_div);
    this.reloadEchart();
    this.loadEchart();
    _this.__resizeHandler = Utils.debounce(() => {
      if (_this.myChart) {
        _this.myChart.resize();
      }
    }, 50);
    window.addEventListener('resize', _this.__resizeHandler);
  },
  beforeDestroy() {
    this.listen.destroyListen();
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    } else {
      return;
    }
  },
  methods: {
    reloadEchart() {
      this.gapColorResult = this.gapColor;
      this.itemStyleBackup = this.getitemStyleBackup();
      this.itemColor = this.getitemColor();
      this.optionSet = this.getOptionSet();
    },
    listenFunc() {
      if (this.myChart != null) {
        this.reloadEchart();
        this.loadEchart();
      }
    },
    getitemStyleBackup() {
      return {
        borderColor: this.$themed(this.gapColorResult), //cy14
        borderWidth: 3,
      };
    },
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
    getOptionSet() {
      return {
        //标题配置
        title: {
          show: this.titleShow,
          text: this.titleText,
          subtext: this.subTitleText,
          itemGap: 2,
          left: 'center',
          // this.optionSet.title.left = '30%'; //left是圆心的值
          // this.optionSet.title.textAlign = "center";
          top: '70%',
          textVerticalAlign: 'center',
          textStyle: {
            color: this.$themed('neutral8'),
            fontSize: 30,
            fontWeight: 'bold',
          },
          subtextStyle: {
            color: this.$themed('neutral5'),
            fontSize: 14,
          },
        },
        //弹出框设置,暂时不支持配置
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
          trigger: 'item',
        },
        //图例组件
        legend: {
          // show:true,
          show: this.legendShow,
          top: '5%',
          left: 'center',
          orient: 'vertical',
          icon: 'circle',
          itemHeight: 12,
          // itemGap: 10%,
          //legend 字体颜色
          textStyle: {
            color: this.$themed('neutral7'),
          },
          tooltip: {
            show: true,
          },
        },
        series: [
          {
            center: ['50%', '70%'],
            // name会显示在tooltip弹出框的上面，需要传
            name: '',
            type: 'pie',
            //环形的宽度，大小,//支持自定义大小
            radius: this.radius,
            avoidLabelOverlap: false,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            label: {
              show: this.labelShow,
              formatter: (params) => {
                return '{name|' + params.name + '}';
              },
              padding: [0, -80, 25, -80],
              rich: {
                name: {
                  fontSize: 14,
                  padding: [0, 10, 0, 4],
                  color: this.$themed('neutral8'),
                },
              },
            },
            //鼠标进过饼状图label显示出来
            emphasis: {},
            labelLine: {
              length2: 100,
              lineStyle: {
                color: this.$themed('neutral8'),
              },
            },
            data: [],
          },
        ],
      };
    },
    //legend文字格式
    legendFormatterSet() {
      //legend 数据格式
      if (this.legendFormatter) {
        this.optionSet.legend['formatter'] = this.legendFormatter;
      }
      //legend数据样式
      if (
        _.isPlainObject(this.legendTextStyle) &&
        !_.isEmpty(this.legendTextStyle)
      ) {
        this.optionSet.legend['textStyle'] = this.legendTextStyle;
      }
    },
    //title series set
    tileCenterSet(index) {
      if (!this.legendShow) {
        this.optionSet.series[index].center = ['50%', '50%'];
        this.optionSet.title.left = 'center';
        this.optionSet.title.top = 'center';
        this.optionSet.title.textVerticalAlign = '';
      } //legend right 显示时修改饼状图的圆心
      else if (this.legendShow && this.legendLocation === 'right') {
        this.optionSet.series[index].center = ['30%', '50%'];
        //title 位置于圆心的位置
        this.optionSet.title.left = '28%'; //left是圆心的值 -1
        if (this.subTitleText !== '') {
          this.optionSet.title.top = '40%'; //有subtitle top上移
        } else {
          this.optionSet.title.top = '50%';
        }
        this.optionSet.title.textAlign = 'center';
      } else if (this.subTitleText !== '') {
        this.optionSet.title.top = '66%';
      }
    },
    pieDataInit(pieDatas, pieName) {
      let pData = [];
      if (pieDatas.length !== 0) {
        //判断pieData是否是二维数组,判断第一项是否是数组
        if (Array.isArray(pieDatas[0])) {
          pieDatas.forEach((item, index) => {
            pData[index] = [];
            //遍历一个数组
            for (let i in item) {
              pData[index].push({
                value: item[i],
                name: pieName[index][i],
              });
            }
          });
        } else {
          //一维数组
          for (let i in pieDatas) {
            pData.push({
              value: pieDatas[i],
              name: pieName[i],
            });
          }
        }
      }
      return pData;
    },
    //series 设置
    seriesSet(pieDatas) {
      let pData = this.pieDataInit(pieDatas, this.pieName);
      //pieData 不是空数组
      if (pData.length !== 0) {
        //判断pieData是否是二维数组,判断第一项是否是数组
        if (Array.isArray(pData[0])) {
          // 遍历pieData
          pData.forEach((item, index) => {
            if (index !== 0) {
              this.optionSet.series[index] = _.cloneDeep(
                this.optionSet.series[0],
              );
            }
            this.tileCenterSet(index);
            if (item.length !== 0) {
              //深拷贝data
              this.optionSet.series[index].data = _.cloneDeep(item);
              this.optionSet.series[index].data = _.cloneDeep(item);
              item.forEach((iData, indey) => {
                this.pieDataStyleSet(index, indey);
              });
            }
          });
        } else {
          this.tileCenterSet(0);
          //深拷贝data
          this.optionSet.series[0].data = _.cloneDeep(pData);
          pData.forEach((iData, indey) => {
            this.pieDataStyleSet(0, indey);
          });
        }
      }
      if (this.double) {
        //拷贝一份series，用于双环
        this.optionSet.series[1] = _.cloneDeep(this.optionSet.series[0]);
        //设置透明度
        this.optionSet.series[1].data.forEach((iten, indez) => {
          iten.itemStyle.opacity = 0.8;
        });
        //设置内环的半径
        const inRadius = this.optionSet.series[0].radius[0];
        this.optionSet.series[1].radius = [
          `${parseInt(inRadius) - 3}%`,
          `${parseInt(inRadius) + 1}%`,
        ];
        //内环没有鼠标经过label变大的效果
        this.optionSet.series[1].label.show = false;
        this.optionSet.series[1].emphasis = {};
      }
    },
    //设置series data 下的itemStyle
    pieDataStyleSet(index, indey) {
      this.optionSet.series[index].data[indey].itemStyle = {};
      //设置颜色
      if (this.color.length === 0) {
        let cl =
          typeof this.itemColor[indey] !== 'undefined'
            ? this.$themed(this.itemColor[indey])
            : '';
        if (cl !== '') {
          this.optionSet.series[index].data[indey].itemStyle.color = cl;
        }
      } else {
        let cl =
          typeof this.color[indey] !== 'undefined'
            ? this.$themed(this.color[indey])
            : typeof this.itemColor[indey] !== 'undefined'
            ? this.$themed(this.itemColor[indey])
            : '';
        if (cl !== '') {
          this.optionSet.series[index].data[indey].itemStyle.color = cl;
        }
      }
    },
    loadEchart() {
      //label 设置,如果label不是空对象,则替换默认配置
      if (_.isPlainObject(this.label) && !_.isEmpty(this.label)) {
        this.optionSet.series[0].label = this.label;
      }
      if (this.legendShow && this.legendLocation === 'right') {
        this.optionSet.legend = {
          show: true,
          top: 'center',
          //为了解bug1952 【仪表盘】兼容适配问题，资源统计，文字和图标重叠了
          left: this.legendLocationLeft,
          orient: 'vertical',
          //icon是长方形
          icon: 'react',
          itemHeight: 10,
          itemWidth: 16,
          //legend 字体颜色
          textStyle: {
            rich: {
              a: {
                fontSize: 14,
                color: this.$themed('neutral7'),
              },
              b: {
                fontSize: 18,
                color: this.$themed('neutral8'),
              },
            },
          },
          //  自定义显示格式
          formatter: (params) => {
            const curData = this.optionSet.series[0].data.find((item) => {
              return item.name === params;
            });
            return [`{a|${params}}`, ' ', ' ', `{b|${curData.value}}`].join('');
            // return params + ' ' + ' ' + curData.value;
          },
        };
      }

      //如果传递了legendFormatter,替换默认配置
      this.legendFormatterSet();
      //设置空隙
      if (this.gapShow) {
        this.optionSet.series[0].itemStyle = this.itemStyleBackup;
      }
      // 设置series
      this.seriesSet(this.pieData);
      //设置option
      this.myChart.setOption(this.optionSet);
    },
  },
};
</script>
