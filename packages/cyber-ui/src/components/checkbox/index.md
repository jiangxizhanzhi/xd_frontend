## 基础用法

```html
<template>
  <div>
    <cb-checkbox v-model="checked">备选项</cb-checkbox>
    <cb-checkbox v-model="checked">备选项</cb-checkbox>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        checked: true,
      };
    },
  };
</script>
<!-- live-cb-checkbox-base.vue -->
```

## 禁用状态

```html
<template>
  <div>
    <cb-checkbox v-model="checked1" disabled>备选项1</cb-checkbox>
    <cb-checkbox v-model="checked2" disabled>备选项</cb-checkbox>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        checked1: false,
        checked2: true,
      };
    },
  };
</script>
<!-- live-cb-checkbox-disabled.vue -->
```

## 多选框组

```html
<template>
  <div class="checkbox">
    <cb-checkbox-group v-model="checkList" @change="checkboxChange">
      <cb-checkbox label="复选框 A"></cb-checkbox>
      <cb-checkbox label="复选框 B"></cb-checkbox>
      <cb-checkbox label="复选框 C"></cb-checkbox>
      <cb-checkbox label="禁用" disabled></cb-checkbox>
      <cb-checkbox disabled> 备选项 </cb-checkbox>
    </cb-checkbox-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkList: ['选中且禁用', '复选框 A'],
      };
    },
    methods: {
      checkboxChange(val) {
        console.log(val);
      },
    },
  };
</script>
<style lang="scss">
  .checkbox {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<!-- live-cb-checkbox-more.vue -->
```

## 多选框组竖直方向

```html
<template>
  <div class="checkbox">
    <cb-checkbox-group v-model="checkList" direction="vertical">
      <cb-checkbox label="复选框 A"></cb-checkbox>
      <cb-checkbox label="复选框 B"></cb-checkbox>
      <cb-checkbox label="复选框 C"></cb-checkbox>
      <cb-checkbox label="禁用" disabled></cb-checkbox>
      <cb-checkbox disabled>
        备选备选项备选项备选项备选项备选项备选项备选项备选项备选项项备选备选项备选项备选项备选项备选项备选项备选项备选项备选项项备选备选项备选项备选项备选项备选项备选项备选项备选项备选项项备选备选项备选项备选项备选项备选项备选项备选项备选项备选项项备选备选项备选项备选项备选项备选项备选项备选项备选项备选项项
      </cb-checkbox>
    </cb-checkbox-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkList: ['选中且禁用', '复选框 A'],
      };
    },
  };
</script>
<style lang="scss">
  .checkbox {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<!-- live-cb-checkbox-more2.vue -->
```
