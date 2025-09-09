export default [
  // 编辑训练
  {
    name: 'new-network-attack-defense-experimental-home-edit',
    path: '/cr/new-network-attack-defense-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-attack-defense-experimental-home',
    path: '/cr/new-network-attack-defense-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-attack-defense-experimental-student-combat',
    path: '/cr/new-network-attack-defense-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
