# 基本演示

```html
<template>
  <div>
    <div>
      <cb-button @click="toggle">开始/暂停</cb-button>
      <cb-button @click="reset">重置</cb-button>
    </div>
    <div style="width: 180px">
      <cb-input v-model="newVal"></cb-input>
      <cb-button @click="set">新值</cb-button>
    </div>
    <h4>基本使用 prop 传值</h4>
    <cb-count-up :end="val" :decimals="2" ref="count1" />
    <h4>自定义颜色</h4>
    <cb-count-up
      :end="val"
      :decimals="2"
      ref="count2"
      :animate="false"
      color="primary-color"
    />
    <cb-count-up
      :end="val"
      :decimals="2"
      ref="count2"
      :animate="false"
      color="#11ffee"
    />
    <h4>自定义大小</h4>
    <cb-count-up
      :end="val"
      :decimals="2"
      ref="count3"
      separator=","
      size="28"
    />
    <h4>插槽</h4>
    <cb-count-up :end="val" ref="count4" size="28">{{ val }}</cb-count-up>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        newVal: 10000,
        val: 10000,
      };
    },
    mounted() {},
    methods: {
      toggle() {
        this.$refs.count1.pauseResume();
        this.$refs.count2.pauseResume();
        this.$refs.count3.pauseResume();
        this.$refs.count4.pauseResume();
      },
      reset() {
        this.$refs.count1.reset();
        this.$refs.count2.reset();
        this.$refs.count3.reset();
        this.$refs.count4.reset();
      },
      set() {
        this.val = this.newVal;
      },
    },
  };
</script>
<!-- cb-count-up.vue -->
```
