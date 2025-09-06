<template>
  <div>
    <!-- 学员操作机页面任务矩阵 -->
    <cb-dialog
      v-if="visible"
      :title="$t('m.taskMatrix')"
      :visible="visible"
      class="task-dialog"
      :before-close="beforeClose"
      :close-on-press-escape="false"
      width="600px"
    >
      <div class="task-dialog-content cyber-scroll-bar-small">
        <div class="task-item" :key="item.resource_id" v-for="item in taskList">
          <div
            class="decorate"
            :class="[
              item.status === 1
                ? 'decorate-success'
                : item.status === 2
                ? 'decorate-fail'
                : item.status === 0
                ? 'decorate-waiting'
                : item.status === 3
                ? 'decorate-reject'
                : 'decorate-not-submit',
            ]"
          ></div>
          <!-- 0未评估,1成功2失败3驳回11未提交 -->
          <span
            class="tag"
            :class="[
              item.status === 1
                ? 'tag-success'
                : item.status === 2
                ? 'tag-fail'
                : item.status === 0
                ? 'tag-waiting'
                : item.status === 3
                ? 'tag-reject'
                : 'tag-not-submit',
            ]"
            >{{
              item.status === 1
                ? $t('rbt.success')
                : item.status === 0
                ? $t('rbt.toEvaluate')
                : item.status === 2
                ? $t('rbt.fail')
                : item.status === 3
                ? $t('rbt.reject')
                : $t('rbt.unSubmit')
            }}
          </span>
          <span class="title" :title="item.name" @click="openTaskFn(item)">{{
            item.name
          }}</span>
        </div>
      </div>
    </cb-dialog>
    <!-- 答题弹框 -->
    <div class="elc-dialog">
      <cb-dialog
        v-if="showAnswerDialog"
        :visible.sync="showAnswerDialog"
        width="55%"
        class="task-answer-dialog-team"
        :append-to-body="true"
        center
        :close-on-press-escape="false"
        custom-class="inner-dialog"
      >
        <div slot="title" class="header-title">
          <!-- 题目名称 -->
          <span :title="titleName">{{ titleName }}</span>
        </div>
        <div
          class="cyber-scroll-bar-small"
          style="height: 500px; overflow: auto"
        >
          <answer-dialog
            ref="AnswerDialog"
            :task-resource-id="taskResourceId"
            :task-stage="taskStage"
          />
          <!--  -->
        </div>
        <span slot="footer" class="dialog-footer">
          <cb-button-group>
            <cb-button @click="SubmitAnswer()">{{ $t('m.ensure') }}</cb-button>
            <cb-button hollow @click="showAnswerDialog = false">
              {{ $t('m.cancel') }}
            </cb-button>
          </cb-button-group>
        </span>
      </cb-dialog>
    </div>
  </div>
</template>

<script>
import { getRedBlueMatrixApi } from '@/api/web/team-training';
import AnswerDialog from './answer-dialog.vue';
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';

export default {
  components: {
    AnswerDialog,
  },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      titleName: '',
      cookie: '',
      visible: false,
      resource_id: this.resourceId,
      taskList: [],
      showAnswerDialog: false,
      taskResourceId: '',
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.studentReportWs();
  },

  methods: {
    // 点击题目
    openTaskFn(item) {
      // alert('123');
      this.taskResourceId = item.mission_id; //任务id
      this.taskStage = item.stage; //任务阶段名称
      this.showAnswerDialog = true;
      this.titleName = item.name;
    },
    SubmitAnswer() {
      // 团队训练
      let answer = '';
      if (this.$refs.AnswerDialog.taskInfos.type === 0) {
        answer = this.$refs.AnswerDialog.judgeAnswer;
        if (!answer) {
          this.$message.error(this.$t('m.plzAnswerSubmit'));
          return;
        }
      } else if (this.$refs.AnswerDialog.taskInfos.type === 1) {
        answer = this.$refs.AnswerDialog.singleAnswer;
        if (!answer) {
          this.$message.error(this.$t('m.plzAnswerSubmit'));
          return;
        }
      } else if (this.$refs.AnswerDialog.taskInfos.type === 2) {
        answer = JSON.stringify(this.$refs.AnswerDialog.multipleAnswer);
        if (this.$refs.AnswerDialog.multipleAnswer.length <= 0) {
          this.$message.error(this.$t('m.plzAnswerSubmit'));
          return;
        }
      } else {
        answer = this.$refs.AnswerDialog.taskAnswer;
        if (!answer) {
          this.$message.error(this.$t('m.plzAnswerSubmit'));
          return;
        }
      }
      const params = {};
      params.answer = answer;
      params.mission_hash = this.taskResourceId;
      this.$request
        .post(
          '/cr/training_team/training_team_students/submit_missions',
          {
            resource_id: this.resource_id,
            answer: answer,
            mission_hash: this.taskResourceId,
            remark: this.$refs.AnswerDialog.taskAnswer,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.reportSuccess'));
          this.$emit('refreshData');
          this.initData();
          this.showAnswerDialog = false;
        });
    },
    beforeClose() {
      this.$emit('before-close', 'task');
      this.visible = false;
    },
    /**
     * 初始化数据
     */
    initData() {
      if (this.resource_id) {
        getRedBlueMatrixApi({
          user_id: this.userId,
          resource_id: this.resourceId,
        }).then((res) => {
          const data = _.get(res, 'data.data', '');
          this.taskList = data.task_list;
        });
      }
    },
    studentReportWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 0 || data.code === 2) {
            // 更新任务矩阵
            this.initData();
          }
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.header-title {
  span {
    display: inline-block;
    max-width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.task-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    min-height: 300px;
  }
}

.task-dialog-content {
  width: 546px;
  height: 500px;
  overflow-y: scroll;
  .task-item {
    height: 48px;
    display: flex;
    align-items: center;
    background: var(--bg-color-3);
    border-bottom: 1px solid var(--neutral0);
    padding-left: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    &:hover {
      background: var(--neutral0);
    }
    &:hover .title {
      color: var(--primary-color);
    }
    .decorate {
      width: 2px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .decorate-success {
      background: var(--green-color);
    }
    .decorate-fail {
      background: var(--red-color);
    }
    .decorate-waiting {
      background: var(--primary-color-2);
    }
    .decorate-reject {
      background: var(--orange-color);
    }
    .decorate-not-submit {
      background: var(--primary-color);
    }
    .tag {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      padding: 0 8px;
    }
    .tag-success {
      background: var(--green-color-2);
      color: var(--green-color);
    }
    .tag-fail {
      background: var(--red-color-2);
      color: var(--red-color);
    }
    .tag-waiting {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
    .tag-reject {
      background: var(--yellow-color-2);
      color: var(--yellow-color);
    }
    .tag-not-submit {
      background: var(--bg-color-2);
      color: var(--neutral8);
    }
    .title {
      width: 456px;
      display: inline-block;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: var(--neutral8);
      margin-left: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="scss">
.inner-dialog {
  margin-right: 0 !important;
}
</style>
