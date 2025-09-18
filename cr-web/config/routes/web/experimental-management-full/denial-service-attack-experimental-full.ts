export default [
  // 编辑训练
  {
    name: 'denial-service-attack-experimental-home-edit',
    path: '/denial-service-attack-experimental/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'denial-service-attack-experimental-home',
    path: '/denial-service-attack-experimental-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'denial-service-attack-experimental-student-combat',
    path: '/denial-service-attack-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
