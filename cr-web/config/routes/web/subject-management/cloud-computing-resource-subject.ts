export default [
  {
    name: 'cloud-computing-resource-subject',
    path: '/cloud-computing-resource-subject',
    title: 'routes.cloud-computing-resource-subject',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'cloud-computing-resource-subject-train',
    path: '/cloud-computing-resource-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 综合演训训练模板详情页
  {
    name: 'cloud-computing-resource-subject-template-detail',
    path: '/cloud-computing-resource-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-computing-resource-subject-create',
    path: '/cloud-computing-resource-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-computing-resource-subject-add',
    path: '/cloud-computing-resource-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'cloud-computing-resource-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
