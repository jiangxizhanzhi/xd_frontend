export const trainingRouter = [
  {
    name: 'cr-individual-training',
    path: '/admin/event/list-train-single',
    // title: '单兵训练',
    title: 'routes.cr-individual-training',
    component: './pages/cms/cr-event/event-list-train-single',
    meta: {
      module: 'cr-individual-training',
    },
  },
  {
    path: '/admin/event/single/create',
    title: '新增',
    component: './pages/cms/cr-event/train-single/create',
    name: 'cr-event-train-single-create',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
      module: 'cr-individual-training',
    },
  },
  {
    path: '/admin/event/single/:id',
    component: './pages/cms/cr-event/train-single/edit',
    name: 'cr-event-train-single-edit',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
      module: 'cr-individual-training',
    },
  },
  {
    name: 'event-auth-single',
    path: '/admin/event/single/:eventId/auth/:resourceId',
    component: './pages/cms/cr-event/private-exercises.vue',
    title: '授权操作',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
      module: 'cr-individual-training',
    },
  },
  {
    path: '/admin/scene/single/config/:id/test',
    component: './pages/cms/scene/config/test',
    name: 'scene-config-test-single',
    title: '场景测试',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
      module: 'cr-individual-training',
    },
  },
]
