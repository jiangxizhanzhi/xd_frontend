## 基本演示

```html
<template>
  <div>
    <cb-iconfont type="icon-lishizuijinshijian"></cb-iconfont>

    <cb-iconfont
      type="icon-lishizuijinshijian"
      themedColor="danger-color"
      :size="24"
    ></cb-iconfont>
    <cb-iconfont
      type="icon-lishizuijinshijian"
      themedColor="font-color-primary"
      :size="24"
    ></cb-iconfont>
  </div>
</template>
<script>
  import ListenDomChange from '../../utils/listen-dom';

  export default {
    data() {
      return {
        listen: new ListenDomChange({
          dom: document.body,
          callback: this.listenFunc,
        }),
      };
    },
    methods: {
      listenFunc(theme) {
        console.log(theme);
      },
    },
  };
</script>
<!-- live-iconfont.vue -->
```
