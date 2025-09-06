<template>
  <!-- 理论基础习题详情 -->
  <cb-inner-page :background="false">
    <div class="exercise-details-wrapper">
      <div class="exercise-header">
        <transition name="el-fade-in-linear">
          <div class="tool-box">
            <headerColumn
              :practiceSetId="practiceSetId"
              :type="type"
              :isCollection="isCollection"
              @collection-change="collection"
              @prev-change="prev"
              @next-change="next"
              :currentIndex="numIndex"
              :totalIndex="questionBankData.length"
              @go-topic-bank="goTopicBank"
              @go-back="goBack"
              :recordFrom="recordFrom"
            ></headerColumn>
          </div>
        </transition>
      </div>
      <div class="basic-questions cyber-scroll-bar-small">
        <div
          class="basic-questions-topic"
          v-if="type == TYPE.Rationale"
          v-loading="loadingBasic"
          element-loading-background="rgba(35, 44, 59, .7)"
        >
          <!-- :submitStatus="submitStatus" -->
          <basic-question
            class="left-area"
            ref="basicQuesPage"
            :resourceId="resourceId"
            :loadingStatus="loadingBasic"
            :questionDatas="questionDatas"
            :categoryName="categoryName"
            @submit-basic-answer="basicSubmitForm"
            :isCollection="isCollection"
            @collection-change="collection"
            @show-note="showNoteTh"
            :type-list="typeLists"
            :difficult-list="difficultLists"
            :solvedDetail="solvedDetail"
            :topicSolved="topicSolved"
          ></basic-question>
          <!-- 最近答题和相关好题区域，最多只展示5条数据 -->
          <relevant-topic
            :recent-answer-list="recentAnswerList"
            :revelant-questions="revelantQuestions"
            @toDetail="relevantTo"
          ></relevant-topic>
        </div>
        <div v-if="showNote" id="my-note-box-id" class="my-note-box">
          <Block :title="$t('m.exercise.myNotes')"></Block>
          <MyNote
            :mark-notes.sync="pracNotes"
            :restType="11"
            :businessType="BUSINESS_TYPE.OJ_WEB_THEORY"
            @submitNote="detailSubmitNote"
            :fileSize="1024 * 1024 * 1024"
          />
        </div>
      </div>

      <FixedWorkbook
        v-if="workbookDrawerShow"
        ref="refFixed"
        :type="TYPE.Rationale"
        :practiceSetName="questionDatas && questionDatas.practice_set_name"
        :practiceSetId="practiceSetId"
        :currentId="resourceId"
        :isShow="workbookDrawerShow"
        :recordFrom="recordFrom"
        @hide="hideDrawer"
      />
    </div>
  </cb-inner-page>
</template>
<script>
import basicQuestion from '@/pages/web/practice/exercise-details/components/basic-question.vue';
import RelevantTopic from './components/relevant-topic.vue';
// import operationQuestion from './components/operation-question.vue';
import headerColumn from './components/header-column-theory.vue';
import MyNote from '@/components/notes/my-notes.vue';
import Block from '@/components/block';
import FixedWorkbook from './components/fixed-workbook.vue';
import {
  TYPE,
  SUBMITSTATUS,
  THEORYSTATUSTYPE,
  COLLECTION_TYPE,
  QUESTIONTYPE,
} from './../constant';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  BUSINESS_TYPE,
} from '@/pages/web/course/constant.js';
import { getComConstantsConfig } from '@/api/common.js';
import _ from 'lodash';
import {
  getNoteDetail,
  postNoteSave,
  relevantTopics,
  tempRecentTopics,
} from '@/api/practice.ts';

export default {
  components: {
    basicQuestion,
    // operationQuestion,
    headerColumn,
    MyNote,
    Block,
    FixedWorkbook,
    RelevantTopic,
  },
  data() {
    return {
      TYPE,
      // SUBMITSTATUS,
      THEORYSTATUSTYPE,
      QUESTIONTYPE,
      NOTE_TYPE,
      RESOURCE_TYPE,
      BUSINESS_TYPE,
      websocketKeyProp: '',
      categorys: null,
      loadingBasic: false,
      loadingOpt: false,
      resourceId: String,
      questionDatas: null, // 考题data
      QuestionType: '', // 题目类型
      questionBankData: '', // 题目目录(用于查询上一题下一题)
      type: 0, // 理论基础，夺旗，真实漏洞
      // isScroller: false,
      isSolved: false, // false未解决 true已解决
      topicSolved: THEORYSTATUSTYPE.NotStart, // 0尝试过 1已解决 2未开始
      isCollection: false, // 收藏状态
      submitStatus: THEORYSTATUSTYPE.NotStart, // 0尝试过 1已解决 2未开始
      submitAnswer: null,
      pagename: {
        rationale: {
          id: TYPE.Rationale,
          name: this.$t('m.rationale'), // 理论基础
        },
        'capture-flag': {
          id: TYPE.CaptureFlag,
          name: this.$t('m.captureFlag'), // '夺旗解题'
        },
      },
      showNote: false,
      typeLists: [], //题目类型数据
      difficultLists: [], // 难度分类数据
      solvedDetail: {}, // 用于单选 多选 判断正确答案
      practiceSetId: '', // 习题集id
      workbookDrawerShow: false, //  习题集抽屉列表
      recordFrom: '', // 记录从哪来
      pracNotes: '', // 笔记
      recentAnswerList: [], // 最近答题数据，最多纪录5条
      revelantQuestions: [], // 相关好题数据，最多纪录5条
      relevantIds: [],
    };
  },
  computed: {
    numIndex() {
      // 题号
      const { questionBankData = [], resourceId = '' } = this;
      const num = questionBankData.indexOf(resourceId);
      const numIndex = num === -1 ? null : num + 1;
      return numIndex;
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
    // this.type = this.pagename[this.$route.params.type].id;
    this.resourceId = this.$route.params.id;
    this.practiceSetId = this.$route.query && this.$route.query.practice_set_id;
    // normal正常页面、 practice_set习题集、record解出记录、mistake 错题集
    this.recordFrom = this.$route.query && this.$route.query.from;
    this.getTopicType();
    this.getDifficultList();
    this.getDatas(); // 获取习题数据
  },
  mounted() {
    this.tempRecentTopicsTh();
    this.getNotes();
  },
  methods: {
    relevantTo(row) {
      if (
        this.recordFrom === 'mistake' ||
        this.recordFrom === 'relevantNormalMistake'
      ) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            from: 'relevantNormalMistake',
          },
        });
      } else if (
        this.recordFrom === 'note' ||
        this.recordFrom === 'relevantNormalNote'
      ) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            from: 'relevantNormalNote',
          },
        });
      } else if (
        this.recordFrom === 'record' ||
        this.recordFrom === 'relevantNormalRecord'
      ) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            from: 'relevantNormalRecord',
          },
        });
      } else if (this.recordFrom === 'relevantPerson') {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            from: 'relevantPerson',
          },
        });
      } else {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            from: 'relevantNormal',
          },
        });
      }
    },
    // 获取笔记
    getNotes() {
      getNoteDetail({
        resource_id: this.resourceId,
        note_type: NOTE_TYPE.NOTE,
        resource_type: RESOURCE_TYPE.THEORY,
      }).then((res) => {
        this.pracNotes = res.data.data == null ? '' : res.data.data.content;
        this.showNote = this.pracNotes ? true : false;
      });
    },
    detailSubmitNote(val) {
      postNoteSave({
        business_id: this.resourceId,
        note_type: NOTE_TYPE.NOTE,
        business_type: RESOURCE_TYPE.THEORY,
        content: val,
      }).then((res) => {
        this.$message.success(this.$t('m.saveSuccessful'));
      });
    },
    hideDrawer() {
      this.workbookDrawerShow = false;
    },
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        this.typeLists = arr;
      });
    },
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.difficultLists = arr;
      });
    },
    showNoteTh() {
      this.showNote = true;
      setTimeout(() => {
        const a = '#my-note-box-id';
        this.$el.querySelector(a).scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    clearDatas() {
      this.questionDatas = null;
      this.isCollection = false; // 收藏状态
      // this.submitStatus = SUBMITSTATUS.NotSubmitted; // 0未提交 1提交错误 2 提交正确
    },
    getDatas() {
      this.getQuestionBank();
      // if (this.type === TYPE.Rationale) {
      // 理论基础接口
      this.getCategory();
      this.getQuestionData();
      // }
      //  else if (this.type === TYPE.CaptureFlag) {
      //   this.getOptCategory();
      //   this.getOptQuestionData();
      // }
    },
    getQuestionData() {
      // 理论基础-题目内容
      this.loadingBasic = true;
      const that = this;
      that.clearDatas();
      that.$refs.basicQuesPage
        ? that.$refs.basicQuesPage.clearBasicDatas()
        : '';
      this.$request
        .get(
          '/oj/practice/theory',
          {
            resource_id: that.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.loadingBasic = false;
          that.questionDatas = _.get(resp, 'data.data');
          that.solvedDetail = _.get(that.questionDatas, 'resolved_detail', {});
          that.topicSolved = _.get(that.questionDatas, 'solved', {});
          that.isCollection =
            _.get(that.questionDatas, 'is_collection', '') || false;
          // 最近解题top5
          // const tempRecentAnswerList = _.get(resp, 'data.data.top5', []) || [];
          // this.recentAnswerList = tempRecentAnswerList.map((item) => {
          //   return {
          //     time: item.update_time,
          //     user_name: item.user_name,
          //     status: item.solved ? 1 : 0,
          //   };
          // });
          this.getRelevantTopics(this.questionDatas.category_id);
        });
    },
    getOptQuestionData() {
      // 夺旗-题目内容
      this.loadingOpt = true;
      const that = this;
      that.questionDatas = null;
      this.$request
        .get(
          '/oj/practice/operation',
          {
            resource_id: that.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.loadingOpt = false;
          that.questionDatas = _.get(resp, 'data.data', null);
          that.websocketKeyProp = _.get(
            resp,
            'data.scene_config_data.websocket_key',
          );
          that.isCollection =
            _.get(that.questionDatas, 'is_collection', '') || false;
        });
    },
    getQuestionBank() {
      // 题库
      const that = this;

      if (this.recordFrom !== 'note') {
        if (
          this.recordFrom === 'relevantNormal' ||
          this.recordFrom === 'relevantPerson' ||
          this.recordFrom === 'relevantNormalMistake' ||
          this.recordFrom === 'relevantNormalNote' ||
          this.recordFrom === 'relevantNormalRecord'
        ) {
          that.questionBankData = that.relevantIds;
        } else {
          let axiosUlr = '';
          let axiosParams = {};
          // normal正常页面、 practice_set习题集、record解出记录、mistake 错题集、note笔记
          if (
            this.recordFrom === 'normal' ||
            this.recordFrom === 'practice_set'
          ) {
            axiosUlr = '/oj/practice/theory/list/ids';
            axiosParams = {
              practice_set_id: this.practiceSetId,
            };
          } else if (this.recordFrom === 'record') {
            axiosUlr = '/oj/practice/theory/record_practice_ids';
          } else if (this.recordFrom === 'mistake') {
            axiosUlr = '/oj/person/mistake_ids';
          }
          this.$request
            .get(axiosUlr, axiosParams, {
              baseURL: '/api/ojj',
            })
            .then((resp) => {
              that.questionBankData = _.get(resp, 'data.data');
            });
        }
      }
    },
    collection(val) {
      // 收藏
      let businessType = null;
      if (this.type === TYPE.Rationale) {
        //  0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
        businessType = COLLECTION_TYPE.RELATION;
      } else if (this.type === TYPE.CaptureFlag) {
        //  0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
        businessType = COLLECTION_TYPE.CAPTURE_FLAG;
      }
      this.$request
        .post(
          '/oj/collection',
          {
            is_collection: !val,
            business_id: this.resourceId,
            business_type: businessType,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.isCollection = !val;
          // 收藏提示语
          if (this.isCollection) {
            this.$message.success(this.$t('common.collectSuccess'));
          } else {
            this.$message.success(this.$t('common.collectCancel'));
          }
        });
    },
    prev(val) {
      // 上一题
      // if (this.type === TYPE.Rationale) {
      if (this.numIndex > 1) {
        // this.submitStatus = SUBMITSTATUS.NotSubmitted;
        this.resourceId = this.questionBankData[this.numIndex - 2];
        this.$refs.basicQuesPage
          ? this.$refs.basicQuesPage.clearFormValid()
          : '';
        this.$router.push({
          path: `/practice/rationale/exercise-details/${this.resourceId}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      }
      // } else if (this.type === TYPE.CaptureFlag) {
      //   if (this.numIndex > 1) {
      //     // this.submitStatus = SUBMITSTATUS.NotSubmitted;
      //     this.resourceId = this.questionBankData[this.numIndex - 2];
      //     this.$router.push({
      //       path: `/practice/capture-flag/exercise-details/${this.resourceId}`,
      //       query: {
      //         practice_set_id: this.practiceSetId,
      //         from: this.recordFrom,
      //       },
      //     });
      //   }
      // }
    },
    next() {
      // 下一题
      // if (this.type === TYPE.Rationale) {
      if (this.numIndex < this.questionBankData.length) {
        // this.submitStatus = SUBMITSTATUS.NotSubmitted;
        this.resourceId = this.questionBankData[this.numIndex];
        this.$refs.basicQuesPage
          ? this.$refs.basicQuesPage.clearFormValid()
          : '';
        this.$router.push({
          path: `/practice/rationale/exercise-details/${this.resourceId}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      }
      // } else if (this.type === TYPE.CaptureFlag) {
      //   if (this.numIndex < this.questionBankData.length) {
      //     // this.submitStatus = SUBMITSTATUS.NotSubmitted;
      //     this.resourceId = this.questionBankData[this.numIndex];
      //     this.$router.push({
      //       path: `/practice/capture-flag/exercise-details/${this.resourceId}`,
      //       query: {
      //         practice_set_id: this.practiceSetId,
      //         from: this.recordFrom,
      //       },
      //     });
      //   }
      // }
    },
    goTopicBank() {
      if (this.recordFrom === 'practice_set') {
        this.workbookDrawerShow = true;
      } else {
        this.comGo();
      }
    },
    goBack() {
      if (this.recordFrom === 'practice_set') {
        // 跳转至习题集详情页
        this.$router.push({
          path: `/practice/rationale/list/${this.practiceSetId}`,
        });
      } else {
        this.comGo();
      }
    },
    comGo() {
      if (
        this.recordFrom === 'record' ||
        this.recordFrom === 'relevantNormalRecord'
      ) {
        // 跳转至练习记录
        this.$router.push({
          path: `/practice/record`,
        });
      } else if (
        this.recordFrom === 'normal' ||
        this.recordFrom === 'relevantNormal'
      ) {
        // 跳转至理论列表页
        this.$router.push({
          path: '/practice',
        });
      } else if (
        this.recordFrom === 'mistake' ||
        this.recordFrom === 'relevantNormalMistake'
      ) {
        const path = `/page/mg/personal?to=mistake`;
        window.open(`${path}`, '_self');
      } else if (
        this.recordFrom === 'note' ||
        this.recordFrom === 'relevantNormalNote'
      ) {
        // 从我的笔记过来
        const path = `/page/mg/personal?to=note`;
        window.open(`${path}`, '_self');
      } else if (this.recordFrom === 'relevantPerson') {
        const path = `/page/mg/personal?to=collection`;
        window.open(`${path}`, '_self');
      }
    },
    basicSubmitForm(val) {
      // 理论基础-提交答案
      const that = this;
      this.$request
        .post(
          '/oj/practice/theory/submit_answer',
          {
            resource_id: this.resourceId,
            submit_answer: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const data = _.get(resp, 'data.data.status');
          this.topicSolved = data;
          if (data === THEORYSTATUSTYPE.Solved) {
            if (
              this.questionDatas.theory_type === QUESTIONTYPE.SingleChoice ||
              this.questionDatas.theory_type === QUESTIONTYPE.MultipleChoice ||
              this.questionDatas.theory_type === QUESTIONTYPE.JudgmentQustion
            ) {
              this.solvedDetail = {
                correct_answer: val,
                is_solved: true,
              };
            }
            this.topicSolved = THEORYSTATUSTYPE.Solved;
            if (this.numIndex < this.questionBankData.length) {
              // 是否是最后一题
              // that.submitStatus = SUBMITSTATUS.SubmittedCorrectly; // 0未提交 1提交错误 2 提交正确
              let timer1 = null;
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

              clearTimeout(timer1);
              timer1 = setTimeout(() => {
                that.next();
              }, 2000);
            } else {
              this.getQuestionData();
            }
          } else {
            // that.submitStatus = SUBMITSTATUS.SubmittedError;
            this.topicSolved = THEORYSTATUSTYPE.Tried;
            this.$message({
              type: 'error',
              message: this.$t('practice.answerWrong'),
              duration: 2000,
            });
            let timer2 = null;
            clearTimeout(timer2);
            timer2 = setTimeout(() => {
              // that.submitStatus = SUBMITSTATUS.NotSubmitted;
            }, 2000);
          }
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
    getOptCategory() {
      // 方向数据
      const that = this;
      this.$request
        .get(
          '/oj/practice/category/list',
          {
            practice_type: TYPE.CaptureFlag,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          that.categorys = _.get(resp, 'data.data');
        });
    },
    // 获取相关好题数据top5
    getRelevantTopics(resource_id) {
      const query = {
        category_id: resource_id,
      };
      relevantTopics(query).then((res) => {
        const tempData = _.get(res, 'data.data', []) || [];
        this.revelantQuestions = tempData.map((item) => {
          return {
            topic: item.content,
            status: item.solved,
            resource_id: item.resource_id,
          };
        });
        this.relevantIds = tempData.map((item) => {
          return item.resource_id;
        });
        if (
          this.recordFrom === 'relevantNormal' ||
          this.recordFrom === 'relevantPerson' ||
          this.recordFrom === 'relevantNormalMistake' ||
          this.recordFrom === 'relevantNormalNote' ||
          this.recordFrom === 'relevantNormalRecord'
        ) {
          this.questionBankData = this.relevantIds;
        }
      });
    },
    tempRecentTopicsTh() {
      tempRecentTopics({
        resource_id: this.resourceId,
      }).then((res) => {
        const tempRecentAnswerList = _.get(res, 'data.data', []) || [];
        this.recentAnswerList = tempRecentAnswerList.map((item) => {
          return {
            time: item.update_time,
            user_name: item.user_name,
            status: item.solved ? 1 : 0,
          };
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.exercise-details-wrapper {
  height: inherit;
  position: relative;
}
.exercise-header {
  margin-bottom: 12px;
  padding: 8px 0;
  background: var(--bg-color-2);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  .tool-box {
    height: 36px;
    width: 100%;
  }

  .el-fade-in-enter-active,
  .el-fade-in-leave-active,
  .el-fade-in-linear-enter-active,
  .el-fade-in-linear-leave-active {
    transition: opacity 0.5s linear;
  }
}
.basic-questions {
  min-height: 360px;
  border-radius: 4px;
  max-height: calc(100% - 60px);
  overflow: auto;
  .basic-questions-topic {
    display: flex;
    .left-area {
      flex: 1;
      background: var(--bg-color-2);
    }
  }
  .my-note-box {
    background: var(--bg-color-2);
    margin-top: 12px;
    border-radius: 4px;
    padding: 16px 4px 16px 24px;
  }
}
</style>
<style lang="scss">
.basic-questions {
  .main-content {
    .practice-basic-title {
      .title {
        .practice-mavon-title {
          .cb-markdown {
            .markdown-body {
              padding: 0;
              margin-top: 3px;
              font-size: 16px;
            }
          }
        }
      }
    }
    .topic-options {
      .elc-radio-group {
        .el-radio__label {
          .cb-markdown {
            .markdown-body {
              padding: 0;
              margin-top: 3px;
            }
          }
        }
      }
    }
    .cb-checkbox-group {
      .el-checkbox {
        .cb-markdown {
          .markdown-body {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
