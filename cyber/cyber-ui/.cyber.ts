import { IConfig } from '@cyber/cli';

export default {
  title: '@cyber/ui',
  description: 'CyberUI 组件库',
  routerMode: 'hash',
  library: 'cyber-ui',
  auth: false,
  base: '/cyber-ui',
  //老版
  locale: {
    default: 'zh-CN',
  },
  locales: {
    default: 'zh-CN',
  },
  minimize: true,
  copy: [
    {
      from: './src/theme/plugin',
      to: '../lib/style/plugin',
    },
  ],
  hasCyberUI: true,
  compositionApi: false,
  drop_console: true,
  drop_debugger: true,
} as IConfig;
