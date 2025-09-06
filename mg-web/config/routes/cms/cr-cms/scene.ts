export default [
  {
    path: '/admin/cr/admin/event/template',
    name: 'template',
    title: '对抗拓扑模板99',
    component: './frame',
  },
  {
    path: '/admin/cr/admin/event/template/create',
    component: './frame',
    name: 'topology-template-create',
    title: '新增',
    meta: {
      breadcrumb: {
        parentName: 'template',
      },
    },
  },
  {
    path: '/admin/cr/admin/event/template/:id',
    component: './frame',
    name: 'topology-template-edit',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'template',
      },
    },
  },
  {
    // cr
    name: 'cr-event-list',
    path: '/admin/cr/admin/event/list',
    title: '对抗场景编排99',
    component: './frame',
  },
  {
    name: 'event-auth',
    path: '/admin/cr/admin/event/:eventId/auth/:resourceId',
    component: './frame',
    title: '授权操作99',
    meta: {
      breadcrumb: {
        parentName: 'cr-event-list',
      },
    },
  },
  {
    path: '/admin/cr/admin/scene/config/:id/test',
    component: './frame',
    name: 'scene-config-test',
    title: '场景测试99',
    meta: {
      breadcrumb: {
        parentName: 'cr-event-list',
      },
    },
  },
  {
    // 红蓝对抗创建
    path: '/admin/cr/admin/event/red_vs_blue/create',
    component: './frame',
    name: 'cr-event-red-vs-blue-create',
    title: '新增红蓝对抗',
    meta: {
      breadcrumb: {
        parentName: 'cr-event-list',
      },
    },
  },
  {
    // 红蓝对抗编辑
    path: '/admin/cr/admin/event/red_vs_blue/:id',
    component: './frame',
    name: 'cr-event-red-vs-blue-edit',
    title: '编辑红蓝对抗',
    meta: {
      breadcrumb: {
        parentName: 'cr-event-list',
      },
    },
  },
];
