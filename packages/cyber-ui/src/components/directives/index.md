# 拖拽 dialog

```html
<template>
  <div>
    <cb-button @click="btnClick">点击弹出</cb-button>
    <cb-dialog :visible="visibleValue">
      <template slot="title">
        <div>头部</div>
      </template>
      <div>内容</div>
      <template slot="footer">
        <div>底部</div>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visibleValue: false,
      };
    },
    methods: {
      btnClick() {
        this.visibleValue = !this.visibleValue;
      },
    },
  };
</script>

<!-- live-dialog.vue -->
```

# 拖拽任意元素

```html
<template>
  <div>
    <div
      style="position: fixed;bottom:100px;right:100px;outline:1px solid red;width:100px;height:100px;background:red"
      v-drag
    >
      <div>可以拖拽</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>

<!-- live-dialog2.vue -->
```

# 拷贝

```html
<template>
  <div>
    <div v-copy>拷贝</div>
  </div>
</template>

<!-- live-dialog3.vue -->
```
