import proxy from './config/proxy';
export default {
  base: '/page/scene',
  routes: [
    {
      path: '/',
      component: './pages/scene/index.vue',
    },
  ],
  iconfont: {
    scriptUrl: [
      // '//at.alicdn.com/t/c/font_3187907_5yf0zgir9fv.js', // 基础图标
      // '//at.alicdn.com/t/c/font_2776302_ch8hg2apwtl.js', // 业务图标
      '//at.alicdn.com/t/c/font_2647558_upnhwlj5na.js', // 拓扑编辑器
    ],
  },
  locale: {
    default: 'zh-CN',
    cyberUI: true,
  },
  proxy,
  static: {
    inline: true,
  },
  minimize: false,
  library: 'cyber-scene',
  compositionApi: true,
};
