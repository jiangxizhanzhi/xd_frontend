## 基本演示

```html
<template>
  <div>
    <cb-pagination
      :show-size-changer="false"
      :show-quick-jumper="false"
      :current.sync="current"
      :total="100"
      :pageSizeOptions="pageSizeOptions"
      :page-size.sync="pageSize"
      @currentChange="currentChange"
    >
    </cb-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageSizeOptions: ['10', '20'],
        current: 1,
        pageSize: 10,
      };
    },
    watch: {
      current(val) {
        console.log('current change', val);
      },
      pageSize(val) {
        console.log('pageSize change', val);
      },
    },
    methods: {
      currentChange(current) {
        console.log(current);
      },
    },
  };
</script>
<style lang="scss" scoped></style>
<!-- cb-pagination.vue -->
```

## 自定义 page-szie

```html
<template>
  <div>
    <cb-pagination
      :current.sync="current"
      :total="100"
      :pageSizeOptions="pageSizeOptions"
      :page-size.sync="pageSize"
      @currentChange="currentChange"
    >
    </cb-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageSizeOptions: ['10', '20'],
        current: 1,
        pageSize: 10,
      };
    },
    watch: {
      current(val) {
        console.log('current change', val);
      },
      pageSize(val) {
        console.log('pageSize change', val);
      },
    },
    methods: {
      currentChange(current) {
        console.log(current);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .bg {
    padding: 100px;
    background: rgb(50, 63, 90);
  }
</style>
<!-- cb-pagination-size.vue -->
```
