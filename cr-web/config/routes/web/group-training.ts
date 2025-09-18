export default [
  {
    path: '',
    name: 'comprehensive-training-folder',
    children: [
      // 综合演训列表页
      {
        name: 'group-training',
        path: '/group_training',
        title: 'routes.group-training',
        meta: {
          hideInMenu: true,
          breadcrumb: true,
          module: 'group-training',
        },
        component: './pages/web/experimental-management/list.vue',
      },
      // 我的训练详情页
      {
        name: 'group-training-train',
        path: '/team_train/:resource_id',
        title: 'm.details',
        meta: {
          breadcrumb: {
            parentName: 'group-training',
          },
          module: 'group-training',
        },
        component:
          './pages/web/experimental-management/teachers/teacher_home.vue',
      },
      // 综合演训训练模板详情页
      {
        name: 'group-training-template-detail',
        path: '/team-train/template-detail/:resource_id/:template_id',
        title: '训练模板详情',
        meta: {
          breadcrumb: {
            parentName: 'group-training',
          },
          module: 'group-training',
        },
        component:
          './pages/web/experimental-management/components/templates-detail.vue',
      },
      // 训练训练列表点击创建训练
      {
        name: 'group-training-create',
        path: '/team-train/create/:templateId/:business_template_id',
        title: '创建训练',
        meta: {
          breadcrumb: {
            parentName: 'group-training',
          },
          module: 'group-training',
        },
        component:
          './pages/web/experimental-management/components/train-create.vue',
      },
      // 训练模板详情点击创建训练
      {
        name: 'group-training-add',
        path: '/team-train/add/:resource_id/:template_id/:templateId/:business_template_id',
        title: '创建训练',
        meta: {
          breadcrumb: {
            parentName: 'group-training-template-detail',
          },
          module: 'group-training',
        },
        component:
          './pages/web/experimental-management/components/train-create.vue',
      },
    ],
  },
];
