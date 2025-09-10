export default [
  // 编辑训练
  {
    name: 'group-training-home-edit',
    path: '/cr/group-training-home-edit/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
  // 团队训练教员训练详情页
  {
    name: 'group-training-home',
    path: '/cr/group-training-home/:resource_id',
    title: 'route.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
