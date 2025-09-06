import CyberUI, { setTheme, CbMessageBox } from '@cyber/ui';
import { Vue } from 'vue';
import { IRuntime } from '@cyber/cli';
import _ from 'lodash';
import {
  initFrame,
  setVueInstance,
  getI18N,
  getStore,
  getRouter,
  getUserPermissions,
  request,
} from '@cyber/helper';

const echarts = require('echarts');
window.echarts = echarts;

import '@/assets/css/index.scss';
import '@/style/index.scss';
import './assets/iconfont/iconfont.css';
import '@cyber/ui/lib/css/index.css';

import { getToken, getJWTToken } from '@/utils/auth';

import http from '@/utils/http.js';
import GlobalUtils from '@/utils/utils';
import VueBus from 'vue-bus'; // bus传值
import ReconnectingWebSocket from 'reconnecting-websocket';

import EchartWrapper from './components/echart-wrapper/index.vue';
import Textarea from './components/textarea/index.vue';
import TextareaFlag from './components/textarea/index-flag.vue';
import TimeCountdown from './components/scene-related/index';
import FixedLengthLabel from './components/fixed-length-label/index.vue';
import FormTags from './components/form-tag/form-tag.vue';
import VueCropper from 'vue-cropper';
import vuedraggable from 'vuedraggable';

import 'animate.css';

import CompositionAPI from '@vue/composition-api';

import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
// import Utils from './utils/utils.js';
// import { webTrack } from './utils/track';

const whiteList = ['/login', '/registration', '/license']; // no redirect whitelist
// 全局注册白名单备用
GlobalUtils.registerWhiteList(whiteList, 'practical-training');

let runtime: IRuntime = function (Vue: Vue) {
  setVueInstance(Vue);
  const i18n = getI18N();
  const store = getStore();
  const router = getRouter();
  Vue.use(CyberUI, { i18n, router, store });
  setTheme();
  const originalPush = getRouter().push;
  getRouter().push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
  };

  Vue.use(VueBus);
  Vue.use(CompositionAPI);
  http.registerRequestInterceptor(
    (config: { headers: { [x: string]: string } }) => {
      const csrftoken = getToken();
      if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
      }

      const jwttoken = getJWTToken();
      if (jwttoken) {
        config.headers['Authorization'] = 'JWT ' + jwttoken;
      }
      config.headers['Accept-Language'] = i18n.locale;
      return config;
    },
    (error: any) => {
      Promise.reject(error);
    },
  );

  http.registerResponseInterceptor(
    (response: any) => response,
    (error: any) => {
      const msg = _.get(error, 'response.data.__global.message');
      if (
        GlobalUtils.strInArr(msg, [
          'Invalid signature.',
          'Signature has expired.',
        ]) ||
        _.get(error, 'response.status') === 401
      ) {
        store.dispatch('user/ResetToken').then(() => {
          router.push({
            name: 'login',
          });
        });
      } else if (_.get(error, 'response.status') === 425) {
        router.push({
          name: 'license',
        });
      }

      return Promise.reject(error);
    },
  );

  // router.afterEach((to, from) => {
  //   if (to.name) {
  //     Utils.debounce(webTrack(null, 'pv', to), 50);
  //   }
  // });

  Vue.prototype.$_ = _;
  Vue.prototype.$request = request;
  Vue.prototype.$ws = ReconnectingWebSocket;
  Vue.prototype.$ListenDomChange = ListenDomChange;
  Vue.use(CompositionAPI);
  Vue.use(VueCropper);
  // Vue.use(VueCodemirror);
  Vue.use(VueBus);

  Vue.component('echart-wrapper', EchartWrapper);
  Vue.component('cy-textarea', Textarea);
  Vue.component('cy-textarea-flag', TextareaFlag);
  Vue.component('cy-time-countdown', TimeCountdown);
  Vue.component('fixed-length-label', FixedLengthLabel);
  Vue.component('draggable', vuedraggable);
  Vue.component('cy-tags', FormTags);
  initFrame();

  request.setRequestGlobalConfig({
    headers: { 'Accept-Language': i18n.locale },
    errorHandler: (defaultRes) => {
      CbMessageBox.serverError(defaultRes);
    },
  });

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
