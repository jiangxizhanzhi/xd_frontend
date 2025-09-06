import CbAuthOperation from './src/private-operation.vue';
/* istanbul ignore next */
CbAuthOperation.install = function (Vue) {
  Vue.component(CbAuthOperation.name, CbAuthOperation);
};
export default CbAuthOperation;
