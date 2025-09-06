// 靶场测评体系
export const assessmentSystem = {
  path: '/admin/assessment',
  title: 'routes.assessment-system',
  name: 'assessment-system',
  children: [
    {
      // 评估算法管理
      path: '/admin/assessment-algorithm',
      title: 'routes.assessment-algorithm',
      component: './pages/cms/assessment-system/assessment-algorithm/index',
      name: 'assessment-algorithm',
      meta: {
        module: 'assessment-algorithm',
      },
    },
    {
      // 评估算法新增
      path: '/admin/assessment-algorithm/create',
      component:
        './pages/cms/assessment-system/assessment-algorithm/algorithm-create',
      name: 'assessment-algorithm-create',
      title: '新增',
      meta: {
        breadcrumb: {
          parentName: 'assessment-algorithm',
        },
        module: 'assessment-algorithm',
      },
    },
    {
      // 评估算法编辑
      path: '/admin/assessment-algorithm/edit/:resource_id',
      component:
        './pages/cms/assessment-system/assessment-algorithm/algorithm-edit',
      name: 'assessment-algorithm-edit',
      title: '编辑',
      meta: {
        breadcrumb: {
          parentName: 'assessment-algorithm',
        },
        module: 'assessment-algorithm',
      },
    },
    {
      // 指标项管理
      path: '/admin/assessment-model',
      title: 'routes.assessment-model',
      component: './pages/cms/assessment-system/assessment-model/index',
      name: 'assessment-model',
      meta: {
        module: 'assessment-model',
      },
    },
    {
      // 指标项新增
      path: '/admin/assessment-model/create',
      component: './pages/cms/assessment-system/assessment-model/model-create',
      name: 'assessment-model-create',
      title: '新增',
      meta: {
        breadcrumb: {
          parentName: 'assessment-model',
        },
        module: 'assessment-model',
      },
    },
    {
      // 指标项编辑
      path: '/admin/assessment-model/edit/:resource_id',
      component: './pages/cms/assessment-system/assessment-model/model-edit',
      name: 'assessment-model-edit',
      title: '编辑',
      meta: {
        breadcrumb: {
          parentName: 'assessment-model',
        },
        module: 'assessment-model',
      },
    },
    {
      // 指标体系管理
      path: '/admin/assessment-indicators',
      title: 'routes.assessment-indicators',
      component: './pages/cms/assessment-system/assessment-indicators/index',
      name: 'assessment-indicators',
      meta: {
        module: 'assessment-indicators',
      },
    },
    {
      // 指标体系新增
      path: '/admin/assessment-indicators/create',
      component:
        './pages/cms/assessment-system/assessment-indicators/indicators-create',
      name: 'assessment-indicators-create',
      title: '新增',
      meta: {
        breadcrumb: {
          parentName: 'assessment-indicators',
        },
        module: 'assessment-indicators',
      },
    },
    {
      // 指标体系编辑
      path: '/admin/assessment-indicators/edit/:resource_id',
      component:
        './pages/cms/assessment-system/assessment-indicators/indicators-edit',
      name: 'assessment-indicators-edit',
      title: '编辑',
      meta: {
        breadcrumb: {
          parentName: 'assessment-indicators',
        },
        module: 'assessment-indicators',
      },
    },
  ],
};
