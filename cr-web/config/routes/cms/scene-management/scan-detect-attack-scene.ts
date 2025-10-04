export default [
  {
    name: 'scan-detect-attack-scene',
    path: '/scan-detect-attack-scene',
    title: 'routes.scan-detect-attack-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'scan-detect-attack-scene-add',
    path: '/scan-detect-attack-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
  {
    name: 'scan-detect-attack-scene-edit',
    path: '/scan-detect-attack-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
];
