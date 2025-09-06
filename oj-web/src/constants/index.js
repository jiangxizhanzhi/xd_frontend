import Vue from 'vue';
import { Constant } from './base';
import './exercisers/type';
import './setting/base';

import './practice/auth';
import './personal/auth';
Vue.prototype.$CONSTANT = Constant;
export default Constant;

export { V, N, getNewConstant } from './base';
