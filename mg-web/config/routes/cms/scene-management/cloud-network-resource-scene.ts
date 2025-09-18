export default [
  {
    name: 'cloud-network-resource-scene',
    path: '/admin/cr/admin/cloud-network-resource-scene',
    title: 'routes.cloud-network-resource-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-tikuguanli',
    }
  },
  {
    name: 'cloud-network-resource-scene-add',
    path: '/admin/cr/admin/cloud-network-resource-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
  {
    name: 'cloud-network-resource-scene-edit',
    path: '/admin/cr/admin/cloud-network-resource-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
];
