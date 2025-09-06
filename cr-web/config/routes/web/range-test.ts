export default [
  {
    name: 'range-test-self',
    path: '/range-test',
    title: 'routes.range-test',
    meta: {
      breadcrumb: true,
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/index.vue',
  },
  {
    name: 'add-test',
    path: '/range-test/create',
    title: 'm.add',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/create.vue',
  },
  {
    name: 'edit-test',
    path: '/range-test/edit/:id',
    title: 'm.edit',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/edit.vue',
  },
  {
    name: 'test-detail',
    path: '/range-test/detail/:templateId',
    title: 'm.detailTest',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'range-test-self',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/index.vue',
  },
  // 流量仿真
  {
    name: 'flow-emulation',
    path: '/range-test-flow/detail-flow/flow-emulation/:templateId/:mpSceneId/:taskId',
    title: '流量仿真',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/test/flow-emulation.vue',
  },
  // 评估新增
  {
    name: 'assess-add',
    path: '/range-test/assess-add/:templateId',
    title: 'm.add',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/assess/assess-add.vue',
  },
  // 评估编辑
  {
    name: 'assess-edit',
    path: '/range-test/assess-edit/:templateId/:resource_id',
    title: 'm.editAssess',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/assess/assess-edit.vue',
  },

  // 5.3.4查看评估详情
  {
    name: 'assess-detail',
    path: '/range-test/assess-detail-new/:templateId/:resource_id/:task_id_new',
    title: 'm.detailAssess',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/assess/assess-detail-new.vue',
  },
  {
    name: 'assess-history',
    path: '/range-test/assess-detail-new/:templateId/:resource_id/:task_id_new/assess-history',
    title: 'assessment.history',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'assess-detail',
      },
      module: 'range-test-self',
    },
    component: './pages/web/RangeTest/test-detail/assess/assess-history.vue',
  },
  // 测试Superset
  {
    name: 'assess-detail1',
    path: '/range-test/assess-detail-new1/:templateId/:resource_id/:task_id_new',
    title: '评估详情1',
    meta: {
      hideInMenu: true,
      breadcrumb: {
        parentName: 'test-detail',
      },
      module: 'range-test-self',
    },
    component:
      './pages/web/RangeTest/test-detail/assess/assess-detail-new1.vue',
  },
];
