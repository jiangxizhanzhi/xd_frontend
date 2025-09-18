export default [
  // 编辑训练
  {
    name: 'scan-detect-attack-experimental-home-edit',
    path: '/scan-detect-attack-experimental/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'scan-detect-attack-experimental-home',
    path: '/scan-detect-attack-experimental-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'scan-detect-attack-experimental-student-combat',
    path: '/scan-detect-attack-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
