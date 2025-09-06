<template>
  <cb-inner-page :background="false">
    <div
      class="exercise-details-wrapper"
      :key="questionDatas && questionDatas.resource_id"
    >
      <div class="exercise-header flex-between">
        <transition name="el-fade-in-linear">
          <div class="tool-box">
            <headerColumn
              :type="type"
              :isProfile="true"
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
      <div class="content cyber-scroll-bar-small">
        <div
          class="basic-questions"
          v-show="type == TYPE.RATIONALE"
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
            @submit-basic-answer="subAnswer"
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
          <Block :title="$t('practice.myNote')"></Block>
          <MyNote
            :mark-notes.sync="pracNotes"
            :restType="11"
            :businessType="BUSINESS_TYPE.OJ_WEB_THEORY"
            @submitNote="detailSubmitNote"
          />
        </div>
        <div
          class="operation-questions"
          v-show="type == TYPE.CAPTURE_FLAG"
          v-loading="loadingOpt"
          element-loading-background="rgba(35, 44, 59, .7)"
        >
          <operation-question
            ref="operationQuesPage"
            :loadingStatus="loadingOpt"
            :crEventData.sync="questionDatas"
            :type="type"
            :resourceId="resourceId"
            :questionDatas="questionDatas"
            :categoryName="categoryName"
            :submitStatus="submitStatus"
            @submit-opt-answer="subAnswer"
            :isCollection="isCollection"
            @collection-change="collection"
          ></operation-question>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import basicQuestion from '@/pages/web/practice/exercise-details/components/basic-question.vue';
import operationQuestion from '@/pages/web/practice/exercise-details/components/operation-question.vue';
import headerColumn from '@/pages/web/practice/exercise-details/components/header-column-theory.vue';
import RelevantTopic from '@/pages/web/practice/exercise-details/components/relevant-topic.vue';
import Block from '@/components/block';
import MyNote from '@/components/notes/my-notes.vue';
import {
  TYPE,
  SUBMITSTATUS,
  COLLECTION_TYPE,
  THEORYSTATUSTYPE,
  QUESTIONTYPE,
} from './../../constant';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  BUSINESS_TYPE,
} from '@/pages/web/course/constant.js';
import { getComConstantsConfig } from '@/api/common.js';
import {
  getNoteDetail,
  postNoteSave,
  relevantTopics,
  tempRecentTopics,
} from '@/api/practice.ts';
import _ from 'lodash';
export default {
  components: {
    basicQuestion,
    operationQuestion,
    headerColumn,
    MyNote,
    RelevantTopic,
    Block,
  },
  data() {
    return {
      TYPE,
      SUBMITSTATUS,
      THEORYSTATUSTYPE,
      QUESTIONTYPE,
      NOTE_TYPE,
      RESOURCE_TYPE,
      BUSINESS_TYPE,
      categorys: null,
      loadingBasic: false,
      loadingOpt: false,
      resourceId: String,
      questionDatas: null, // 考题data
      QuestionType: '', // 题目类型
      questionBankData: '', // 题目目录(用于查询上一题下一题)
      type: Number, // 理论基础，夺旗，真实漏洞
      isScroller: false,
      isSolved: false, // false未解决 true已解决
      isCollection: false, // 收藏状态
      submitStatus: SUBMITSTATUS.NOT_SUBMITTED, // 0未提交 1提交错误 2 提交正确
      submitAnswer: null,
      showNote: false,
      typeLists: [], //题目类型数据
      difficultLists: [], // 难度分类数据
      solvedDetail: {}, // 用于单选 多选 判断正确答案
      recordFrom: '',
      topicSolved: THEORYSTATUSTYPE.NotStart, // 0尝试过 1已解决 2未开始
      pracNotes: '', // 笔记
      recentAnswerList: [], // 最近答题数据，最多纪录5条
      revelantQuestions: [], // 相关好题数据，最多纪录5条
    };
  },
  computed: {
    numIndex() {
      // 题号
      const { questionBankData = [], questionDatas = null } = this;
      let num = null;
      if (questionDatas) {
        num = _.findIndex(
          questionBankData,
          (ele) => ele.resource_id === questionDatas.resource_id,
        );
      }

      const numIndex = num === -1 ? null : num + 1;
      return numIndex;
    },
    breadList() {
      // 头部面包屑
      const { questionDatas = null } = this;
      let list = [];
      let questionName;
      if (questionDatas) {
        questionName =
          _.get(questionDatas, 'title', '') ||
          this.$t('m.exercise.contestQuestions'); // 赛题
      }
      list = [
        { title: this.$t('layout.navi.personal'), path: '/profile' },
        {
          title: this.$t('m.myCollectionPractice'),
          name: 'personal',
          params: { oraginResoure: 'practice' },
        },
        { path: `${this.$route.path}`, title: questionName },
      ];
      return list;
    },
    categoryName() {
      // 方向分类名称
      const { questionBankData = [], questionDatas = null } = this;
      let categoryNameObj;
      let categoryName;
      if (questionDatas) {
        categoryNameObj = _.find(
          questionBankData,
          (ele) => ele.resource_id === questionDatas.resource_id,
        );
        categoryName = _.get(categoryNameObj, 'category_name', '');
      }
      return categoryName;
    },
  },
  created() {
    this.resourceId = this.$route.params.id;
    this.recordFrom = this.$route.query && this.$route.query.from;
    this.type = Number(this.$route.query.practice_type);
    if (this.type === this.TYPE.RATIONALE) {
      this.getNotes();
      this.tempRecentTopicsTh();
    }
    this.getTopicType();
    this.getDifficultList();
    this.getProfileDatas();
  },
  mounted() {},
  methods: {
    relevantTo(row) {
      this.$router.push({
        path: `/practice/rationale/exercise-details/${row.resource_id}`,
        query: {
          from: 'relevantPerson',
        },
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
    // 获取笔记
    getNotes() {
      getNoteDetail({
        resource_id: this.resourceId,
        note_type: NOTE_TYPE.NOTE,
        resource_type: RESOURCE_TYPE.THEORY,
      }).then((res) => {
        this.pracNotes = res.data.data == null ? '' : res.data.data.content;
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
      this.submitStatus = SUBMITSTATUS.NOT_SUBMITTED; // 0未提交 1提交错误 2 提交正确
    },
    getProfileDatas() {
      this.getQuestionBank();
      this.getQuestionData();
    },
    getQuestionBank() {
      // 个人中心收藏数据 - 题库
      this.$request
        .get(
          '/oj/person/my_all_collection_practice',
          {},
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.questionBankData = _.get(resp, 'data.data');
        });
    },
    getQuestionData() {
      // 个人中心收藏-题目内容
      const that = this;
      that.clearDatas();
      this.type === that.TYPE.RATIONALE ? (this.loadingBasic = true) : '';
      this.type === that.TYPE.CAPTURE_FLAG ? (this.loadingOpt = true) : '';
      let getUrl = '';
      if (this.type === that.TYPE.RATIONALE) {
        getUrl = '/oj/person/collection_theory_practice_detail';
      } else {
        getUrl = '/oj/person/collection_operate_practice_detail';
      }
      this.$request
        .get(
          getUrl,
          {
            resource_id: that.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.loadingBasic = false;
          this.loadingOpt = false;
          that.questionDatas = _.get(resp, 'data.data');
          if (this.type === that.TYPE.RATIONALE) {
            that.solvedDetail = _.get(
              that.questionDatas,
              'resolved_detail',
              {},
            );
            that.topicSolved = _.get(that.questionDatas, 'solved', {});
          }
          that.isCollection =
            _.get(that.questionDatas, 'is_collection', '') || false;
          if (this.type === this.TYPE.RATIONALE) {
            this.getRelevantTopics(this.questionDatas.category_id);
          }
        });
    },
    collection(val) {
      // 收藏
      let businessType = null;
      if (this.type === TYPE.RATIONALE) {
        //  0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
        businessType = COLLECTION_TYPE.RELATION;
      } else if (this.type === TYPE.CAPTURE_FLAG) {
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
        });
    },
    prev(val) {
      // 上一题
      if (this.numIndex > 1) {
        if (this.type === TYPE.RATIONALE) {
          this.$refs.basicQuesPage
            ? this.$refs.basicQuesPage.clearFormValid()
            : '';
          this.$refs.basicQuesPage
            ? this.$refs.basicQuesPage.clearBasicDatas()
            : '';
        }
        const num = this.numIndex - 2;
        this.submitStatus = SUBMITSTATUS.NOT_SUBMITTED;
        this.resourceId = this.questionBankData[num].resource_id;
        this.type = this.questionBankData[num].practice_type;
        this.$router.push({
          name: 'collection-exercise-details',
          params: {
            id: this.resourceId,
          },
          query: {
            practice_type: this.type,
            from: 'collection',
          },
        });
      }
    },
    next() {
      // 下一题
      if (this.numIndex < this.questionBankData.length) {
        if (this.type === TYPE.RATIONALE) {
          this.$refs.basicQuesPage
            ? this.$refs.basicQuesPage.clearFormValid()
            : '';
          this.$refs.basicQuesPage
            ? this.$refs.basicQuesPage.clearBasicDatas()
            : '';
        }
        this.submitStatus = SUBMITSTATUS.NOT_SUBMITTED;
        this.resourceId = this.questionBankData[this.numIndex].resource_id;
        this.type = this.questionBankData[this.numIndex].practice_type;
        this.$router.push({
          name: 'collection-exercise-details',
          params: {
            id: this.resourceId,
          },
          query: {
            practice_type: this.type,
            from: 'collection',
          },
        });
      }
    },
    subAnswer(val) {
      // 理论基础-夺旗解题-提交答案
      const that = this;
      let submitUrl = null;
      if (this.type === TYPE.RATIONALE) {
        submitUrl = '/oj/practice/theory/submit_answer';
      } else if (this.type === TYPE.CAPTURE_FLAG) {
        submitUrl = '/oj/practice/operation/submit_answer';
      }
      this.$request
        .post(
          submitUrl,
          {
            resource_id: this.resourceId,
            submit_answer: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          if (this.type === TYPE.RATIONALE) {
            const data = _.get(resp, 'data.data.status');
            this.topicSolved = data;
            if (data === THEORYSTATUSTYPE.Solved) {
              if (
                this.questionDatas.theory_type === QUESTIONTYPE.SingleChoice ||
                this.questionDatas.theory_type === QUESTIONTYPE.MultipleChoice
              ) {
                this.solvedDetail = {
                  correct_answer: val,
                  is_solved: true,
                };
              }
              this.topicSolved = THEORYSTATUSTYPE.Solved;
              if (that.numIndex < that.questionBankData.length) {
                // 是否是最后一题
                // that.submitStatus = SUBMITSTATUS.SUBMITTED_CORRECTLY; // 0未提交 1提交错误 2 提交正确
                let timer1 = null;
                if (
                  this.questionDatas.theory_type !== QUESTIONTYPE.ShortAnswer
                ) {
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
                timer1 = setTimeout(function () {
                  that.next();
                }, 2000);
              } else {
                that.getQuestionData();
              }
            } else {
              // that.submitStatus = SUBMITSTATUS.SUBMITTED_ERROR;
              this.topicSolved = THEORYSTATUSTYPE.Tried;
              this.$message({
                type: 'error',
                message: this.$t('practice.answerWrong'),
                duration: 2000,
              });
              let timer2 = null;
              clearTimeout(timer2);
              timer2 = setTimeout(function () {
                // that.submitStatus = SUBMITSTATUS.NOT_SUBMITTED;
              }, 2000);
            }
          } else {
            const data = _.get(resp, 'data.data.solved', '') || false;
            if (data) {
              if (that.numIndex < that.questionBankData.length) {
                // 是否是最后一题
                that.submitStatus = SUBMITSTATUS.SUBMITTED_CORRECTLY; // 0未提交 1提交错误 2 提交正确
                let timer1 = null;
                clearTimeout(timer1);
                timer1 = setTimeout(function () {
                  if (that.type === TYPE.RATIONALE) {
                    that.next();
                  } else if (that.type === TYPE.CAPTURE_FLAG) {
                    that.next();
                    that.submitStatus = SUBMITSTATUS.NOT_SUBMITTED;
                  }
                }, 2000);
              } else {
                that.getQuestionData();
              }
            } else {
              that.submitStatus = SUBMITSTATUS.SUBMITTED_ERROR;
              let timer2 = null;
              clearTimeout(timer2);
              timer2 = setTimeout(function () {
                that.submitStatus = SUBMITSTATUS.NOT_SUBMITTED;
              }, 2000);
            }
          }
        });
    },
    goTopicBank() {
      this.comGo();
    },
    goBack() {
      this.comGo();
    },
    comGo() {
      const path = `/page/mg/personal?to=collection`;
      window.open(`${path}`, '_self');
    },
  },
};
</script>
<style scoped lang="scss">
.exercise-details-wrapper {
  height: inherit;
  position: relative;
}
.operation-questions {
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
.content {
  min-height: 360px;
  border-radius: 2px;
  max-height: calc(100% - 64px);
  overflow: auto;
}
.basic-questions {
  // background: var(--bg-color-2);
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
</style>
