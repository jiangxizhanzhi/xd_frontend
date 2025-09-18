export default [
  {
    name: 'cloud-computing-resource-scene',
    path: '/admin/cr/admin/cloud-computing-resource-scene',
    title: 'routes.cloud-computing-resource-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-daohanglan-yun',
    }
  },
  {
    name: 'cloud-computing-resource-scene-add',
    path: '/admin/cr/admin/cloud-computing-resource-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
  {
    name: 'cloud-computing-resource-scene-edit',
    path: '/admin/cr/admin/cloud-computing-resource-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-scene',
      },
    },
  },
];
