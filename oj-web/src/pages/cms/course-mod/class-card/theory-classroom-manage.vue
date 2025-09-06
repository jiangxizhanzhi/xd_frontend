<template>
  <cb-inner-page :background="false">
    <cb-tabs
      class="classroom-manage-tab"
      type="border-card"
      v-model="activeName"
    >
      <cb-tab-pane
        :label="$t('m.classroomMonitoring')"
        :name="tabNameList.classroomMonitoring"
      >
        <classroom-monitoring ref="classroomMonitoring"></classroom-monitoring>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('course.classInfo')" :name="tabNameList.homework">
        <homework ref="homework"></homework>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('live.courseLive')" :name="tabNameList.live">
        <live v-show="activeName === tabNameList.live" ref="live"></live>
      </cb-tab-pane>
    </cb-tabs>
    <div class="char-box">
      <chat-tool ref="chatTool" />
    </div>
  </cb-inner-page>
</template>
<script>
import ClassroomMonitoring from '@/pages/cms/course-mod/class-card/components/classroom-monitoring/index.vue';
import Homework from '@/pages/cms/course-mod/class-card/components/homework/index.vue';
import Live from '@/pages/cms/course-mod/class-card/components/live/index.vue';
import chatTool from '@/components/cms-chat-tools/index.vue';

const tabNameList = {
  classroomMonitoring: 'classroomMonitoring',
  homework: 'homework',
  live: 'classLearningLive',
};
export default {
  components: {
    ClassroomMonitoring,
    Homework,
    Live,
    chatTool,
  },
  data() {
    return {
      activeName: tabNameList.classroomMonitoring,
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
    margin: 0 0 20p;
  }
}
</style>
