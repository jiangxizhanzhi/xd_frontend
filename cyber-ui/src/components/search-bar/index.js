import CbSearchBar from './src/search-bar.vue';
/* istanbul ignore next */
CbSearchBar.install = function (Vue) {
  Vue.component(CbSearchBar.name, CbSearchBar);
};
export default CbSearchBar;
