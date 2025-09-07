## 面包屑基本演示

```html
<template>
  <div>
    <cb-breadcrumb :data="data" :active="active"></cb-breadcrumb>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [
          {
            name: 'index',
            path: '/breadcrumb',
            meta: {
              title: '首页1首页1',
            },
            children: [
              {
                name: 'index1',
                path: '/breadcrumb/1',
                meta: {
                  title: '首页1',
                  breadcrumb: {
                    parentName: 'index',
                  },
                },
              },
              {
                name: 'index2',
                path: '/breadcrumb/2',
                meta: {
                  title: '首页2',
                  breadcrumb: {
                    parentName: 'index',
                  },
                },
              },
              {
                name: 'index3',
                path: '/breadcrumb/3',
                meta: {
                  title: '首页3',
                  breadcrumb: {
                    parentName: 'index',
                  },
                },
              },
            ],
          },
        ],
        active: {
          name: 'index2',
          path: '/breadcrumb/2',
          meta: {
            title:
              '首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2首页2',
            breadcrumb: {
              parentName: 'index',
            },
          },
        },
      };
    },
    methods: {},
  };
</script>
<!-- live-breadcrumb.vue -->
```
