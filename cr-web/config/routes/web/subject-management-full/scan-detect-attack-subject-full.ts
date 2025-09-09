export default [
  // 编辑训练
  {
    name: 'scan-detect-attack-subject-home-edit',
    path: '/scan-detect-attack-subject/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'scan-detect-attack-subject-home',
    path: '/scan-detect-attack-subject-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'scan-detect-attack-subject-student-combat',
    path: '/scan-detect-attack-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
