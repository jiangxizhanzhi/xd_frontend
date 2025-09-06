export default [
  {
    name: 'group-training',
    path: '/cr/group_training',
    // title: 'route.teamTraining',
    title: 'routes.group-training',
    meta: {
      breadcrumb: true,
    },
    component: './frame',
  },
  {
    name: 'team_train',
    path: '/cr/team_train/:resource_id',
    title: 'route.details',
    meta: {
      breadcrumb: {
        parentName: 'group-training',
      },
    },
    component: './frame',
  },
  // {
  //   path: '/cr/student_combat/:resource_id', // 学生点击进入团队训练
  //   name: 'student_combat',
  //   title: 'route.details',
  //   meta: {
  //     breadcrumb: {
  //       parentName: 'group-training',
  //     },
  //   },
  //   component: './frame',
  // },
  // 团队训练训练模板详情页
  {
    name: 'team-train-template-detail',
    path: '/cr/team-train/template-detail/:resource_id/:template_id',
    title: 'route.trainingTemplateDetail',
    meta: {
      breadcrumb: {
        parentName: 'group-training',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    path: '/cr/team-train/create/:templateId/:business_template_id',
    name: 'team-train-create',
    title: 'route.createTraining',
    meta: {
      breadcrumb: {
        parentName: 'group-training',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    path: '/cr/team-train/add/:resource_id/:template_id/:templateId/:business_template_id',
    name: 'team-train-add',
    title: 'route.createTraining',
    meta: {
      breadcrumb: {
        parentName: 'team-train-template-detail',
      },
    },
    component: './frame',
  },
  // 团队训练编辑训练
  {
    name: 'team-train-edit',
    path: '/team-train/edit/:id',
    title: 'route.editTraining',
    meta: {
      breadcrumb: {
        parentName: 'group-training',
      },
    },
    component: './frame',
  },
];
