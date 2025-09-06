import _ from 'lodash';
import Constant from '@/constants';

export default {
  props: {
    practiceSet: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    totalScore() {
      const { practiceSet = [] } = this;
      const tenTimes =
        practiceSet.reduce((prev, acc) => prev + acc.score, 0) * 10;
      return Math.round(tenTimes) / 10;
    },
    practiceSetComputed: {
      get() {
        const { practiceSet = [] } = this;
        return {
          judgeList: _.filter(
            practiceSet,
            (item) => item.question_type === Constant.TaskType.JUDGE.value,
          ),
          singleSelectionList: _.filter(
            practiceSet,
            (item) => item.question_type === Constant.TaskType.SINGLE.value,
          ),
          multiSelectionList: _.filter(
            practiceSet,
            (item) => item.question_type === Constant.TaskType.MULTIPLE.value,
          ),
          blankList: _.filter(
            practiceSet,
            (item) => item.question_type === Constant.TaskType.BLANK.value,
          ),
          shortAnswerList: _.filter(
            practiceSet,
            (item) => item.question_type === Constant.TaskType.SHORTQUES.value,
          ),
          operateList: _.filter(
            practiceSet,
            (item) => item.question_type === 5,
          ),
        };
      },
      set(obj) {
        this.$emit('update:practice-set', [
          ...obj.judgeList,
          ...obj.singleSelectionList,
          ...obj.multiSelectionList,
          ...obj.blankList,
          ...obj.shortAnswerList,
          ...obj.operateList,
        ]);
      },
    },
    judgeList: {
      get() {
        return this.practiceSetComputed.judgeList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          judgeList: arr,
        });
      },
    },
    singleSelectionList: {
      get() {
        return this.practiceSetComputed.singleSelectionList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          singleSelectionList: arr,
        });
      },
    },
    multiSelectionList: {
      get() {
        return this.practiceSetComputed.multiSelectionList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          multiSelectionList: arr,
        });
      },
    },
    blankList: {
      get() {
        return this.practiceSetComputed.blankList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          blankList: arr,
        });
      },
    },
    shortAnswerList: {
      get() {
        return this.practiceSetComputed.shortAnswerList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          shortAnswerList: arr,
        });
      },
    },
    operateList: {
      get() {
        return this.practiceSetComputed.operateList;
      },
      set(arr) {
        this.practiceSetComputed = Object.assign({}, this.practiceSetComputed, {
          operateList: arr,
        });
      },
    },
  },
};
