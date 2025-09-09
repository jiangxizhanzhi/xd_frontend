export default [
  // 编辑训练
  {
    name: 'cloud-computing-resource-experimental-home-edit',
    path: '/cloud-computing-resource-experimental/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-computing-resource-experimental-home',
    path: '/cloud-computing-resource-experimental-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-experimental-student-combat',
    path: '/cloud-computing-resource-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
