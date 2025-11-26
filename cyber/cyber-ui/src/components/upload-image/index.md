## 拖拽上传图片

### 单个

```html
<template>
  <cb-upload-image action="https://jsonplaceholder.typicode.com/posts/">
    <template slot="tip"
      ><div>
        请上传.jpg、.png、.jpeg、.gif、.svg格式的文件，建议尺寸160x160px，大小不超过10M
      </div></template
    >
  </cb-upload-image>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!-- drag-upload-example.vue -->
```

```html
<template>
  <cb-upload-image
    :tip="tip"
    action="https://jsonplaceholder.typicode.com/posts/"
  >
  </cb-upload-image>
</template>
<script>
  export default {
    data() {
      return {
        tip: '请上传.jpg、.png、.jpeg、.gif、.svg格式的文件，建议尺寸160x160px，大小不超过10M',
      };
    },
    mounted() {},
  };
</script>
<!-- drag-upload-example-tip.vue -->
```

### 多个

```html
<template>
  <cb-upload-image
    :limit="100"
    action="https://jsonplaceholder.typicode.com/posts/"
  >
  </cb-upload-image>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!-- drag-upload-example1.vue -->
```

### 预览尺寸

```html
<template>
  <cb-upload-image
    image-width="140"
    :limit="100"
    action="https://jsonplaceholder.typicode.com/posts/"
  >
  </cb-upload-image>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!-- drag-upload-example1.vue -->
```

### disabled

```html
<template>
  <cb-upload-image disabled v-model="list"> </cb-upload-image>
</template>
<script>
  export default {
    data() {
      return {
        list: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          },
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          },
        ],
      };
    },
  };
</script>
<!-- drag-upload-example-disabled.vue -->
```
