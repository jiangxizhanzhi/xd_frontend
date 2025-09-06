// 红蓝对抗
export const redVsBlueRouter = [
  // path: '',
  // // title: '红蓝对抗',
  // title: 'routes.red-vs-blue-folder',
  // name: 'red-vs-blue-folder',
  // children: [
  {
    path: '/admin/event/list-red-blue',
    // title: '红蓝对抗',
    title: 'routes.red-vs-blue-folder',
    name: 'red-blue',
    component: './pages/cms/cr-event/event-list-red-blue',
    meta: {
      module: 'red-blue',
    },
  },
  {
    path: '/admin/event/red_vs_blue/create',
    component: './pages/cms/cr-event/red-vs-blue/edit',
    title: '新增',
    name: 'cr-event-red-vs-blue-create',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
      module: 'red-blue',
    },
  },
  {
    path: '/admin/event/red_vs_blue/:id',
    component: './pages/cms/cr-event/red-vs-blue/edit',
    title: '编辑',
    name: 'cr-event-red-vs-blue-edit',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
      module: 'red-blue',
    },
  },
  {
    name: 'event-auth-red-blue',
    path: '/admin/event/red-vs-blue/:eventId/auth/:resourceId',
    component: './pages/cms/cr-event/private-exercises.vue',
    title: '授权操作',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
      module: 'red-blue',
    },
  },
  {
    path: '/admin/scene/red-blue/config/:id/test',
    component: './pages/cms/scene/config/test',
    name: 'scene-config-test-red-blue',
    title: '场景测试',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
      module: 'red-blue',
    },
  },
  // ],
];
