<template>
  <div class="all-answer-box">
    <div class="right-answer">
      <span>【{{ $t('m.correctAnswer') }}】 {{ rightAnswer }}</span>
    </div>
    <div class="student-answer">
      <span
        >【{{ $t('m.studentAnswer') }}】<span
          :class="solved ? 'green-color' : 'error-color'"
        >
          {{ userAnswer }}</span
        ></span
      >
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    rightAnswer: {
      type: String,
      default: '',
    },

    userAnswer: {
      type: String,
      default: '',
    },
    solved: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const state = reactive({
      count: 0,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.all-answer-box {
  padding-left: 15px;
  line-height: 22px;
  margin-top: 6px;
  .green-color {
    color: var(--green-color);
  }
  .error-color {
    color: var(--red-color);
  }
  .student-answer {
    margin-top: 4px;
  }
}
</style>
