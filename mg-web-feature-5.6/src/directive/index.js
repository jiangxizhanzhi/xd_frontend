import { trim } from './input-trim';

const directive = (Vue) => {
  Vue.directive('input-trim', trim);
};

export default directive;
