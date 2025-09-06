<template>
  <!-- 实践操作习题详情 -->
  <cb-inner-page :background="false">
    <div class="exercise-details-wrapper">
      <div class="exercise-header flex-between">
        <transition name="el-fade-in-linear">
          <div class="tool-box">
            <headerColumn
              :type="type"
              :isCollection="isCollection"
              @collection-change="collection"
              @prev-change="prev"
              @next-change="next"
              :currentIndex="numIndex"
              :totalIndex="questionBankData.length || 0"
              @go-topic-bank="goTopicBank"
              @go-back="goBack"
              :recordFrom="recordFrom"
            ></headerColumn>
          </div>
        </transition>
      </div>

      <div
        class="operation-questions cyber-scroll-bar-small"
        v-loading="loadingOpt"
        element-loading-background="rgba(35, 44, 59, .7)"
      >
        <operation-question
          ref="operationQuesPage"
          :websocketKeyProp="websocketKeyProp"
          :crEventData.sync="questionDatas"
          :type="type"
          :loadingStatus="loadingOpt"
          :resourceId="resourceId"
          :questionDatas="questionDatas"
          :categoryName="categoryName"
          @submit-opt-answer="optSubmitForm"
          :submitStatus="submitStatus"
          :businessType="BUSINESS_TYPE.OJ_WEB_EXERCISE_FLAG"
          :isCollection="isCollection"
          @collection-change="collection"
          :again="recordAgain"
        ></operation-question>
      </div>
      <FixedWorkbook
        v-if="workbookDrawerShow"
        ref="refFixed"
        :type="TYPE.CaptureFlag"
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
import operationQuestion from './components/operation-question.vue';
import headerColumn from './components/header-column-theory.vue';
import FixedWorkbook from './components/fixed-workbook.vue';
import { TYPE, SUBMITSTATUS, COLLECTION_TYPE } from './../constant';
import _ from 'lodash';
import { BUSINESS_TYPE } from '@/pages/web/course/constant.js';
import { getFlagQuestionBank, getFlagResolvedIdList } from '@/api/practice.ts';
export default {
  components: {
    operationQuestion,
    headerColumn,
    FixedWorkbook,
  },
  data() {
    return {
      BUSINESS_TYPE,
      TYPE,
      SUBMITSTATUS,
      websocketKeyProp: '',
      categorys: null,
      loadingBasic: false,
      loadingOpt: false,
      resourceId: String,
      questionDatas: null, // 考题data
      QuestionType: '', // 题目类型
      questionBankData: '', // 题目目录(用于查询上一题下一题)
      type: TYPE.CaptureFlag, // 理论基础，夺旗，真实漏洞
      isSolved: false, // false未解决 true已解决
      isCollection: false, // 收藏状态
      submitStatus: SUBMITSTATUS.NotSubmitted, // 0未提交 1提交错误 2 提交正确
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
      recordFrom: '', // 记录从哪来
      recordAgain: false, //是否再练一次
      practiceSetId: '', // 习题集id
      workbookDrawerShow: false,
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
    this.recordFrom = this.$route.query && this.$route.query.from;
    this.recordAgain = this.$route.query && this.$route.query.again;
    this.getDatas(); // 获取习题数据
  },
  mounted() {},
  methods: {
    hideDrawer() {
      this.workbookDrawerShow = false;
    },
    clearDatas() {
      this.questionDatas = null;
      this.isCollection = false; // 收藏状态
      this.submitStatus = SUBMITSTATUS.NotSubmitted; // 0未提交 1提交错误 2 提交正确
    },
    getDatas() {
      //  从我的笔记 和 再练一次 不需要 上一题下一题 disabled
      if (
        !(
          this.recordFrom === 'note' ||
          this.recordFrom === 'question' ||
          this.recordFrom === 'replay' ||
          this.recordAgain
        )
      ) {
        this.getQuestionBank();
      }

      // if (this.type === TYPE.Rationale) {
      //   // 理论基础接口
      //   this.getCategory();
      //   this.getQuestionData();
      // } else if (this.type === TYPE.CaptureFlag) {
      this.getOptCategory();
      this.getOptQuestionData();
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
          that.isCollection =
            _.get(that.questionDatas, 'is_collection', '') || false;
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
          that.loadingOpt = false;
          that.questionDatas = _.get(resp, 'data.data', null);
          // that.websocketKeyProp = _.get(resp, 'data.scene_data.websocket_key')
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

      if (this.recordFrom === 'record') {
        getFlagResolvedIdList().then((resp) => {
          that.questionBankData = _.get(resp, 'data.data');
        });
      } else {
        getFlagQuestionBank({ practice_set_id: this.practiceSetId }).then(
          (resp) => {
            that.questionBankData = _.get(resp, 'data.data');
          },
        );
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
      //   if (this.numIndex > 1) {
      //     this.submitStatus = SUBMITSTATUS.NotSubmitted;
      //     this.resourceId = this.questionBankData[this.numIndex - 2];
      //     this.$refs.basicQuesPage
      //       ? this.$refs.basicQuesPage.clearFormValid()
      //       : '';
      //     this.$router.push({
      //       path: `/practice/rationale/exercise-details/${this.resourceId}`,
      //       query: {
      //         practice_set_id: this.practiceSetId,
      //         from: this.recordFrom,
      //       },
      //     });
      //   }
      // } else if (this.type === TYPE.CaptureFlag) {
      if (this.numIndex > 1) {
        this.submitStatus = SUBMITSTATUS.NotSubmitted;
        this.resourceId = this.questionBankData[this.numIndex - 2];
        this.$router.push({
          path: `/practice/capture-flag/exercise-details/${this.resourceId}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      }
      // }
    },
    next() {
      // 下一题
      // if (this.type === TYPE.Rationale) {
      //   if (this.numIndex < this.questionBankData.length) {
      //     this.submitStatus = SUBMITSTATUS.NotSubmitted;
      //     this.resourceId = this.questionBankData[this.numIndex];
      //     this.$refs.basicQuesPage
      //       ? this.$refs.basicQuesPage.clearFormValid()
      //       : '';
      //     this.$router.push({
      //       path: `/practice/rationale/exercise-details/${this.resourceId}`,
      //       query: {
      //         practice_set_id: this.practiceSetId,
      //         from: this.recordFrom,
      //       },
      //     });
      //   }
      // } else if (this.type === TYPE.CaptureFlag) {
      if (this.numIndex < this.questionBankData.length) {
        this.submitStatus = SUBMITSTATUS.NotSubmitted;
        this.resourceId = this.questionBankData[this.numIndex];
        this.$router.push({
          path: `/practice/capture-flag/exercise-details/${this.resourceId}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      }
      // }
    },

    optSubmitForm(val) {
      // 夺旗解题-答案提交
      const that = this;
      let axiosUrl = '';
      if (this.recordAgain) {
        // 再练一次
        axiosUrl = '/oj/practice/operation/submit_answer_again';
      } else {
        axiosUrl = '/oj/practice/operation/submit_answer';
      }
      this.$request
        .post(
          axiosUrl,
          {
            resource_id: this.resourceId,
            submit_answer: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const data = _.get(resp, 'data.data', '');
          const is_solved = _.get(data, 'solved', '') || false;
          if (is_solved) {
            that.submitStatus = SUBMITSTATUS.SubmittedCorrectly; // 2 提交正确

            let optTimer1 = null;
            clearTimeout(optTimer1);
            optTimer1 = setTimeout(function () {
              that.submitStatus = SUBMITSTATUS.NotSubmitted;
              that.$refs.operationQuesPage.isSolved = true;
              that.$request
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
                  that.recordAgain = '';
                  that.questionDatas = _.get(resp, 'data.data', null);
                });
            }, 2000);
          } else {
            that.submitStatus = SUBMITSTATUS.SubmittedError;
            let optTimer2 = null;
            clearTimeout(optTimer2);
            optTimer2 = setTimeout(function () {
              that.submitStatus = SUBMITSTATUS.NotSubmitted;
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
    goTopicBank() {
      if (this.recordFrom === 'practice_set') {
        this.workbookDrawerShow = true;
      } else {
        this.comGo();
      }
    },
    goBack() {
      // 从习题集进来
      if (this.recordFrom === 'practice_set') {
        this.$router.push({
          path: `/practice/capture-flag/list/${this.practiceSetId}`,
        });
      } else {
        this.comGo();
      }
    },
    comGo() {
      if (this.recordFrom === 'record') {
        // 从解题记录正常进来和从再练一次进来 跳转至解题记录
        this.$router.push({
          path: `/capture-flag/record`,
        });
      } else if (this.recordFrom === 'normal') {
        // 正常进来 跳转至理论列表页
        this.$router.push({
          path: '/practice/capture-flag',
        });
      } else if (this.recordFrom === 'note') {
        //从我的笔记进来
        const path = `/page/mg/personal?to=note`;
        window.open(`${path}`, '_self');
      } else if (this.recordFrom === 'question') {
        //从我的提问进来
        const path = `/page/mg/personal?to=question`;
        window.open(`${path}`, '_self');
      } else if (this.recordFrom === 'replay') {
        //从我的回复进来
        const path = `/page/mg/personal?to=replay`;
        window.open(`${path}`, '_self');
      } else {
        // 从我的场景进来
        this.$router.push({
          path: `/capture-flag/record`,
        });
      }
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
    width: 100%;
    height: 36px;
  }

  .el-fade-in-enter-active,
  .el-fade-in-leave-active,
  .el-fade-in-linear-enter-active,
  .el-fade-in-linear-leave-active {
    transition: opacity 0.5s linear;
  }
}
.operation-questions {
  min-height: 360px;
  border-radius: 2px;
  max-height: calc(100% - 60px);
  overflow: auto;
}
</style>
<style lang="scss"></style>
