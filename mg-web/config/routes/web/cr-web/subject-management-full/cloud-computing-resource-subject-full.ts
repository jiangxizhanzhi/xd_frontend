export default [
  // 编辑训练
  {
    name: 'cloud-computing-resource-subject-home-edit',
    path: '/cr/cloud-computing-resource-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-computing-resource-subject-home',
    path: '/cr/cloud-computing-resource-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-subject-student-combat',
    path: '/cr/cloud-computing-resource-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
