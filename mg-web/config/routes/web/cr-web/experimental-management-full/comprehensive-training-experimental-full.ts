export default [
  // 编辑训练
  {
    name: 'comprehensive-training-experimental-home-edit',
    path: '/cr/comprehensive-training-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'comprehensive-training-experimental-home',
    path: '/cr/comprehensive-training-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-experimental-student-combat',
    path: '/cr/comprehensive-training-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
