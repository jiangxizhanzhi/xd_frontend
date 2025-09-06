<template>
  <div class="other-question">
    <label for="">{{ $t('m.taskDesc') }}：</label>
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
  },
  setup() {
    const state = reactive({});

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.other-question {
  padding-left: 15px;
  display: flex;
  align-items: baseline;
}
</style>
