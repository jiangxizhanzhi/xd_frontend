export default [
  // 编辑训练
  {
    name: 'red-blue-edit',
    path: '/red-blue/edit/:id',
    title: '编辑训练',
    component: './pages/web/red-blue/common/edit.vue',
    meta: {
      auth: false,
      module: 'red-vs-blue',
    },
  },
  // 管理员详情页
  {
    name: 'manage-home',
    path: '/manage-home/:resource_id',
    title: 'm.details',
    component: './pages/web/red-blue/admin/index.vue',
    meta: {
      auth: false,
      module: 'red-vs-blue',
    },
  },
  // 导演详情页
  {
    name: 'director-home',
    path: '/director-home/:resource_id',
    title: 'm.details',
    component: './pages/web/red-blue/director/index.vue',
    meta: {
      auth: false,
      module: 'red-vs-blue',
    },
  },
  // 裁判详情页
  {
    name: 'referee-home',
    path: '/referee-home/:resource_id',
    title: 'm.details',
    component: './pages/web/red-blue/referee/index.vue',
    meta: {
      auth: false,
      module: 'red-vs-blue',
    },
  },
  // 学员详情页
  {
    name: 'access-center-member',
    path: '/access-center-member/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      module: 'red-vs-blue',
    },
    component: './pages/web/red-blue/student/index.vue',
  },
];
