```html
<template>
  <div>
    <cb-scrollbar height="100px">
      <h4 v-for="item in listData">{{item.title}}</h4>
    </cb-scrollbar>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        listData: [
          {
            title: '滚动第一行',
          },
          {
            title: '滚动第二行',
          },
          {
            title: '滚动第三行',
          },
          {
            title: '滚动第四行',
          },
          {
            title: '滚动第五行',
          },
          {
            title: '滚动第六行',
          },
          {
            title: '滚动第七行',
          },
          {
            title: '滚动第八行',
          },
          {
            title: '滚动第九行',
          },
        ],
      };
    },
  };
</script>
<style></style>
<!--live-scrollbar.vue-->
```
