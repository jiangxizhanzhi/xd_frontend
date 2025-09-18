export default [
  // 编辑训练
  {
    name: 'new-network-basic-experimental-home-edit',
    path: '/cr/new-network-basic-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-basic-experimental-home',
    path: '/cr/new-network-basic-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-basic-experimental-student-combat',
    path: '/cr/new-network-basic-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
