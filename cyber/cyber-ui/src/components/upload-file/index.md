## 文件上传

```html
<template>
  <div>
    <cb-upload-file
      :limit="10"
      :type="'file'"
      accept=".xls,.xlsx"
      v-model="list"
    >
      <template v-slot:tip>
        支持(.xls, .txt)格式文件, 模板下载: [ excel_demo.xls , txt_demo.txt ]
      </template>
    </cb-upload-file>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        action: 'http://10.100.2.21/mg/api/sv_base/public/file_upload/',
        type: 'file',
        list: [
          {
            name: 'foodfoodfofoodfoodfoodfoodfoodfoodfoodfoodfoodfoododfoodfoodfoodfoodfoodfoodfood.jpeg',
            url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00576-1654.jpg',
            isPreview: true,
          },
          {
            name: 'food2.jpeg',
            url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00057-169.jpg',
            isDownload: true,
          },
        ],
      };
    },
  };
</script>
<!--live-upload.vue-->
```

## 图片上传

```html
<template>
  <div>
    <cb-button @click="add">新增</cb-button>
    <cb-upload-file
      :limit="5"
      v-model="list"
      :fetchPromise="fetchPromise"
    ></cb-upload-file>
    <div v-for="(item,index) in list" :key="index">{{item.name}}</div>
  </div>
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
            name: 'food2.jpeg',
            url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00057-169.jpg',
          },
        ],
      };
    },
    methods: {
      add() {
        this.list.push({
          name: 'food2.jpeg',
          url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00057-169.jpg',
        });
      },
      fetchPromise() {},
    },
  };
</script>
<!--live-upload1.vue-->
```

## 单个图片上传

```html
<template>
  <div>
    <cb-upload-file :type="type" v-model="list"></cb-upload-file>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'file',
        list: [
          {
            name: '111',
            url: '222',
          },
        ],
      };
    },
  };
</script>
<!--live-upload-single.vue-->
```

## 自定义上传

```html
<template>
  <div>
    <cb-upload-file
      :type="type"
      v-model="list"
      :fetch-promise="uploadFunc"
    ></cb-upload-file>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'file',
        list: [],
      };
    },
    methods: {
      uploadFunc(file) {
        console.log('自定义上传', file);
      },
    },
  };
</script>
<!--live-upload-promise.vue-->
```

## 一些插槽

```html
<template>
  <div>
    <cb-upload-file :limit="10" v-model="list" :file-size="3 * 1024 * 1024">
      <cb-button @click="reset">插槽</cb-button>
      <template v-slot:tip>
        只能上传jpg/png文件，且不超过500kb
        <cb-button>下载附件</cb-button>
      </template>
    </cb-upload-file>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        action: 'http://10.100.2.21/mg/api/sv_base/public/file_upload/',
        type: 'file',
        list: [
          {
            name: 'foodfoodfofoodfoodfoodfoodfoodfoodfoodfoodfoodfoododfoodfoodfoodfoodfoodfoodfood.jpeg',
            url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00576-1654.jpg',
          },
          {
            name: 'food2.jpeg',
            url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00057-169.jpg',
          },
        ],
      };
    },
    methods: {
      reset() {
        this.list = [];
      },
    },
  };
</script>
<!--live-upload-slot.vue-->
```

## 单个

```html
<template>
  <div>
    <cb-upload-file :fetch-promise="uploadFunc"></cb-upload-file>
    <div v-for="(item,index) in list" :key="index">{{item}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'file',
        list: [],
      };
    },
    methods: {
      uploadFunc(file) {
        // let _this = this;
        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function (e) {
        //   _this.list = [
        //     {
        //       name: '456457',
        //       url: e.target.result,
        //     },
        //   ];
        // };
      },
    },
  };
</script>
<!-- live-example.vue -->
```

```html
<template>
  <cb-upload-file
    drag
    type="file"
    accept=".zip"
    fileSize="104857600"
    v-model="list"
    :fetch-promise="uploadFunc"
    @delete="deleteFile"
  >
    <cb-iconfont type="icon-xinzeng" size="25"></cb-iconfont>
    <div style="color: var(--neutral8); font-size: 14px;margin-bottom:4px">
      点击或拖拽文件到此处上传
    </div>
    <div style="color: var(--neutral5); font-size: 12px">
      请上传.zip格式的文件且大小不超过100MB
    </div>
  </cb-upload-file>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
      };
    },
    methods: {
      uploadFunc(file) {},
      deleteFile(file) {
        this.list = this.list.filter((item) => item.url !== file.url);
        this.form.file = '';
        this.file = null;
      },
    },
  };
</script>

<!-- live-drag-example.vue -->
```
