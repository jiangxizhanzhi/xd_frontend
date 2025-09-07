export default [
  {
    name: 'comprehensive-training-scene',
    path: '/admin/comprehensive-training-scene',
    title: 'routes.comprehensive-training-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-scene-add',
    path: '/admin/comprehensive-training-scene/add',
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
    name: 'comprehensive-training-scene-edit',
    path: '/admin/comprehensive-training-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
];
