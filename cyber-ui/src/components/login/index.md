## 基本演示

```html
<template>
  <div>
    <div>
      <cb-button-group>
        <cb-button @click="() => showRegister = !showRegister"
          >是否显示注册按钮</cb-button
        >
        <cb-button @click="() => showBackImg = !showBackImg"
          >是否显示背景图片</cb-button
        >
        <cb-button @click="() => showCustomBackImg = !showCustomBackImg"
          >自定义背景图片</cb-button
        >
      </cb-button-group>
    </div>
    <cb-login
      systemName="用户登录"
      :showRegister="showRegister"
      :showBackImg="showBackImg"
      :url="'www.baidu.com'"
      :registerUrl="'www.baidu.com'"
      :customBackImg="loadCusImg"
      @success="success"
      @error="error"
    ></cb-login>
  </div>
</template>

<script>
  import { themed } from '../../utils/themes';
  import customBackImg from '../../assets/img/userhead.png';
  export default {
    components: {},
    data() {
      return {
        showRegister: false,
        showBackImg: true,
        showCustomBackImg: false,
      };
    },
    computed: {
      loadCusImg() {
        return this.showCustomBackImg ? customBackImg : '';
      },
    },
    methods: {
      themed: themed,
      success(res) {
        this.$message.success('登录成功' + res);
      },
      error(res) {
        this.$message.error('登录失败' + res);
      },
    },
  };
</script>
<!-- login.vue -->
```
