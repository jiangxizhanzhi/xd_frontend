import personal from './web/personal';
import route from './web/route';
import message from './web/message';
import productActive from './web/product-active';
// import routes from './web/routes';
import changePwd from './web/change-password';
import sceneTips from './web/scene-tips.js';
import scene from './web/scene.js';
import vulnDetail from './web/vuln-detail';
import vulnIndex from './web/vuln-index';
import exp from './web/exp';
import shell from './web/shell';
import ghdb from './web/ghdb';
import systemManagement from './cms/system-management';
import notice from './cms/system-notice';
import dashboard from './cms/dashboard';
import systemOperation from './cms/system-operation';
import professionalSystem from './cms/professional-system';
import activation from './activation';
import constants from './constants';
import mgRoutes from './cms/mg-routes';
import ctRoutes from './ct-routes';
import routes from './routes';
import vulnRoutes from './vuln-routes';
import resource from './cms/resource';
import personTrainingScreen from './cms/person-training-screen';
import dynamicControl from './cms/dynamic-control';
import trainStatistics from './cms/train-statistics';
import device from './cms/device';
import system from './cms/system';
import langEn from './cms/zh';
import course from './web/course';
import other from './web/other';
import login from './login';
import topoMan from './topo-management';
import configuration from './configuration-ip';
import screenBusiness from './web/screen-business';
import intelligence from './intelligence';
import situation3DManage from './cms/situation-3D-manage';
import common from './common';
import components from './components';
import vulnList from './cms/vuln-list';
import paperMgr from './cms/paper-mgr';
import higherInfo from './cms/higher-info';
import _ from 'lodash';
const allZh = _.merge(course, other, langEn, scene);
const allRoutes = _.merge(routes);
export default {
  personal,
  message,
  productActive,
  mg: {},
  route,
  // routes,
  changePwd,
  sceneTips,
  ...mgRoutes,
  systemManagement,
  notice,
  systemOperation,
  professionalSystem,
  activation,
  constants,
  ctRoutes,
  routes,
  vulnRoutes,
  resource,
  personTrainingScreen,
  ...dynamicControl,
  trainStatistics,
  ...device,
  ...system,
  ...allRoutes,
  ...allZh,
  login,
  dashboard,
  ...topoMan,
  ...configuration,
  ...screenBusiness,
  intelligence,
  situation3DManage,
  vulnDetail,
  vulnIndex,
  exp,
  shell,
  ghdb,
  common,
  components,
  vulnList,
  paperMgr,
  higherInfo,
};
