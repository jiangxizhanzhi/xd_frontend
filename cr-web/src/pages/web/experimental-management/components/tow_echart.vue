<template>
  <div :id="id" style="width: 100%; height: 200%" />
</template>
<script>
import _ from 'lodash';
import { debounce } from '@/utils';
export default {
  props: {
    initData: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
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
      placeHolderStyle: {
        normal: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
      _.forEach(this.initData, (item) => {
        legendName.push(item.name);
        valueDatas.push(item.value);
      });
      const data2 = [];
      for (var i = 0; i < this.scaleData.length; i++) {
        data2.push(
          {
            value: this.scaleData[i].value,
            name: this.scaleData[i].name,
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#213D63',
                // shadowColor: 'rgba(142, 152, 241, 0.6)',
              },
            },
          },
          {
            value: 4,
            name: '',
            itemStyle: this.placeHolderStyle,
          },
        );
      }
      const seriesObj = [
        {
          name: '',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['47%', '33%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#262D47',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: this.initData,
        },
        {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['48%', '48%'],
          center: ['47%', '33%'],
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
        color: ['#ff4948', '#0195ff'],
        tooltip: {
          show: false,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: '23%',
          y: '68%',
          icon: 'circle',
          itemWidth: 6, // 设置宽度
          itemHeight: 6, // 设置高度
          textStyle: {
            fontSize: 12,
            color: '#8b94b1',
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
            return name + '  ' + clientcounts[index] + '%';
          },
        },
        toolbox: {
          show: false,
        },
        graphic: {
          // 图形中间文字
          type: 'text',
          left: '33%',
          top: '32%',
          style: {
            text: '主观题',
            textAlign: 'center',
            fill: '#d2d9ec',
            fontSize: 12,
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
