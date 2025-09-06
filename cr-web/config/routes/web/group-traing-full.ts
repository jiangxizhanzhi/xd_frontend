export default [
  // 编辑训练
  {
    name: 'team-train-edit',
    path: '/team-train/edit/:id',
    title: '编辑训练',
    component: './pages/web/team-train/components/train-edit.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
  // 教员详情页
  {
    name: 'train-detail-home',
    path: '/train-detail-home/:resource_id',
    title: 'm.details',
    component: './pages/web/team-train/teacher-detail/index.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
];
