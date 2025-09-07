export default [
  {
    name: 'new-network-basic-scene',
    path: '/admin/new-network-basic-scene',
    title: 'routes.new-network-basic-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      iconfont: 'icon-tuopu',
      auth: false,
    },
  },
  {
    name: 'new-network-basic-scene-add',
    path: '/admin/new-network-basic-scene/add',
    title: 'mgRoutes.add',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'topology-management',
      },
    },
  },
  {
    name: 'new-network-basic-scene-edit',
    path: '/admin/new-network-basic-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-basic-scene',
      },
    },
  },
];
