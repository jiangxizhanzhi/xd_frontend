<template>
  <div class="subassembly">
    <cb-form-item :label="$t('missions.answer')">
      <cb-switch
        v-model="answer"
        :active-text="$t('missions.correct')"
        :inactive-text="$t('missions.error')"
      />
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentJudgeMission',
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
  computed: {},
  watch: {
    // correctAnswer(val) {
    //   this.answer = val
    // },
    answer(val) {
      if (val === true) {
        this.$emit('answer', 'A');
      } else {
        this.$emit('answer', 'B');
      }
    },
    correctAnswer(val) {
      this.correctAnswerSet();
    },
  },
  mounted() {
    this.correctAnswerSet();
  },
  methods: {
    correctAnswerSet() {
      if (this.correctAnswer === 'A') {
        this.answer = true;
      } else {
        this.answer = false;
      }
    },
  },
};
</script>
