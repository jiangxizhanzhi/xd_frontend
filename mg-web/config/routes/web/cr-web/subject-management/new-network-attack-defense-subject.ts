export default [
  {
    name: 'new-network-attack-defense-subject',
    path: '/cr/new-network-attack-defense-subject',
    title: 'routes.new-network-attack-defense-subject',
    meta: {
      breadcrumb: true,
      isThird: true,
      iconfont: 'icon-kechengkeshi',
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'new-network-attack-defense-subject-train',
    path: '/cr/new-network-attack-defense-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-subject',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'new-network-attack-defense-subject-template-detail',
    path: '/cr/new-network-attack-defense-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-attack-defense-subject-create',
    path: '/cr/new-network-attack-defense-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-attack-defense-subject-add',
    path: '/cr/new-network-attack-defense-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-attack-defense-subject',
      },
    },
    component: './frame',
  },
];
