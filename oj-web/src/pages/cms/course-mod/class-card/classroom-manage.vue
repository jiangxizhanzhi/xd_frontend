<template>
  <cb-inner-page :background="false">
    <cb-tabs
      class="classroom-manage-tab"
      type="border-card"
      v-model="activeName"
    >
      <cb-tab-pane
        :label="$t('m.environmentalAllocation')"
        :name="tabNameList.environmental"
      >
        <environmental-distribution></environmental-distribution>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('m.classroomMonitoring')"
        :name="tabNameList.classroomMonitoring"
      >
        <classroom-monitoring
          ref="classroomMonitoring"
          :isShow="true"
        ></classroom-monitoring>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('m.experimentReport')"
        :name="tabNameList.experimentReport"
      >
        <experiment-report ref="experimentReport"></experiment-report>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('course.classInfo')" :name="tabNameList.homework">
        <homework ref="homework"></homework>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('m.classLearningStatistics')"
        :lazy="true"
        :name="tabNameList.classLearningStatistics"
      >
        <learning-statistics
          v-if="activeName === 'classLearningStatistics'"
        ></learning-statistics>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('live.courseLive')" :name="tabNameList.live">
        <live v-show="activeName === tabNameList.live" ref="live"></live>
        <!-- <iframe
          ref="iframeRef"
          :src="live_url"
          width="100%"
          height="670px"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
        ></iframe> -->
      </cb-tab-pane>
    </cb-tabs>
    <div class="char-box">
      <chat-tool ref="chatTool" />
    </div>
  </cb-inner-page>
</template>
<script>
import ClassroomMonitoring from '@/pages/cms/course-mod/class-card/components/classroom-monitoring/index.vue';
import EnvironmentalDistribution from '@/pages/cms/course-mod/class-card/components/environmental-distribution.vue';
import ExperimentReport from '@/pages/cms/course-mod/class-card/components/experiment-report.vue';
import Homework from '@/pages/cms/course-mod/class-card/components/homework/index.vue';
import LearningStatistics from '@/pages/cms/course-mod/class-card/components/learning-statistics.vue';
import chatTool from '@/components/cms-chat-tools/index.vue';
import Live from '@/pages/cms/course-mod/class-card/components/live/index.vue';

const tabNameList = {
  environmental: 'environmental',
  classroomMonitoring: 'classroomMonitoring',
  experimentReport: 'experimentReport',
  homework: 'homework',
  classLearningStatistics: 'classLearningStatistics',
  live: 'classLearningLive',
};
export default {
  components: {
    ClassroomMonitoring,
    EnvironmentalDistribution,
    ExperimentReport,
    Homework,
    LearningStatistics,
    chatTool,
    Live,
  },
  data() {
    return {
      bgStatus: false,
      activeName: tabNameList.environmental,
      live_url: '',
      protocol: '',
    };
  },
  computed: {
    tabNameList() {
      return tabNameList;
    },
  },
  watch: {
    activeName: {
      handler(nv, ov) {
        if (nv === this.tabNameList.classroomMonitoring) {
          //课堂监控
          this.$refs.classroomMonitoring.$refs.sdlRefb.reload();
        } else if (nv === this.tabNameList.experimentReport) {
          // 实验报告
          this.$refs.experimentReport.$refs.sdlRefb.reload();
        } else if (nv === this.tabNameList.homework) {
          // 课后练习
          if (this.$refs.homework.isTrue && this.$refs.homework.issue) {
            this.$refs.homework.$refs.sdlRefb.reload();
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.lessonId = this.$route.params.lessonId;
    // this.courseId = this.$route.params.courseId;
    // this.orgId = this.$route.params.orgId;
    // if (window.location.hostname === 'localhost') {
    //   this.protocol = 'http:'
    // } else {
    //   this.protocol = 'https:'
    // }
    // this.live_url = `${this.protocol}//${window.location.host}/page/oj/admin/courses/class-card/${this.lessonId}/${this.courseId}/${this.orgId}/classroom-manage/teaching-live`;
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss">
.el-tabs.classroom-manage-tab > .el-tabs__content {
  padding: 30px;
}
</style>
<style scoped lang="scss">
.el-tabs {
  .el-tabs__header {
    margin: 0 0 20px;
  }
}
</style>
