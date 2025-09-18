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
    name: 'group-training-train',
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
  //   path: '/cr/student_combat/:resource_id', // 学生点击进入综合演训
  //   name: 'student_combat',
  //   title: 'route.details',
  //   meta: {
  //     breadcrumb: {
  //       parentName: 'group-training',
  //     },
  //   },
  //   component: './frame',
  // },
  // 综合演训训练模板详情页
  {
    name: 'group-training-template-detail',
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
    name: 'group-training-create',
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
    name: 'group-training-add',
    title: 'route.createTraining',
    meta: {
      breadcrumb: {
        parentName: 'group-training-template-detail',
      },
    },
    component: './frame',
  },
  // 综合演训编辑训练
  {
    name: 'group-training-home-edit',
    path: '/cr/group-training-home-edit/edit/:id',
    title: 'route.editTraining',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'group-training',
      },
    },
    component: './frame',
  },
];
