import dialogDrag from './drag-dialog/drag';
import drag from './drag/index.js';
import copy from './copy';
const directives = {
  dialogDrag,
  drag,
  copy,
};
const importDirective = (Vue) => {
  Object.keys(directives).forEach((key) => {
    Vue.directive(directives[key].name, directives[key]);
  });
};
export default importDirective;
