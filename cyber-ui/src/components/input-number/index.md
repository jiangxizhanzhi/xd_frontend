## 基本使用

```html
<template>
  <div>
    <cb-input-number
      v-model="num"
      @change="handleChange"
      :min="1"
      :max="10"
      label="描述文字"
    ></cb-input-number>
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        num: 1,
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
    },
  };
</script>
<style>
  .bg {
    background: linear-gradient(0deg, #1d2533 0%, #273041 100%);
  }
</style>
<!--live-input-number.vue-->
```

## 位置

```html
<template>
  <div>
    <cb-input-number
      v-model="num"
      controls-position="right"
      @change="handleChange"
      :min="1"
      :max="10"
    ></cb-input-number>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        num: 1,
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
    },
  };
</script>
<!--live-input-number-position.vue-->
```
