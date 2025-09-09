export default [
  {
    name: 'new-network-basic-subject',
    path: '/cr/new-network-basic-subject',
    title: 'routes.new-network-basic-subject',
    meta: {
      breadcrumb: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'new-network-basic-subject-train',
    path: '/cr/new-network-basic-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'new-network-basic-subject-template-detail',
    path: '/cr/new-network-basic-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-basic-subject-create',
    path: '/cr/new-network-basic-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-basic-subject-add',
    path: '/cr/new-network-basic-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-subject',
      },
    },
    component: './frame',
  },
];
