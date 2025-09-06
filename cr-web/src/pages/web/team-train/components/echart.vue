<template>
  <div :id="id" style="width: 100%; height: 180px" />
</template>
<script>
import _ from 'lodash';
import { debounce } from '@/utils';
import { getLanguage, getTheme } from '@cyber/helper';
export default {
  props: {
    initData: {
      type: Array,
      default: () => [
        { name: '已完成', value: 0 },
        { name: '进行中', value: 0 },
        { name: '已结束', value: 0 },
      ],
    },
    id: {
      type: String,
      default: '',
    },
    taskTotal: {
      type: Number,
      default: 0,
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
    };
  },
  computed: {},
  watch: {
    initData: {
      handler(nv, ov) {
        const newValue = JSON.stringify(nv);
        const oldValue = JSON.stringify(ov);
        if (newValue !== oldValue) {
          this.initChart();
        }
      },
      immidiate: true,
      deep: true,
    },
    theme: {
      handler() {
        this.initChart();
      },
    },
    language: {
      deep: true,
      handler(val) {
        this.initChart();
      },
    },
  },
  mounted() {
    this.initChart();
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
          },
          {
            value: 4,
            name: '',
          },
        );
      }
      const seriesObj = [
        {
          name: '',
          type: 'pie',
          radius: ['45%', '60%'],
          center: ['35%', '40%'],
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
          data: this.initData,
        },
        {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: ['38%', '38%'],
          center: ['35%', '40%'],
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
          this.$themed('green-color'),
          this.$themed('orange-color'),
          this.$themed('blue-color'),
        ],
        tooltip: {
          show: false,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '57%',
          y: '25%',
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
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
          left: '58%',
          top: '12%',
          style: {
            text: this.taskTotal + ' ' + this.$t('m.itemTask'),
            textAlign: 'center',
            fill: this.$themed('neutral8'),
            fontSize: 14,
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
