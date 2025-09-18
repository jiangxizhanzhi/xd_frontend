export default [
  {
    name: 'comprehensive-training-subject',
    path: '/comprehensive-training-subject',
    title: 'routes.comprehensive-training-subject',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'comprehensive-training-subject-train',
    path: '/comprehensive-training-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 综合演训训练模板详情页
  {
    name: 'comprehensive-training-subject-template-detail',
    path: '/comprehensive-training-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'comprehensive-training-subject-create',
    path: '/comprehensive-training-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'comprehensive-training-subject-add',
    path: '/comprehensive-training-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
