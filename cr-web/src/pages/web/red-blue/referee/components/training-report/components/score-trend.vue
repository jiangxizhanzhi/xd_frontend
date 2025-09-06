<template>
  <div class="score-trend">
    <chart-demo v-if="ready" ref="demoRef" :option="option"></chart-demo>
  </div>
</template>

<script>
import chartDemo from './chart-demo';
export default {
  components: {
    chartDemo,
  },
  props: {
    seriesData: {
      type: Array,
      default: () => [],
    },
    xData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ready: false,
      option: {
        color: [
          this.$themed('cyan-color'),
          this.$themed('blue-color'),
          this.$themed('green-color'),
          this.$themed('orange-color'),
          this.$themed('yellow-color'),
          this.$themed('red-color'),
          this.$themed('cyan-color-4'),
          this.$themed('blue-color-4'),
          this.$themed('green-color-4'),
          this.$themed('orange-color-4'),
        ],
        legend: {
          show: true,
          right: 10,
          top: 0,
          // icon: this.legendIcon,
          itemHeight: 0,
          orient: 'vertical',
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: 12,
          },
          //暂不支持设置data，显示legend时，series的name必须设置
          // data: [],
          formatter: function (name) {
            if (!name) return '';
            //超出几个字符隐藏，鼠标悬浮时显示
            if (name.length > 8) {
              name = name.slice(0, 8) + '...';
            }
            return name;
          },
          tooltip: {
            show: true,
            trigger: 'item',
          },
        },
        // 网格
        grid: {
          show: false,
          top: 40,
          left: 60,
          right: 200,
          bottom: 16,
          containLabel: true,
        },
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
        xAxis: {
          boundaryGap: false,
          // name: 's', // x轴名称
          data: [],
          // x轴名称样式
          nameTextStyle: {
            fontSize: 14,
            color: this.$themed('neutral5'),
            verticalAlign: 'top',
            padding: [6, 0, 0, 0],
          },
          // 坐标轴轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: '',
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴刻度标签
          axisLabel: {
            // interval: 0,
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        yAxis: {
          name: this.$t('rbt.scores'),
          nameTextStyle: {
            fontSize: 12,
            color: this.$themed('neutral5'),
            padding: [0, 45, 10, 20],
          },
          type: 'value',
          // max: 600,
          minInterval: 1,
          // splitNumber: 4,
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // grid区域分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral0'),
            },
          },
          axisLabel: {
            fontSize: 12,
            color: this.$themed('neutral5'),
          },
        },
        series: [],
      },
    };
  },
  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.initData();
            this.$refs.demoRef.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    xData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.option.xAxis.data = newVal;
            this.$refs.demoRef.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      // 处理x轴数据
      this.option.xAxis.data = this.xData;
      // 处理series数据和颜色
      this.option.series = [];
      this.seriesData.forEach((item, index) => {
        this.option.series.push({
          name: item.name,
          type: 'line',
          data: item.data,
          showSymbol: false,
          lineStyle: {
            width: 2,
          },
          symbol: 'none',
          smooth: true,
        });
      });
      this.ready = true;
    },
    // 颜色转换
    HEXToRGB(color, opacity) {
      color = color.trim();
      let r = parseInt(color.substring(1, 3), 16);
      let g = parseInt(color.substring(3, 5), 16);
      let b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
  },
};
</script>
<style lang="scss" scoped>
.score-trend {
  width: 100%;
  height: 100%;
}
</style>
