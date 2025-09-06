import CbProgress from './src/progress.vue';
/* istanbul ignore next */
CbProgress.install = function (Vue) {
  Vue.component(CbProgress.name, CbProgress);
};
export default CbProgress;
