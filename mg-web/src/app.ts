import { IRuntime, IRuntimeResult } from '@cyber/cli';
import CyberUI, { setTheme, CbMessageBox } from '@cyber/ui';
import {
  request,
  getI18N,
  initFrame,
  getRouter,
  getStore,
  getUserPermissions,
  setLanguage,
} from '@cyber/helper';
import '@/style/index.scss';

import _ from 'lodash';
import './utils/jsplumb/jsplumb.js'; //子服务测评管理连接线需要，window挂载全局方法jsplumb
import '@/utils/web-test.js';
import compositionApi from '@vue/composition-api';
import directive from './directive';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';

import Constant from './constants';

import CbPlayer from './components/xgplayer';
import Textarea from '@/components/textarea/index.vue';
import ChapterLesson from '@/pages/web/personal/my-career/components/chapter-lesson';
import '@cyber/ui/src/theme/index.scss';
import VueChatScroll from 'vue-chat-scroll';
import Utils from './utils/utils.js';
import { webTrack } from './utils/track';

const i18n = getI18N();
let runtime: IRuntime = function (Vue): IRuntimeResult {
  // 前端配置文件: 打包后运维人员直接在打包文件夹下改config.json文件
  request
    .get('/public/config.json', {}, { baseURL: '/page/mg' })
    .then((res) => {
      const store = getStore();
      store.commit({
        type: 'config/setConfigData',
        configData: res.data,
      });
      if (res.data.language) {
        setLanguage(res.data.language);
      }
      request.setRequestGlobalConfig({
        headers: { 'Accept-Language': i18n.locale },
        errorHandler: (defaultRes) => {
          CbMessageBox.serverError(defaultRes);
        },
      });
    });

  Vue.use(compositionApi);
  Vue.use(directive);
  Vue.use(CyberUI, { i18n: getI18N(), router: getRouter(), store: getStore() });

  const originalPush = getRouter().push;
  getRouter().push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
  };

  const router = getRouter();

  router.beforeEach((to, from, next) => {
    Vue.prototype.$preRouter = from;
    next();
  });
  router.afterEach((to, from) => {
    if (to.name) {
      Utils.debounce(webTrack(null, 'pv', to), 50);
    }
  });

  Vue.use(CbPlayer);
  Vue.component('cy-textarea', Textarea);
  Vue.component('ChapterLesson', ChapterLesson);
  Vue.prototype.$request = request;
  Vue.prototype.$CONSTANT = Constant;
  Vue.prototype.$ListenDomChange = ListenDomChange;
  initFrame();
  setTheme('theme-light');
  Vue.use(VueChatScroll);

  function getRoles() {
    return getUserPermissions(undefined, undefined, {}, [
      'layout',
      '*',
      'default',
      'web-layout',
      'cms-layout',
      'web-default',
      'cms-default',
    ]);
  }
  // 资源用户固定id
  function filter(routes, roles) {
    let _parentName = _.get(routes, 'meta._parentName', []);
    let _folderName = _.get(routes, 'meta._folderName', []);
    if (_parentName.length === 0) {
      return (
        roles.includes(routes.name) || _.get(routes, 'meta.auth') === false
      );
    } else {
      let f = roles.some((el) => {
        return _parentName.includes(el) || _folderName.includes(el);
      });
      return (
        roles.includes(routes.name) ||
        roles.includes(_.get(routes, 'meta.breadcrumb.parentName'), '') ||
        _.get(routes, 'meta.auth') === false ||
        f
      );
    }
  }
  return { getRoles, filter };
};
export default runtime;
