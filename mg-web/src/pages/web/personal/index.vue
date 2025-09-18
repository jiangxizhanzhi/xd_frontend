<template>
  <cb-inner-page :background="false">
    <div class="base-info-wrapper com-bg">
      <UserInfo
        :showCourseTrain="showCourseTrain"
        @learnRecord="getLearnUpdate"
      />
    </div>
    <div class="personal-center-wrapper">
      <div class="left-content">
        <div class="my-schedule com-bg">
          <Block :title="$t('personal.mySchedule')">
            <day-pan />
          </Block>
        </div>
        <div v-if="showCourseTrain" class="competent-assessment com-bg">
          <Block :title="$t('personal.capabilityAssessment')">
            <CompetentAssessment :updateInfo="reloadAssessment" />
          </Block>
        </div>
        <div class="notice-info com-bg">
          <Block :title="$t('personal.bulletin')">
            <bulletin />
          </Block>
        </div>
      </div>
      <div class="right-content">
        <div class="content-wrapper">
          <cb-tabs
            v-if="showCourse || showTrain || showContest"
            v-model="activeName"
          >
            <cb-tab-pane
              v-if="showCourse"
              :label="$t('personal.trainingCourse')"
              name="course"
            >
              <!-- 学习统计 -->
              <div v-if="activeName == 'course'">
                <div v-if="isShow" class="person-statistical-learning">
                  <Block
                    :title="$t('personal.statisticalLearning')"
                    class="th-heard"
                  >
                  </Block>
                  <div class="top-style">
                    <div class="progress-style">
                      <div class="study-style ft14">
                        {{ $t('personal.postStudyRecord') }}
                      </div>
                      <learn-progress
                        :updateInfo="reloadAssessment"
                      ></learn-progress>
                    </div>
                    <div class="view-style">
                      <!-- 学习概览 -->
                      <div class="study-style ft14">
                        {{ $t('personal.learningView') }}
                      </div>
                      <learn-view></learn-view>
                    </div>
                  </div>
                  <!-- 学习记录 -->
                  <div class="record-style">
                    <div class="study-style ft14">
                      {{ $t('personal.studyRecord') }}
                    </div>
                    <learn-record></learn-record>
                  </div>
                  <!-- 我的学习任务 -->
                  <Block :title="$t('personal.myTask')" class="th-heard">
                  </Block>
                  <learn-task></learn-task>
                </div>
                <div v-else>
                  <my-content
                    :index-value="indexValue"
                    :toType="toType"
                    :toContent="toContent"
                    @isGoFn="nextFn"
                    @refreshMistake="myMistakeFn"
                  ></my-content>
                </div>
              </div>
            </cb-tab-pane>
            <cb-tab-pane
              v-if="showTrain"
              :label="$t('personal.combinedTrain')"
              name="training"
            >
              <comprehensive-training
                v-if="activeName == 'training'"
              ></comprehensive-training>
            </cb-tab-pane>
            <cb-tab-pane
              v-if="showContest"
              :label="$t('personal.contest')"
              name="contest"
            >
              <joust-competition
                v-if="activeName == 'contest'"
              ></joust-competition>
            </cb-tab-pane>
          </cb-tabs>
        </div>
        <!-- 课程训练对应 -->
        <div class="my-content" v-show="activeName === 'course' && showCourse">
          <span class="learn-style" @click="goFn(1)"
            >{{ $t('personal.myQuestion') }}（{{ questionTotal }}）
          </span>
          <span class="learn-style" @click="goFn(2)"
            >{{ $t('personal.myReply') }}（{{ replyTotal }}）</span
          >
          <span class="learn-style" @click="goFn(3)"
            >{{ $t('personal.myNotes') }}（{{ noteTotal }}）</span
          >
          <span class="learn-style" @click="goFn(4)"
            >{{ $t('personal.myCollection') }}（{{ collectionTotal }}）</span
          >
          <span class="learn-style" @click="goFn(5)">
            {{ $t('personal.myMistake') }}（{{ mistakeTotal }}）
          </span>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import topTitle from './components/top-title/index.vue';
import learnProgress from './components/learn-progress/index.vue';
import learnView from './components/learn-view/index.vue';
import learnRecord from './components/learn-record/index.vue';
import Block from '@/components/block';
import UserInfo from './components/user-info';
import DayPan from './components/day-plan';
import CompetentAssessment from './components/competent-assessment';
import Bulletin from './components/bulletin/index';
import ComprehensiveTraining from './components/comprehensive-training';
import MyContent from './components/my-content/index';
import LearnTask from './components/learn-task/index.vue';
import JoustCompetition from './components/joust-competition/index';
import {
  getMyMistake,
  getMyQsuestion,
  getMyReply,
  getMyNotes,
  getMyCollection,
} from '@/api/personal';
export default {
  components: {
    topTitle,
    learnProgress,
    learnView,
    learnRecord,
    Block,
    UserInfo,
    DayPan,
    CompetentAssessment,
    Bulletin,
    ComprehensiveTraining,
    MyContent,
    LearnTask,
    JoustCompetition,
  },
  data() {
    return {
      activeName: 'course',
      showCourseTrain: false,
      showCourse: false,
      showTrain: false,
      showContest: false,
      isShow: true,
      indexValue: '1',
      mistakeTotal: 0,
      questionTotal: 0,
      replyTotal: 0,
      noteTotal: 0,
      collectionTotal: 0,
      reloadAssessment: false,
      toContent: '', // 练习进入到 错题mistake 笔记note 收藏collection等
      toType: '', // 理论theory 或 实操flag
    };
  },
  computed: {},
  watch: {
    activeName(val) {
      // console.log(val, 'activeName');
    },
    toContent(val) {
      if (val) {
        if (val === 'mistake') {
          this.goFn(5);
        } else if (val === 'note') {
          this.goFn(3);
        } else if (val === 'collection') {
          this.goFn(4);
        } else if (val === 'question') {
          this.goFn(1);
        } else if (val === 'replay') {
          this.goFn(2);
        }
      }
    },
  },
  created() {
    this.toContent = this.$route.query && this.$route.query.to;
    this.toType = this.$route.query && this.$route.query.type;
    this.myMistakeFn();
    this.myQuestionFn();
    this.myReply();
    this.myNote();
    this.myCollection();
    this.getModulesActived();
  },
  mounted() {},
  methods: {
    getLearnUpdate() {
      this.reloadAssessment = false;
      setTimeout(() => {
        this.reloadAssessment = true;
      }, 50);
    },
    myMistakeFn() {
      getMyMistake().then((res) => {
        this.mistakeTotal = res.data.data.total;
      });
    },
    myQuestionFn() {
      getMyQsuestion().then((res) => {
        this.questionTotal = res.data.data.total;
      });
    },
    myReply() {
      getMyReply().then((res) => {
        this.replyTotal = res.data.data.total;
      });
    },
    myNote() {
      getMyNotes().then((res) => {
        this.noteTotal = res.data.data.total;
      });
    },
    myCollection() {
      getMyCollection().then((res) => {
        this.collectionTotal = res.data.data.total;
      });
    },

    nextFn(val) {
      this.isShow = val;
    },
    goFn(value) {
      this.indexValue = value;
      this.isShow = false;
    },
    getModulesActived() {
      this.$request
        .get('/sys/activation/status', null, { baseURL: '/api/mp' })
        .then((res) => {
          const modulesItems = _.get(res, 'data.data.items', []);
          // const modulesItems = [
          //   { key: 'LCS-FUNC-CR-SHIXUN', value: '0', type: 1 }, //实训
          //   { key: 'LCS-FUNC-CR-JINGSAI', value: '0', type: 1 }, //竞赛
          //   { key: 'LCS-FUNC-CR-HUOTILOUDONG', value: '0', type: 1 }, //活体漏洞
          //   { key: 'LCS-FUNC-CR-ZHISHIKU', value: '0', type: 1 }, //知识库
          //   { key: 'LCS-FUNC-CR-SHENTOUSAI', value: '1', type: 1 }, //渗透赛
          //   { key: 'LCS-FUNC-CR-YUNWEISAI', value: '0', type: 1 }, //运维赛
          //   { key: 'LCS-FUNC-CR-ZONGHEXUNLIAN', value: '0', type: 1 }, //对抗演练
          //   { key: 'LCS-FUNC-CR-HONGLANDUIKANG', value: '1', type: 1 }, //红蓝对抗
          //   { key: 'LCS-FUNC-CR-CEPING', value: '0', type: 1 }, //测评
          //   { key: 'LCS-RES-CR-ACTIVENODES', value: '300', type: 2 }, //
          //   { key: 'LCS-RES-CR-EDITNODES', value: '300', type: 2 }, //
          // ];
          const haveOJ = _.findIndex(modulesItems, (item) => {
            return item.key === 'LCS-FUNC-CR-SHIXUN' && item.value === '1';
          });
          // 实战知识库在5.4不作为判断条件
          const haveTrain = _.findIndex(modulesItems, (item) => {
            return (
              (item.key === 'LCS-FUNC-CR-HUOTILOUDONG' && item.value === '1') ||
              (item.key === 'LCS-FUNC-CR-CEPING' && item.value === '1') ||
              (item.key === 'LCS-FUNC-CR-ZONGHEXUNLIAN' &&
                item.value === '1') ||
              (item.key === 'LCS-FUNC-CR-HONGLANDUIKANG' && item.value === '1')
            );
          });
          const haveCT = _.findIndex(modulesItems, (item) => {
            return (
              (item.key === 'LCS-FUNC-CR-JINGSAI' && item.value === '1') ||
              (item.key === 'LCS-FUNC-CR-SHENTOUSAI' && item.value === '1') ||
              (item.key === 'LCS-FUNC-CR-YUNWEISAI' && item.value === '1')
            );
          });
          if (haveOJ > -1 || haveTrain > -1) {
            // 授权激活了实训 训练 （包含漏洞、测评、对抗演练、红蓝对抗、实战知识库）模块
            this.showCourseTrain = true;
          }
          if (haveOJ > -1) {
            //授权实训模块
            this.showCourse = true;
          }
          if (haveTrain > -1) {
            // 授权活体漏洞、实战知识库、对抗演练、红蓝对抗、测评模块 任意一个
            this.showTrain = true;
          }
          if (haveCT > -1) {
            // 授权竞赛模块、渗透赛模块、运维赛模块任意一个
            this.showContest = true;
          }
          //  用于显示哪个tab
          if (this.showCourse) {
            this.activeName = 'course';
          } else if (this.showTrain) {
            this.activeName = 'training';
          } else if (this.showContest) {
            this.activeName = 'contest';
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.com-bg {
  background: var(--bg-color-2);
}
.cb-block {
  height: 100%;
  ::v-deep .cb-block-title-container {
    margin-bottom: 0 !important;
  }
}
.base-info-wrapper {
  width: 100%;
  height: 128px;
  margin-bottom: 16px;
  padding: 18px 24px;
  border-radius: 4px;
}
.personal-center-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  .left-content {
    height: 100%;
    width: 408px;
    margin-right: 16px;
    flex-shrink: 0;
    .my-schedule {
      width: 100%;
      height: 340px;
      margin-bottom: 16px;
      padding: 16px;
      border-radius: 4px;
    }
    .competent-assessment {
      width: 100%;
      height: 271px;
      margin-bottom: 16px;
      padding: 16px;
      border-radius: 4px;
    }
    .notice-info {
      width: 100%;
      padding: 16px;
      border-radius: 4px;
    }
  }
  .right-content {
    position: relative;
    width: calc(100% - 408px - 16px);
    height: 100%;
    background: var(--bg-color-2);
    padding: 0px 16px;
    border-radius: 4px;
    .content-wrapper {
      .cb-tabs {
        ::v-deep .el-tabs__header {
          margin: 0 0 0;
          // padding-bottom: 16px;
        }
      }
    }
    .th-heard {
      width: 100%;
      margin-bottom: 12px;
    }
    .top-style {
      height: 236px;
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      .progress-style {
        background: var(--bg-color-3);
        width: 65%;
        margin-right: 16px;

        .study-style {
          margin-left: 16px;
          margin-top: 12px;
        }
      }
      .view-style {
        background: var(--bg-color-3);
        width: 35%;
        .study-style {
          margin-left: 16px;
          margin-top: 12px;
        }
      }
    }
    .record-style {
      width: 100%;
      height: 269px;
      padding-top: 12px;
      background: var(--bg-color-3);
      margin-bottom: 24px;
      .study-style {
        margin-left: 16px;
      }
    }
  }
}
.my-content {
  position: absolute;
  top: 10px;
  right: 16px;
  .learn-style {
    font-size: 12px;
    color: var(--neutral8);
    margin-right: 16px;
    cursor: pointer;
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
<style lang="scss">
.person-statistical-learning {
  padding-top: 16px;
  .cb-block-title-container {
    // margin-top: 1px;
  }
}
</style>
