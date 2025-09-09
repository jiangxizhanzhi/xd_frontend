export default [
  {
    path: '',
    name: 'comprehensive-training-folder',
    children: [
      // 团队训练列表页
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
        name: 'team_train',
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
      // 团队训练训练模板详情页
      {
        name: 'team-train-template-detail',
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
        name: 'team-train-create',
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
        name: 'team-train-add',
        path: '/team-train/add/:resource_id/:template_id/:templateId/:business_template_id',
        title: '创建训练',
        meta: {
          breadcrumb: {
            parentName: 'team-train-template-detail',
          },
          module: 'group-training',
        },
        component:
          './pages/web/experimental-management/components/train-create.vue',
      },
    ],
  },
];
