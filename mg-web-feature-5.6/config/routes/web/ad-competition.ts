export default [
  {
    path: '',
    title: 'route.athleticDrills',
    name: 'competition-folder',
    children: [
      {
        path: '/ad/competition',
        component: './frame',
        name: 'competition',
        title: 'route.exerciseHomepage',
        meta: {
          hideInMenu: true,
          breadcrumb: false,
        },
      },
      {
        path: '/ad/competition-details',
        component: './frame',
        name: 'competition-details',
        title: 'route.rehearseDetails',
        meta: {
          breadcrumb: {
            parentName: 'competition',
          },
        },
      },
    ],
  },
];
