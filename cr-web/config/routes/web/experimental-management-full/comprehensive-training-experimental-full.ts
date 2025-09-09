export default [
  // 编辑训练
  {
    name: 'comprehensive-training-experimental-home-edit',
    path: '/comprehensive-training-experimental/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'comprehensive-training-experimental-home',
    path: '/comprehensive-training-experimental-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-experimental-student-combat',
    path: '/comprehensive-training-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
