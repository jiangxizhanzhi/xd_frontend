## markdown 编辑器

```html
<template>
  <div style="width:100%;height:1000px">
    <cb-button @click="langChange('en-US')">英文</cb-button>
    <cb-button @click="langChange('zh-CN')">中文</cb-button>
    <cb-markdown
      v-model="value"
      :uploadImages="uploadImages"
      :uploadFile="uploadFile"
      :plugins="plugins"
      :uploadZip="uploadZip"
      :exportFile="exportFile"
    />
  </div>
</template>
<script>
  import { content } from './doc.js';
  import math from '@bytemd/plugin-math';

  import '../../theme/plugin/math/katex.min.css';
  import ZhHans from 'bytemd/locales/zh_Hans.json';
  import EN from 'bytemd/locales/en.json';
  import { request } from '@cyber/helper';

  export default {
    data() {
      return {
        value: content,
        plugins: [math()],
      };
    },
    methods: {
      langChange(value) {
        this.lang = value;
      },
      uploadImages(item) {
        console.log(item);
        return new Promise((resolve, reject) => {
          resolve([
            {
              url: 'https://webpack.docschina.org/docschina-logo.59f03f74b3c450856c01.png',
            },
          ]);
        });
      },
      uploadFile(item) {
        return new Promise((resolve) => {
          resolve([
            {
              name: '上传的文件22',
              url: 'https://webpack.docschina.org/docschina-logo.59f03f74b3c450856c01.png',
            },
          ]);
        });
      },
      uploadZip(item) {
        return new Promise((resolve) => {
          resolve([
            {
              name: '上传的文件11111',
              url: 'https://webpack.docschina.org/docschina-logo.59f03f74b3c450856c01.png',
            },
          ]);
        });
      },
      exportFile() {
        window.open('http://10.100.1.28/cpms/built_in/Demo.zip');
        // request.download('http://10.100.1.28/cpms/built_in/Demo.zip');
      },
    },
  };
</script>
<!-- live-Markdown.vue -->
```

## markdown 展示

```html
<template>
  <div style="width:800px">
    <CbMarkdown v-model="value" type="viewer" language="zh-CN" />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: content,
      };
    },
    mounted() {},
  };
</script>
<!-- live-Markdown2.vue -->
```
