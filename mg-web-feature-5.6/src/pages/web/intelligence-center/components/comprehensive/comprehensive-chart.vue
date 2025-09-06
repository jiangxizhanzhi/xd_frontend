<template>
  <div class="wrapper">
    <template v-if="this.courseData">
      <div class="left-chart">
        <div class="head">
          {{ $t('personal.trainingOverview') }}
        </div>
        <basic :option="optionBar"></basic>
      </div>
      <div class="right-chart">
        <div class="head">
          {{ $t('personal.trainingType') }}
        </div>
        <div class="box">
          <basic ref="pieRef" :option="optionPie"></basic>
        </div>
      </div>
    </template>
    <no-data v-else></no-data>
  </div>
</template>

<script>
import NoData from '@/components/empty/index';
import Basic from '../../../../../components/chart/basic';

export default {
  components: {
    NoData,
    Basic,
  },
  name: 'comprehensive-chart',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      courseData: {},
      categoryList: {
        1: this.$t('personal.penetrationTest'),
        2: this.$t('personal.operationProtection'),
        3: this.$t('personal.systemSimulation'),
        4: this.$t('personal.integratedScene'),
        5: this.$t('personal.ceOthers'),
      },
      optionBar: {
        legend: {
          show: true,
          x: 'right',
          padding: [10, 12, 0, 0],
          itemHeight: 6,
          itemWidth: 12,
          textStyle: {
            color: this.$themed('neutral7'),
            fontSize: 12,
          },
        },
        grid: {
          top: '30%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        // 提示框
        tooltip: {
          trigger: 'item',
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: 'rgba(50, 50, 50, 0)',
          textStyle: {
            // fontSize: 12,
            color: this.$themed('neutral8'),
          },
          extraCssText:
            'max-width: 420px;white-space: normal;word-break: break-all;',
        },
        xAxis: {
          type: 'category',
          data: [],
          // 坐标轴轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          // 坐标轴刻度标签
          axisLabel: {
            interval: 0,
            fontSize: 12,
            color: this.$themed('neutral7'),
          },
        },
        yAxis: {
          name: this.$t('personal.times'),
          nameTextStyle: {
            padding: [30, 0, 0, -20],
            fontSize: 10,
            color: this.$themed('--neutral5'),
            align: 'left',
          },
          type: 'value',
          minInterval: 1,
          // grid区域分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: this.$themed('neutral1'),
            },
          },
          axisLabel: {
            fontSize: 10,
            color: this.$themed('--neutral5'),
          },
        },
        series: [
          {
            name: this.$t('personal.completed'),
            type: 'bar',
            stack: 'stack',
            barWidth: 12,
            color: this.$themed('green-color'),
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: this.$t('personal.unfinished'),
            type: 'bar',
            stack: 'stack',
            barWidth: 12,
            color: this.$themed('orange-color'),
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
        ],
      },
      optionPie: {
        title: {
          text: '',
          x: 'center',
          y: '35%',
          subtext: this.$t('personal.trainingTimes'),
          textStyle: {
            color: this.$themed('--neutral8'),
            fontSize: 24,
            fontWeight: 600,
          },
          subtextStyle: {
            fontSize: 14,
            color: this.$themed('--neutral5'),
          },
        },
        color: [
          this.$themed('green-color'),
          this.$themed('primary-color'),
          this.$themed('yellow-color'),
          this.$themed('red-color'),
          this.$themed('orange-color'),
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: 'rgba(50, 50, 50, 0)',
          textStyle: {
            color: this.$themed('neutral8'),
          },
          extraCssText:
            'max-width: 420px;white-space: normal;word-break: break-all;',
        },
        series: [
          {
            type: 'pie',
            radius: ['42%', '55%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: this.$themed('bg-color-3'),
              borderWidth: 1,
            },
            left: 'center',
            height: '100%',
            width: '100%',
            data: [],
            label: {
              alignTo: 'edge',
              formatter: function (params) {
                return [
                  '{name|' + params.name + '}\n',
                  '{percent|' + params.percent + '%}',
                ].join('');
              },
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                name: {
                  fontSize: 12,
                  color: this.$themed('neutral7'),
                },
                percent: {
                  fontSize: 10,
                  color: this.$themed('neutral7'),
                },
              },
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80,
            },
            labelLayout: function (params) {
              let chart = this.$refs?.pieRef?.chart;
              if (!chart) return;
              const isLeft = params.labelRect.x < chart.getWidth() / 2;
              const points = params.labelLinePoints;
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
          },
        ],
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        let xData = [];
        let yData = [[], []];
        let pieData = [];
        let total = 0;
        if (val?.completed?.length) {
          xData = val?.completed?.map((item) => item.app_name);
          yData[0] = val?.completed?.map((item) => item.count) || [];
        }
        if (val?.incomplete?.length) {
          if (!xData.length) {
            xData = val?.incomplete?.map((item) => item.app_name);
          }
          yData[1] = val?.incomplete?.map((item) => item.count) || [];
        }
        this.$set(this.optionBar.xAxis, 'data', xData);
        this.$set(this.optionBar.series[0], 'data', yData[0]);
        this.$set(this.optionBar.series[1], 'data', yData[1]);
        Object.entries(val?.training_type_map)?.forEach((item) => {
          total += item[1];
          let key = item[0];
          pieData.push({
            name: this.categoryList[key],
            value: item[1],
          });
        });
        this.$set(this.optionPie.series[0], 'data', pieData);
        this.$set(this.optionPie.title, 'text', total);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
  created() {},
  beforeDestroy() {},
  mounted() {},
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left-chart,
  .right-chart {
    display: inline-block;
    width: calc(50% - 5px);
    height: 100%;
    background-color: var(--neutral0);
    position: relative;
    .box {
      width: 250px;
      height: 190px;
      margin-top: 24px;
      margin-left: 24px;
    }
    .head {
      position: absolute;
      top: 4px;
      left: 12px;
    }
  }
}
</style>
