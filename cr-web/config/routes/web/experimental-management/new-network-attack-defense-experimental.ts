export default [
  {
    name: 'new-network-attack-defense-experimental',
    path: '/new-network-attack-defense-experimental',
    title: 'routes.new-network-attack-defense-experimental',
    meta: {
      auth: false,
      breadcrumb: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'new-network-attack-defense-experimental-train',
    path: '/new-network-attack-defense-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 团队训练训练模板详情页
  {
    name: 'new-network-attack-defense-experimental-template-detail',
    path: '/new-network-attack-defense-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-attack-defense-experimental-create',
    path: '/new-network-attack-defense-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-attack-defense-experimental-add',
    path: '/new-network-attack-defense-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-attack-defense-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
