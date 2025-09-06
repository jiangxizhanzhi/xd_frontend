## 基本演示

```html
<template>
  <div>
    <cb-auth-operation
      :treeData="treeData"
      :props="props"
      :show-index="true"
      tree-width="200"
      :scroll="{y: 300}"
      :share-mode="share_mode"
    >
      <template v-slot:create_username="{data}">
        <div>{{data.create_username}}</div>
      </template>
      <template v-slot:leftSearch>
        <div style="width:100px">左侧插槽</div>
      </template>
      <template v-slot:rightSearch>
        <div>右侧插槽</div>
      </template>
    </cb-auth-operation>
  </div>
</template>
<script>
  const arrayData = [];
  for (let i = 0; i < 60; i++) {
    arrayData.push({
      key: i,
      name: `这是名字${i}`,
      resource_id: i * 10,
      share: 0,
      username: `name${i}`,
    });
  }
  import { themed } from '../../utils/themes';

  export default {
    data() {
      return {
        props: {
          children: 'children',
          label: 'label',
        },
        share_mode: 2,
        treeData: [
          {
            label:
              '一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1',
            id: 1,
            children: [
              {
                label: '二级 1-1',
                id: '1-1',
                children: [
                  {
                    label:
                      '三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 2',
            children: [
              {
                label: '二级 2-1',
                children: [
                  {
                    label: '三级 2-1-1',
                  },
                ],
              },
              {
                label: '二级 2-2',
                children: [
                  {
                    label: '三级 2-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 3',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 3',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 4',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 5',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 6',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
        ],
        privateData: {
          teachers: [],
        },
      };
    },
    mounted() {
      setTimeout(() => {
        this.privateData.teachers = arrayData;
      }, 1000);
    },
    methods: {
      themed: themed,
    },
  };
</script>
<style lang="scss">
  .cb-auth-operation {
    .cb-search-table .cb-table-no-data {
      padding: 0;
    }
  }
</style>
<!-- live-auth-operation.vue -->
```
