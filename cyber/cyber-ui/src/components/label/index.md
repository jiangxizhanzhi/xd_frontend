## 基本演示

```html
<template>
  <div :style="{padding:'12px',background:themed('cy14')}">
    <cb-label
      class="cb-label-test"
      :width="200"
      str="test test test test test test test test test test"
    />
    <cb-label
      selectable
      :width="200"
      str="selectable test test test test test test test test test test"
      class="cb-label-test"
    />
  </div>
</template>
<script>
  import { themed } from '../../utils/themes';
  export default {
    data() {
      return {};
    },
    methods: {
      themed: themed,
    },
  };
</script>
<style lang="scss" scoped>
  .cb-label-test {
    line-height: 32px;
  }
</style>
<!-- fixed-label.vue -->
```
