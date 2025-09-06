export default [
  {
    path: '/cr/student_combat/:resource_id', // 学生点击进入团队训练
    name: 'student_combat',
    title: 'mroute.details',
    meta: {
      auth: false,
    },
    component: './frame',
  },
];
