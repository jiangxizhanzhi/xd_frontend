## 单选

```html
<template>
  <div>
    <cb-filter-condition
      v-model="select"
      :condition="typeCondition"
      :filterList="typeLists"
      :showCount="10"
      :height="32"
      @change="changeFunc"
    ></cb-filter-condition>
    <!-- <span style="color:white"> {{select}}</span> -->
    <h4>关闭展开功能</h4>
    <cb-filter-condition
      v-model="select"
      :condition="typeCondition"
      :filterList="typeLists"
      :showCount="0"
      @change="changeFunc"
    ></cb-filter-condition>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        select: 1,
        typeCondition: '分类',
        searchCondition: 0,
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
          {
            label: '高级',
            value: 4,
          },
          {
            label: '中级',
            value: 5,
          },
          {
            label: '低级',
            value: 6,
          },
          {
            label: '高级',
            value: 7,
          },
          {
            label: '中级',
            value: 8,
          },
          {
            label: '低级',
            value: 9,
          },
          {
            label: '高级',
            value: 10,
          },
          {
            label: '中级',
            value: 11,
          },
          {
            label: '低级低级低级低级低级低级低级低级',
            value: 12,
          },
          {
            label: '高级',
            value: 13,
          },
          {
            label: '中级',
            value: 14,
          },
          {
            label: '低级',
            value: 15,
          },
          {
            label: '低级',
            value: 16,
          },
          {
            label: '低级',
            value: 17,
          },
          {
            label: '低级',
            value: 18,
          },
          {
            label: '低级',
            value: 19,
          },
          {
            label: '低级',
            value: 20,
          },
          {
            label: '低级',
            value: 21,
          },
          {
            label: '低级',
            value: 22,
          },
          {
            label: '低级',
            value: 23,
          },
        ],
      };
    },
    methods: {
      changeFunc(item) {
        console.log('md changeFunc', item);
      },
      getSearchValue(value) {
        console.log(value);
      },
    },
  };
</script>
<!-- cb-search.vue -->
```

## 多选

```html
<template>
  <div>
    {{select}}----
    <cb-filter-condition
      v-model="select"
      :condition="typeCondition"
      :filterList="typeLists"
      type="checkbox"
      :props="{label:'name',value:'value'}"
    ></cb-filter-condition>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        select: [1, 2],
        typeCondition: '分类',
        searchCondition: 0,
        typeLists: [
          {
            name: '全部1',
            all: true,
            value: 0,
          },
          {
            name: '高级',
            value: 1,
          },
          {
            name: '中级',
            value: 2,
          },
          // {
          //   label: '低级',
          //   value: 3,
          // },
          // {
          //   label: '高级',
          //   value: 4,
          // },
          // {
          //   label: '中级',
          //   value: 5,
          // },
          // {
          //   label: '低级',
          //   value: 6,
          // },
          // {
          //   label: '高级',
          //   value: 7,
          // },
          // {
          //   label: '中级',
          //   value: 8,
          // },
          // {
          //   label: '低级',
          //   value: 9,
          // },
          // {
          //   label: '高级',
          //   value: 10,
          // },
          // {
          //   label: '中级',
          //   value: 11,
          // },
          // {
          //   label: '低级低级低级低级低级低级低级低级',
          //   value: 12,
          // },
          // {
          //   label: '高级',
          //   value: 13,
          // },
          // {
          //   label: '中级',
          //   value: 14,
          // },
          // {
          //   label: '低级',
          //   value: 15,
          // },
        ],
      };
    },
    mounted() {
      setTimeout(() => {
        console.log('更新数据');
        this.typeLists = [
          {
            name: '22',
            value: 13,
          },
          {
            name: '11',
            value: 14,
          },
          {
            name: '3',
            value: 15,
          },
        ];
      }, 30000);
    },
    methods: {
      getSearchValue(value) {
        console.log(value);
      },
    },
  };
</script>
<!-- cb-search2.vue -->
```
