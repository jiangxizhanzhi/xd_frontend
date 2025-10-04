export default [
  {
    name: 'new-network-attack-defense-scene',
    path: '/new-network-attack-defense-scene',
    title: 'routes.new-network-attack-defense-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-attack-defense-scene-add',
    path: '/new-network-attack-defense-scene/add',
    title: '新增',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
  {
    name: 'new-network-attack-defense-scene-edit',
    path: '/new-network-attack-defense-scene/edit/:id',
    title: '编辑',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
];
