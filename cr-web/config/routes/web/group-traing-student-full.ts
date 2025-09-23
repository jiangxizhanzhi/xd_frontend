export default [
  {
    name: 'group-training-student-combat',
    path: '/group-training/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
      module: 'group-training',
    },
  },
];
