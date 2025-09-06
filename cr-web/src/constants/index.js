import { Constant } from './base';
import _ from 'lodash';
import Vue from 'vue';
import('./setting/base');
import('./setting/auth');
import('./setting/scene');
import('./model/auth');
import('./model/cr_scene');
import('./model/condition');
import('./model/traffic');
import('./model/scene');
import('./model/mission');
import('./model/missions');
import('./model/traffic');
import('./model/probe');
import('./model/tool');
import('./model/ce-team-train');
import('./model/ce-base');

Vue.prototype.$CONSTANT = Constant;

export default Constant;

export { V, N, getNewConstant } from './base';
