export default [
  // 编辑训练
  {
    name: 'denial-service-attack-subject-home-edit',
    path: '/cr/denial-service-attack-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'denial-service-attack-subject-home',
    path: '/cr/denial-service-attack-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'denial-service-attack-subject-student-combat',
    path: '/cr/denial-service-attack-subject/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
