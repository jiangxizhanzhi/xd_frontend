## 基本演示

```html
<template>
  <cb-search-bar>
    <cb-search-input slot="search" v-model="value"></cb-search-input>
    <cb-button-group slot="searchRightArea">
      <cb-button button-type="add"></cb-button>
      <cb-button button-type="edit"></cb-button>
      <cb-button button-type="export"></cb-button>
    </cb-button-group>
    <cb-filter-condition
      slot="filter"
      v-model="select"
      :condition="typeCondition"
      :filterList="typeLists"
    ></cb-filter-condition>
  </cb-search-bar>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        select: 0,
        typeCondition: '分类',
        typeLists: [
          {
            label: '全部',
            all: true,
            value: 0,
          },
          {
            label: '高级',
            value: 1,
          },
          {
            label: '中级',
            value: 2,
          },
          {
            label: '低级',
            value: 3,
          },
        ],
      };
    },
    methods: {},
  };
</script>
<style lang="scss" scoped></style>
<!-- search-bar.vue -->
```
