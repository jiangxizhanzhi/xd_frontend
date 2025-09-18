export default [
  // 编辑训练
  {
    name: 'new-network-basic-subject-home-edit',
    path: '/cr/new-network-basic-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-basic-subject-home',
    path: '/cr/new-network-basic-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-basic-subject-student-combat',
    path: '/cr/new-network-basic-subject/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
