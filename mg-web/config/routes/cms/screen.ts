export default [
  {
    name: 'screen1',
    path: '/admin/screen-1/visual-screen',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-1',
  },
  {
    name: 'screen2',
    path: '/admin/screen-1/visual-screen2',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-1/index2.vue',
  },
  // jyj
  {
    name: 'screen3',
    path: '/admin/screen-2/visual-screen1',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-2/main',
  },
  // jyj
  {
    name: 'screen4',
    path: '/admin/screen-2/visual-screen2',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-2/team',
  },
  // 葫芦岛
  {
    name: 'screen5',
    path: '/admin/screen-3/visual-screen',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-3',
  },
  //团队红蓝跳转演示动效控制台添加
  {
    name: 'screen5',
    path: '/admin/screen-3/visual-screen-control',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-3-backend/index',
  },
];
