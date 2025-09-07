export default [
  {
    name: 'denial-service-attack-scene',
    path: '/admin/denial-service-attack-scene',
    title: 'routes.denial-service-attack-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'denial-service-attack-scene-add',
    path: '/admin/denial-service-attack-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
  {
    name: 'denial-service-attack-scene-edit',
    path: '/admin/denial-service-attack-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
];
