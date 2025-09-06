import { ICyberConfig } from '@cyber/cli';
import routes from './routes/index';
import proxy from './proxy';

export default {
  base: '/page/cr',
  title: '靶场',
  mode: 'history',
  locale: {
    default: 'zh-CN',
    cyberUI: true,
  },
  vuex: true,
  auth: true,
  routes,
  proxy,
  compositionApi: true,
  appName: 'cr-web',
} as ICyberConfig;
