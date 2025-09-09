export default [
  // 编辑训练
  {
    name: 'scan-detect-attack-experimental-home-edit',
    path: '/cr/scan-detect-attack-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'scan-detect-attack-experimental-home',
    path: '/cr/scan-detect-attack-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'scan-detect-attack-experimental-student-combat',
    path: '/cr/scan-detect-attack-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
