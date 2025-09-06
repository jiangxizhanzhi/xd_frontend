<template>
  <cb-inner-page :background="false">
    <div class="user-info-content">
      <div class="student-organization">
        <div class="student">
          <info :user-data="user"></info>
        </div>
        <div class="organization">
          <class-count></class-count>
        </div>
      </div>
      <div class="record">
        <exam-count-chart></exam-count-chart>
      </div>
      <div class="exam">
        <exam-count></exam-count>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Info from '@/pages/cms/course-mod/learn-statistics/components/info.vue';
import ClassCount from '@/pages/cms/course-mod/learn-statistics/components/class-count.vue';
import ExamCount from '@/pages/cms/course-mod/learn-statistics/components/exam-count.vue';
import ExamCountChart from '@/pages/cms/course-mod/learn-statistics/components/exam-count-chart.vue';
export default {
  components: {
    Info,
    ClassCount,
    ExamCount,
    ExamCountChart,
  },
  data() {
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // 表示是否是浅色系
      light: true,
      user: {},
      learn: {},
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params.userId;
    this.user = {
      name: this.$route.query.name,
      username: this.$route.query.username,
      role: this.$route.query.role,
      organization_data: this.$route.query.organization_data,
      avatar: this.$route.query.avatar,
    };
  },
  mounted() {
    this.listenFunc();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
    },
  },
};
</script>
<style scoped lang="scss">
@mixin layoutFlex() {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
}
@mixin defalutBgc() {
  background: var(--bg-color-secondary);
}
.user-info-content {
  // width: 100%;
  height: 100%;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  .student-organization,
  .course-hour {
    @include layoutFlex();
    height: 220px;
    > div {
      flex: 0 0 49.5%;
      // @include defalutBgc();
    }
  }
  .course-hour {
    height: 300px;
  }
  .exam,
  .record {
    @include defalutBgc();
    margin-bottom: 16px;
  }
}
</style>
