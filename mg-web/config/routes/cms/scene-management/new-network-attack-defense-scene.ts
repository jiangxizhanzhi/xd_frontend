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
    title: '新增新型网络攻防场景',
    component: './frame',
    meta: {
      module: 'new-network-attack-defense-scene',
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
  {
    name: 'new-network-attack-defense-scene-edit',
    path: '/admin/cr/admin/new-network-attack-defense-scene/edit/:id',
    title: '编辑新型网络攻防场景',
    component: './frame',
    meta: {
      module: 'new-network-attack-defense-scene',
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
];
