export default [
  {
    name: 'scan-detect-attack-scene',
    path: '/cr/scan-detect-attack-scene',
    title: 'routes.scan-detect-attack-scene',
    component: './frame',
    meta: {
      iconfont: 'icon-xinxitongji',
    }
  },
  {
    name: 'scan-detect-attack-scene-add',
    path: '/cr/scan-detect-attack-scene/add',
    title: '新增云环境扫描探测攻击场景',
    component: './frame',
    meta: {
      module: 'scan-detect-attack-scene',
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
  {
    name: 'scan-detect-attack-scene-edit',
    path: '/cr/scan-detect-attack-scene/edit/:id',
    title: '编辑云环境扫描探测攻击场景',
    component: './frame',
    meta: {
      module: 'scan-detect-attack-scene',
      breadcrumb: {
        parentName: 'scan-detect-attack-scene',
      },
    },
  },
];
