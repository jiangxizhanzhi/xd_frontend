import { ICyberConfig } from '@cyber/cli';
import routes from './routes';
import proxy from './proxy';

export default {
  title: '下一代网络靶场',
  mode: 'history',
  base: '/page/mg',
  vuex: true,
  auth: true,
  locale: {
    default: 'zh-CN',
    cyberUI: true,
  },
  routes,
  proxy,
  compositionApi: true,
  baseApp: true,
} as ICyberConfig;
