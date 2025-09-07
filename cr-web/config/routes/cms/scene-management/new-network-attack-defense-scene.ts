export default [
  {
    name: 'new-network-attack-defense-scene',
    path: '/admin/new-network-attack-defense-scene',
    title: 'routes.new-network-attack-defense-scene',
    component: './pages/cms/scene-management/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'new-network-attack-defense-scene-add',
    path: '/admin/new-network-attack-defense-scene/add',
    title: 'mgRoutes.add',
    component: './pages/cms/scene-management/add.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'topology-management',
      },
    },
  },
  {
    name: 'new-network-attack-defense-scene-edit',
    path: '/admin/new-network-attack-defense-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/scene-management/edit.vue',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-scene',
      },
    },
  },
];
