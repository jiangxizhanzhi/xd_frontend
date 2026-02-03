## 基本使用

```html
<template>
  <div>
    <div class="loading" v-loading="loading"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
      };
    },
  };
</script>
<style lang="scss">
  .loading {
    width: 400px;
    height: 400px;
    /* outline: 1px solid red; */
  }
</style>
<!-- live-loading.vue -->
```

## 整页加载

```html
<template> </template>
<template>
  <div>
    <cb-button
      type="primary"
      @click="openFullScreen1"
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      指令方式
    </cb-button>
    <cb-button type="primary" @click="openFullScreen2"> 服务方式 </cb-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fullscreenLoading: false,
      };
    },
    methods: {
      openFullScreen1() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      },
      openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      },
    },
  };
</script>
<!-- live-loading-full.vue  -->
```
