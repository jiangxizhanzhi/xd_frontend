## 基本演示

```html
<template>
  <div style="height:540px">
    <cb-table-transfer
      :props="props"
      :tree="false"
      :query="query"
      placeholder="哈哈"
    >
      <template v-slot:create_username="{data}">
        <div>{{data.create_username}}</div>
      </template>
      <template v-slot:leftSearch>
        <div style="width:400px;display:flex">
          左侧插槽
          <cb-search-input v-model="query.name"></cb-search-input>
          <cb-input v-model="query.age"></cb-input>
        </div>
      </template>
      <template v-slot:operate> ss </template>
      <template v-slot:op>
        <div>右侧插槽</div>
      </template>
    </cb-table-transfer>
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

  export default {
    data() {
      return {
        props: {
          children: 'children',
          label: 'label',
        },
        query: {
          name: '',
          age: '',
        },
        privateData: {
          share_mode: 2,
          teachers: arrayData,
        },
      };
    },
    methods: {},
  };
</script>
<!-- live-auth-operation.vue -->
```
