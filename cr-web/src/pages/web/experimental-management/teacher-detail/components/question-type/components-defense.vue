<template>
  <!-- 团队新增任务防御 -->
  <div class="subassembly">
    <cb-form-item :label="$t('m.practiceAnswer')" prop="answer">
      <cb-input
        v-model="answer"
        :placeholder="$t('m.answerChoose')"
        class="elc-input"
      />
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentsDefenseMission',
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
      this.answer = val;
      this.$emit('answer', val);
    },
  },
};
</script>

<style scoped></style>
