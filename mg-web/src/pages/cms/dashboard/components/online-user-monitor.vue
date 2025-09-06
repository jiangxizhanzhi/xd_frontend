<template>
  <cb-search-table
    :cols.sync="cols"
    url="/agg/dashboard/user_online_record"
    ref="userMonitorRef"
    baseURL="/api/mp"
    :background="true"
    :searchBarBg="false"
  >
    <template v-slot:operation="scope">
      <div
        v-if="scope.data.has_node_session"
        class="monitor-icon"
        @click="viewMonitor(scope.data)"
      >
        <cb-iconfont type="icon-jiankong"></cb-iconfont>
      </div>
      <span v-else>-</span>
    </template>
  </cb-search-table>
</template>

<script>
export default {
  name: 'line2',
  data() {
    return {
      actionArry: [
        this.$t('systemManagement.system.system'),
        this.$t('systemManagement.system.tool'),
        this.$t('systemManagement.system.course'),
        this.$t('systemManagement.system.resource'),
        this.$t('systemManagement.system.account'),
        this.$t('systemManagement.system.scene'),
        this.$t('systemManagement.system.occupation'),
        this.$t('systemManagement.system.exam'),
        this.$t('systemManagement.system.practice'),
        this.$t('systemManagement.system.practiceExercise'),
        this.$t('systemManagement.system.practiceTheory'),
        this.$t('systemManagement.system.testPaper'),
      ],
      cols: [],
    };
  },
  created() {
    this.cols = [
      {
        label: this.$t('dashboard.username'),
        prop: 'username',
        width: 250,
        resizable: true,
      },
      {
        label: this.$t('dashboard.name'),
        prop: 'name',
      },
      {
        label: this.$t('dashboard.organization'),
        prop: 'org',
        width: 300,
        resizable: true,
      },
      {
        label: this.$t('dashboard.action'),
        prop: 'action',
      },
      {
        label: this.$t('dashboard.object'),
        prop: 'subject',
      },

      {
        label: this.$t('dashboard.onlineTime'),
        prop: 'total_online_hours',
      },
      {
        label: this.$t('dashboard.operationMonitor'),
        slot: 'operation',
      },
    ];
  },
  methods: {
    viewMonitor(data) {
      this.$router.push({
        name: 'user-operation-monitor',
        params: { id: data.user, user: data.username },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.monitor-icon {
  width: 16px;
  cursor: pointer;
}
</style>
