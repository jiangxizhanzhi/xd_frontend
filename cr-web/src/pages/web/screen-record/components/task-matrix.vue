<template>
  <cb-dialog
    :title="$t('m.taskMatrix')"
    :visible="visible"
    class="task-dialog"
    :before-close="beforeClose"
    :close-on-press-escape="false"
    width="600px"
  >
    <div class="task-dialog-content">
      <train-task
        :resource-id="resource_id"
        :train-task="taskLists"
        :show-submit-btn="showSubmitBtn"
        @update="handleUpdateData"
        @submit="handleSubmit"
        :inner="true"
      />
    </div>
  </cb-dialog>
</template>

<script>
import TrainTask from '../../single-train/components/train-task.vue';
import { missionMatrix } from '@/api/web/single-train';
import _ from 'lodash';
export default {
  components: {
    TrainTask,
  },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
    showSubmitBtn: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      visible: false,
      taskLists: [],
      resource_id: this.resourceId,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'task');
      this.visible = false;
    },
    /**
     * 初始化数据
     */
    initData() {
      if (this.resource_id) {
        missionMatrix({
          resource_id: this.resource_id,
        })
          .then((res) => {
            this.taskLists = _.get(res, 'data.data.matrix', []);
          })
          .catch(() => {});
      }
    },
    handleUpdateData() {
      this.$emit('update');
    },
    handleSubmit() {
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.task-dialog-content {
  height: 500px;
}
.task-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    min-height: 300px;
  }
}
</style>
<style lang="scss">
.inner-dialog {
  margin-right: 0 !important;
}
</style>
