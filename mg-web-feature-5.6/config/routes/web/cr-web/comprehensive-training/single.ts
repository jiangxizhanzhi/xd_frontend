export default [
  {
    name: 'single-list',
    path: '/cr/single_list',
    // title: 'route.individualTraining',
    title: 'routes.single-list',
    meta: {
      breadcrumb: true,
    },
    component: './frame',
  },
  {
    name: 'single_train',
    title: 'route.details',
    path: '/cr/single_train/:resource_id',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'single-list',
      },
    },
  },
];
