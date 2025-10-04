export default [
  // {
  //   path: '',
  //   // title: 'mgRoutes.taskPlan',
  //   title: 'routes.cr-mission-arrange-folder',
  //   name: 'cr-mission-arrange-folder',
  //   meta: {
  //     iconfont: 'icon-renwufangan',
  //   },
  //   children: [
  {
    path: '/admin/cr/admin/combat-tech/combat-tech',
    // title: 'mgRoutes.taskPlan',
    title: 'routes.cr-mission-arrange-folder',
    name: 'mission-arrange-management',
    component: './frame',
    meta: {
      // hideInMenu: true,
      iconfont: 'icon-renwufangan',
      breadcrumb: false,
    },
  },
  {
    path: '/admin/cr/admin/combat-techs/create',
    title: '新增',
    component: './frame',
    name: 'combat-tech-create',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
    },
  },
  {
    path: '/admin/cr/admin/combat-tech-update/:resource_id',
    title: '编辑',
    component: './frame',
    name: 'combat-tech-update',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
    },
  },

  {
    path: '/admin/cr/admin/combat-tech/task-skill',
    title: 'mgRoutes.skillPoint',
    component: './frame',
    name: 'task-skill-management',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
    },
  },
  //   ],
  // },
];
