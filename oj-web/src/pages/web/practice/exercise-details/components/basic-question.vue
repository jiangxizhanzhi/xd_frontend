<template>
  <div class="basic-question basic-question-theory">
    <template v-if="!loadingStatus">
      <div class="main-content" v-if="questionDatas">
        <basic-title-theory
          :difficultName="topicDifficult"
          :difficult="questionDatas && questionDatas.difficulty"
          :name="categoryName"
          :content="questionDatas && questionDatas.content"
          :isCollection="isCollection"
          @collection-change="collection"
          @show-note="showNote"
          :knowledgeDatas="knowledgeDatas"
          :solved="topicSolved"
          :showNote="true"
          :showStatus="true"
        ></basic-title-theory>
        <div class="topic-content-com">
          <TopicTitle
            :name="topicType"
            :content="questionDatas && questionDatas.content"
          ></TopicTitle>
          <div class="topic-options">
            <single-choice
              v-if="QuestionType == QUESTIONTYPE.SingleChoice"
              ref="singleAnswerRules"
              :isRule="false"
              v-model="singleAnswer"
              :isSolved="
                isSolved || (solvedDetail && solvedDetail.is_solved)
                  ? solvedDetail.is_solved
                  : false
              "
              :data="singleList"
              :correct-data="
                solvedDetail && solvedDetail.correct_answer
                  ? solvedDetail.correct_answer
                  : ''
              "
              @sendSingleChoice="getBasicAnswerSingleJudgment"
            ></single-choice>
            <multiple-choice
              v-else-if="QuestionType == QUESTIONTYPE.MultipleChoice"
              ref="multipleAnswerRules"
              :isRule="false"
              v-model="multipleAnswer"
              :isSolved="
                isSolved || (solvedDetail && solvedDetail.is_solved)
                  ? solvedDetail.is_solved
                  : false
              "
              :data="multipleList"
              :correct-data="
                solvedDetail && solvedDetail.correct_answer
                  ? solvedDetail.correct_answer
                  : ''
              "
              @sendMultiple="getBasicAnswer"
            ></multiple-choice>
            <judgment-questions
              v-else-if="QuestionType == QUESTIONTYPE.JudgmentQustion"
              ref="judgmentAnswerRules"
              :isRule="false"
              v-model="judgmentAnswer"
              :isSolved="isSolved"
              :data="judgmentList"
              :correct-data="
                solvedDetail && solvedDetail.correct_answer
                  ? solvedDetail.correct_answer
                  : ''
              "
              @sendJudgment="getBasicAnswerSingleJudgment"
            ></judgment-questions>
            <completion
              v-else-if="QuestionType == QUESTIONTYPE.Completion"
              ref="completionAnswerRules"
              :isRule="false"
              :isSolved="isSolved"
              :data="completionList"
              :changeTransfer="true"
              @sendCompletion="getBasicAnswer"
            ></completion>
            <short-answer
              v-else-if="QuestionType == QUESTIONTYPE.ShortAnswer"
              ref="shortAnswerRules"
              :isRule="false"
              v-model="shortAnswerList"
              :isSolved="isSolved"
              :changeTransfer="true"
              @sendShortAnswer="getBasicAnswer"
            ></short-answer>
            <div class="keyWords" v-show="shortAnswerKeyword.length > 0">
              <div class="title ft14">
                {{ $t('m.exercise.keywords') }}
              </div>
              <div class="keyWordList">
                <div
                  class="keyWord"
                  v-for="(item, index) in shortAnswerKeyword"
                  :key="index"
                >
                  <span class="ft14">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="status-tip"> -->
        <!-- <div
            class="success-status-tip"
            v-show="submitStatus == SUBMITSTATUS.SubmittedCorrectly"
          >
            <template v-if="QuestionType == QUESTIONTYPE.ShortAnswer">
              <span class="shortWarn">{{ $t('course.shortAnswerWarn') }}</span>
            </template>
            <template v-else>
              <cb-iconfont
                type="icon-chenggong"
                themedColor="green-color"
              ></cb-iconfont>
            </template>
            <span class="blue ft14" style="color: var(--neutral8)">
              {{ $t('m.exercise.twoSecond') }}</span
            ><span class="ft14" style="color: var(--neutral8)">
              {{ $t('m.exercise.toNext') }}</span
            >
          </div> -->
        <!-- <div
            class="error-status-tip"
            v-show="submitStatus == SUBMITSTATUS.SubmittedError"
          >
            <cb-iconfont
              type="icon-shibai"
              themedColor="red-color"
            ></cb-iconfont>
            <span class="ft14" style="color: var(--neutral8)">{{
              $t('m.exercise.reAnswer')
            }}</span>
          </div> -->
        <!-- </div> -->
        <div class="flex-center">
          <!-- submitStatus !== SUBMITSTATUS.SubmittedCorrectly && -->
          <status-btn
            v-show="
              !isSolved &&
              QuestionType !== QUESTIONTYPE.SingleChoice &&
              QuestionType !== QUESTIONTYPE.JudgmentQustion
            "
            btnSize="large"
            :icon-name="'icon-xiafa1'"
            :btn-name="$t('m.exercise.submit')"
            :status-class="'submit-btn'"
            :disableSubmit="disableSubmit"
            @click.native="submit()"
          ></status-btn>
          <!-- <status-btn
            v-show="isSolved"
            :icon-name="'icon-xuanze1'"
            :btn-name="$t('m.exercise.solved')"
            :status-class="'orange-btn'"
          ></status-btn> -->
          <!-- <status-btn
            v-show="submitStatus == SUBMITSTATUS.SubmittedCorrectly"
            :icon-name="'icon-xuanze1'"
            :btn-name="$t('m.exercise.submitted')"
            :status-class="'green-btn'"
          ></status-btn> -->
        </div>
      </div>
      <div
        class="empty-div"
        v-if="!questionDatas"
        style="width: 100%; height: 420px"
      >
        <empty></empty>
      </div>
    </template>
  </div>
</template>
<script>
import empty from '@/components/empty/index.vue';
import singleChoice from '@/components/exercise-select/single-choice-theory.vue';
import multipleChoice from '@/components/exercise-select/multiple-choice-theory.vue';
import judgmentQuestions from '@/components/exercise-select/judgment-questions-theory.vue';
import completion from '@/components/exercise-select/completion-theory.vue';
import shortAnswer from '@/components/exercise-select/short-answer-theory.vue';
import TopicTitle from '@/components/exercise-select/topic-title.vue';
import statusBtn from '@/components/button/status-btn.vue';
import { SUBMITSTATUS, QUESTIONTYPE, THEORYSTATUSTYPE } from './../../constant';
import _ from 'lodash';
import BasicTitleTheory from '@/components/exercise-select/basic-title-theory.vue';
export default {
  name: '',
  components: {
    empty,
    singleChoice,
    multipleChoice,
    judgmentQuestions,
    completion,
    shortAnswer,
    statusBtn,
    TopicTitle,
    BasicTitleTheory,
  },
  props: {
    submitStatus: {
      // 0未提交 1提交错误 2 提交正确
      type: Number,
      default: SUBMITSTATUS.NotSubmitted,
    },
    loadingStatus: {
      type: Boolean,
      default: true,
    },
    type: {
      type: Number,
      default: null,
    },
    resourceId: {
      type: String,
      default: '',
    },
    questionDatas: {
      type: Object,
      default: null,
    },
    categoryName: {
      type: String,
      default: '',
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
    typeList: {
      type: Array,
      default: [],
    },
    difficultList: {
      type: Array,
      default: [],
    },
    solvedDetail: {
      type: Object,
      default: {},
    },
    topicSolved: {
      type: Number,
      default: THEORYSTATUSTYPE.NotStart,
    },
  },
  data() {
    return {
      SUBMITSTATUS,
      QUESTIONTYPE,
      QuestionType: null,
      knowledgeDatas: null, // 知识点
      isSolved: false, // false未解决 true已解决
      submitAnswer: null,
      multipleAnswer: [],
      multipleList: [],
      singleAnswer: '',
      singleList: [],
      judgmentAnswer: '',
      judgmentList: [
        {
          name: this.$t('m.exercise.correct'), // '正确'
          label: 'A',
        },
        {
          name: this.$t('m.exercise.error'), // '错误'
          label: 'B',
        },
      ],
      completionList: {},
      shortAnswerList: '',
      shortAnswerKeyword: [], // 简答关键字
      disableSubmit: true,
    };
  },
  computed: {
    language() {
      return this.$store.state.app.language;
    },
    topicType() {
      // 题目类型
      const filterData = _.filter(this.typeList, (item) => {
        return item.code === this.questionDatas.theory_type;
      });
      return filterData && filterData[0] ? filterData[0].name : '';
    },
    topicDifficult() {
      // 题目难度
      const filterData = _.filter(this.difficultList, (item) => {
        return item.code === this.questionDatas.difficulty;
      });
      return filterData && filterData[0] ? filterData[0].name : '';
    },
  },
  watch: {
    // loadingStatus: {
    //   handler(nv, ov) {
    //     console.log(nv, '2');
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    questionDatas: {
      handler(val, oldval) {
        const that = this;
        this.knowledgeDatas = JSON.parse(_.get(val, 'knowledge', '') || null);
        this.QuestionType = _.get(val, 'theory_type', ''); // 题型(0:单选,1:多选,2:判断,3:填空,4:简答)
        const resolved_detail = _.get(val, 'resolved_detail', '');
        this.isSolved = _.get(resolved_detail, 'is_solved', '') || false;
        const submit_answer = _.get(resolved_detail, 'submit_answer', '');
        if (this.QuestionType === QUESTIONTYPE.SingleChoice) {
          that.singleList = [];
          const data = JSON.parse(_.get(val, 'option'));
          for (const key in data) {
            const item = {
              name: `${data[key]}`,
              label: key,
            };
            that.singleList.push(item);
          }
          that.isSolved
            ? (that.singleAnswer = submit_answer)
            : (that.singleAnswer = '');
        } else if (that.QuestionType === QUESTIONTYPE.MultipleChoice) {
          const data = JSON.parse(_.get(val, 'option'));
          for (const key in data) {
            const item = {
              name: `${data[key]}`,
              label: key,
            };
            that.multipleList.push(item);
          }
          that.isSolved
            ? (that.multipleAnswer = submit_answer.split('|'))
            : (that.multipleAnswer = []);
        } else if (that.QuestionType === QUESTIONTYPE.JudgmentQustion) {
          that.isSolved
            ? (that.judgmentAnswer = submit_answer)
            : (that.judgmentAnswer = '');
        } else if (that.QuestionType === QUESTIONTYPE.Completion) {
          const data = _.get(val, 'blank_count');
          that.completionList = {};
          if (that.isSolved) {
            console.log(submit_answer);
            that.completionList = JSON.parse(submit_answer) || {};
          } else {
            _.times(data, (item) => {
              that.completionList[item] = '';
            });
          }
        } else if (that.QuestionType === QUESTIONTYPE.ShortAnswer) {
          that.isSolved
            ? (that.shortAnswerList = submit_answer)
            : (that.shortAnswerList = '');
          that.shortAnswerKeyword = JSON.parse(
            _.get(val, 'resolved_detail.keyword', '') || '[]',
          );
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  beforeDestroy() {},
  mounted() {},
  methods: {
    collection() {
      this.$emit('collection-change', this.isCollection);
    },
    clearBasicDatas() {
      this.QuestionType = null; // 题目类型
      this.isSolved = false;
      this.submitAnswer = null;
      this.singleList = [];
      this.multipleList = [];
      this.completionList = {};
      this.singleAnswer = '';
      this.multipleAnswer = [];
      this.judgmentAnswer = '';
      this.shortAnswerList = '';
      this.shortAnswerKeyword = []; // 简答关键字
    },
    clearFormValid() {
      // 清除校验
      if (this.QuestionType === QUESTIONTYPE.SingleChoice) {
        this.$refs['singleAnswerRules'].resetSingleAnswer();
      } else if (this.QuestionType === QUESTIONTYPE.MultipleChoice) {
        this.$refs['multipleAnswerRules'].resetMultipleAnswer();
      } else if (this.QuestionType === QUESTIONTYPE.JudgmentQustion) {
        this.$refs['judgmentAnswerRules'].resetJudgmentAnswer();
      } else if (this.QuestionType === QUESTIONTYPE.Completion) {
        this.$refs['completionAnswerRules'].resetCompletionAnswer();
      } else if (this.QuestionType === QUESTIONTYPE.ShortAnswer) {
        this.$refs['shortAnswerRules'].resetShortAnswer();
      }
    },
    commonValidate(type) {
      // 校验
      let flag = false;
      if (type === QUESTIONTYPE.SingleChoice) {
        flag = this.$refs['singleAnswerRules'].validateSingleAnswer();
      } else if (type === QUESTIONTYPE.MultipleChoice) {
        flag = this.$refs['multipleAnswerRules'].validateMultipleAnswer();
      } else if (type === QUESTIONTYPE.JudgmentQustion) {
        flag = this.$refs['judgmentAnswerRules'].validateJudgmentAnswer();
      } else if (type === QUESTIONTYPE.Completion) {
        flag = this.$refs['completionAnswerRules'].validateCompletionAnswer();
      } else if (type === QUESTIONTYPE.ShortAnswer) {
        flag = this.$refs['shortAnswerRules'].validateShortAnswer();
      }
      return flag;
    },
    getBasicAnswerSingleJudgment(val) {
      // 单选 简答 提交答案
      this.disableSubmit = val ? false : true;
      this.submitAnswer = val;
      this.submit();
    },
    getBasicAnswer(val) {
      if (this.QuestionType === QUESTIONTYPE.Completion) {
        const arr = Object.values(JSON.parse(val));
        const haveNoEmpty = arr.some((val) => val !== '');
        this.disableSubmit = haveNoEmpty ? false : true;
      } else {
        this.disableSubmit = val ? false : true;
      }

      // 获取多选判断简答答案获取
      this.submitAnswer = val;
    },
    submit() {
      if (!this.disableSubmit) {
        const flag = this.commonValidate(this.QuestionType);
        if (flag) {
          this.$emit('submit-basic-answer', this.submitAnswer);
        }
      }
    },
    showNote() {
      this.$emit('show-note');
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-question {
  min-height: 360px;
  border-radius: 4px;
  padding: 0 0 20px 0;
  .status-tip {
    height: 20px;
    text-align: center;
    margin-bottom: 12px;
    .shortWarn {
      font-size: 14px;
      color: var(--orange-color);
    }
  }
  .topic-options {
    min-height: 225px;
    // padding-top: 10px;
    width: 100%;
  }
}
</style>
<style lang="scss">
.basic-question-theory {
  .practice-basic-title-topic {
    .markdown-body {
      p {
        font-size: 16px !important;
      }
    }
  }
  .topic-options {
    .markdown-body {
      p {
        font-size: 16px !important;
      }
      img {
        max-width: 400px;
      }
    }
  }
}
</style>
