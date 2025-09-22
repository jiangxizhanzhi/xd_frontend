export default [
  // 编辑训练
  {
    name: 'group-training-home-edit',
    path: '/group-training-home-edit/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
  // 教员详情页
  {
    name: 'group-training-home',
    path: '/group-training-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
];
