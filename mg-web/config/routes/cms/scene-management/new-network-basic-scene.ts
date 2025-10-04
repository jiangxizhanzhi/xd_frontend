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
    title: '新增新型网络基础场景',
    component: './frame',
    meta: {
      module: 'new-network-basic-scene',
      breadcrumb: {
        parentName: 'new-network-basic-scene',
      },
    },
  },
  {
    name: 'new-network-basic-scene-edit',
    path: '/admin/cr/admin/new-network-basic-scene/edit/:id',
    title: '编辑新型网络基础场景',
    component: './frame',
    meta: {
      module: 'new-network-basic-scene',
      breadcrumb: {
        parentName: 'new-network-basic-scene',
      },
    },
  },
];
