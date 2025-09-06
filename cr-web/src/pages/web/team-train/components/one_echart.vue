<template>
  <div :id="id" style="width: 100%; height: 100%" />
</template>
<script>
import _ from 'lodash';
import { debounce } from '@/utils';
import { getLanguage, getTheme } from '@cyber/helper';
export default {
  props: {
    initData: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
    allColor: {
      type: Array,
      default: () => [],
    },
    theme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      language: getLanguage(),
      scaleData: [
        {
          name: '',
          value: 60,
        },
        {
          name: '',
          value: 60,
        },
        {
          name: '',
          value: 60,
        },
        {
          name: '',
          value: 60,
        },
      ],
      rich: {
        white: {
          color: '#ddd',
          align: 'center',
          padding: [5, 0],
        },
      },
      echartList: [],
    };
  },
  computed: {},
  watch: {
    initData: {
      handler(val, oldval) {
        if (val) {
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    theme: {
      handler() {
        this.initChart();
      },
    },
  },
  mounted() {
    // 监控改变窗口大小改变事件 修改echart宽度
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    // 页面销毁后清除事件
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      const legendName = [];
      const valueDatas = [];
      _.forEach(this.initData.list, (item) => {
        legendName.push(item.name);
        valueDatas.push(item.value);
      });
      const data2 = [];
      for (var i = 0; i < this.scaleData.length; i++) {
        data2.push(
          {
            value: this.scaleData[i].value,
            name: this.scaleData[i].name,
            itemStyle: {},
          },
          {
            value: 4,
            name: '',
          },
        );
      }

      // 数据处理成百分比
      this.echartList = _.cloneDeep(this.initData.list);
      this.echartList[1].value =
        this.echartList[1].value - this.echartList[0].value;

      const seriesObj = [
        {
          name: this.initData.name,
          type: 'pie',
          radius: ['38%', '51%'],
          center: ['50%', '32%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          itemStyle: {},
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: this.echartList,
        },
        {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['32%', '32%'],
          center: ['50%', '32%'],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              labelLine: {
                show: false,
              },
            },
          },
          data: data2,
        },
      ];
      const option = {
        color: this.allColor,
        tooltip: {
          show: false,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: 'center',
          y: '68%',
          icon: 'circle',
          itemWidth: 6, // 设置宽度
          itemHeight: 6, // 设置高度
          textStyle: {
            fontSize: 12,
            color: this.$themed('neutral8'),
          },
          data: legendName,
          formatter: function (name) {
            var index = 0;
            var clientlabels = legendName;
            var clientcounts = valueDatas;
            clientlabels.forEach(function (value, i) {
              if (value === name) {
                index = i;
              }
            });
            return name + '  ' + clientcounts[index];
          },
        },
        toolbox: {
          show: false,
        },
        graphic: {
          // 图形中间文字
          type: 'text',
          left: 'center',
          top: '60%',
          style: {
            text: this.initData.name,
            textAlign: 'center',
            fill: this.$themed('neutral8'),
            fontSize: 12,
          },
        },
        series: seriesObj,
      };
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(option);
      this.chart.resize();
    },
  },
};
</script>

<style lang="scss"></style>
