import { ICyberConfig } from '@cyber/cli';
import path from 'path';
import routes from './routes';
import proxy from './proxy';

export default {
  title: '下一代网络靶场',
  mode: 'history',
  base: '/page/mg',
  alias: {
    '@': './src',
    '@cyber/ui': '../packages/cyber-ui',
    '@cyber/scene': '../packages/cyber-scene',
    'vue$': path.resolve(__dirname, '../node_modules/vue'),
    '@vue/composition-api$': path.resolve(__dirname, '../node_modules/@vue/composition-api'),
    '@cyber/helper$': path.resolve(__dirname, '../node_modules/@cyber/helper'),
  },
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
