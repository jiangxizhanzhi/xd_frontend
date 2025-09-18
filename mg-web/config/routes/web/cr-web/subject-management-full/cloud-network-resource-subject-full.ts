export default [
  // 编辑训练
  {
    name: 'cloud-network-resource-subject-home-edit',
    path: '/cr/cloud-network-resource-subject/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-network-resource-subject-home',
    path: '/cr/cloud-network-resource-subject-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-network-resource-subject-student-combat',
    path: '/cr/cloud-network-resource-subject/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
