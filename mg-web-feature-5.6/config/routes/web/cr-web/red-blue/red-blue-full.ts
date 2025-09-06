export default [
  // 编辑训练
  {
    name: 'red-blue-edit',
    path: '/cr/red-blue/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 管理员详情页
  {
    name: 'manage-home',
    path: '/cr/manage-home/:resource_id',
    title: 'route.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 导演详情页
  {
    name: 'director-home',
    path: '/cr/director-home/:resource_id',
    title: 'route.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 裁判详情页
  {
    name: 'referee-home',
    path: '/cr/referee-home/:resource_id',
    title: 'route.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 学员详情页
  {
    name: 'access-center-member',
    path: '/cr/access-center-member/:resource_id',
    title: 'route.details',
    meta: {
      auth: false,
    },
    component: './frame',
  },
];
