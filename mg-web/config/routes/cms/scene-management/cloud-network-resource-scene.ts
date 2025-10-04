export default [
  {
    name: 'cloud-network-resource-scene',
    path: '/cr/cloud-network-resource-scene',
    title: 'routes.cloud-network-resource-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-tikuguanli',
    }
  },
  {
    name: 'cloud-network-resource-scene-add',
    path: '/cr/cloud-network-resource-scene/add',
    title: '新增云网络资源场景',
    component: './frame',
    meta: {
      module: 'cloud-network-resource-scene',
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
  {
    name: 'cloud-network-resource-scene-edit',
    path: '/cr/cloud-network-resource-scene/edit/:id',
    title: '编辑云网络资源场景',
    component: './frame',
    meta: {
      module: 'cloud-network-resource-scene',
      breadcrumb: {
        parentName: 'cloud-network-resource-scene',
      },
    },
  },
];
