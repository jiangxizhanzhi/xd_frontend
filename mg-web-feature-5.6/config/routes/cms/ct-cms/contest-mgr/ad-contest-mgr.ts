export default [
  // 攻防赛
  {
    name: 'ct-ad-list',
    path: '/admin/ct/admin/ad/list',
    title: 'routes.ct-ad-list',
    component: './frame',
  },
  // form
  {
    name: 'ct-ad-add',
    path: '/admin/ct/admin/ad/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-list',
      },
    },
  },
  {
    name: 'ct-ad-edit',
    path: '/admin/ct/admin/ad/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-list',
      },
    },
  },
  // 比赛运维
  {
    name: 'ct-ad-operation',
    path: '/admin/ct/admin/ad/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-list',
      },
    },
  },
  // 题目编辑
  {
    name: 'ct-ad-qs-edit',
    path: '/admin/ct/admin/ad/contest/qs/edit/:resource_id/:qs_id',
    component: './frame',
    title: 'ctRoutes.topicOperations',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-list',
      },
    },
  },
];
