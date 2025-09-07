export default [
  {
    name: 'cloud-computing-resource-scene',
    path: '/admin/cloud-computing-resource-scene',
    title: 'routes.cloud-computing-resource-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      iconfont: 'icon-tuopu',
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-scene-add',
    path: '/admin/cloud-computing-resource-scene/add',
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
    name: 'cloud-computing-resource-scene-edit',
    path: '/admin/cloud-computing-resource-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
];
