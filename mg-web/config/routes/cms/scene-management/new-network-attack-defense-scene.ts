export default [
  {
    name: 'new-network-attack-defense-scene',
    path: '/admin/cr/admin/new-network-attack-defense-scene',
    title: 'routes.new-network-attack-defense-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-wangluoyushezhi',
    }
  },
  {
    name: 'new-network-attack-defense-scene-add',
    path: '/admin/cr/admin/new-network-attack-defense-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
  {
    name: 'new-network-attack-defense-scene-edit',
    path: '/admin/cr/admin/new-network-attack-defense-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
];
