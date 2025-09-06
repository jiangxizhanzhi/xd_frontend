<template>
  <div class="subassembly">
    <cb-form-item :label="$t('missions.answer')" prop="answer">
      <cb-input
        v-model="answer"
        :placeholder="$t('missions.pleaseInputFileMD5')"
        style="width: 85%"
      />
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentsFileMission',
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
    // correctAnswer(val) {
    //   this.answer = val
    // },
    answer(val) {
      this.answer = val;
      this.$emit('answer', val);
    },
  },
};
</script>

<style scoped></style>
