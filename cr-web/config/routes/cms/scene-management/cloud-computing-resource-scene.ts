export default [
  {
    name: 'cloud-computing-resource-scene',
    path: '/admin/cloud-computing-resource-scene',
    title: 'routes.cloud-computing-resource-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-computing-resource-scene-add',
    path: '/admin/cloud-computing-resource-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
  {
    name: 'cloud-computing-resource-scene-edit',
    path: '/admin/cloud-computing-resource-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
];
