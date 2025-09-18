export default [
  // 编辑训练
  {
    name: 'cloud-network-resource-experimental-home-edit',
    path: '/cloud-network-resource-experimental/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-network-resource-experimental-home',
    path: '/cloud-network-resource-experimental-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-network-resource-experimental-student-combat',
    path: '/cloud-network-resource-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
