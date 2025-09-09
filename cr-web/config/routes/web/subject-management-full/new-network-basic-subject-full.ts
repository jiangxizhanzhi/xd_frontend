export default [
  // 编辑训练
  {
    name: 'new-network-basic-subject-home-edit',
    path: '/new-network-basic-subject/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'new-network-basic-subject-home',
    path: '/new-network-basic-subject-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-basic-subject-student-combat',
    path: '/new-network-basic-subject/student_combat/:resource_id', // 学生点击进入团队训练
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
