## 基本使用

```html
<template>
  <div>
    <cb-switch v-model="value"> </cb-switch>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
      };
    },
  };
</script>
<!--live-switch.vue-->
```

## 文字描述

```html
<template>
  <div>
    <cb-switch v-model="value" active-text="按月付费" inactive-text="按年付费">
    </cb-switch>
    <br />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
      };
    },
  };
</script>
<!--live-switch-text.vue-->
```

## 禁用状态

```html
<template>
  <div>
    <cb-switch v-model="value" disabled> </cb-switch>
    <cb-switch v-model="unChecked" disabled> </cb-switch>
    <br />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        unChecked: false,
      };
    },
  };
</script>
<!--live-switch-disabled.vue-->
```
