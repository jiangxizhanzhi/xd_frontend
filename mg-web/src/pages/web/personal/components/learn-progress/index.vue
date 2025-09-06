<template>
  <div>
    <div class="content" v-if="this.courseData">
      <div class="left-content">
        <div class="left-charts">
          <div
            id="echartsPieOne"
            style="width: 150px; height: 150px"
            ref="servicePieOne"
          ></div>
          <ul>
            <li>
              <span>{{ $t('personal.courseLearns') }}</span>
              <span class="num"
                >{{ this.finished_courses }}/{{
                  this.courseData.total_courses
                }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="right-content">
        <div
          id="echartsPie"
          style="width: 150px; height: 150px"
          ref="servicePie"
          class="left-box"
        ></div>
        <div class="right-box">
          <ul>
            <li>
              <span>{{ $t('personal.theoryClass') }}</span>
              <span class="num"
                >{{ this.finished_theory_lessons }}/{{
                  this.theory_lessons
                }}</span
              >
            </li>
            <li>
              <span>{{ $t('personal.experimentalClass') }}</span>
              <span class="num"
                >{{ this.finished_practice_lessons }}/{{
                  this.practice_lessons
                }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <no-data></no-data>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import { getStudyProcess } from '@/api/personal';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import noData from '../empty/index.vue';

export default {
  components: {
    noData,
  },
  name: 'echartsPie',
  props: {
    updateInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      debounceId: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      chart: null,
      courseData: null,
      finished_courses: 0,
      finished_practice_lessons: 0,
      finished_theory_lessons: 0,
      total_courses: 0,
      un_finished_practice_lessons: 0,
      un_finished_theory_lessons: 0,
      practice_lessons: 0,
      theory_lessons: 0,
    };
  },
  watch: {
    updateInfo(val) {
      if (val) {
        this.getCourseData();
      }
    },
  },
  methods: {
    listenFunc() {
      this.echartsPieInit();
      this.echartsPieInitOne();
    },
    //获取数据
    getCourseData() {
      getStudyProcess()
        .then((resp) => {
          if (resp.data.data) {
            this.courseData = _.get(resp, 'data.data', {});
            this.finished_courses = this.courseData.finished_courses;
            this.finished_practice_lessons =
              this.courseData.finished_practice_lessons;
            this.finished_theory_lessons =
              this.courseData.finished_theory_lessons;
            this.total_courses =
              this.courseData.total_courses - this.finished_courses;
            this.un_finished_practice_lessons =
              this.courseData.un_finished_practice_lessons;
            this.un_finished_theory_lessons =
              this.courseData.un_finished_theory_lessons;
            //课时总数
            this.totalNum =
              this.un_finished_practice_lessons +
              this.un_finished_theory_lessons +
              this.finished_practice_lessons +
              this.finished_theory_lessons;
            //总课程数
            this.lessonNum = this.courseData.total_courses;
            this.practice_lessons =
              this.un_finished_practice_lessons +
              this.finished_practice_lessons;
            this.theory_lessons =
              this.courseData.un_finished_theory_lessons +
              this.courseData.finished_theory_lessons;
            this.$nextTick(() => {
              this.echartsPieInit();
              this.echartsPieInitOne();
            });
          } else {
            this.courseData = null;
          }
        })
        .catch((error) => {});
    },
    echartsPieInit() {
      if (!document.getElementById('echartsPie')) return;
      this.chart = Echarts.init(document.getElementById('echartsPie'));

      this.chart.setOption({
        title: {
          text: this.totalNum,
          x: '47%',
          y: '30%',
          textAlign: 'center',
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
            return (
              data.seriesName +
              data.name +
              ' : ' +
              ' (' +
              data.percent.toFixed(1) +
              '%)'
            );
          },
        },
        series: [
          {
            name: this.$t('personal.experimentalClass'), //系列名称
            type: 'pie', //饼图
            hoverAnimation: false, //是否开启hover(悬停)在扇区上的放大动画效果
            radius: ['65%', '80%'],
            text: 11,
            labelLine: {
              //标签的视觉引导线
              normal: {
                show: false,
              },
            },
            data: [
              //系列中的数据内容数组
              // 实验课时
              {
                value: this.finished_practice_lessons,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('orange-color'),
                  },
                },
              },
              {
                value:
                  this.finished_practice_lessons !== 0
                    ? this.un_finished_practice_lessons
                    : 100,
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
            name: this.$t('personal.theoryClass'),
            type: 'pie',
            hoverAnimation: false,
            radius: ['85%', '100%'],
            labelLine: {
              normal: {
                show: false,
              },
            },
            //理论课时
            data: [
              {
                value: this.finished_theory_lessons,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('green-color'),
                  },
                },
              },

              {
                value:
                  this.finished_theory_lessons !== 0
                    ? this.un_finished_theory_lessons
                    : 100,
                itemStyle: {
                  normal: {
                    // borderRadius: [8, 8, 8, 8],
                    color: this.$themed('--neutral0'),
                  },
                },
              },
            ],
          },
        ],
      });
      this.chart.resize();
    },
    echartsPieInitOne() {
      if (!document.getElementById('echartsPieOne')) return;
      this.chart = Echarts.init(document.getElementById('echartsPieOne'));

      this.chart.setOption({
        title: {
          text: this.lessonNum,
          x: '47%',
          y: '30%',
          textAlign: 'center',
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
          borderWidth: 0,
          //提示框组件
          show: true,
          //触发类型[item-数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用]
          trigger: 'item',
          formatter: function (data) {
            return (
              data.seriesName +
              data.name +
              ' : ' +
              ' (' +
              data.percent.toFixed(1) +
              '%)'
            );
          },
        },
        series: [
          {
            name: this.$t('personal.courseLearns'),
            type: 'pie',
            hoverAnimation: false,
            radius: ['85%', '100%'],
            labelLine: {
              normal: {
                show: false,
              },
            },
            // 课程学习
            data: [
              {
                value: this.finished_courses,
                itemStyle: {
                  normal: {
                    borderRadius: [8, 8, 8, 8],
                    color: this.$themed('primary-color'),
                  },
                },
              },
              {
                value: this.finished_courses != 0 ? this.total_courses : 100,
                itemStyle: {
                  normal: {
                    // borderRadius: [8, 8, 8, 8],
                    color: this.$themed('--neutral0'),
                  },
                },
              },
            ],
          },
        ],
      });
      this.chart.resize();
    },
  },
  created() {
    this.listen.createListen();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounceId);
    this.listen.destroyListen();
  },
  mounted() {
    this.getCourseData();
    this.$nextTick(function () {
      this.debounceId = _.debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 300);
      window.addEventListener('resize', this.debounceId);
    });
  },
};
</script>

<style scoped lang="scss">
ul li::marker {
  font-size: 24px;
}
li {
  span {
    position: relative;
    top: -2px;
  }
}

.content {
  padding: 0 5%;
  display: flex;
  height: 215px;
  .left-content {
    width: 40%;
    position: relative;
    .left-charts {
      position: absolute;
      left: 40%;
      transform: (-50%, 0);
      ul {
        width: 300px;
        margin: 10px auto;
        padding: 0;
        li {
          margin-left: 10%;
          font-size: 14px;
        }
        li:nth-child(1)::marker {
          color: var(--primary-color);
        }
      }
    }
  }
  .right-content {
    width: 60%;
    .left-box {
      margin: 0 auto;
    }
    .right-box {
      ul {
        display: flex;
        justify-content: space-around;
        width: 300px;
        margin: 10px auto;
        padding: 0;
        li {
          margin-left: 20px;
          font-size: 14px;
        }

        li:nth-child(2)::marker {
          color: var(--orange-color);
        }
        li:nth-child(1)::marker {
          color: var(--green-color);
        }
      }
    }
  }
}
.num {
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
}
</style>
