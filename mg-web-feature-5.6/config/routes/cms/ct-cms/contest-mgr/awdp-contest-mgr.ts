export default [
  {
    name: 'ct-awdp-list',
    path: '/admin/ct/admin/awdp/list',
    title: 'routes.ct-awdp-list',
    component: './frame',
    meta: {},
  },
  // form
  {
    name: 'ct-awdp-add',
    path: '/admin/ct/admin/awdp/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-list',
      },
    },
  },
  {
    name: 'ct-awdp-edit',
    path: '/admin/ct/admin/awdp/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-list',
      },
    },
  },
  // 比赛运维
  {
    name: 'ct-awdp-operation',
    path: '/admin/ct/admin/awdp/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-list',
      },
    },
  },
  // 题目编辑
  {
    name: 'ct-awdp-subject-edit',
    path: '/admin/ct/admin/awdp/contest/subject/edit/:resource_id/:topicId',
    component: './frame',
    title: 'ctRoutes.topicOperations',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-operation',
      },
    },
  },
];
