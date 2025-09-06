export default [
  {
    path: '',
    name: 'exam-folder',
    title: 'route.test',
    children: [
      {
        path: '/oj/exam',
        name: 'oj-exam',
        title: 'route.test',
        meta: {
          hideInMenu: true,
          breadcrumb: false,
        },
        component: './frame',
      },
      {
        path: '/oj/exam/detail/:resource_id',
        name: 'oj-exam-detail',
        title: 'route.details',
        meta: {
          breadcrumb: {
            parentName: 'oj-exam',
          },
        },
        component: './frame',
      },
    ],
  },
];
