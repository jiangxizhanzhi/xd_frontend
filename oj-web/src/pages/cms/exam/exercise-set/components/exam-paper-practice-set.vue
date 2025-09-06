<template>
  <div class="exam-paper-practice-set">
    <div class="first-row mb20">
      <div class="item-title">
        {{ $t('views.exam.paper.totalPractice') }}{{ practiceSet.length
        }}{{ $t('views.exam.paper.qt') }} ,

        <!-- {{ $t('views.exam.paper.totalScore')
        }}{{ totalScore }}{{ $t('views.exam.paper.pt')
        }} -->
        {{ $t('views.exam.paper.qz')
        }}{{ $t('views.exam.paper.objectiveQuestion')
        }}{{
          judgeList.length +
          singleSelectionList.length +
          multiSelectionList.length +
          operateList.length
        }}{{ $t('views.exam.paper.qt') }} ,
        {{ $t('views.exam.paper.subjectiveQuestion')
        }}{{ shortAnswerList.length + blankList.length
        }}{{ $t('views.exam.paper.qt') }}
        <span>（{{ $t('views.exam.paper.repeat') }}）</span>
      </div>
    </div>
    <div class="scroll-style cyber-scroll-bar-small">
      <practice
        :list.sync="judgeList"
        :question-type-str="$t('questionType.judgeType')"
        :index="1"
      ></practice>
      <practice
        :list.sync="singleSelectionList"
        :question-type-str="$t('questionType.singleSelectionType')"
        :index="2"
      ></practice>
      <practice
        :list.sync="multiSelectionList"
        :question-type-str="$t('questionType.multiSelectionType')"
        :index="3"
      ></practice>
      <practice
        :list.sync="blankList"
        :question-type-str="$t('questionType.blankType')"
        :index="4"
      ></practice>
      <practice
        :list.sync="shortAnswerList"
        :question-type-str="$t('questionType.shortAnswerType')"
        :index="5"
      ></practice>
      <practice-op
        :list.sync="operateList"
        :question-type-str="$t('questionType.operateType')"
        :index="6"
      ></practice-op>
    </div>
  </div>
</template>
<script>
import Practice from './exam-paper-practice-set-detail.vue';
import PracticeOp from './exam-paper-practice-set-detail-op.vue';
import PracticeSetMixin from '@/pages/cms/exam/exercise-set/components/exam-paper-practice-set-mixin.js';

export default {
  components: {
    Practice,
    PracticeOp,
  },
  mixins: [PracticeSetMixin],
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss">
.exam-paper-practice-set {
  color: var(--neutral8);
  & > .first-row {
    & > .item-title {
      & > span {
        color: var(--neutral7);
      }
    }
  }
  .cb-markdown .markdown-body {
    padding: 0 !important;
    p {
      margin: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .el-scrollbar__view {
  margin-right: 10px;
}
.exam-paper-practice-set {
  padding: 16px 0px 16px 0px !important;
  border-radius: 0;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;

  & > .first-row {
    & > .item-title {
      font-weight: bold;
      > span {
        font-size: 14px;
      }
    }
  }
  & > .scroll {
    height: 800px;
    overflow-y: auto;
  }
}
.scroll-style {
  height: calc(var(--content-height) - 100px);
  overflow: auto;
}
</style>
