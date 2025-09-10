export default [
  {
    path: '/cr/group-training-student-combat/student_combat/:resource_id', // 学生点击进入团队训练
    name: 'group-training-student-combat',
    title: 'mroute.details',
    meta: {
      auth: false,
    },
    component: './frame',
  },
];
