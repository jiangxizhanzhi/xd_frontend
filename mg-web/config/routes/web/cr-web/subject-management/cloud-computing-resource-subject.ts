export default [
  {
    name: 'cloud-computing-resource-subject',
    path: '/cr/cloud-computing-resource-subject',
    title: 'routes.cloud-computing-resource-subject',
    meta: {
      breadcrumb: true,
      isThird: true,
      // iconfont: 'icon-xuexikecheng',
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'cloud-computing-resource-subject-train',
    path: '/cr/cloud-computing-resource-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'cloud-computing-resource-subject-template-detail',
    path: '/cr/cloud-computing-resource-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-computing-resource-subject-create',
    path: '/cr/cloud-computing-resource-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-computing-resource-subject-add',
    path: '/cr/cloud-computing-resource-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component: './frame',
  },
];
