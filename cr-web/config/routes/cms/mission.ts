export const missionRouter = [
  // path: '',
  // // title: '任务方案',
  // title: 'routes.cr-mission-arrange-folder',
  // name: 'cr-mission-arrange-folder',
  // children: [
  {
    path: '/admin/combat-tech/combat-tech',
    // title: '任务方案',
    title: 'routes.cr-mission-arrange-folder',
    name: 'mission-arrange-management',
    component: './pages/cms/missions/combat-tech/list',
    meta: {
      // hideInMenu: true,
      module: 'mission-arrange-management',
    },
  },
  {
    path: '/admin/combat-techs/create', // 新增任务
    component: './pages/cms/missions/combat-tech/create.vue',
    title: '新增',
    name: 'combat-tech-create',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
      module: 'mission-arrange-management',
    },
  },
  {
    path: '/admin/combat-tech-update/:resource_id', // 编辑任务
    component: './pages/cms/missions/combat-tech/update.vue',
    name: 'combat-tech-update',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
      module: 'mission-arrange-management',
    },
  },
  {
    path: '/admin/combat-tech/task-skill', // 任务技能点管理
    component: './pages/cms/missions/combat-tech/task-skill/detail.vue',
    name: 'task-skill-management',
    title: '任务技能点管理',
    meta: {
      breadcrumb: {
        parentName: 'mission-arrange-management',
      },
      module: 'mission-arrange-management',
    },
  },
  // ],
];
