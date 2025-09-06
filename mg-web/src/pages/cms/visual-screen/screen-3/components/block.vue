<template>
  <div class="block">
    <div class="block-header">
      <span class="icon"></span>
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'Block',
  props: {
    title: String,
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.block {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .icon {
      background: url(~@/assets/img/visual-screen/screen-3/title.png) center
        center / contain no-repeat;
      width: 3.2em;
      height: 1.875em;
    }

    .title {
      font-size: 1.125em;
      font-family: youshebiaotihei !important;
      color: #ffffff;
      background: linear-gradient(180deg, #ffffff 0%, #afafc2 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .body {
    flex: 1;
    height: 0;
  }
}
</style>
