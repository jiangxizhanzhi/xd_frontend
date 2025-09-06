<template>
  <!-- 团队新增任务文件 -->
  <div class="subassembly">
    <cb-form-item :label="$t('m.practiceAnswer')" prop="answer">
      <cb-input
        v-model="answer"
        :placeholder="$t('m.pleaseInputFileMD5')"
        class="elc-input"
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
