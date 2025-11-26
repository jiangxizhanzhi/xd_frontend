import CbAuthAccess from './src/manage-auth.vue';
/* istanbul ignore next */
CbAuthAccess.install = function (Vue) {
  Vue.component(CbAuthAccess.name, CbAuthAccess);
};
export default CbAuthAccess;
