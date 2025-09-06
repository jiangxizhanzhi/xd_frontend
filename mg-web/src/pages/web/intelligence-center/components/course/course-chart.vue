<template>
  <div class="wrapper">
    <template v-if="data">
      <div class="left-chart">
        <div class="chart-box">
          <basic :option="optionCourse"></basic>
        </div>
        <div class="txt-box">
          <div class="txt">
            <i></i>
            <span>{{ $t('personal.courseLearns') }}</span>
            <span class="count"
              >{{ data.finished_courses || 0 }}/{{
                data.total_courses || 0
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="right-chart">
        <div class="chart-box">
          <basic :option="optionLesson"></basic>
        </div>
        <div class="txt-box">
          <div class="txt">
            <i class="yellow"></i>
            <span>{{ $t('personal.theoryClass') }}</span>
            <span class="count"
              >{{ data.finished_theory_lessons || 0 }}/{{ theoryTotal }}</span
            >
          </div>
          <div class="txt">
            <i class="green"></i>
            <span>{{ $t('personal.experimentalClass') }}</span>
            <span class="count"
              >{{ data.finished_practice_lessons || 0 }}/{{
                practiceTotal
              }}</span
            >
          </div>
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
  name: 'course-chart',
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      optionCourse: {
        title: {
          text: this.data.total_courses || 0,
          left: 'center', // 水平居中
          top: '30%', // 垂直居中
          subtext: this.$t('personal.courseTotal'),
          textStyle: {
            color: this.$themed('--neutral8'),
            fontSize: 24,
            fontWeight: 600,
          },
          subtextStyle: {
            fontSize: 14,
            color: this.$themed('--neutral7'),
          },
        },
        tooltip: {
          textStyle: {
            color: this.$themed('neutral8'),
          },
          backgroundColor: this.$themed('bg-color-1'),
          borderColor: 'rgba(50, 50, 50, 0)',
          //提示框组件
          show: true,
          //触发类型[item-数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用]
          trigger: 'item',
          formatter: function (data) {
            if (data.data.typename) {
              return (
                data.marker +
                ' ' +
                data.data.typename +
                '：' +
                data.percent.toFixed(1) +
                '%'
              );
            }
          },
        },
        series: [
          {
            name: this.$t('personal.courseLearns'),
            type: 'pie',
            hoverAnimation: false,
            radius: ['80%', '95%'],
            labelLine: {
              normal: {
                show: false,
              },
            },
            // 课程学习
            data: [
              {
                typename: this.$t('intelligence.learned'),
                value: this.data.finished_courses || 0,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('primary-color'),
                  },
                },
              },
              {
                value: this.data.total_courses || 100,
                itemStyle: {
                  normal: {
                    color: this.$themed('--neutral0'),
                  },
                },
              },
            ],
          },
        ],
      },
      optionLesson: {
        title: {
          text: this.lessonTotal,
          left: 'center', // 水平居中
          top: '30%', // 垂直居中
          subtext: this.$t('personal.classTotal'),
          textStyle: {
            color: this.$themed('--neutral8'),
            fontSize: 24,
            fontWeight: 600,
          },
          subtextStyle: {
            fontSize: 14,
            color: this.$themed('--neutral7'),
          },
        },
        tooltip: {
          textStyle: {
            color: this.$themed('neutral8'),
          },
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          //提示框组件
          show: true,
          //触发类型[item-数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用]
          trigger: 'item',
          formatter: function (data) {
            if (data.data.typename) {
              return (
                data.marker +
                ' ' +
                data.data.typename +
                '：' +
                data.percent.toFixed(1) +
                '%'
              );
            }
          },
        },
        series: [
          {
            name: this.$t('personal.theoryClass'), //系列名称
            type: 'pie', //饼图
            hoverAnimation: false, //是否开启hover(悬停)在扇区上的放大动画效果
            radius: ['55%', '70%'],
            text: 11,
            labelLine: {
              //标签的视觉引导线
              normal: {
                show: false,
              },
            },
            data: [
              // 已完成理论课时
              {
                typename: this.$t('intelligence.learned'),
                value: this.data.finished_theory_lessons || 0,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('orange-color'),
                  },
                },
              },
              {
                value: this.data.un_finished_theory_lessons || 100,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('--neutral0'),
                  },
                },
              },
            ],
          },
          {
            name: this.$t('personal.experimentalClass'),
            type: 'pie',
            hoverAnimation: false,
            radius: ['80%', '95%'],
            labelLine: {
              normal: {
                show: false,
              },
            },
            //实验课时
            data: [
              {
                typename: this.$t('intelligence.learned'),
                value: this.data.finished_practice_lessons || 0,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('green-color'),
                  },
                },
              },
              {
                value: this.data.un_finished_practice_lessons || 0,
                itemStyle: {
                  normal: {
                    color: this.$themed('--neutral0'),
                  },
                },
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    // 理论课时总数
    theoryTotal() {
      return (
        this.data.finished_theory_lessons +
          this.data.un_finished_theory_lessons || 0
      );
    },
    // 实验课时总数
    practiceTotal() {
      return (
        this.data.finished_practice_lessons +
          this.data.un_finished_practice_lessons || 0
      );
    },
    // 总课时数
    lessonTotal() {
      return this.theoryTotal + this.practiceTotal || 0;
    },
  },
  watch: {
    data: {
      handler() {
        this.$set(this.optionLesson.title, 'text', this.lessonTotal);
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
  .left-chart,
  .right-chart {
    display: inline-block;
    width: 49%;
    height: 100%;
    .chart-box {
      height: calc(100% - 38px);
      width: 100%;
    }
    .txt-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      .txt {
        position: relative;
        color: var(--neutral8);
        font-weight: 400;
        font-size: 14px;
        width: 100%;
        text-align: center;
        i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary-color);
          margin-right: 8px;
          &.yellow {
            background-color: var(--orange-color);
          }
          &.green {
            background-color: var(--green-color);
          }
        }
        .count {
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
