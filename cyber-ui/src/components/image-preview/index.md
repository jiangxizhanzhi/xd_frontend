## 基本使用

```html
<template>
  <div>
    <cb-button @click="imgShow">预览</cb-button>
    <cb-image-preview :url-list="srcList" v-model="show"></cb-image-preview>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: false,
        srcList: [
          'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
        ],
      };
    },
    methods: {
      imgShow() {
        this.show = true;
      },
    },
  };
</script>
<!-- live-image-preview.vue -->
```
