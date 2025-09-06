<template>
  <!--  组卷考试页面 -->
  <cb-inner-page :background="false">
    <div class="volume-exam-wrapper">
      <div class="header">
        <headerColumn
          :type="9"
          :isExam="true"
          @prev-change="prev"
          @next-change="next"
          :currentIndex="numIndex"
          :totalIndex="totalIndex"
          @go-back="goBack"
          @hand-exam="handExam"
        ></headerColumn>
      </div>
      <div class="content">
        <div class="answer-sheet answer-com cyber-scroll-bar-small">
          <AnswerSheet
            :notStart="paperSummary && paperSummary.not_start"
            :right="paperSummary && paperSummary.right"
            :wrong="paperSummary && paperSummary.wrong"
            :list="paperSummary && paperSummary.practice_solved"
            :currentTopic="currentTopic"
            @topic-click="topicClick"
          />
        </div>
        <div class="answer-area answer-com cyber-scroll-bar-small">
          <div v-if="refreshTopic" class="headline">
            <basic-title-theory
              :difficultName="topicDifficult"
              :difficult="questionDatas && questionDatas.difficulty"
              :name="categoryName"
              :isCollection="isCollection"
              @collection-change="collection"
              :knowledgeDatas="knowledgeDatas"
              :solved="topicSolved"
            >
            </basic-title-theory>
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
                  :isSolved="isSolved"
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
                  :isSolved="isSolved"
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
                <div
                  class="keyWords"
                  v-show="
                    QuestionType == QUESTIONTYPE.ShortAnswer &&
                    shortAnswerKeyword.length > 0
                  "
                >
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
              <div class="flex-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import headerColumn from '@/pages/web/practice/exercise-details/components/header-column-theory.vue';
import AnswerSheet from './components/answer-sheet.vue';
import BasicTitleTheory from '@/components/exercise-select/basic-title-theory.vue';
import TopicTitle from '@/components/exercise-select/topic-title.vue';

import singleChoice from '@/components/exercise-select/single-choice-theory.vue';
import multipleChoice from '@/components/exercise-select/multiple-choice-theory.vue';
import judgmentQuestions from '@/components/exercise-select/judgment-questions-theory.vue';
import completion from '@/components/exercise-select/completion-theory.vue';
import shortAnswer from '@/components/exercise-select/short-answer-theory.vue';
import statusBtn from '@/components/button/status-btn.vue';

import {
  getPaperSummary,
  getPaperTopicDetail,
  submitPaperTopicAnswer,
  collectionPaperTopic,
  submitPaper,
} from '@/api/practice.ts';
import { getComConstantsConfig } from '@/api/common.js';
import {
  TYPE,
  SUBMITSTATUS,
  QUESTIONTYPE,
  THEORYSTATUSTYPE,
  COLLECTION_TYPE,
} from '../constant';
export default {
  components: {
    headerColumn,
    AnswerSheet,
    BasicTitleTheory,
    TopicTitle,
    singleChoice,
    multipleChoice,
    judgmentQuestions,
    completion,
    shortAnswer,
    statusBtn,
  },
  data() {
    return {
      TYPE,
      SUBMITSTATUS,
      QUESTIONTYPE,
      THEORYSTATUSTYPE,
      resourceId: '',
      totalIndex: null,
      currentTopic: '', // 当前选中的题号
      paperSummary: {},
      questionDatas: {}, // 单个题目详情

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
      isCollection: false,
      topicSolved: THEORYSTATUSTYPE.NotStart, // 0尝试过 1已解决 2未开始
      solvedDetail: {}, // 用于单选 多选 判断正确答案

      typeList: [], // 类型列表
      difficultList: [], // 难度列表
      refreshTopic: false, // 刷新右侧题目区域

      recordFrom: '', // 记录从哪来
      timer: null, // 用于答题成功2秒后跳转下一题
    };
  },
  computed: {
    numIndex() {
      const { paperSummary = {}, currentTopic = '' } = this;
      if (paperSummary.practice_solved) {
        const num = paperSummary.practice_solved.findIndex(
          (item) => item.practice_id === currentTopic,
        );
        const numIndex = num === -1 ? null : num + 1;
        return numIndex;
      }
      return null;
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
    categoryName() {
      // 方向分类名称
      const { categorys = [], questionDatas = null } = this;
      let categoryNameObj;
      let categoryName;
      if (questionDatas) {
        categoryNameObj = _.find(
          categorys,
          (ele) => ele.resource_id === questionDatas.category_id,
        );
        categoryName = _.get(categoryNameObj, 'name', '');
      }
      return categoryName;
    },
  },
  created() {
    this.resourceId = this.$route.params && this.$route.params.id;
    this.recordFrom = this.$route.query && this.$route.query.from;
    this.getTopicType();
    this.getDifficultList();
    this.getCategory();
  },
  mounted() {
    this.getPaperSummaryTh();
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        this.typeList = arr;
      });
    },
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.difficultList = arr;
      });
    },
    getCategory() {
      // 理论基础-方向数据
      const that = this;
      // 分类类型 0=理论基础 2=实践操作
      this.$request
        .get(
          '/oj/practice/category/list',
          {
            practice_type: TYPE.Rationale,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          that.categorys = _.get(resp, 'data.data');
        });
    },
    // 获取左侧答题卡详情
    getPaperSummaryTh() {
      getPaperSummary({
        paper_id: this.resourceId,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        this.paperSummary = data;
        this.totalIndex = this.paperSummary?.practice_solved.length;
        this.currentTopic =
          this.paperSummary?.practice_solved?.[0]?.practice_id;
        this.getSingleTopicDetail(this.currentTopic);
      });
    },
    // 获取单个题目详情
    getSingleTopicDetail(practice_id) {
      this.refreshTopic = false;
      this.shortAnswerKeyword = [];
      getPaperTopicDetail({
        practice_id: practice_id,
      }).then((res) => {
        const val = _.get(res, 'data.data');
        this.questionDatas = val;
        this.isCollection = _.get(val, 'is_collection', false);
        this.knowledgeDatas = JSON.parse(_.get(val, 'knowledge', '') || null);
        this.QuestionType = _.get(val, 'theory_type', ''); // 题型(0:单选,1:多选,2:判断,3:填空,4:简答)
        // const resolved_detail = _.get(val, 'resolved_detail', '');
        this.topicSolved = _.get(val, 'solved', '');
        let resolved_detail = null;
        if (this.topicSolved === THEORYSTATUSTYPE.Solved) {
          resolved_detail = {
            correct_answer: _.get(val, 'answer', ''),
            is_solved: true,
            keyword: _.get(val, 'keyword', null),
            submit_answer: _.get(val, 'answer', ''),
          };
        } else if (this.topicSolved === THEORYSTATUSTYPE.Tried) {
          resolved_detail = {
            is_solved: false,
            submit_answer: _.get(val, 'answer', ''), // 手动加的
          };
        }
        this.isSolved = _.get(resolved_detail, 'is_solved', '') || false;
        this.solvedDetail = resolved_detail;
        const submit_answer = _.get(resolved_detail, 'submit_answer', '');
        if (this.QuestionType === QUESTIONTYPE.SingleChoice) {
          this.singleList = [];
          const data = JSON.parse(_.get(val, 'option'));
          for (const key in data) {
            const item = {
              name: `${data[key]}`,
              label: key,
            };
            this.singleList.push(item);
          }
          this.singleAnswer = submit_answer;
          // this.isSolved
          //   ? (this.singleAnswer = submit_answer)
          //   : (this.singleAnswer = '');
        } else if (this.QuestionType === QUESTIONTYPE.MultipleChoice) {
          this.multipleList = [];
          const data = JSON.parse(_.get(val, 'option'));
          for (const key in data) {
            const item = {
              name: `${data[key]}`,
              label: key,
            };
            this.multipleList.push(item);
          }
          // this.isSolved
          //   ? (this.multipleAnswer = submit_answer.split('|'))
          //   : (this.multipleAnswer = []);
          this.multipleAnswer = submit_answer.split('|');
        } else if (this.QuestionType === QUESTIONTYPE.JudgmentQustion) {
          // this.isSolved
          //   ? (this.judgmentAnswer = submit_answer)
          //   : (this.judgmentAnswer = '');
          this.judgmentAnswer = submit_answer;
        } else if (this.QuestionType === QUESTIONTYPE.Completion) {
          const data = _.get(val, 'blank_count');
          this.completionList = {};
          // if (this.isSolved) {
          if (submit_answer) {
            this.completionList = JSON.parse(submit_answer) || {};
          } else {
            _.times(data, (item) => {
              this.completionList[item] = '';
            });
          }
        } else if (this.QuestionType === QUESTIONTYPE.ShortAnswer) {
          // this.isSolved
          //   ? (this.shortAnswerList = submit_answer)
          //   : (this.shortAnswerList = '');
          this.shortAnswerList = submit_answer;
          this.shortAnswerKeyword = JSON.parse(
            _.get(resolved_detail, 'keyword', '') || '[]',
          );
        }
        this.refreshTopic = true;
      });
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
    // 单个题目答题
    submit() {
      if (!this.disableSubmit) {
        submitPaperTopicAnswer({
          resource_id: this.currentTopic,
          submit_answer: this.submitAnswer,
        }).then((res) => {
          const data = _.get(res, 'data.data.status');
          this.topicSolved = data;
          this.isSolved = data === THEORYSTATUSTYPE.Solved ? true : false;
          const filterIndex = _.findIndex(
            this.paperSummary.practice_solved,
            (item) => {
              return item.practice_id === this.currentTopic;
            },
          );
          if (data === THEORYSTATUSTYPE.Solved) {
            this.$set(
              this.paperSummary.practice_solved[filterIndex],
              'solved',
              THEORYSTATUSTYPE.Solved,
            );
            if (
              this.questionDatas.theory_type === QUESTIONTYPE.SingleChoice ||
              this.questionDatas.theory_type === QUESTIONTYPE.MultipleChoice ||
              this.questionDatas.theory_type === QUESTIONTYPE.JudgmentQustion
            ) {
              this.solvedDetail = {
                correct_answer: this.submitAnswer,
                is_solved: true,
              };
            }
            this.topicSolved = THEORYSTATUSTYPE.Solved;
            if (this.numIndex < this.paperSummary?.practice_solved.length) {
              // 是否是最后一题
              // that.submitStatus = SUBMITSTATUS.SubmittedCorrectly; // 0未提交 1提交错误 2 提交正确
              // let timer1 = null;
              if (this.questionDatas.theory_type !== QUESTIONTYPE.ShortAnswer) {
                this.$message({
                  type: 'success',
                  message: this.$t('practice.answerCorrectly'),
                  duration: 1000,
                });
              } else {
                this.$message({
                  type: 'success',
                  message: this.$t('course.shortAnswerWarn'),
                  duration: 2000,
                });
              }

              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                this.next();
              }, 2000);
            } else {
              this.getSingleTopicDetail(this.currentTopic);
            }
          } else {
            // that.submitStatus = SUBMITSTATUS.SubmittedError;
            this.topicSolved = THEORYSTATUSTYPE.Tried;
            this.$message({
              type: 'error',
              message: this.$t('practice.answerWrong'),
              duration: 2000,
            });
            this.$set(
              this.paperSummary.practice_solved[filterIndex],
              'solved',
              THEORYSTATUSTYPE.Tried,
            );
            // let timer2 = null;
            // clearTimeout(timer2);
            // timer2 = setTimeout(() => {}, 2000);
          }
          // 目的是获取左侧答题卡 数量统计
          getPaperSummary({
            paper_id: this.resourceId,
          }).then((res) => {
            const data = _.get(res, 'data.data');
            this.paperSummary = data;
          });
        });
      }
    },

    // 左侧答题卡点击题目
    topicClick(val) {
      this.currentTopic = val.practice_id;
      this.getSingleTopicDetail(this.currentTopic);
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    prev() {
      // 上一题
      if (this.numIndex > 1) {
        this.currentTopic =
          this.paperSummary?.practice_solved[this.numIndex - 2].practice_id;
        this.getSingleTopicDetail(this.currentTopic);
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    next() {
      // 下一题
      if (this.numIndex < this.paperSummary?.practice_solved.length) {
        this.currentTopic =
          this.paperSummary?.practice_solved[this.numIndex].practice_id;
        this.getSingleTopicDetail(this.currentTopic);
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    goBack() {
      // 退出答题
      let displayText =
        this.paperSummary.not_start > 0
          ? this.$t('practice.thereAreStill') +
            this.paperSummary.not_start +
            this.$t('practice.noHaveConfirmExit')
          : this.$t('practice.confirmExit');
      this.$confirm(displayText, '', {
        confirmButtonText: this.$t('careerSystem.confirm'),
        cancelButtonText: this.$t('careerSystem.cancel'),
        type: 'warning',
      })
        .then(() => {
          // 从哪来回哪去
          if (this.recordFrom === 'volume-normal') {
            // 从正常练习页面来
            this.$router.push({
              path: `/practice`,
            });
          } else if (this.recordFrom === 'volume-record') {
            // 从组卷记录页面来
            this.$router.push({
              path: `/practice/volume-record`,
            });
          } else if (this.recordFrom === 'volume-detail') {
            // 从组卷详情页面来
            this.$router.push({
              path: `/practice/volume-detail/${this.resourceId}`,
            });
          }
        })
        .catch(() => {});
    },
    handExam() {
      let displayText =
        this.paperSummary.not_start > 0
          ? this.$t('practice.thereAreStill') +
            this.paperSummary.not_start +
            this.$t('practice.noHaveConfirmSubmit')
          : this.$t('practice.confirmSubmit');
      this.$confirm(displayText, '', {
        confirmButtonText: this.$t('careerSystem.confirm'),
        cancelButtonText: this.$t('careerSystem.cancel'),
        type: 'warning',
      })
        .then(() => {
          submitPaper({
            paper_id: this.resourceId,
          }).then((res) => {
            this.$message.success(this.$t('practice.handExamSuccess'));
            // 跳转组卷详情
            this.$router.push({
              path: `/practice/volume-detail/${this.resourceId}`,
            });
          });
        })
        .catch(() => {});
    },
    collection() {
      collectionPaperTopic({
        is_collection: !this.isCollection,
        business_id: this.currentTopic,
        business_type: COLLECTION_TYPE.RELATION,
      }).then((res) => {
        this.isCollection = !this.isCollection;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.volume-exam-wrapper {
  height: inherit;
  position: relative;
  .header {
    margin-bottom: 12px;
    padding: 8px 0;
    background: var(--bg-color-2);
    border-radius: 4px;
  }
  .content {
    height: calc(100% - 64px);
    display: flex;
    align-items: flex-start;

    .answer-sheet {
      width: 279px;
      margin-right: 12px;
      min-height: 100px;
    }
    .answer-area {
      min-height: 100%;
      width: calc(100% - 291px);
    }
    .answer-com {
      max-height: 100%;
      overflow: auto;
      background: var(--bg-color-2);
      border-radius: 4px;
    }
    .topic-options {
      min-height: 225px;
      padding-top: 10px;
      width: 100%;
    }
  }
}
</style>
