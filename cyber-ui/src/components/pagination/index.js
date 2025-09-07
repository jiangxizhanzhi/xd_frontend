import APagination from 'ant-design-vue/lib/pagination';

import CbPagination from './src/pagination';
/* istanbul ignore next */
CbPagination.install = function (Vue) {
  Vue.use(APagination);
  Vue.component(CbPagination.name, CbPagination);
};
export default CbPagination;
