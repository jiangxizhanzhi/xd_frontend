<template>
  <div class="subassembly">
    <cb-form-item :label="$t('missions.answer')" prop="answer">
      <cb-input
        v-model="answer"
        :placeholder="$t('missions.answerChoose')"
        style="width: 85%"
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
