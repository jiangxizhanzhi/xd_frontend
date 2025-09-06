<template>
  <div
    class="level-statistic"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,.1)"
  >
    <div class="chart-box" ref="levelStatisticChart"></div>
    <!-- no-data -->
    <div v-if="levelData.length === 0 && !loading" class="no-data">
      <empty></empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { dangerLevelOptions } from '@/constants/index.js';
import Empty from '@/components/empty';
import * as echarts from 'echarts';
import { getVulnOverviewLevel } from '@/api/vuln';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: true,
      levelStatistic: null,
      levelData: [],
      dangerLevelOptions,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      options: {
        title: {
          left: '24%',
          top: 'center',
          z: 10,
          textStyle: {
            color: this.$themed('neutral9'),
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 20,
          },
          textAlign: 'center',
        },
        color: [],
        legend: {
          icon: 'rect',
          orient: 'vertical',
          right: 'right',
          top: 'middle',
          data: [],
          formatter: ' {name}',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 12,
          textStyle: {
            color: this.$themed('neutral8'),
            fontSize: 14,
          },
        },
        series: [],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            let { marker, name, percent } = params;
            return `${marker}${name}<br/>${percent}%`;
          },
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: this.$themed('bg-color-1'),
          textStyle: {
            fontSize: 14,
            color: this.$themed('neutral8'),
          },
        },
      },
    };
  },
  created() {
    this.listen.createListen();
    this.fetchData();
  },
  mounted() {
    this.__resizeHandler = _.debounce(() => {
      this.levelStatistic.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    this.listen.destroyListen();
    // 页面销毁后清除事件
    window.removeEventListener('resize', this.__resizeHandler);
    if (!this.levelStatistic) {
      return;
    }

    this.levelStatistic.dispose();
    this.levelStatistic = null;
  },
  methods: {
    listenFunc() {
      this.options.title.textStyle.color = this.$themed('neutral9');
      this.options.legend.textStyle.color = this.$themed('neutral8');
      this.options.tooltip.textStyle.color = this.$themed('neutral8');
      this.options.tooltip.backgroundColor = this.$themed('bg-color-1');
      this.options.tooltip.borderColor = this.$themed('bg-color-1');
      this.options.series = [];
      this.handleChartsData();
    },
    getColorOptions() {
      return [
        this.$themed('neutral4'),
        this.$themed('yellow-color'),
        this.$themed('orange-color'),
        this.$themed('red-color'),
        '#000',
      ];
    },
    fetchData() {
      getVulnOverviewLevel()
        .then((res) => {
          // total
          this.options.title.text = `${_.get(
            res,
            'data.data.total',
            0,
          )}\n${this.$t('vulnIndex.levelStatisticTotal')}`;
          // data

          this.levelData = _.get(res, 'data.data.statistics', []);
          this.handleChartsData();
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    handleChartsData() {
      let seriesData = [];
      this.options.color = [];
      if (this.levelData.length > 0) {
        this.levelData.map((item) => {
          let tempObj = {
            value: item.count,
            name: `${dangerLevelOptions[item.level]} ${item.count}`,
          };
          this.options.legend.data.push(tempObj.name);
          this.options.color.push(this.getColorOptions()[item.level]);
          seriesData.push(tempObj);
        });
        // series
        this.options.series.push({
          type: 'pie',
          radius: ['50%', '80%'],
          center: ['25%', '50%'],
          data: seriesData,
          label: {
            show: false,
            position: 'outer',
            alignTo: 'none',
            bleedMargin: 5,
            formatter: '{d}%',
            color: this.$themed('white-color'),
            fontSize: 14,
            lineHeight: 22,
          },
          labelLine: {
            length: 10,
            length2: 15,
            maxSurfaceAngle: 80,
          },
        });
        this.initEcharts();
      }
    },
    initEcharts() {
      if (!this.levelStatistic) {
        this.levelStatistic = echarts.init(this.$refs.levelStatisticChart);
      }

      this.levelStatistic.setOption(this.options);
    },
  },
};
</script>

<style scoped lang="scss">
.level-statistic {
  position: relative;
  width: 100%;
  height: calc(100% - 48px);
  .chart-box {
    width: 95%;
    height: 100%;
  }
  .no-data {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
