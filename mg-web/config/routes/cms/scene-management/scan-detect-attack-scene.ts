export default [
  {
    name: 'scan-detect-attack-scene',
    path: '/admin/cr/admin/scan-detect-attack-scene',
    title: 'routes.scan-detect-attack-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-xinxitongji',
    }
  },
  {
    name: 'scan-detect-attack-scene-add',
    path: '/admin/cr/admin/scan-detect-attack-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
  {
    name: 'scan-detect-attack-scene-edit',
    path: '/admin/cr/admin/scan-detect-attack-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
];
