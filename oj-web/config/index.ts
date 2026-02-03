import { ICyberConfig } from '@cyber/cli';
import path from 'path';
import routes from './routes';
import proxy from './proxy';

export default {
  title: '实训',
  base: '/page/oj',
  alias: {
    '@': './src',
    '@cyber/ui': '../packages/cyber-ui',
    '@cyber/scene': '../packages/cyber-scene',
    'vue$': path.resolve(__dirname, '../node_modules/vue'),
    '@vue/composition-api$': path.resolve(__dirname, '../node_modules/@vue/composition-api'),
    '@cyber/helper$': path.resolve(__dirname, '../node_modules/@cyber/helper'),
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
