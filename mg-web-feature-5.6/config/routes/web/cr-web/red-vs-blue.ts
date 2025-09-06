export default [
  {
    name: 'red-vs-blue',
    path: '/cr/red_vs_blue',
    title: 'routes.red-vs-blue-web-folder',
    component: './frame',
    meta: {
      breadcrumb: false,
    },
  },
  {
    name: 'red-blue-template-detail',
    path: '/cr/red-blue/template-detail/:resource_id/:template_id',
    title: 'route.trainingTemplateDetail',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
      },
    },
    component: './frame',
  },
  // 训练模板跳转
  {
    name: 'red-blue-create',
    path: '/cr/red-blue/create/:templateId/:business_template_id',
    title: 'route.createTraining',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
      },
    },
    component: './frame',
  },
  // 模板详情跳转
  {
    name: 'red-blue-add',
    path: '/cr/red-blue/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: 'route.createTraining',
    meta: {
      breadcrumb: {
        parentName: 'red-blue-template-detail',
      },
    },
    component: './frame',
  },
  {
    name: 'red-blue-edit',
    path: '/cr/red-blue/edit/:id',
    title: 'route.editTraining',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
      },
    },
    component: './frame',
  },
];
