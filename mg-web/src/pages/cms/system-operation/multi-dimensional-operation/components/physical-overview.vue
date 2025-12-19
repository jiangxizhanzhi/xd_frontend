<template>
  <div class="line-chart">
    <div
      ref="chartref"
      :style="{ width, height }"
    ></div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as echarts from 'echarts';
import { Label } from '@cyber/painter/lib/graph';
export default {
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },

    physicalOverviewData: {
      type: Object,
      default() {
        return {
          xData: [],
          company_data1: [],
          company_data2: [],
          company_data3: [],
        };
      },
    },
  },
  data() {
    return {
      chart: null,
      option: {
        // 提示框配置（鼠标悬浮显示详情）
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow' // 阴影指示器，增强交互
          },
          formatter: function (params) {
            // 获取厂商名称
            const vendor = params[0].name;
            // 依次提取 CPU、内存、磁盘的数值（按series顺序）
            const cpu = params[0].value;
            const memory = params[1].value;
            const disk = params[2].value;
            // 简洁返回文本，换行用\n，无多余样式
            return `${vendor}\nCPU：${cpu}%  内存：${memory}%  磁盘：${disk}%`;
          },
        },
        // 图例配置（对应CPU/内存/磁盘）
        legend: {
          show: true,
          top: '0' // 图例位置
        },
        // 网格配置（调整图表位置）
        grid: {
          left: '3%',
          top: '15%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        // X轴配置（厂商分类）
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            show: true,        // 强制显示标签
            fontSize: 14,      // 标签字体大小
            color: '#333',     // 标签颜色（避免和背景同色）
          },
        },
        // Y轴配置（占用量数值）
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %' // 显示百分比单位
          }
        },
        label: {
          show: true,
          color: "#000000",
          formatter: function (params) {
            return params.data + '%'
          },
        },
        // 系列数据（核心数据配置）
        series: [
          {
            name: 'CPU占用量',
            type: 'bar',
            data: [], // 对应厂商A/B/C的CPU占用量
            itemStyle: { color: '#5470c6' } // 自定义柱子颜色
          },
          {
            name: '内存占用量',
            type: 'bar',
            data: [], // 对应厂商A/B/C的内存占用量
            itemStyle: { color: '#91cc75' }
          },
          {
            name: '磁盘占用量',
            type: 'bar',
            data: [], // 对应厂商A/B/C的磁盘占用量
            itemStyle: { color: '#fac858' }
          }
        ]
      }
    };
  },
  watch: {
    // 处理数据
    physicalOverviewData: {
      handler(nv, ov) {
        if (nv.xData.length) {
          this.option.xAxis.data = nv.xData;
          this.option.series[0].data = nv.company_data1;
          this.option.series[1].data = nv.company_data2;
          this.option.series[2].data = nv.company_data3;
          this.handleFormatData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.chart.setOption(this.option);
    },
    handleFormatData() {
      this.initChart();
    },
  },
};
</script>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
