import { IRuntime } from '@cyber/cli';
import 'element-ui/lib/theme-chalk/index.css';
import CyberUI, { setTheme, CbMessageBox } from '@cyber/ui';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import '@cyber/ui/src/theme/index.scss';
import '@/style/index.scss';
import '@/assets/styles/index.scss'; // global css
import {
  initFrame,
  setVueInstance,
  request,
  getI18N,
  getStore,
  getRouter,
  getUserPermissions,
} from '@cyber/helper';

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import JsonViewe from 'vue-json-viewer';

import * as echarts from 'echarts';

import Constant from './constants';
import './utils/websocket';

import ReconnectingWebSocket from 'reconnecting-websocket';
import EchartWrapper from './components/echart-wrapper/index.vue';
import _ from 'lodash';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import VueCropper from 'vue-cropper';
import CbPlayer from './components/xgplayer';
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import JsonViewer from 'vue-json-viewer';
import CompositionAPI from '@vue/composition-api';
import Utils from './utils/utils.js';
import { webTrack } from './utils/track';

// @ts-ignore
let runtime: IRuntime = function (Vue) {
  Vue.use(CompositionAPI);
  setVueInstance(Vue);

  const i18n = getI18N();
  const store = getStore();
  const router = getRouter();

  request.setRequestGlobalConfig({
    headers: { 'Accept-Language': i18n.locale },
    errorHandler: (defaultRes) => {
      CbMessageBox.serverError(defaultRes);
    },
  });
  Vue.use(CyberUI, { i18n, router, store });
  setTheme();
  const originalPush = getRouter().push;
  getRouter().push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
  };

  router.beforeEach((to, from, next) => {
    Vue.prototype.$preRouter = from;
    next();
  });
  router.afterEach((to, from) => {
    if (to.name) {
      Utils.debounce(webTrack(null, 'pv', to), 50);
    }
  });
  Vue.use(mavonEditor);
  Vue.use(JsonViewe);
  Vue.use(VueCropper);
  Vue.use(CbPlayer);
  Vue.use(VueCodemirror);
  Vue.use(JsonViewer);
  Vue.component('echart-wrapper', EchartWrapper);

  Vue.prototype.$ListenDomChange = ListenDomChange;
  Vue.prototype.$echarts = echarts;
  Vue.prototype.$CONSTANT = Constant;
  Vue.prototype.$_ = _;
  Vue.prototype.$ws = ReconnectingWebSocket;
  Vue.prototype.$request = request;
  initFrame();
  function getRoles() {
    return getUserPermissions(undefined, undefined, { baseURL: '/api/mp' }, [
      'web-layout',
      '*',
      'web-default',
      'cms-layout',
      'cms-default',
    ]);
  }

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
