## 基本使用

```html
<template>
  <div>
    <cb-inner-page :background="true">
      background=true
      <br />
      上内边距20px，下内边距20px
      <br />
      <br />
      <br />
      <br />
      <br />
    </cb-inner-page>
    <cb-inner-page :background="false">
      background=false
      <br />
      上内边距20px
      <br />
      <br />
      <br />
      <br />
      <br />
    </cb-inner-page>
    <cb-inner-page background="noOpacity">
      background="noOpacity"
      <br />
      上内边距20px
      <br />
      <br />
      <br />
      <br />
      <br />
    </cb-inner-page>
  </div>
</template>
<style lang="scss">
  .bg {
    color: #fff;
  }
</style>
<!-- live-inner-page.vue -->
```
