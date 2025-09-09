export default [
  // 编辑训练
  {
    name: 'new-network-attack-defense-subject-home-edit',
    path: '/cr/new-network-attack-defense-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-attack-defense-subject-home',
    path: '/cr/new-network-attack-defense-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-attack-defense-subject-student-combat',
    path: '/cr/new-network-attack-defense-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
