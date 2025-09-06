export default [
  {
    name: 'software-folder',
    path: '',
    title: 'route.shootingRangetest',
    children: [
      {
        path: '/cr/software-test',
        name: 'software-test',
        title: 'route.shootingRangetest',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: true,
        },
      },
      {
        path: '/cr/software-add',
        name: 'software-add',
        title: 'route.add',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-test',
          },
        },
      },
      {
        path: '/cr/software-edit/:id',
        name: 'software-edit',
        title: 'route.edit',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-test',
          },
        },
      },
      {
        path: '/cr/software-test/detail/:id',
        name: 'software-detail',
        title: 'route.details',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-test',
          },
        },
      },
      {
        path: '/cr/test-record/:id',
        name: 'test-record',
        title: 'route.testRecords',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-detail',
          },
        },
      },
      {
        path: '/cr/software-test/detail/edittest-scene/:id/:taskId',
        name: 'software-detail-edit',
        component: './frame',
        title: 'route.EditTestEnvironment',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-detail',
          },
        },
      },
      {
        path: '/cr/software-test/detail/addtest-scene/:id',
        name: 'software-detail-add',
        component: './frame',
        title: 'route.addingTestEnvironment',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-detail',
          },
        },
      },
      {
        path: '/cr/test-environment/:id/:taskId',
        name: 'test-environment',
        title: 'route.testEnvironment',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'software-detail',
          },
        },
      },
      {
        path: '/cr/test-environment/:id/:taskId/:sceneId',
        name: 'scene-monitor',
        title: 'route.sceneMonitor',
        component: './frame',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'test-environment',
          },
        },
      },
    ],
  },
];
