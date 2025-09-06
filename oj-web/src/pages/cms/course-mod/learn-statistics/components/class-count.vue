<template>
  <div class="info-content" :background="true">
    <div class="user-title">
      <top-title :name="$t('learningStatistics.learningData')"></top-title>
    </div>
    <div class="user">
      <div class="info-item">
        <label class="one-overflow" :title="$t('m.finishClass')"
          >{{ $t('personStatistics.completeTheCourse') }}：</label
        >
        <div class="progress">
          <cb-progress
            :percentage="completeCourses"
            :format="formatCourses"
          ></cb-progress>
        </div>
      </div>
      <div class="info-item">
        <label class="one-overflow" :title="$t('m.completedExperiment')"
          >{{ $t('personStatistics.completeTheoryCourse') }}：</label
        >
        <div class="progress">
          <cb-progress
            :percentage="completeTheory"
            :format="formatTheory"
          ></cb-progress>
        </div>
      </div>
      <div class="info-item">
        <label class="one-overflow" :title="$t('m.completedExperiment')"
          >{{ $t('personStatistics.completeTheExperimentalCourse') }}：</label
        >
        <div class="progress">
          <cb-progress
            :percentage="completeExpCount"
            :format="formatExpCount"
          ></cb-progress>
        </div>
      </div>
      <div class="info-item">
        <label class="one-overflow" :title="$t('m.completeTheExercise')"
          >{{ $t('personStatistics.finishTheAfterClassExercises') }}：</label
        >
        <div class="progress">
          <cb-progress
            :percentage="completePractice"
            :format="formatPractice"
          ></cb-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topTitle from '@/components/Title/index.vue';
export default {
  components: {
    topTitle,
  },
  data() {
    return {
      courses: 0,
      theory: 0,
      exp_count: 0,
      practice: 0,
      coursesTotal: 0,
      theoryTotal: 0,
      exp_countTotal: 0,
      practiceTotal: 0,
    };
  },
  computed: {
    completeCourses() {
      if (this.courses && this.coursesTotal) {
        return (this.courses / this.coursesTotal) * 100;
      }
      return 0;
    },
    completeTheory() {
      if (this.theory && this.coursesTotal) {
        return (this.theory / this.theoryTotal) * 100;
      }
      return 0;
    },
    completeExpCount() {
      if (this.exp_count && this.exp_countTotal) {
        return (this.exp_count / this.exp_countTotal) * 100;
      }
      return 0;
    },
    completePractice() {
      if (this.practice && this.practiceTotal) {
        return (this.practice / this.practiceTotal) * 100;
      }
      return 0;
    },
  },
  watch: {},
  created() {
    this.resource_id = this.$route.params.userId;
    this.getClassCount();
  },
  methods: {
    getClassCount() {
      // 个人信息,学习数据
      this.$request
        .get(
          '/oj/admin/course/personal-stats/person-stats-detail/count',
          { user_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const classData = res.data.data;
          this.courses = classData.finish_courses_count;
          this.theory = classData.finish_theory_count;
          this.exp_count = classData.finish_exp_count;
          this.practice = classData.after_class_practice;
          this.coursesTotal = classData.course_total_count;
          this.theoryTotal = classData.theory_course_total_count;
          this.exp_countTotal = classData.exp_course_total_count;
          this.practiceTotal = classData.after_class_practice_total_count;
        })
        .catch(() => {});
    },
    formatCourses(percentage) {
      return percentage === 0 ? `0` : `${this.courses}`;
    },
    formatTheory(percentage) {
      return percentage === 0 ? `0` : `${this.theory}`;
    },
    formatExpCount(percentage) {
      return percentage === 0 ? `0` : `${this.exp_count}`;
    },
    formatPractice(percentage) {
      return percentage === 0 ? `0` : `${this.practice}`;
    },
  },
};
</script>
<style scoped lang="scss">
label {
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral8);
}
.info-content {
  background: var(--bg-color-2);
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .user-title {
    width: 100%;
    margin-bottom: 5px;
  }
  .user {
    width: 100%;
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info-item {
      width: 100%;
      display: flex;
      align-items: center;

      label {
        width: 100px;
      }
      .progress {
        width: calc(100% - 100px);
        ::v-deep .cb-progress .el-progress--line .el-progress__text {
          float: right !important;
        }
        ::v-deep .cb-progress-bar {
          margin-right: -50px;
        }
      }
      .person-number {
        color: var(--font-color-primary);
      }
    }
  }
}
</style>
