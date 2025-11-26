<template>
  <div class="table">
    <cb-search-table
      :scroll="scroll"
      ref="table"
      query="query"
      :url="url"
      :baseURL="baseURL"
      :cols="columnsData"
      :data="query"
      :showQuickJumper="false"
      childrenColumnName="course_lessons"
      showLessItems
      :showIndex="showIndex"
      :row-selection="rowSelection"
      :rowKey="rowKey"
      :selection.sync="selection"
      :page-size-options="pageSizeOptions"
      @onSelectAll="onSelectAll"
      @onSelect="onSelect"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <slot name="leftSearch"></slot>
        <cb-search-input
          v-model="query[queryName.tableSearchName]"
          :placeholder="placeholder"
        ></cb-search-input>
      </template>
      <template v-for="(item, index) in columns" v-slot:[item.slot]="{ data }">
        <span :key="index" v-if="item.slot">
          <slot :name="item.slot" :data="data"> </slot>
        </span>
      </template>
    </cb-search-table>
  </div>
</template>

<script>
export default {
  props: {
    queryS: {
      type: Object,
    },
    placeholder: {
      type: String,
    },
    queryName: {
      type: Object,
      default: () => {},
    },
    baseURL: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    treeId: {
      type: String | Number,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: 'resource_id',
    },
    rowSelection: {
      type: null,
      default: null,
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Object,
      default: () => ({ y: 500 }),
    },
  },
  data() {
    return {
      selection: [],
      query: {},
      pageSizeOptions: ['10', '50', '100', '500', '1000'],
    };
  },
  computed: {
    columnsData() {
      const arr = [];
      this.columns.forEach((element) => {
        if (!element.position) {
          arr.push(element);
        }
        if (
          element.position &&
          (element.position === 'left' || element.position === 'all')
        ) {
          arr.push(element);
        }
      });
      return arr;
    },
  },
  created() {},
  mounted() {
    this.query = this.queryS;
  },
  watch: {
    queryS: {
      handler(val) {
        this.query = val;
      },
      deep: true,
    },
    treeId(val) {
      this.query[this.queryName.treeName] = val;
      const table = this.$refs.table;
      table.handleTableChange(table.paginator);
    },
    selection(val) {
      this.$emit('toggleSelection', val);
    },
  },
  methods: {
    onSelect(record, selected) {
      this.$emit('onSelect', record, selected);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      this.$emit('onSelectAll', selected, selectedRows, changeRows);
    },
  },
};
</script>
