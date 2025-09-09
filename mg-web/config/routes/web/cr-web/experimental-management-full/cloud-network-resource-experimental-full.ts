export default [
  // 编辑训练
  {
    name: 'cloud-network-resource-experimental-home-edit',
    path: '/cr/cloud-network-resource-experimental/edit/:id',
    title: '编辑训练',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-network-resource-experimental-home',
    path: '/cr/cloud-network-resource-experimental-home/:resource_id',
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-network-resource-experimental-student-combat',
    path: '/cr/cloud-network-resource-experimental/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './frame',
    meta: {
      auth: false,
    },
  },
];
