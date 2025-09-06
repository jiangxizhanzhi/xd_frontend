export default [
  // {
  //   path: '',
  //   name: 'range-test',
  //   title: 'routes.range-test',
  //   children: [
  {
    name: 'range-test-self',
    path: '/cr/range-test',
    title: 'routes.range-test',
    meta: {
      // hideInMenu: true,
      breadcrumb: false,
    },
    component: './frame',
  },
  {
    name: 'add-test',
    path: '/cr/range-test/create',
    title: 'route.add',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
    },
    component: './frame',
  },
  {
    name: 'edit-test',
    path: '/cr/range-test/edit/:id',
    title: 'route.edit',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
    },
    component: './frame',
  },
  {
    name: 'test-detail',
    path: '/cr/range-test/detail/:templateId',
    title: 'route.testDetail',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
    },
    component: './frame',
  },
  // 评估新增
  {
    name: 'assess-add',
    path: '/cr/range-test/assess-add/:templateId',
    title: 'route.assessAdd',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  // 评估编辑
  {
    name: 'assess-edit',
    path: '/cr/range-test/assess-edit/:templateId/:resource_id',
    title: 'route.assessEdit',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  // 评估查看详情
  {
    name: 'assess-detail',
    path: '/cr/range-test/assess-detail/:templateId/:resource_id',
    title: 'route.assessDetail',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  // 5.3.4评估查看详情
  {
    name: 'assess-detail',
    path: '/cr/range-test/assess-detail-new/:templateId/:resource_id/:task_id_new',
    title: 'route.assessDetail',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  {
    name: 'assess-history',
    path: '/cr/range-test/assess-detail-new/:templateId/:resource_id/:task_id_new/assess-history',
    title: 'route.history',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'assess-detail',
      },
    },
    component: './frame',
  },
  // 测试Superset
  {
    name: 'assess-detail1',
    path: '/cr/range-test/assess-detail-new1/:templateId/:resource_id/:task_id_new',
    title: '评估详情1',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  // 流量仿真
  {
    name: 'flow-emulation',
    path: '/cr/range-test-flow/detail-flow/flow-emulation/:templateId/:mpSceneId/:taskId',
    title: 'route.flowEmulation',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
    },
    component: './frame',
  },
  //   ],
  // },
];
