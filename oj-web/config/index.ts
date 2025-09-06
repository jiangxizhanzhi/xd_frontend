import { ICyberConfig } from '@cyber/cli';
import routes from './routes';
import proxy from './proxy';

export default {
  title: '实训',
  base: '/page/oj',
  alias: {
    '@': './src',
  },
  mode: 'history',
  vuex: true,
  locale: {
    default: 'zh-CN',
    cyberUI: true,
  },
  compositionApi: true,
  auth: true,
  routes,
  proxy,
  appName: 'oj-web',
} as ICyberConfig;
