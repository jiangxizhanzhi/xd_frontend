export default [
  {
    name: 'scan-detect-attack-scene',
    path: '/admin/scan-detect-attack-scene',
    title: 'routes.scan-detect-attack-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'scan-detect-attack-scene-add',
    path: '/admin/scan-detect-attack-scene/add',
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
    name: 'scan-detect-attack-scene-edit',
    path: '/admin/scan-detect-attack-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
];
