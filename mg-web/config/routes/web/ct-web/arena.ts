export default [
  {
    path: '/ct/arena',
    name: 'ct-contest-arena-list',
    title: 'routes.ct-contest-arena-list',
    component: './frame',
    meta: {
      breadcrumb: false,
    },
  },
  {
    path: '/ct/arena/:arena_id',
    name: 'ct-arena-detail',
    title: 'ctRoutes.arenaDetail',
    meta: {
      breadcrumb: {
        parentName: 'ct-contest-arena-list',
      },
    },
    component: './frame',
  },
];
