export default [
  {
    path: '/ct/contest/exam',
    name: 'ct-contest-exam-list',
    title: 'routes.ct-contest-exam-list',
    meta: {
      breadcrumb: false,
    },
    component: './frame',
  },
  {
    path: '/ct/contest/exam/:exam_id',
    name: 'ct-contest-exam',
    title: 'routes.ct-contest-exam-list',
    meta: {
      breadcrumb: {
        parentName: 'ct-contest-exam-list',
      },
    },
    component: './frame',
  },
  {
    path: '/ct/contest/exam-review/:exam_id',
    name: 'ct-contest-exam-review',
    title: 'ctRoutes.examReview',
    meta: {
      breadcrumb: {
        parentName: 'ct-contest-exam-list',
      },
    },
    component: './frame',
  },
  {
    path: '/ct/contest/exam-guid/:exam_id',
    name: 'ct-contest-exam-guid',
    title: 'ctRoutes.examGuide',
    meta: {
      breadcrumb: {
        parentName: 'ct-contest-exam-list',
      },
    },
    component: './frame',
  },
];
