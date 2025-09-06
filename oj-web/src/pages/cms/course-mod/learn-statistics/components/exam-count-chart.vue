<template>
  <div class="exam-count-chart">
    <div class="title">
      <top-title :name="$t('m.LearningGameRecord')" />
    </div>
    <div class="regex">
      <echart-wrapper
        ref="CountChart"
        :opt="option"
        @ready="echartReady = true"
      ></echart-wrapper>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/search-condition/search-input.vue';
import topTitle from '@/components/Title/index.vue';
import * as echarts from 'echarts';
export default {
  components: {
    SearchInput,
    topTitle,
  },
  data() {
    return {
      lesson_learn_record: [],
      thirty_days: [],
      // xnames:[],
      report_finish_record: [],
      echartReady: false,
      average_score: [],
      axisLineColor: this.$themed('neutral7'),
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      neutral8Color: this.$themed('neutral8'),
      bgColor3: this.$themed('bg-color-3'),
      redColor: this.$themed('red-color'),
      orangeColor: this.$themed('orange-color'),
      greenColor: this.$themed('green-color'),
    };
  },
  computed: {
    option() {
      if (!this.echartReady) {
        return false;
      }
      return {
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: this.neutral8Color,
          },
          left: '6%',
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: this.bgColor3,
          borderWidth: 0,
          textStyle: {
            color: this.neutral8Color,
          },
          axisPointer: {
            lineStyle: {
              color: this.neutral8Color,
            },
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [
            this.$t('m.course'),
            this.$t('m.experimentReport'),
            this.$t('m.averageCore'),
          ],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: this.neutral8Color,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: this.axisLineColor,
              },
            },
            data: this.thirty_days,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('m.course') + '/' + this.$t('m.experiment'),
            max: function (value) {
              return (value.max + 0.01 * value.min).toFixed(2);
            },
            min: function (value) {
              return (value.min - 0.01 * value.min).toFixed(2);
            },
            axisTick: {
              show: false,
            },
            splitLine: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: this.axisLineColor,
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
              },
            },
          },
          {
            type: 'value',
            name: this.$t('m.averageCore'),
            max: function (value) {
              return (value.max + 0.01 * value.min).toFixed(2);
            },
            min: function (value) {
              return (value.min - 0.01 * value.min).toFixed(2);
            },
            axisTick: {
              show: false,
            },
            splitLine: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: this.axisLineColor,
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
              },
            },
          },
        ],
        series: [
          {
            name: this.$t('m.course'),
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: this.redColor,
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)',
                    },
                  ],
                  false,
                ),
                shadowColor: this.redColor,
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: this.redColor,
              },
            },
            data: this.lesson_learn_record,
          },
          {
            name: this.$t('m.experimentReport'),
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: this.orangeColor,
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)',
                    },
                  ],
                  false,
                ),
                shadowColor: this.orangeColor,
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: this.orangeColor,
              },
            },
            data: this.report_finish_record,
          },
          {
            name: this.$t('m.averageCore'),
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: this.greenColor,
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)',
                    },
                  ],
                  false,
                ),
                shadowColor: this.greenColor,
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: this.greenColor,
              },
            },
            data: this.average_score,
          },
        ],
      };
    },
  },
  created() {
    this.listen.createListen();
    this.resource_id = this.$route.params.userId;
    this.getCount();
  },
  mounted() {},
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.axisLineColor = this.$themed('neutral7');
      this.neutral8Color = this.$themed('neutral8');
      this.bgColor3 = this.$themed('bg-color-3');
      this.redColor = this.$themed('red-color');
      this.orangeColor = this.$themed('orange-color');
      this.greenColor = this.$themed('green-color');
    },
    getCount() {
      // 个人信息学习记录折线图
      this.$request
        .get(
          '/oj/person/study_period_records',
          { user_id: this.resource_id, isWeb: false },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.thirty_days = res.data.data.xnames;
          // 课程
          this.lesson_learn_record = res.data.data.yfirst_values;
          // 实验报告
          this.report_finish_record = res.data.data.ysecond_values;
          // 平均分
          this.average_score = res.data.data.ythird_values;
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="scss">
.exam-count-chart {
  background: var(--bg-color-2);
  width: 100%;
  padding: 10px 20px 20px;
  .title {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
  }
  .regex {
    height: 300px;
  }
}
</style>
