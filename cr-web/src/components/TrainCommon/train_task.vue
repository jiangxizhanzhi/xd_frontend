<template>
  <div
    class="right-combat"
    :class="showTask ? 'cssAnimate' : 'cssAnimateRight'"
  >
    <div class="btn-left fr" @click="showTaskPanel()">
      <cb-iconfont v-if="showTask" type="icon-xiangzuo"></cb-iconfont>
      <cb-iconfont v-else type="icon-xiangyou"></cb-iconfont>
    </div>
    <div
      v-if="showTask"
      class="task-content fr cyber-scroll-bar"
      style="width: 100%; height: 100%; overflow-y: scroll"
    >
      <div class="tabDetail">
        <cb-tabs
          v-model="activeName"
          style="width: auto; margin-top: 0"
          type="card"
        >
          <cb-tab-pane :label="$t('m.description')" name="trainDescription" />
          <cb-tab-pane :label="$t('m.task')" name="traintask" />
        </cb-tabs>
      </div>

      <!-- <el-scrollbar> -->
      <div v-if="activeName === 'trainDescription'">
        <div class="info-content fl description-common-style">
          <div class="train-info">
            <cb-row>
              <cb-col :span="8">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainType') }}</span>
                </div>
              </cb-col>
              <cb-col :span="16">
                <div
                  class="grid-content bg-purple-light"
                  :title="trainDescription.trainType"
                >
                  {{ trainDescription.trainType }}
                </div>
              </cb-col>
            </cb-row>
            <cb-row>
              <cb-col :span="8">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainTime') }}</span>
                </div>
              </cb-col>
              <cb-col :span="16">
                <div
                  class="grid-content bg-purple-light"
                  :title="trainDescription.duration_time + hours"
                >
                  {{ trainDescription.duration_time }} {{ hours }}
                </div>
              </cb-col>
            </cb-row>
            <cb-row>
              <cb-col :span="7">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.preSkill') }}</span>
                </div>
              </cb-col>
              <cb-col :span="16">
                <div class="grid-content bg-purple-light skill-style">
                  <div
                    v-for="(item, k) in trainDescription.pre_skill"
                    :key="k"
                    class="skill-box one-overflow"
                    :title="item"
                  >
                    {{ item }}
                  </div>
                </div>
              </cb-col>
            </cb-row>
            <cb-row>
              <cb-col :span="7">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainSkill') }}</span>
                </div>
              </cb-col>
              <cb-col :span="16">
                <div class="grid-content bg-purple-light skill-style">
                  <div
                    v-for="(item, i) in trainDescription.train_skill"
                    :key="i"
                    class="skill-box one-overflow"
                    :title="item"
                  >
                    {{ item }}
                  </div>
                </div>
              </cb-col>
            </cb-row>
            <cb-row>
              <cb-col :span="8">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.taskDescription') }}</span>
                </div>
              </cb-col>
              <cb-col :span="16">
                <div
                  style="width: 100%"
                  class="grid-content bg-purple-light"
                  :title="trainDescription.description"
                >
                  {{ trainDescription.description }}
                </div>
              </cb-col>
            </cb-row>
          </div>
        </div>
      </div>
      <div
        v-if="activeName === 'traintask'"
        class="task-lists cyber-scroll-bar"
      >
        <div
          v-for="(item, indexList) in taskLists"
          :key="indexList"
          class="task-list"
        >
          <div class="task-stage">
            <span class="stage-name one-overflow" :title="item.stage">{{
              item.stage
            }}</span>
          </div>
          <div
            v-for="(list, childrenIndexList) in item.missions"
            :key="list.resource_id"
            class="task-set"
            @click="gotoAnswer(list, item.stage, indexList, childrenIndexList)"
          >
            <span
              class="one-overflow cursor answered-name"
              :title="list.name || list.title"
              >{{ list.name || list.title }}</span
            >
            <template>
              <span
                v-if="
                  list.state ===
                  $CONSTANT.Mission.FinishedCondition.TOEVALUATE.value
                "
                class="fl toevaluate answered"
                >[{{ $t('m.toEvaluate') }}]</span
              >
              <span
                v-else-if="
                  list.state ===
                  $CONSTANT.Mission.FinishedCondition.SUCCESS.value
                "
                class="fl success answered"
                >[{{ $t('m.success') }}]</span
              >
              <span
                v-else-if="
                  list.state === $CONSTANT.Mission.FinishedCondition.FAIL.value
                "
                class="fl fail answered"
                >[{{ $t('m.fail') }}]</span
              >
              <span
                v-else-if="
                  list.state ===
                  $CONSTANT.Mission.FinishedCondition.REJECT.value
                "
                class="fl reject answered"
                >[{{ $t('m.reject') }}]</span
              >
              <span
                v-else-if="
                  list.state ===
                  $CONSTANT.Mission.FinishedCondition.HASISSUED.value
                "
                class="fl answered"
                >[{{ $t('m.hasIssued') }}]</span
              >
            </template>
          </div>
        </div>
      </div>
      <!-- </el-scrollbar> -->
    </div>
    <!--答题弹窗-->
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
          <span>{{ $t('m.trainTask') }}</span>
        </div>
        <div class="cyber-scroll-bar" style="height: 500px; overflow: auto">
          <answer-dialog
            ref="AnswerDialog"
            :task-stage="taskStage"
            :task-resource-id="taskResourceId"
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
import AnswerDialog from '@/components/TrainCommon/module/answerDialog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'TrainTask',
  components: {
    AnswerDialog,
  },
  props: {
    taskLists: {
      type: Array,
      default: () => [],
    },
    trainDescription: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: 'trainDescription',
      showTask: true,
      showTrainRecord: false,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      taskStage: '',
      taskName: '',
      taskResourceId: null,
      resource_id: '',
      index: null,
      childrenIndex: null,
    };
  },
  computed: {
    ...mapGetters(['theme']),
    hours() {
      let hoursName = '';
      if (this.trainDescription.duration_time === 1) {
        hoursName = this.$t('m.hours');
      } else {
        hoursName = this.$t('m.hour');
      }
      return hoursName;
    },
  },
  watch: {
    activeName: {
      handler(val, oldval) {
        if (val === 'traintask') {
          this.$emit('refershTask');
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  methods: {
    showTaskPanel() {
      this.showTask = !this.showTask;
    },
    gotoAnswer(list, titleName, index, childrenIndex) {
      this.index = index;
      this.childrenIndex = childrenIndex;
      this.taskResourceId = list.resource_id;
      this.taskStage = titleName;
      this.taskName = list.name || list.title;
      this.showAnswerDialog = true;
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
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.reportSuccess'));
          this.$emit('refreshData');
          this.showAnswerDialog = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cssAnimate {
  width: 21%;
  min-width: 350px;
  transition: all 0.5s ease;
}
</style>
<style lang="scss">
.leftContentNormal {
  width: calc(100% - 11px);
  transition: all 0.5s ease;
}
.leftContentAnimate {
  width: 0;
  transition: all 0.9s ease;
}
.cssAnimateRight {
  width: 1px;
  transition: all 0.5s ease;
}
.right-combat {
  .cb-tabs .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: 0;
  }
  height: 100%;
  position: absolute;
  right: 0;
  z-index: 2;
  .tabsDetail {
    width: calc(100% - 92px);
    height: 42px;
    padding: 34px 46px 0;
    // border-radius: 21px;
  }
  .title-name {
    padding: 15px 0 15px 15px;
    .linear {
      width: 3px;
      height: 16px;
      background: linear-gradient(
        0deg,
        rgba(30, 163, 254, 1),
        rgba(0, 224, 232, 1)
      );
      border-radius: 2px;
    }
    span {
      padding-left: 15px;
      color: #1ea3fe;
      font-size: 16px;
      line-height: 16px;
      // display: block;
      float: left;
    }
  }
  .btn-left {
    cursor: pointer;
    width: 20px;
    height: 50px;
    border-radius: 2px 0 0 2px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    top: 34px;
    left: -20px;
    z-index: 10;
    svg {
      font-size: 12px !important;
    }
  }

  .task-content {
    height: 100%;
    position: absolute;
    right: 0;
    .el-scrollbar {
      height: calc(100% - 90px);
    }
    .el-scrollbar__view {
      height: calc(100% - 90px);
      padding: 0;
    }
    .el-scrollbar__bar.is-horizontal {
      height: 0;
      left: 0;
    }
    .task-lists {
      width: 100%;
      height: calc(100% - 85px);
      box-sizing: border-box;
      padding: 0 24px 0;
      overflow-y: auto;
      .task-list {
        width: 100%;
        .task-stage {
          width: 100%;
          padding: 24px 0 10px;
          .left-stage {
            width: 30%;
            margin-top: 10px;
          }
          .stage-name {
            position: relative;
            width: 100%;
            height: 24px;
            margin: 0 2%;
            padding-left: 18px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            display: inline-block;
            // font-weight: 300;
          }
          .stage-name::before {
            position: absolute;
            top: 6px;
            left: 2px;
            content: '';
            width: 6px;
            height: 8px;
          }
          .right-stage {
            width: 30%;
            transform: rotateY(180deg);
            margin-top: 10px;
          }
        }
      }
    }
    .task-set {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin: 0 0 0 2px;
      &:hover {
        cursor: pointer;
        width: 100%;
        height: 40px;
        // z-index: 99;
        // padding-left: 5px;
        span:first-child {
          -webkit-background-clip: text;
        }
      }
      span:first-child {
        // display: block;
        font-size: 14px;
        // width: 100%;
      }
      .answered-name {
        display: inline-block;
        width: 50%;
      }
      .answered {
        display: inline-block;
        // width: 30%;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 40px;
        height: 40px;
        padding-left: 20px;
        padding-right: 10px;
      }
    }
    .train-record {
      position: absolute;
      left: 50px;
      bottom: 30px;
      width: 72%;
      height: 48px;
      background: rgba(132, 144, 159, 0.2);
      border-radius: 24px;
      line-height: 48px;
      .text {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(192, 204, 231, 1);
        margin-left: 20px;
      }

      .btn_radius {
        cursor: pointer;
        width: 88px;
        height: 24px;
        text-align: center;
        line-height: 22px;
        border: 1px solid;
        border-color: rgba(44, 163, 238, 1);
        // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
        border-radius: 12px;
        margin: 10px 10px 0 10px;
        i {
          font-size: 12px;
          color: transparent;
          background: linear-gradient(
            180deg,
            rgba(57, 239, 255, 1) 0%,
            rgba(58, 165, 255, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}
.fa-file-text-o:before {
  color: #35c1ee;
  position: absolute;
  top: 24px;
  right: 60px;
}
.info-content {
  width: 100%;
  height: 100%;
  // padding-left: 50px;
  padding: 0 24px 0;
  box-sizing: border-box;
}
.train-info {
  width: 100%;
  margin: 24px 0 0 0;

  .info-description-name {
    width: 80px;
    i {
      font-size: 8px;
      color: #8b94b1;
      line-height: 1px;
    }
    i::before {
      content: '';
    }
    span {
      margin: 0 0 10px 10px;
      font-size: 14px;
      color: #c0cce7;
    }
  }
  .info-description-right {
    margin-left: 10px;
    width: calc(100% - 110px);
    word-break: break-all;
  }
  .skill-box {
    max-width: 100%;
    font-size: 14px;
    margin-bottom: 6px;
    display: inline-block;
    padding: 2px 11px;
    cursor: pointer;
  }
}
.record {
  .el-dialog__header {
    text-align: left !important;
    span {
      display: inline-block;
    }
    .el-dialog__body {
      height: 100% !important;
    }
  }
}
.task-answer-dialog-team {
  width: 100%;
  height: 100%;
  .el-dialog {
    // height: 85%;
  }
  .el-dialog__header {
    // text-align: center !important;
    // padding: 20px 0 20px 29px !important;
    // vertical-align: none !important;
    // border-bottom: 1px solid rgba(54, 67, 91, 1);
    // span {
    //   color: rgba(237, 242, 255, 1) !important;
    // }
  }
  .el-dialog__body {
    padding: 20px 40px !important;
    // .el-scrollbar {
    //   height: calc(100% - 200px);
    // }
    .el-scrollbar__view {
      // height: calc(100% - 200px);
    }
    // .el-scrollbar__bar.is-horizontal {
    //   height: 0;
    //   left: 0;
    // }
  }
  .el-dialog__footer {
    // margin-top: 30px;
    text-align: center;
    .dialog-footer {
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
  }
}
</style>
