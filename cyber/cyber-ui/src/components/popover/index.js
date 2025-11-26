import CbPopover from './src/main';
import directive from './src/directive';

/* istanbul ignore next */
CbPopover.install = function (Vue) {
  Vue.directive('popover', directive);
  Vue.component(CbPopover.name, CbPopover);
};
CbPopover.directive = directive;

export default CbPopover;
