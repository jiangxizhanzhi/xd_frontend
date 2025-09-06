<template>
  <div class="right-rate">
    <cb-iconfont
      type="icon-chenggong"
      themedColor="green-color"
      v-show="correct"
    ></cb-iconfont>
    <cb-iconfont
      type="icon-cuowu1"
      themedColor="red-color"
      v-show="!correct"
    ></cb-iconfont>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    correct: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const state = reactive({});
    const refData = toRefs(state);
    return {
      ...refData,
    };
  },
};
</script>

<style lang="scss" scoped>
.right-rate {
  position: absolute;
  right: 12px;
  top: 24px;
}
</style>
