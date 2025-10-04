export default [
  {
    name: 'comprehensive-training-scene',
    path: '/cr/comprehensive-training-scene',
    title: 'routes.comprehensive-training-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-liuliangguanli',
    }
  },
  {
    name: 'comprehensive-training-scene-add',
    path: '/cr/comprehensive-training-scene/add',
    title: '新增综合演训场景',
    component: './frame',
    meta: {
      module: 'comprehensive-training-scene',
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
  {
    name: 'comprehensive-training-scene-edit',
    path: '/cr/comprehensive-training-scene/edit/:id',
    title: '编辑综合演训场景',
    component: './frame',
    meta: {
      module: 'comprehensive-training-scene',
      breadcrumb: {
        parentName: 'comprehensive-training-scene',
      },
    },
  },
];
