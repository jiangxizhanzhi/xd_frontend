export default [
  // 编辑训练
  {
    name: 'comprehensive-training-subject-home-edit',
    path: '/comprehensive-training-subject/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'comprehensive-training-subject-home',
    path: '/comprehensive-training-subject-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-subject-student-combat',
    path: '/comprehensive-training-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
