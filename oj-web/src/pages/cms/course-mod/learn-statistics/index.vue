<template>
  <cb-inner-page :background="true" title="统计分析">
    <cb-radio-group v-model="activeName" class="radio-btn">
      <cb-radio-button :label="$t('m.personalStatistics')"></cb-radio-button>
      <cb-radio-button :label="$t('m.courseStatistics')"></cb-radio-button>
    </cb-radio-group>
    <course-statistics
      v-if="activeName === $t('m.courseStatistics')"
    ></course-statistics>
    <person-statistics
      v-if="activeName === $t('m.personalStatistics')"
    ></person-statistics>
  </cb-inner-page>
</template>
<script>
import CourseStatistics from '@/pages/cms/course-mod/learn-statistics/course-statistics.vue';
import PersonStatistics from '@/pages/cms/course-mod/learn-statistics/person-statistics.vue';
export default {
  components: {
    CourseStatistics,
    PersonStatistics,
  },
  data() {
    return {
      activeName: this.$t('m.personalStatistics'),
    };
  },
  created() {},
  methods: {},
};
</script>
<style scoped lang="scss">
::v-deep .el-tabs--border-card {
  box-shadow: none;
}
.radio-btn {
  margin-bottom: 16px;
}
</style>
