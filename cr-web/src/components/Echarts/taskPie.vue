<template>
  <div :id="id" style="width: 100%; height: 100%" />
</template>

<script>
import _ from 'lodash';
import { debounce } from '@/utils';
import { getLanguage } from '@cyber/helper';

export default {
  name: 'TaskPie',
  props: {
    initData: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
    isTeam: {
      type: Boolean,
      default: true,
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
    };
  },
  computed: {
    pieNameLocation() {
      const screenWidth = document.body.clientWidth;
      let limit = '22%';
      if (screenWidth <= 1366) {
        limit = this.isTeam ? '15%' : '20%';
      } else if (screenWidth <= 1440 && screenWidth > 1366) {
        limit = this.isTeam ? '16%' : '21%';
      } else if (screenWidth <= 1680 && screenWidth > 1440) {
        limit = this.isTeam ? '17%' : '21%';
      } else {
        limit = this.isTeam ? '18%' : '22%';
      }
      return limit;
    },
  },
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
    if (this.chart) {
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
      const seriesObj = [
        {
          name: this.initData.name,
          type: 'pie',
          radius: ['45%', '60%'],
          center: ['25%', '40%'],
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
          data: this.initData.list,
        },
        {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['40%', '40%'],
          center: ['25%', '40%'],
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
        color: [
          this.$themed('primary-color'),
          this.$themed('green-color'),
          this.$themed('red-color'),
          this.$themed('orange-color'),
          this.$themed('blue-color'),
          this.$themed('yellow-color'),
        ],
        tooltip: {
          show: false,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '50%',
          y: 'center',
          icon: 'circle',
          itemWidth: 12, // 设置宽度
          itemHeight: 12, // 设置高度
          textStyle: {
            fontSize: 12,
            color: this.$themed('neutral8'),
          },
          data: legendName,
          pageIconInactiveColor: '#2f4554', // 翻页按钮不激活时颜色
          pageIconColor: '#aaa', // 翻页按钮颜色
          pageTextStyle: {
            color: '#8b94b1',
          },
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
          left: this.pieNameLocation,
          bottom: '10%',
          style: {
            text: this.initData.name,
            textAlign: 'center',
            fill: this.$themed('neutral8'),
            fontSize: 14,
            color: '#D1DBF1',
          },
        },
        series: seriesObj,
      };
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(option);
    },
  },
};
</script>

<style lang="scss"></style>
