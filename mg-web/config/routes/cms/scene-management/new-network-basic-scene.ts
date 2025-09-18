export default [
  {
    name: 'new-network-basic-scene',
    path: '/admin/cr/admin/new-network-basic-scene',
    title: 'routes.new-network-basic-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-xitongyunwei1',
    }
  },
  {
    name: 'new-network-basic-scene-add',
    path: '/admin/cr/admin/new-network-basic-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-scene',
      },
    },
  },
  {
    name: 'new-network-basic-scene-edit',
    path: '/admin/cr/admin/new-network-basic-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-scene',
      },
    },
  },
];
