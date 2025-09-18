export default [
  {
    name: 'new-network-basic-subject',
    path: '/new-network-basic-subject',
    title: 'routes.new-network-basic-subject',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'new-network-basic-subject-train',
    path: '/new-network-basic-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 综合演训训练模板详情页
  {
    name: 'new-network-basic-subject-template-detail',
    path: '/new-network-basic-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-basic-subject-create',
    path: '/new-network-basic-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-basic-subject-add',
    path: '/new-network-basic-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
