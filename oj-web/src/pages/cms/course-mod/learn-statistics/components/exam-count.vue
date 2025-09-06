<template>
  <div class="class-learn-content">
    <div class="title">
      <top-title :name="$t('learningStatistics.courseLearningStatistics')" />
    </div>
    <div class="exam-count">
      <!-- <cb-search-table
        :cols="columns"
        :url="examUrl"
        :data="model"
        ref="commentRef"
      > -->
      <!-- 个人信息,课程学习统计todo接口返回没数据待验证-->
      <cb-search-table
        :cols="columns"
        url="/oj/admin/course/personal-stats/person-stats-detail/course"
        baseURL="/api/ojj"
        :data="model"
        ref="commentRef"
        :searchBarBg="false"
      >
        <template v-slot:difficulty="scope">
          <div>
            <span v-if="scope.data.difficulty === DIFFICULTY.ADVANCED">{{
              $t('m.advanced')
            }}</span>
            <span v-if="scope.data.difficulty === DIFFICULTY.MEDIUM">{{
              $t('m.medium')
            }}</span>
            <span v-if="scope.data.difficulty === DIFFICULTY.PRIMARY">{{
              $t('m.primary')
            }}</span>
          </div>
        </template>
      </cb-search-table>
    </div>
  </div>
</template>
<script>
import topTitle from '@/components/Title/index.vue';
import { DIFFICULTY } from '../contant.js';
export default {
  components: {
    topTitle,
  },
  data() {
    return {
      DIFFICULTY,
      model: {
        user_id: this.$route.params.userId,
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      columns: [],
      tableData: [],
    };
  },
  computed: {
    // examUrl() {
    //   return (
    //     '/admin/course/courses/user_learned_course_statistics/?user=' +
    //     this.resource_id
    //   );
    // },
  },
  created() {
    this.resource_id = this.$route.params.userId;
    this.columns = [
      {
        label: this.$t('m.courseName'),
        prop: 'name',
      },
      {
        label: this.$t('m.direction'),
        prop: 'direction_name',
      },
      {
        label: this.$t('m.difficulty'),
        slot: 'difficulty',
        // prop: 'difficulty',
      },
      {
        label: this.$t('personStatistics.totalClassHours'),
        prop: 'lesson_count',
      },
      {
        label: this.$t('personStatistics.theoreticalLessonsLearned'),
        prop: 'learned_theory',
        sorter: 'learned_theory',
      },
      // 已学习实验课时
      {
        label: this.$t('personStatistics.experimentalLessonsLearned'),
        // prop: 'learned_exp_report',
        // sorter: 'learned_exp_report',
        prop: 'learned_exp',
        sorter: 'learned_exp',
      },
      {
        label: this.$t('personStatistics.afterClassExercisesHaveBeenCompleted'),
        prop: 'learned_after_class_practice',
        sorter: 'learned_after_class_practice',
      },
      // 已提交实验报告数
      {
        label: this.$t('personStatistics.numberOfExperimentalReportsSubmitted'),
        // prop: 'learned_exp',
        // sorter: 'learned_exp',
        prop: 'learned_exp_report',
        sorter: 'learned_exp_report',
      },
    ];
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.class-learn-content {
  background: var(--bg-color-2);
  width: 100%;
  padding: 10px 20px 20px;
  .title {
    width: 100%;
    height: 30px;
  }
  .exam-count {
    margin-top: 20px;
  }
}
</style>
