export default [
  // 战队管理
  {
    name: 'ct-team-list',
    path: '/admin/ct/admin/team/list',
    title: 'routes.ct-team-list',
    component: './frame',
  },
  {
    name: 'ct-team-add',
    path: '/admin/ct/admin/team/add',
    title: 'ctRoutes.addTeam',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-team-list',
      },
    },
  },
  {
    name: 'ct-team-edit',
    path: '/admin/ct/admin/team/edit/:teamId',
    title: 'ctRoutes.editTeam',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-team-list',
      },
    },
  },
  {
    name: 'ct-member-manage',
    path: '/admin/ct/admin/team/member-manage/:teamId',
    title: 'ctRoutes.memberManage',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-team-list',
      },
    },
  },
];
