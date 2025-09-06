<template>
  <div class="content">
    <div class="train-task-list cyber-scroll-bar-small">
      <div
        v-for="item in trainTask"
        :key="item.stage_name"
        class="task-content"
      >
        <block :title="item.stage_name" />
        <div class="task-list">
          <div
            class="task-item"
            v-for="child in item.missions"
            :key="child.resource_id"
            @click="handleClick(child)"
          >
            <div
              class="task-inner"
              :class="
                child.status === task_status.CORRECT
                  ? 'task-success'
                  : child.status === task_status.ERROR
                  ? 'task-error'
                  : ''
              "
            >
              <cb-tag
                size="small"
                class="item-tag"
                :class="
                  child.status === task_status.CORRECT
                    ? 'tag-success'
                    : child.status === task_status.ERROR
                    ? 'tag-error'
                    : ''
                "
                >{{
                  child.status === task_status.CORRECT
                    ? $t('m.success')
                    : child.status === task_status.ERROR
                    ? $t('m.singleFailed')
                    : $t('m.unsubmitted')
                }}</cb-tag
              >
              <span class="task-title">{{ child.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 50px">
      <cb-button
        :disabled="!showSubmitBtn"
        style="float: right; margin-top: 10px"
        @click="submitTrain"
        >{{ $t('m.submitTrain') }}</cb-button
      >
    </div>
    <cb-dialog
      v-if="showAnswerDialog"
      slot="answer-dialog"
      :visible.sync="showAnswerDialog"
      :close-on-press-escape="false"
      append-to-body
      custom-class="inner-dialog"
    >
      <div slot="title" class="header-title">
        <span>{{ taskName }}</span>
      </div>
      <div class="cyber-scroll-bar-small" style="height: 500px; overflow: auto">
        <single-answer-dialog
          ref="singleAnswerDialog"
          :resource-id="resourceId"
          :task-resource-id="taskResourceId"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" mr @click="SubmitAnswer">
            {{ $t('m.ensure') }}
          </cb-button>
          <cb-button button-type="cancel" @click="showAnswerDialog = false">
            {{ $t('m.cancel') }}
          </cb-button>
        </cb-button-group>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import Block from '@/components/block';
import SingleAnswerDialog from './single-answer-dialog.vue';
import { missionSubmit } from '@/api/web/single-train';
import { TASK_STATUS } from '../constants';
export default {
  props: {
    trainTask: {
      type: Array,
      default() {
        return {};
      },
    },
    showSubmitBtn: {
      type: Boolean,
      default: () => false,
    },
    resourceId: {
      type: String,
      default: '',
    },
  },
  components: {
    Block,
    SingleAnswerDialog,
  },
  data() {
    return {
      task_status: TASK_STATUS,
      showAnswerDialog: false,
      taskResourceId: '',
      taskName: '',
      resource_id: this.resourceId,
    };
  },

  mounted() {},
  methods: {
    // 点击弹框
    handleClick(data) {
      this.taskResourceId = data.resource_id;
      this.taskName = data.title;
      this.showAnswerDialog = true;
    },
    // 提交任务
    SubmitAnswer() {
      // 单兵训练提交训练记录
      const params = {};
      if (this.$refs.singleAnswerDialog.questionType === 0) {
        params.answer = this.$refs.singleAnswerDialog.judgeAnswer;
      }
      if (this.$refs.singleAnswerDialog.questionType === 1) {
        params.answer = this.$refs.singleAnswerDialog.singleAnswer;
      }
      if (this.$refs.singleAnswerDialog.questionType === 2) {
        params.answer = JSON.stringify(
          this.$refs.singleAnswerDialog.multipleAnswer,
        );
      }
      if (this.$refs.singleAnswerDialog.questionType === 7) {
        params.answer = this.$refs.singleAnswerDialog.fileMD5;
      }
      params.training_record = this.$refs.singleAnswerDialog.taskAnswer;
      params.mission_resource_id = this.taskResourceId;
      params.business_template_id = this.resource_id;

      missionSubmit(params).then((res) => {
        this.$message.success(this.$t('m.reportSuccess'));
        this.$emit('submit');
        this.showAnswerDialog = false;
      });
    },
    // 提交训练
    submitTrain() {
      this.$request
        .post(
          `/cr/single_train/room/train_submit/`,
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$emit('update');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 40px);
}
.train-task-list {
  height: 100%;
  overflow: auto;
  .task-content {
    .task-list {
      margin-top: -4px;
      margin-bottom: 16px;
      .task-item {
        // padding: 14px 16px;
        border-bottom: 1px solid var(--neutral0);
        padding: 4px 0;
        cursor: pointer;
        background: var(--bg-color-3);
        &:hover {
          background: var(--neutral0);
          color: var(--primary-color);
        }
        .task-inner {
          border-left: 2px solid var(--primary-color);
          padding: 8px 16px;
          .item-tag {
            margin-right: 12px;
          }
          .task-title {
            display: inline-block;
            line-height: 22px;
            height: 22px;
          }
        }
        .task-success {
          border-left: 2px solid var(--green-color);
        }
        .task-error {
          border-left: 2px solid var(--red-color);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tag-success {
  background: var(--green-color-2);
  .cb-tag-content {
    color: var(--green-color);
  }
}
.tag-error {
  background: var(--red-color-2);
  .cb-tag-content {
    color: var(--red-color);
  }
}
</style>
