export const probeRouter = {
  path: '',
  // title: '探针管理',
  title: 'routes.cr-collection-system-folder',
  name: 'cr-collection-system-folder',
  children: [
    {
      path: '/admin/probe/universal-probe',
      title: '通用探针',
      name: 'universal-probe',
      component: './pages/cms/probe/universal-probe/index',
      meta: {
        module: 'universal-probe',
      },
    },
    {
      path: '/admin/probe/custom-probe',
      title: '自定义探针',
      name: 'custom-probe',
      component: './pages/cms/probe/custom-probe/list',
      meta: {
        module: 'custom-probe',
      },
    },
    {
      path: '/admin/probe/custom-probe/create',
      component: './pages/cms/probe/custom-probe/create',
      title: '新增',
      name: 'custom-probe-create',
      meta: {
        breadcrumb: {
          parentName: 'custom-probe',
        },
        module: 'custom-probe',
      },
    },
    {
      path: '/admin/probe/custom-probe/edit/:id',
      component: './pages/cms/probe/custom-probe/edit',
      title: '编辑',
      name: 'custom-probe-edit',
      meta: {
        breadcrumb: {
          parentName: 'custom-probe',
        },
        module: 'custom-probe',
      },
    },
    {
      path: '/admin/probe/collection-template',
      title: '采集模板',
      name: 'collection-template',
      component: './pages/cms/probe/collection-template/list',
      meta: {
        module: 'collection-template',
      },
    },
    {
      path: '/admin/probe/collection-template/create',
      component: './pages/cms/probe/collection-template/create',
      title: '新增',
      name: 'collection-template-create',
      meta: {
        breadcrumb: {
          parentName: 'collection-template',
        },
        module: 'collection-template',
      },
    },
    {
      path: '/admin/probe/collection-template/edit/:id',
      component: './pages/cms/probe/collection-template/edit',
      title: '编辑',
      name: 'collection-template-edit',
      meta: {
        breadcrumb: {
          parentName: 'collection-template',
        },
        module: 'collection-template',
      },
    },
    {
      path: '/admin/probe/collection-analyse',
      title: '采集分析',
      name: 'collection-analyse',
      component: './pages/cms/probe/collection-analyse/list',
      meta: {
        module: 'collection-analyse',
      },
    },
  ],
};
