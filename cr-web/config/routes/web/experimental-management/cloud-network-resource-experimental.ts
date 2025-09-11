export default [
  {
    name: 'cloud-network-resource-experimental',
    path: '/cloud-network-resource-experimental',
    title: 'routes.cloud-network-resource-experimental',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'cloud-network-resource-experimental-train',
    path: '/cloud-network-resource-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 团队训练训练模板详情页
  {
    name: 'cloud-network-resource-experimental-template-detail',
    path: '/cloud-network-resource-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-network-resource-experimental-create',
    path: '/cloud-network-resource-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-network-resource-experimental-add',
    path: '/cloud-network-resource-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
