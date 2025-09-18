## 基本演示

```html
<template>
  <cb-tabs type="border-card" v-model="activeName">
    <cb-tab-pane label="baseConfig" name="baseConfig"
      >baseConfig
      <cb-input />
      <cb-select> </cb-select>
    </cb-tab-pane>
    <cb-tab-pane label="advanceConfig" name="advanceConfig">
      <cb-search-table
        :scroll="{ y: 240 }"
        :background="true"
        url="http://10.100.3.4:3000/mock/195/cyber/table/data"
        :cols="columns"
        :data="query"
        childrenColumnName="course_lessons"
      >
        <template v-slot:search>
          <cb-input v-model="query.name" placeholder="请输入姓名"></cb-input>
          <cb-input v-model="query.age" placeholder="请输入年龄"></cb-input>
        </template>
      </cb-search-table>
    </cb-tab-pane>
    <cb-tab-pane label="authInfo" name="authInfo">authInfo</cb-tab-pane>
  </cb-tabs>
</template>
<script>
  import { themed } from '../../utils/themes';

  export default {
    data() {
      return {
        activeName: 'baseConfig',
        query: {
          name: '',
          age: '',
        },
        columns: [
          {
            label: '数据1',
            prop: 'learning_count',
          },
          {
            label: '数据3',
            prop: 'report_count',
          },
          {
            label: '数据2',
            prop: 'create_username',
          },
        ],
      };
    },
    methods: {
      themed: themed,
    },
  };
</script>
<style lang="scss" scoped>
  .cb-labcb-test {
    line-height: 32px;
  }
</style>
<!-- fixed-label.vue -->
```

```html
<template>
  <div>
    <cb-tabs type="card">
      <cb-tab-pane label="用户管理">用户管理</cb-tab-pane>
      <cb-tab-pane label="配置管理">配置管理</cb-tab-pane>
      <cb-tab-pane label="权限管理">权限管理</cb-tab-pane>
      <cb-tab-pane label="定时任务补偿">定时任务补偿</cb-tab-pane>
    </cb-tabs>
  </div>
</template>
<!-- fixed-label2.vue -->
```

```html
<template>
  <div>
    <cb-tabs>
      <cb-tab-pane label="用户管理">用户管理</cb-tab-pane>
      <cb-tab-pane label="配置管理">配置管理</cb-tab-pane>
      <cb-tab-pane label="权限管理">权限管理</cb-tab-pane>
      <cb-tab-pane label="定时任务补偿">定时任务补偿</cb-tab-pane>
    </cb-tabs>
  </div>
</template>
<!-- fixed-label3.vue -->
```
