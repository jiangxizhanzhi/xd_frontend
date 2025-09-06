<template>
  <div class="question-title">
    <span class="question-number" style="position: relative">
      {{ index + 1 }}、
    </span>
    <CbMarkdown v-model="content" type="viewer"></CbMarkdown>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const state = reactive({});
    const refData = toRefs(state);
    return {
      ...refData,
    };
  },
};
</script>

<style lang="scss" scoped>
.question-title {
  display: flex;
  align-items: flex-start;
  .question-number {
    margin-top: 4px;
  }
  ::v-deep .cb-markdown .markdown-body {
    p {
      margin: 0 !important;
    }
  }
}
</style>
