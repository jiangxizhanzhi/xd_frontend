export default [
  {
    name: 'denial-service-attack-scene',
    path: '/admin/cr/admin/denial-service-attack-scene',
    title: 'routes.denial-service-attack-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-zonghexunlian',
    }
  },
  {
    name: 'denial-service-attack-scene-add',
    path: '/admin/cr/admin/denial-service-attack-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
  {
    name: 'denial-service-attack-scene-edit',
    path: '/admin/cr/admin/denial-service-attack-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
];
