export default [
  {
    name: 'comprehensive-training-scene',
    path: '/admin/cr/admin/comprehensive-training-scene',
    title: 'routes.comprehensive-training-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-liuliangguanli',
    }
  },
  {
    name: 'comprehensive-training-scene-add',
    path: '/admin/cr/admin/comprehensive-training-scene/add',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
  {
    name: 'comprehensive-training-scene-edit',
    path: '/admin/cr/admin/comprehensive-training-scene/edit/:id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
];
