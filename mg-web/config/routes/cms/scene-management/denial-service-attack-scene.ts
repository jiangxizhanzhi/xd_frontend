export default [
  {
    name: 'denial-service-attack-scene',
    path: '/cr/denial-service-attack-scene',
    title: 'routes.denial-service-attack-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-zonghexunlian',
    }
  },
  {
    name: 'denial-service-attack-scene-add',
    path: '/cr/denial-service-attack-scene/add',
    title: '新增云网络拒绝服务攻击场景',
    component: './frame',
    meta: {
      module: 'denial-service-attack-scene',
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
  {
    name: 'denial-service-attack-scene-edit',
    path: '/cr/denial-service-attack-scene/edit/:id',
    title: '编辑云网络拒绝服务攻击场景',
    component: './frame',
    meta: {
      module: 'denial-service-attack-scene',
      breadcrumb: {
        parentName: 'denial-service-attack-scene',
      },
    },
  },
];
