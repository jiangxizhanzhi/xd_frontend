## 基本使用

```html
<template>
  <div>
    <cb-radio v-model="radio" label="1">备选项</cb-radio>
    <cb-radio v-model="radio" label="2">备选项</cb-radio>
    <br />
    <cb-radio-group v-model="radio">
      <cb-radio label="3">备选项</cb-radio>
      <cb-radio label="4">备选项</cb-radio>
      <cb-radio label="5">备选项</cb-radio>
    </cb-radio-group>
    <br />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '1',
      };
    },
  };
</script>
<!-- live-radio.vue -->
```

## 禁用状态

```html
<template>
  <div>
    <cb-radio disabled v-model="radio" label="禁用">备选项</cb-radio>
    <cb-radio disabled v-model="radio" label="选中且禁用">备选项</cb-radio>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '选中且禁用',
      };
    },
  };
</script>
<!-- live-radio-disabled.vue -->
```

## 单选按钮组

```html
<template>
  <div>
    <cb-radio-group v-model="radio">
      <cb-radio :label="3">备选项</cb-radio>
      <cb-radio :label="6">备选项</cb-radio>
      <cb-radio :label="9">备选项</cb-radio>
    </cb-radio-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: 3,
      };
    },
  };
</script>
<!-- live-radio-group.vue -->
```

## 竖向单选按钮组

```html
<template>
  <div>
    <cb-radio-group v-model="radio" direction="vertical">
      <cb-radio :label="3">备选项</cb-radio>
      <cb-radio :label="6">备选项</cb-radio>
      <cb-radio :label="9">备选项</cb-radio>
    </cb-radio-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: 3,
      };
    },
  };
</script>
<!-- live-radio-group2.vue -->
```

## 按钮样式

```html
<template>
  <div>
    <div>
      <cb-radio-group v-model="radio1" size="large">
        <cb-radio-button label="上海"></cb-radio-button>
        <cb-radio-button label="北京"></cb-radio-button>
        <cb-radio-button label="广州"></cb-radio-button>
        <cb-radio-button label="深圳"></cb-radio-button>
      </cb-radio-group>
    </div>
    <div style="margin-top: 20px">
      <cb-radio-group v-model="radio2">
        <cb-radio-button label="上海"></cb-radio-button>
        <cb-radio-button label="北京"></cb-radio-button>
        <cb-radio-button label="广州"></cb-radio-button>
        <cb-radio-button label="深圳"></cb-radio-button>
      </cb-radio-group>
    </div>
    <!-- <div style="margin-top: 20px">
      <cb-radio-group v-model="radio3" size="small">
        <cb-radio-button label="上海"></cb-radio-button>
        <cb-radio-button label="北京" disabled></cb-radio-button>
        <cb-radio-button label="广州"></cb-radio-button>
        <cb-radio-button label="深圳"></cb-radio-button>
      </cb-radio-group>
    </div> -->
    <div style="margin-top: 20px">
      <cb-radio-group v-model="radio4" disabled size="mini">
        <cb-radio-button label="上海"></cb-radio-button>
        <cb-radio-button label="北京"></cb-radio-button>
        <cb-radio-button label="广州"></cb-radio-button>
        <cb-radio-button label="深圳"></cb-radio-button>
      </cb-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio1: '上海',
        radio2: '上海',
        radio3: '上海',
        radio4: '上海',
      };
    },
  };
</script>
<!-- live-radio-group3.vue -->
```
