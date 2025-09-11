export default [
  {
    name: 'cloud-network-resource-subject',
    path: '/cloud-network-resource-subject',
    title: 'routes.cloud-network-resource-subject',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'cloud-network-resource-subject-train',
    path: '/cloud-network-resource-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 团队训练训练模板详情页
  {
    name: 'cloud-network-resource-subject-template-detail',
    path: '/cloud-network-resource-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-network-resource-subject-create',
    path: '/cloud-network-resource-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-network-resource-subject-add',
    path: '/cloud-network-resource-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
