
<template>
  <div class="custom">
    <div class="custom-page-left">
      <div class="custom-left">
        <!-- tree -->
        <div class="tree" :style="treeStyle" v-if="tree">
          <cb-search-input
            style="margin-bottom: 16px"
            @change="searchFunc"
          ></cb-search-input>
          <cb-tree
            ref="tree"
            default-expand-all
            :data="treeData"
            :props="props"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            :expand-on-click-node="false"
          >
            <template slot-scope="{ node }">
              <span :title="node.label" class="el-tree-node__label">{{
                node.label
              }}</span>
            </template>
        </cb-tree>
        </div>
        <Table
          :columns="columns"
          :url="url"
          :queryS="query"
          :placeholder="placeholder"
          :rowKey="rowKey"
          :rowSelection="rowSelection"
          :queryName="queryName"
          :baseURL="baseURL"
          :treeId="role_id"
          :showIndex="showIndex"
          :scroll='scroll'
          @onSelectAll="onSelectAll"
          @onSelect="onSelect"
        >
          <template
            v-for="(item, index) in columns"
            v-slot:[item.slot]="{ data }"
          >
            <span :key="index" v-if="item.slot">
              <slot :name="item.slot" :data="data"></slot>
            </span>
          </template>
          <template v-slot:leftSearch>
            <slot name="leftSearch"></slot>
          </template>
        </Table>
      </div>
    </div>
    <div class="custom-center">
      <cb-iconfont type="icon-daorujiantou" size="40"></cb-iconfont>
    </div>
    <div class="custom-page-right">
      <SelectTable
        :columns="columns"
        :rowKey="rowKey"
        :data="selectDataArr"
        :showIndex="showIndex"
        :scroll='scroll'
        @delete="deleteFunc"
      >
        <template
          v-for="(item, index) in columns"
          v-slot:[item.slot]="{ data }"
        >
          <span :key="index" v-if="item.slot">
            <slot :name="item.slot" :data="data"> </slot>
          </span>
        </template>
        <template v-slot:rightSearch>
          <slot name="rightSearch"></slot>
        </template>
      </SelectTable>
    </div>
  </div>
</template>

<script>
import Table from './table.vue';
import SelectTable from './select-table.vue';
import _ from 'lodash';

/**
 * @displayName cb-table-transfer 列表穿梭框
 * @classify Business/业务
 */
export default {
  name: 'CbTableTransfer',
  props: {
    /**
     * 查询条件
     */
    query: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      // default: this.$t('g.pleaseEnterKeyWords'),
    },
    tree: {
      type: Boolean,
      default: true,
    },
    queryName: {
      type: Object,
      default: () => {
        return {
          treeName: 'organization',
          tableSearchName: 'name',
        };
      },
    },
    baseURL: {
      type: String,
      default: '',
    },
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
        };
      },
    },
    url: {
      type: String,
      default: '',
    },
    treeKey: {
      type: String,
      default: 'id',
    },
    rowKey: {
      type: String,
      default: 'resource_id',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    selectData: {
      type: Array,
      default: () => [],
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    /**
     * 左侧树宽度
     */
    treeWidth: {
      type: [String, Number],
    },
    scroll: {
      type: Object,
      default: () => ({ y: 500 }),
    },
  },
  data() {
    return {
      role_id: '',
      selectDataArr: [],
    };
  },
  computed: {
    rowSelection(record) {
      return {
        selectedRowKeys: this.selectArr,
        onChange: this.onSelectChange,
      };
    },
    selectArr() {
      const arr = [];
      this.selectDataArr.forEach((element) => {
        arr.push(element[this.rowKey]);
      });
      return arr;
    },
    treeStyle() {
      return {
        height: this.scroll.y ? this.scroll.y + 171 +'px' : '500px',
        width: this.treeWidth
          ? (this.treeWidth + '').includes('px')
            ? this.treeWidth
            : this.treeWidth + 'px'
          : '',
      };
    },
  },
  created() {},
  mounted() {
    this.selectDataArr = this.selectData;
  },
  watch: {
    selectData(val) {
      this.selectDataArr = val;
    },
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.$emit('onSelectRowKeys', selectedRows)
    },
    deleteFunc(val) {
      this.selectDataArr.forEach((element, index) => {
        if (element[this.rowKey] === val[this.rowKey]) {
          this.selectDataArr.splice(index, 1);
        }
      });
      this.$emit('onChange', this.selectDataArr);
    },
    nodeClick(data, obj, node) {
      this.role_id = data[this.treeKey];
    },
    searchFunc(val) {
      this.$refs.tree.filter(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    onSelect(record, selected) {
      let obj = _.cloneDeep(record);
      if (selected) {
        this.selectDataArr.push(obj);
      } else {
        this.selectDataArr.forEach((element, index) => {
          if (element[this.rowKey] === obj[this.rowKey]) {
            this.selectDataArr.splice(index, 1);
          }
        });
      }
      this.$emit('onChange', this.selectDataArr);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      let arr = _.cloneDeep(changeRows);
      if (selected) {
        this.selectDataArr = this.selectDataArr.concat(arr);
      } else {
        arr.forEach((element) => {
          this.selectDataArr.forEach((item, index) => {
            if (element[this.rowKey] == item[this.rowKey]) {
              this.selectDataArr.splice(index, 1);
            }
          });
        });
      }
      this.$emit('onChange', this.selectDataArr);
    }
  },
  components: { Table, SelectTable },
};
</script>
