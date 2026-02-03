## 弹窗基本示例

```html
<template>
  <div>
    <cb-button @click="btnClick">点击弹出</cb-button>
    <cb-dialog width="550px" height="300px" :visible.sync="visibleValue">
      <template slot="title">
        <div>头部</div>
      </template>
      <div style="height: 400px">
        内容
        <cb-form-tags :value="value" isActive></cb-form-tags>
        <cb-select v-model="select">
          <cb-option :value="1">1</cb-option>
          <cb-option :value="2">2</cb-option>
          <cb-option :value="3">3</cb-option>
          <cb-option :value="4">4</cb-option>
          <cb-option :value="5">5</cb-option>
        </cb-select>
      </div>
      <template slot="footer">
        <div>底部</div>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ['a', 'ab', 'cc', 'dd'],
        visibleValue: false,
        select: [],
      };
    },
    watch: {},
    methods: {
      btnClick() {
        this.visibleValue = true;
      },
    },
  };
</script>

<!-- live-dialog.vue -->
```
