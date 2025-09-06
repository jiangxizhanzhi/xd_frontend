<template>
  <!-- 学员操作机页面任务矩阵 -->
  <cb-dialog
    :title="$t('m.taskMatrix')"
    :visible="visible"
    class="task-dialog"
    :before-close="beforeClose"
    :close-on-press-escape="false"
    width="600px"
  >
    <task-student ref="taskRef" :resource_id="resource_id"></task-student>
  </cb-dialog>
</template>

<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import taskStudent from '@/pages/web/red-blue/student/components/task-student.vue'; //任务矩阵
export default {
  components: {
    taskStudent,
  },
  props: {},
  data() {
    return {
      resource_id: this.$route.query && this.$route.query.resource_id,
      cookie: '',
      visible: false,
    };
  },
  created() {},
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.taskWs();
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'task');
      this.visible = false;
    },
    taskWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 7) {
            this.$refs.taskRef.initData();
          }
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.task-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
}
</style>
