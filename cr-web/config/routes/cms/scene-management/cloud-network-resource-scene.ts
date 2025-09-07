export default [
  {
    name: 'cloud-network-resource-scene',
    path: '/admin/cloud-network-resource-scene',
    title: 'routes.cloud-network-resource-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'cloud-network-resource-scene-add',
    path: '/admin/cloud-network-resource-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
  {
    name: 'cloud-network-resource-scene-edit',
    path: '/admin/cloud-network-resource-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
];
