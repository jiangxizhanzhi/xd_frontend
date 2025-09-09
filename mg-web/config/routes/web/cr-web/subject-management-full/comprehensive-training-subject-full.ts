export default [
  // 编辑训练
  {
    name: 'comprehensive-training-subject-home-edit',
    path: '/cr/comprehensive-training-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'comprehensive-training-subject-home',
    path: '/cr/comprehensive-training-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-subject-student-combat',
    path: '/cr/comprehensive-training-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
