export default [
  // 理论赛管理
  {
    name: 'ct-exams-list',
    path: '/admin/ct/admin/exams/list',
    title: 'routes.ct-exams-list',
    component: './frame',
  },

  {
    name: 'ct-exams-add',
    path: '/admin/ct/admin/exams/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-list',
      },
    },
  },
  {
    name: 'ct-exams-edit',
    path: '/admin/ct/admin/exams/edit/:examId',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-list',
      },
    },
  },
  // 比赛运维
  {
    name: 'ct-exams-operation',
    path: '/admin/ct/admin/exams/contest/:examId',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-list',
      },
    },
  },
  {
    name: 'ct-exams-marking',
    path: '/admin/ct/admin/exams/:userId/scores/:examId',
    title: 'ctRoutes.review',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-operation',
      },
    },
    component: './frame',
  },
  {
    name: 'ct-score-analysis',
    path: '/admin/ct/admin/exams/score/analysis/:examId',
    title: 'ctRoutes.scoreAnalysis',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-operation',
      },
    },
    component: './frame',
  },
  {
    name: 'ct-rapid-marking',
    path: '/admin/ct/admin/exams/rapid/marking/:examId',
    title: 'ctRoutes.quickReview',
    meta: {
      breadcrumb: {
        parentName: 'ct-exams-operation',
      },
    },
    component: './frame',
  },
];
