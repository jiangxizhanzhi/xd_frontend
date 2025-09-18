export default [
  // 编辑训练
  {
    name: 'cloud-computing-resource-subject-home-edit',
    path: '/cloud-computing-resource-subject/edit/:id',
    title: '编辑训练',
    component: './pages/web/experimental-management/components/train-edit.vue',
    meta: {
      auth: false,
    },
  },
  // 教员详情页
  {
    name: 'cloud-computing-resource-subject-home',
    path: '/cloud-computing-resource-subject-home/:resource_id',
    title: 'm.details',
    component: './pages/web/experimental-management/teacher-detail/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-subject-student-combat',
    path: '/cloud-computing-resource-subject/student_combat/:resource_id', // 学生点击进入综合演训
    title: 'm.details',
    component: './pages/web/experimental-management/student/index.vue',
    meta: {
      auth: false,
    },
  },
];
