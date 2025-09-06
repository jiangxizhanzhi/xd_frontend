import PrivateConstant from '../constant.js';

export default {
  computed: {
    emptyList() {
      const { list = [] } = this;
      return list.length === 0;
    },
    totalScore() {
      const { list = [] } = this;
      return list.reduce((prev, acc) => prev + acc.score, 0);
    },
  },

  methods: {
    removeIt(question) {
      this.$bus.emit(PrivateConstant.eventKey.removePracticeFromList, question);
    },
  },
};
