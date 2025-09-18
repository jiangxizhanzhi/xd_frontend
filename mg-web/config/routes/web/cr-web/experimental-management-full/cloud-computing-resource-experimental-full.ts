export default [
  // 编辑训练
  {
    name: 'cloud-computing-resource-experimental-home-edit',
    path: '/cr/cloud-computing-resource-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-computing-resource-experimental-home',
    path: '/cr/cloud-computing-resource-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-experimental-student-combat',
    path: '/cr/cloud-computing-resource-experimental/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
