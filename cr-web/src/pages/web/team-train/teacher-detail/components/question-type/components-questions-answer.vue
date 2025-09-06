<template>
  <!-- 团队新增任务问题 -->
  <div class="subassembly">
    <cb-form-item :label="$t('m.practiceAnswer')" prop="answer">
      <cb-input
        v-model="answer"
        :placeholder="$t('m.fuzzyMatch')"
        class="elc-input"
      />
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentsQuestionAnswerMission',
  props: {
    correctAnswer: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      answer: this.correctAnswer,
    };
  },
  watch: {
    answer(val) {
      this.$emit('answer', val);
    },
  },
};
</script>

<style scoped></style>
