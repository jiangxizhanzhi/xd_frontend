<template>
  <div class="class-learn-content">
    <div class="btn-groups">
      <cb-button icon="icon-shuaxin" @click="refresh">{{
        $t('m.refresh')
      }}</cb-button>
      <cb-button icon="icon-zhongduanshebei1" @click="monitor" v-if="isShow">{{
        $t('m.monitor')
      }}</cb-button>
    </div>
    <cb-search-table
      ref="sdlRefb"
      :url="url()"
      :cols="columns"
      baseURL="/api/ojj"
      :data.sync="query"
      row-key="resource_id"
      :searchBarBg="false"
      ><template v-slot:sign_in="scope"
        ><span class="cheched-in" v-if="scope.data.sign_in">{{
          $t('m.learningCheckedIn')
        }}</span
        ><span class="not-checked-in" v-if="!scope.data.sign_in">{{
          $t('m.learningNotCheckedIn')
        }}</span></template
      >
      <template v-slot:help="scope">
        <cb-button v-if="scope.data.need_help" @click="help(scope)">
          {{ $t('m.RemoteAssistance') }}
        </cb-button>
        <span v-else>-</span>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      query: {
        classroomId: this.$route.params.lessonId,
      },
    };
  },
  computed: {},
  mounted() {},
  created() {
    this.columns = [
      {
        label: this.$t('m.name') + '(' + this.$t('user.username') + ')',
        sorter: 'userName',
        getData(row) {
          const { name = null, user_name = null } = row;
          return `${name}(${user_name})`;
        },
      },
      {
        label: this.$t('m.unit'),
        prop: 'organization_name',
        sorter: 'organizationName',
      },
      {
        label: this.$t('m.checkinStatus'),
        prop: 'sign_in',
        slot: 'sign_in',
        sorter: 'signIn',
      },
      {
        label: this.$t('m.checkinTime'),
        prop: 'sign_in_time',
        sorter: 'signInTime',
      },
      {
        label: this.$t('m.operation'),
        slot: 'help',
      },
    ];
  },
  methods: {
    help(row) {
      const url = this.$router.resolve({
        name: 'ojcms-course-console',
        params: {
          lessonId: this.$route.params.lessonId,
          userId: row.data.user_id,
        },
      });

      window.open(url.href, '_blank');
    },
    url() {
      // return `/admin/course/course_schedules/${this.$route.params.lessonId}/classroom_monitoring/`;
      return '/oj/admin/course/classroom/classroom_monitor';
    },
    refresh() {
      this.$refs.sdlRefb.reload();
    },
    monitor() {
      this.$router.push({
        name: 'class-monitor',
      });
    },
  },
};
</script>
<style scoped lang="scss">
.class-learn-content {
  .btn-groups {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .cheched-in {
    color: var(--green-color);
  }
  .not-checked-in {
    color: var(--red-color);
  }
}
</style>
