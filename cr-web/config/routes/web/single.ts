export default [
  {
    path: '',
    name: 'comprehensive-training-folder',
    children: [
      {
        name: 'single-list',
        path: '/single_list',
        title: 'routes.single-list',
        meta: {
          hideInMenu: true,
          breadcrumb: true,
          module: 'single-list',
        },
        component: './pages/web/single-train/index.vue',
      },
    ],
  },
];
