import CbLogin from './src/login.vue';
/* istanbul ignore next */
CbLogin.install = function (Vue) {
  Vue.component(CbLogin.name, CbLogin);
};
export default CbLogin;
