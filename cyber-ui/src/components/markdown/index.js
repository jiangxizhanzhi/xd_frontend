import CbMarkdown from './src/index.vue';
CbMarkdown.install = function (Vue) {
  Vue.component(CbMarkdown.name, CbMarkdown);
};
export default CbMarkdown;
