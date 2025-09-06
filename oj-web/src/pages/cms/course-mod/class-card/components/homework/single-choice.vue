<template>
  <div class="single-choice">
    <div v-for="item in choice" :key="item.label" class="item">
      <label for="">{{ item.label }}、</label>
      <CbMarkdown v-model="item.name" type="viewer"></CbMarkdown>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    choice: {
      type: Array,
      default: '',
    },
  },
  setup() {
    const state = reactive({});
    const refData = toRefs(state);
    const dealWithData = (data) => {
      return JSON.parse(data);
    };
    return {
      ...refData,
      dealWithData,
    };
  },
};
</script>

<style lang="scss" scoped>
.single-choice {
  padding-left: 15px;
  .item {
    display: flex;
    align-items: baseline;
  }
}
</style>
