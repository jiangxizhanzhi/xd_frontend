<template>
  <div class="box" v-loading="loading.value">
    <div ref="myChart" class="myChart"></div>
    <div class="legend-box ft12">
      <span
        class="my-legend one-overflow"
        v-for="(item, index) in pieData"
        :key="JSON.stringify(item.name)"
        :title="`${item.name}   ${item.value}`"
      >
        <span class="iconStyle"
          ><i :style="{ backgroundColor: COLOR[index % COLOR.length] }"></i>
          {{ item.name }}</span
        >
        <span class="number">{{ item.value }}%</span>
      </span>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([ToolboxComponent, LegendComponent, PieChart, CanvasRenderer]);
const COLOR = ['#29C593', '#F1BF38', '#0BDAFF', '#3AA5FF', '#FF3A5A'];

export default {
  name: 'NightingaleCircle',
  props: {
    pieData: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  inject: {
    loading: {
      from: 'loading',
      default: {
        value: false,
      },
    },
  },

  data() {
    return {
      myChart: null,
      debounceId: null,
      legendList: [],
      COLOR,
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.myChart);
      this.initChart();
      this.debounceId = _.debounce(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      }, 300);
      window.addEventListener('resize', this.debounceId);
    });
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
    window.removeEventListener('resize', this.debounceId);
  },
  watch: {
    pieData: {
      handler(newVal, oldVal) {
        if (this.myChart && newVal) {
          this.initChart();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initChart() {
      if (this.pieData.length == 0) return;
      let _this = this;
      this.legendList = this.pieData.map((item) => {
        return item.name;
      });
      const basic = {
        type: 'pie',
        radius: [5, 45],
        center: ['49%', '49%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 0,
        },
        label: {
          show: false,
        },
      };
      const legend = {
        show: false,
        type: 'scroll',
        icon: 'circle',
        orient: 'vertical',
        right: '20%',
        top: 'center',
        itemWidth: 12,
        itemHeight: 12,
        color: '#fff',
      };
      const tooltip = {
        trigger: 'item',
        backgroundColor: '#2F3A4D',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
          opacity: 0.8,
        },
        formatter: '{b}: {c}',
      };
      let option = {
        color: COLOR,
        legend: {
          ...legend,
          formatter(name) {
            const total = _this.arrCount(_this.pieData);
            const tarValue = _this.pieData.filter((item) => {
              return item.name === name;
            })[0].value;
            return `${name}   ${((tarValue / total) * 100).toFixed(2)}%`;
          },
        },
        tooltip: { ...tooltip },
        series: [
          {
            ...basic,
            data: this.pieData,
          },
        ],
      };
      this.myChart.setOption(option);
    },
    arrCount(arr) {
      let count = 0;
      arr.forEach((item) => {
        count = count + item.value;
      });
      return count;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .legend-box {
    flex: 3;
    margin-right: 8%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    height: 60%;
  }
  .my-legend {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 45%;
    min-width: 126px;
    color: #c0cce7;
    background: url('../assets/img/bg_circle_border.png') bottom center
      no-repeat;
    background-size: contain;
    .iconStyle {
      width: 75px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i {
      display: inline-block;
      margin: 0 3px 0 8px;
      border-radius: 50%;
      width: 8px;
      height: 8px;
    }
    .number {
      margin-right: 17px;
      font-family: Microsoft YaHei;
      text-shadow: 0 0 8px rgba(189, 225, 255, 0.3),
        0 0 8px rgba(189, 225, 255, 0.3), 0 0 8px rgba(189, 225, 255, 0.3),
        0 0 8px rgba(189, 225, 255, 0.3);
      background: linear-gradient(
        0deg,
        #bde1ff 0%,
        #ffffff 50.4150390625%,
        #e7efff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.myChart {
  flex: 2;
  height: 100%;
  background: url('../assets/img/bg_circle.png') no-repeat;
  background-size: 130px 130px;
  background-position: 50% 50%;
}
</style>
