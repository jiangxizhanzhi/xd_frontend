export default [
  {
    name: 'red-vs-blue',
    path: '/red_vs_blue',
    title: 'routes.red-vs-blue-web-folder',
    meta: {
      breadcrumb: true,
      module: 'red-vs-blue',
    },
    component: './pages/web/red-blue/common/index.vue',
  },
  // 模板详情
  {
    name: 'red-blue-template-detail',
    path: '/red-blue/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
        module: 'red-vs-blue',
      },
    },
    component: './pages/web/red-blue/common/components/template-detail.vue',
  },
  // 训练模板跳转
  {
    name: 'red-blue-create',
    path: '/red-blue/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
        module: 'red-vs-blue',
      },
    },
    component: './pages/web/red-blue/common/create.vue',
  },
  // 模板详情跳转
  {
    name: 'red-blue-add',
    path: '/red-blue/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'red-blue-template-detail',
        module: 'red-vs-blue',
      },
    },
    component: './pages/web/red-blue/common/create.vue',
  },
  {
    name: 'red-blue-edit',
    path: '/red-blue/edit/:id',
    title: '编辑训练',
    meta: {
      breadcrumb: {
        parentName: 'red-vs-blue',
        module: 'red-vs-blue',
      },
    },
    component: './pages/web/red-blue/common/edit.vue',
  },
];
