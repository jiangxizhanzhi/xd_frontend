export default [
  // 编辑训练
  {
    name: 'denial-service-attack-experimental-home-edit',
    path: '/cr/denial-service-attack-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'denial-service-attack-experimental-home',
    path: '/cr/denial-service-attack-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'denial-service-attack-experimental-student-combat',
    path: '/cr/denial-service-attack-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
