import { ICyberConfig } from '@cyber/cli';
import path from 'path';
import routes from './routes/index';
import proxy from './proxy';

export default {
  base: '/page/cr',
  title: '靶场',
  alias: {
    '@': './src',
    '@cyber/ui': '../packages/cyber-ui',
    '@cyber/scene': '../packages/cyber-scene',
    'vue$': path.resolve(__dirname, '../node_modules/vue'),
    '@vue/composition-api$': path.resolve(__dirname, '../node_modules/@vue/composition-api'),
    '@cyber/helper$': path.resolve(__dirname, '../node_modules/@cyber/helper'),
  },
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
