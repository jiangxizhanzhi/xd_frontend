<template>
  <div>
    <!-- 学员页面任务矩阵 -->
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
      >
        <div slot="title" class="header-title">
          <!-- 题目名称 -->
          <span class="title-style" :title="titleName">{{ titleName }}</span>
        </div>
        <div
          class="cyber-scroll-bar-small"
          style="height: 500px; overflow: auto"
        >
          <answer-dialog
            ref="AnswerDialog"
            :task-resource-id="taskResourceId"
            :task-stage="taskStage"
            @getData="getData"
          />
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
import { getUserInfo } from '@cyber/helper';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
export default {
  components: {
    AnswerDialog,
  },
  props: {
    // 接收resource_id和student_user_id
    resource_id: {
      type: String,
      default: '',
    },
    student_user_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      titleName: '',
      cookie: '',
      // resource_id: this.resource_id,
      taskList: [],
      showAnswerDialog: false,
      taskResourceId: '',
      taskType: '',
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.studentReportWs();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.initData();
      });
    },
    // 点击题目
    openTaskFn(item) {
      this.taskResourceId = item.mission_id; //任务id
      this.taskStage = item.stage; //任务阶段名称
      this.showAnswerDialog = true;

      this.titleName = item.name;
    },
    getData(data) {
      this.taskType = data.type;
    },
    SubmitAnswer() {
      // 综合演训
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
          // 判断0、单选1、多选2、文件7
          if ([0, 1, 2, 7].includes(this.taskType)) {
            // 判断0、单选1、多选2、文件7 （客观题提示'上报成功'）
            this.$message({
              message: this.$t('m.reportSuccess'),
              type: 'success',
            });
          } else if ([3, 4, 5, 6].includes(this.taskType)) {
            //填空3、问答4、攻击5、防御6（主观题提示'已提交，等待评估'）
            this.$message({
              message: this.$t('m.submittedWaitingForEvaluation'),
              type: 'success',
            });
          }
          this.$emit('refreshData');
          this.initData();
          this.showAnswerDialog = false;
        });
    },

    /**
     * 初始化数据
     */
    initData() {
      if (this.resource_id) {
        getRedBlueMatrixApi({
          user_id: this.$store.state.user.id,
          resource_id: this.resource_id,
        }).then((res) => {
          const data = _.get(res, 'data.data', '');
          this.taskList = data.task_list;
          // 任务矩阵传给外层
          this.$emit('getTaskList', data);
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
            this.$emit('timeLineFresh', true);
          }
          // 更新时间轴标记相关
          // console.log(data.code, '团队学员ws');
          if (data.code === 9) {
            // console.log(data.code, '团队学员成功');
            this.$emit('timeLineFresh', true);
          }
          // 更新倒计时
          if (data.code === 3 && data.runningStatus === 2) {
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
  width: 372px;
  height: 500px;
  overflow-y: scroll;
  .task-item {
    height: 48px;
    display: flex;
    align-items: center;
    background: var(--bg-color-3);
    border-bottom: 1px solid var(--neutral0);
    padding-left: 16px;
    padding-right: 6px;
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
