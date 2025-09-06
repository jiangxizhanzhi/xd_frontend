import CbJsonViewer from './src/index.vue';
CbJsonViewer.install = function (Vue) {
  Vue.component(CbJsonViewer.name, CbJsonViewer);
};
export default CbJsonViewer;
