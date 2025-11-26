## 基本使用

```html
<template>
  <div>
    <cb-steps :active="active" :data="data">
      <!-- <template v-slot:icon="{item,index}"> {{item}} </template> -->
    </cb-steps>
    <cb-button @click="activeChange">切换</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 1,
        data: [{ title: '步骤1' }, { title: '步骤2' }, { title: '步骤3' }],
      };
    },
    methods: {
      activeChange() {
        this.active++;
      },
    },
  };
</script>
<style lang="scss">
  .step {
    background: #434f6a;
    padding: 20px;
  }
</style>
<!-- live-steps.vue -->
```

## 另一种方式

```html
<template>
  <div>
    <cb-steps :active="active" type="default">
      <cb-step title="哈哈哈哈"></cb-step>
      <cb-step title="呵呵"></cb-step>
      <cb-step title="嘻嘻"></cb-step>
    </cb-steps>
    <cb-button @click="activeChange">切换</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 1,
      };
    },
    methods: {
      activeChange() {
        this.active++;
      },
    },
  };
</script>
<style lang="scss">
  .step {
    background: #434f6a;
    padding: 20px;
  }
</style>
<!-- live-steps2.vue -->
```
