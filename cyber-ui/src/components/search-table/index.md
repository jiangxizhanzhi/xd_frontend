## table 基本演示（首列自定义表头）

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols="columns"
      showIndex
      :row-selection="rowSelection"
      :selection="tableSelector"
      row-key="key"
      :pageSize="30"
      :fetchPromise="fetchPromise"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      :searchBarBg="true"
    >
      <template slot="name"> 呵呵 </template>
      <template slot="search">
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
      </template>
      <template slot="searchRightArea">
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
      </template>
      <template slot="filter">
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
      </template>
      <template v-slot:customName>
        <div>
          <span>名称</span>
          <cb-iconfont type="icon-caozuoshuoming1"></cb-iconfont>
        </div>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
  export default {
    computed: {
      rowSelection(record) {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              'selectedRows: ',
              selectedRows,
            );
          },
          getCheckboxProps: (record) => {
            return {
              props: {
                disabled: Math.random() < 0.5,
                defaultChecked: true,
                name: record.name,
              },
            };
          },
        };
      },
    },
    data() {
      return {
        current: 1,
        pageSize: 10,
        tableSelector: {
          maxSelect: 100,
        },
        multipleSelection: [],
        columns: [
          {
            dataIndex: 'name',
            prop: 'name',
            sorter: true,
            titleSlot: 'customName', // 自定义表头
          },
          {
            title: this.$t('g.search'),
            dataIndex: 'age',
            prop: 'age',
            width: '12%',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 2,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [
                    {
                      key: 1,
                      name: '这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格',
                      age: 60,
                      address: 'New York No. 1 Lake Park',
                    },
                    {
                      key: 2,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 3,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 4,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 5,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 6,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                  ],
                },
              });
            }, 500);
          });
        },
      };
    },
  };
</script>
<!-- cb-base-table.vue -->
```

## table 可拖拽

### cols 加 sync 并且列设置 resizable 和 prop

### 列 width 只有 px 或者数字时才可限制最小拖拽宽度

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols.sync="columns"
      selector="checkbox"
      :selection.sync="multipleSelection"
      :pageSize="30"
      :fetchPromise="fetchPromise"
    >
      <template slot="search">
        <cb-button @click="updateColsWidth">test</cb-button>
        <cb-button @click="updateColsWidth2">test</cb-button>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
  export default {
    computed: {},
    data() {
      return {
        current: 1,
        pageSize: 10,
        multipleSelection: [],
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            prop: 'name',
            sorter: true,
            width: '600px',
            resizable: true,
          },
          {
            title: this.$t('g.search'),
            dataIndex: 'age',
            prop: 'age',
            width: 200,
            resizable: true,
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 2,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [
                    {
                      key: 1,
                      name: '这是拖动表格',
                      age: 60,
                      address: 'New York No. 1 Lake Park',
                    },
                    {
                      key: 2,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 3,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 4,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 5,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 6,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                  ],
                },
              });
            }, 500);
          });
        },
      };
    },
    methods: {
      updateColsWidth() {
        this.$refs.sdlRef.updateColsWidth('age', 30);
      },
      updateColsWidth2() {
        this.$refs.sdlRef.updateColsWidth('age', -30);
      },
    },
  };
</script>
<!-- cb-resize-table.vue -->
```

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols="columns"
      showIndex
      :row-selection="rowSelection"
      :selection="tableSelector"
      row-key="key"
      :pageSize="30"
      :fetchPromise="fetchPromise"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
    >
      <template slot="name"> 呵呵 </template>
      <template slot="search">
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
      </template>
      <template slot="searchRightArea">
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
      </template>
      <template slot="filter">
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
  export default {
    computed: {
      rowSelection(record) {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              'selectedRows: ',
              selectedRows,
            );
          },
          getCheckboxProps: (record) => {
            return {
              props: {
                disabled: Math.random() < 0.5,
                defaultChecked: true,
                name: record.name,
              },
            };
          },
        };
      },
    },
    data() {
      return {
        current: 1,
        pageSize: 10,
        tableSelector: {
          maxSelect: 100,
        },
        multipleSelection: [],
        columns: [
          {
            title: function () {
              return <div style="color:red">姓名</div>;
            },
            dataIndex: 'name',
            prop: 'name',
            sorter: true,
          },
          {
            title: this.$t('g.search'),
            dataIndex: 'age',
            prop: 'age',
            width: '12%',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 0,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [],
                },
              });
            }, 500);
          });
        },
      };
    },
  };
</script>
<!-- cb-base-table-empty.vue -->
```

## 单选

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols="columns"
      showIndex
      :row-selection="rowSelection"
      :selection="tableSelector"
      row-key="key"
      :fetchPromise="fetchPromise"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
    >
      <template slot="name"> 呵呵 </template>
      <template slot="search">
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
      </template>
      <template slot="searchRightArea">
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
      </template>
      <template slot="filter">
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
        <cb-button colorType="yellow">test</cb-button>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
  export default {
    computed: {
      rowSelection(record) {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              'selectedRows: ',
              selectedRows,
            );
          },
          getCheckboxProps: (record) => {
            return {
              props: {
                disabled: record.name.indexOf('wzj') > -1,
                defaultChecked: record.name === 'wzj',
                name: record.name,
              },
            };
          },
        };
      },
    },
    data() {
      return {
        current: 1,
        pageSize: 10,
        tableSelector: {
          maxSelect: 1,
        },
        multipleSelection: [],
        columns: [
          {
            title: function () {
              return <div style="color:red">姓名</div>;
            },
            dataIndex: 'name',
            prop: 'name',
          },
          {
            title: this.$t('g.search'),
            dataIndex: 'age',
            prop: 'age',
            width: '12%',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 2,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [
                    {
                      key: 1,
                      name: '这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格这是表格',
                      age: 60,
                      address: 'New York No. 1 Lake Park',
                    },
                    {
                      key: 2,
                      name: 'wzj',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                    {
                      key: 3,
                      name: 'wzj1',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                    },
                  ],
                },
              });
            }, 500);
          });
        },
      };
    },
  };
</script>
<!-- cb-base-table2.vue -->
```

## table-tree 基本演示

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols="columns"
      row-key="key"
      :expandRowKey="expandNumber"
      :fetchPromise="fetchPromise"
    >
      <template slot="search">
        <cb-button @click="expandClick(2,true)">展开第二行</cb-button>,
        <cb-button @click="expandClick(2,false)">关闭第二行</cb-button>
        <cb-button @click="expandClick(3)">展开第三行</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
        <cb-button>test</cb-button>
      </template>
      <template slot="searchRightArea">
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
        <cb-button colorType="red">test</cb-button>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
  import { themed } from '../../utils/themes';
  export default {
    data() {
      return {
        expandNumber: {},
        current: 1,
        pageSize: 10,
        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            prop: 'name',
          },
          {
            title: 'Age',
            dataIndex: 'age',
            prop: 'age',
            width: '12%',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 2,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [
                    {
                      key: 1,
                      name: 'John Brown sr.John Brown sr.John Brown sr.John Brown sr.John Brown sr.',
                      age: 60,
                      address:
                        'New York No. 1 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake Park',
                    },
                    {
                      key: 2,
                      name: 'Joe Black',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                      children: [
                        {
                          key: 11111,
                          name: 'John Brown',
                          age: 42,
                          address:
                            'New York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake Park',
                        },
                        {
                          key: 12111,
                          name: 'John Brown jr.',
                          age: 30,
                          address: 'New York No. 3 Lake Park',
                        },
                        {
                          key: 13111,
                          name: 'Jim Green sr.',
                          age: 72,
                          address: 'London No. 1 Lake Park',
                        },
                      ],
                    },
                    {
                      key: 3,
                      name: 'Joe Black',
                      age: 32,
                      address: 'Sidney No. 1 Lake Park',
                      children: [
                        {
                          key: 11222,
                          name: 'John Brown',
                          age: 42,
                          address:
                            'New York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake ParkNew York No. 2 Lake Park',
                        },
                        {
                          key: 12222,
                          name: 'John Brown jr.',
                          age: 30,
                          address: 'New York No. 3 Lake Park',
                        },
                        {
                          key: 13222,
                          name: 'Jim Green sr.',
                          age: 72,
                          address: 'London No. 1 Lake Park',
                        },
                      ],
                    },
                  ],
                },
              });
            }, 500);
          });
        },
      };
    },
    methods: {
      themed: themed,
      expandClick(val, status) {
        console.log('点击展开', val, status);
        this.expandNumber = { key: val, status };
        console.log('点击展开', this.expandNumber);
      },
    },
  };
</script>
<style lang="scss" scoped></style>
<!-- cb-pagintableation.vue -->
```

## 通过 url 请求数据

```html
<template>
  <div>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
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
  };
</script>
<style></style>
<!-- search-table.vue -->
```

## Empty

```html
<template>
  <div :style="{padding:'12px'}">
    <cb-search-table
      ref="sdlRef"
      :cols.sync="columns"
      selector="checkbox"
      :selection.sync="multipleSelection"
      :pageSize="30"
      :fetchPromise="fetchPromise"
    >
    </cb-search-table>
  </div>
</template>
<script>
  export default {
    computed: {},
    data() {
      return {
        current: 1,
        pageSize: 10,
        multipleSelection: [],
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            prop: 'name',
            sorter: true,
            width: '600px',
            resizable: true,
          },
          {
            title: this.$t('g.search'),
            dataIndex: 'age',
            prop: 'age',
            width: 200,
            resizable: true,
          },
          {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
            prop: 'address',
          },
        ],
        fetchPromise(queryData, option) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  links: {
                    pagination: {
                      total: 2,
                      per_page: 10,
                      current_page: 1,
                      last_page: 1,
                      next_page_url: null,
                      prev_page_url: null,
                      from: 1,
                      to: 10,
                    },
                  },
                  data: [],
                },
              });
            }, 500);
          });
        },
      };
    },
    methods: {},
  };
</script>
<!-- cb-resize-empty-table.vue -->
```
