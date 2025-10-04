export default [
  {
    name: 'cloud-computing-resource-scene',
    path: '/cr/cloud-computing-resource-scene',
    title: 'routes.cloud-computing-resource-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-daohanglan-yun',
    }
  },
  {
    name: 'cloud-computing-resource-scene-add',
    path: '/cr/cloud-computing-resource-scene/add',
    title: '新增云计算资源场景',
    component: './frame',
    meta: {
      module: 'cloud-computing-resource-scene',
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
  {
    name: 'cloud-computing-resource-scene-edit',
    path: '/cr/cloud-computing-resource-scene/edit/:id',
    title: '编辑云计算资源场景',
    component: './frame',
    meta: {
      module: 'cloud-computing-resource-scene',
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
];
