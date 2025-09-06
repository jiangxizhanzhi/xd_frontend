export default [
  // 赛场
  {
    name: 'ct-arena-list',
    path: '/admin/ct/admin/arena/list',
    title: 'routes.ct-arena-list',
    component: './frame',
  },

  {
    name: 'ct-arena-add',
    path: '/admin/ct/admin/arena/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-arena-list',
      },
    },
  },
  {
    name: 'ct-arena-edit',
    path: '/admin/ct/admin/arena/edit/:arenaId',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-arena-list',
      },
    },
  },
  {
    name: 'ct-arena-mgr',
    path: '/admin/ct/admin/arena/contest-mgr/:arenaId',
    component: './frame',
    title: 'ctRoutes.contestMgr',
    meta: {
      breadcrumb: {
        parentName: 'ct-arena-list',
      },
    },
  },
  {
    name: 'ct-arena-rank-mgr',
    path: '/admin/ct/admin/arena/rank-mgr/:arenaId',
    component: './frame',
    title: 'ctRoutes.rankMgr',
    meta: {
      breadcrumb: {
        parentName: 'ct-arena-list',
      },
    },
  },
];
