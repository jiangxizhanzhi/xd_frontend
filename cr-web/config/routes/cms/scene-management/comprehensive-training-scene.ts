export default [
  {
    name: 'comprehensive-training-scene',
    path: '/comprehensive-training-scene',
    title: 'routes.comprehensive-training-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'comprehensive-training-scene-add',
    path: '/comprehensive-training-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
  {
    name: 'comprehensive-training-scene-edit',
    path: '/comprehensive-training-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
];
