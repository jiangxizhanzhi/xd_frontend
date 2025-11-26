## 基本使用

```html
<template>
  <div>
    <cb-radio-group v-model="direction">
      <cb-radio label="ltr">从左往右开</cb-radio>
      <cb-radio label="rtl">从右往左开</cb-radio>
      <cb-radio label="ttb">从上往下开</cb-radio>
      <cb-radio label="btt">从下往上开</cb-radio>
    </cb-radio-group>
    <cb-button @click="drawer = true" type="primary"> 点我打开 </cb-button>
    <cb-drawer
      title="我是标题"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :modal="false"
    >
      <span>我来啦!</span>
    </cb-drawer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        direction: 'rtl',
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then((_) => {
            done();
          })
          .catch((_) => {});
      },
    },
  };
</script>
<!-- live-drawer.vue -->
```
