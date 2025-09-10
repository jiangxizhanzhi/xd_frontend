export default [
  {
    name: 'group-training-student-combat',
    path: '/group-training/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/team-train/student/index.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
];
