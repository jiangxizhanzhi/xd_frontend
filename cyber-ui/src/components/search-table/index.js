import CbSearchTable from './src/search-table.vue';
import ATable from 'ant-design-vue/lib/table';
const CbTableColumns = ATable.Column;
const CbTableColumnGroup = ATable.ColumnGroup;

CbSearchTable.install = function (Vue) {
  Vue.use(ATable);
  Vue.component(CbSearchTable.name, CbSearchTable);
  Vue.component('CbTableColumns', CbTableColumns);
  Vue.component('CbTableColumnGroup', CbTableColumnGroup);
};
export default CbSearchTable;
