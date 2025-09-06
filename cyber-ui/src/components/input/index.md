## 基本使用

```html
<template>
  <div>
    <cb-input v-model="input" autofocus placeholder="请输入内容" />
    <cb-input v-model="input" background-color placeholder="请输入内容" />
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        input: '',
      };
    },
  };
</script>
<!-- live-input.vue -->
```

## 禁用状态

```html
<template>
  <div>
    <cb-input placeholder="请输入内容" v-model="input" disabled />
    <div style="margin: 20px 0;"></div>
    <cb-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea"
      disabled
    />
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        input: '内容1内容1内容1',
        textarea: '内容2内容2内容2',
      };
    },
  };
</script>
<!-- live-input-disabled.vue -->
```

## 前缀后缀

```html
<template>
  <div>
    <cb-input placeholder="请输入内容" v-model="input">
      <template slot="append"> 后缀 </template>
    </cb-input>
    <div style="margin: 20px 0;"></div>
    <cb-input placeholder="请输入内容" v-model="textarea">
      <template slot="prepend"> 前缀 </template>
    </cb-input>
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        input: '内容1内容1内容1',
        textarea: '内容2内容2内容2',
      };
    },
  };
</script>
<!-- live-input-suffix.vue -->
```

## 文本域

```html
<template>
  <div>
    <cb-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea"
    />
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        textarea: '',
      };
    },
  };
</script>
<!-- live-input-textarea.vue -->
```

## 输入长度限制

```html
<template>
  <div>
    <cb-input
      type="text"
      placeholder="请输入内容"
      v-model="text"
      maxlength="10"
      show-word-limit
    />
    <div style="margin: 20px 0;"></div>
    <cb-input
      type="textarea"
      placeholder="请输入内容"
      v-model="textarea"
      maxlength="30"
      show-word-limit
    />
  </div>
</template>
<script>
  /**
   * @classify Form/表单
   */
  export default {
    data() {
      return {
        text: '',
        textarea: '',
      };
    },
  };
</script>
<!-- live-input-length.vue -->
```
