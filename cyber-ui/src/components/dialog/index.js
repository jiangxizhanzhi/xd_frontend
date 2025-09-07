import CbDialog from './src/dialog.vue';
/* istanbul ignore next */
CbDialog.install = function (Vue) {
  Vue.component(CbDialog.name, CbDialog);
};
export default CbDialog;
