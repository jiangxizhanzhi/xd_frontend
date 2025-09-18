export default [
  // 编辑训练
  {
    name: 'new-network-attack-defense-subject-home-edit',
    path: '/new-network-attack-defense-subject/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-attack-defense-subject-home',
    path: '/new-network-attack-defense-subject-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-attack-defense-subject-student-combat',
    path: '/new-network-attack-defense-subject/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
