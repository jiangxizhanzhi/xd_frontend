export default [
  {
    name: 'new-network-attack-defense-experimental',
    path: '/cr/new-network-attack-defense-experimental',
    title: 'routes.new-network-attack-defense-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
      iconfont: 'icon-bianpai',
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'new-network-attack-defense-experimental-train',
    path: '/cr/new-network-attack-defense-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'new-network-attack-defense-experimental-template-detail',
    path: '/cr/new-network-attack-defense-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-attack-defense-experimental-create',
    path: '/cr/new-network-attack-defense-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-attack-defense-experimental-add',
    path: '/cr/new-network-attack-defense-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component: './frame',
  },
];
