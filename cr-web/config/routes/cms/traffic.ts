// 流量
export const trafficRouter = {
  path: '/admin/traffic',
  // title: '流量管理',
  title: 'routes.traffic-manage-folder',
  redirect: '/traffic/background',
  name: 'traffic-manage-folder',
  children: [
    {
      // 背景流量列表页
      path: '/admin/traffic/background',
      // title: '背景流量',
      title: 'routes.static-traffic-list',
      component: './pages/cms/traffic/background/traffic_list',
      name: 'static-traffic-list',
      meta: {
        module: 'static-traffic-list',
      },
    },
    {
      // 攻击流量列表页
      path: '/admin/traffic/intelligent',
      // title: '攻击流量',
      title: 'routes.dynamic-traffic-list',
      component: './pages/cms/traffic/intelligent/traffic_list',
      name: 'dynamic-traffic-list',
      meta: {
        module: 'dynamic-traffic-list',
      },
    },
    {
      // 背景流量新增
      path: '/admin/traffic/background/create',
      component: './pages/cms/traffic/background/traffic_create',
      name: 'static-traffic-create',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'static-traffic-list',
        },
        module: 'static-traffic-list',
      },
    },
    {
      // 背景流量编辑
      path: '/admin/traffic/background/edit/:resource_id',
      component: './pages/cms/traffic/background/traffic_update',
      name: 'static-traffic-update',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'static-traffic-list',
        },
        module: 'static-traffic-list',
      },
    },
    {
      // 背景流量-类型管理
      path: '/admin/traffic/background/type_list',
      component: './pages/cms/traffic/background/type_list',
      name: 'static-traffic-type-list',
      title: 'routes.traffic-type-list',
      meta: {
        breadcrumb: {
          parentName: 'static-traffic-list',
        },
        module: 'static-traffic-list',
      },
    },
    {
      // 背景流量-类型新增
      path: '/admin/traffic/background/type_list/add',
      component: './pages/cms/traffic/background/type_add',
      name: 'static-traffic-type-add',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'static-traffic-type-list',
        },
        module: 'static-traffic-list',
      },
    },
    {
      // 背景流量-类型编辑
      path: '/admin/traffic/background/type_list/edit',
      component: './pages/cms/traffic/background/type_edit',
      name: 'static-traffic-type-edit',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'static-traffic-type-list',
        },
        module: 'static-traffic-list',
      },
    },
    {
      // 攻击流量新增
      path: '/admin/traffic/intelligent/create',
      component: './pages/cms/traffic/intelligent/traffic_create',
      name: 'dynamic-traffic-create',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'dynamic-traffic-list',
        },
        module: 'dynamic-traffic-list',
      },
    },
    {
      // 攻击流量编辑
      path: '/admin/traffic/intelligent/edit/:resource_id',
      component: './pages/cms/traffic/intelligent/traffic_update',
      name: 'dynamic-traffic-update',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'dynamic-traffic-list',
        },
        module: 'dynamic-traffic-list',
      },
    },
    {
      // 攻击流量-类型管理
      path: '/admin/traffic/intelligent/type_list',
      component: './pages/cms/traffic/intelligent/type_list',
      name: 'dynamic-traffic-type-list',
      title: 'routes.traffic-type-list',
      meta: {
        breadcrumb: {
          parentName: 'dynamic-traffic-list',
        },
        module: 'dynamic-traffic-list',
      },
    },
    {
      // 攻击流量-类型新增
      path: '/admin/traffic/intelligent/type_list/add',
      component: './pages/cms/traffic/intelligent/type_add',
      name: 'dynamic-traffic-type-add',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'dynamic-traffic-type-list',
        },
        module: 'dynamic-traffic-list',
      },
    },
    {
      // 攻击流量-类型编辑
      path: '/admin/traffic/intelligent/type_list/edit',
      component: './pages/cms/traffic/intelligent/type_edit',
      name: 'dynamic-traffic-type-edit',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'dynamic-traffic-type-list',
        },
        module: 'dynamic-traffic-list',
      },
    },
    // 开启流量集合的菜单
    {
      // 流量集合列表
      path: '/admin/traffic/scheme',
      // title: '流量集合',
      title: 'routes.traffic-scheme-list',
      component: './pages/cms/traffic/scheme/list',
      name: 'traffic-scheme-list',
      meta: {
        module: 'traffic-scheme-list',
      },
    },
    {
      // 新增流量集合
      path: '/admin/traffic/scheme/create',
      component: './pages/cms/traffic/scheme/create',
      name: 'traffic-scheme-create',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'traffic-scheme-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    {
      // 编辑流量集合
      path: '/admin/traffic/scheme/edit/:resource_id',
      component: './pages/cms/traffic/scheme/edit',
      name: 'traffic-scheme-edit',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'traffic-scheme-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    {
      // 流量详情安排列表
      path: '/admin/traffic/scheme/traffic/:resource_id',
      component: './pages/cms/traffic/scheme/components/scheme_traffic_list',
      name: 'traffic-scheme-traffic-list',
      title: 'routes.traffic-detail-list',
      meta: {
        breadcrumb: {
          parentName: 'traffic-scheme-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    {
      // 流量集合-类型管理
      path: '/admin/traffic/scheme/type_list',
      component: './pages/cms/traffic/scheme/type_list',
      name: 'scheme-traffic-type-list',
      title: 'routes.traffic-type-list',
      meta: {
        breadcrumb: {
          parentName: 'traffic-scheme-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    {
      // 流量集合-类型新增
      path: '/admin/traffic/scheme/type_list/add',
      component: './pages/cms/traffic/scheme/type_add',
      name: 'scheme-traffic-type-add',
      title: 'routes.add',
      meta: {
        breadcrumb: {
          parentName: 'scheme-traffic-type-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    {
      // 流量集合-类型编辑
      path: '/admin/traffic/scheme/type_list/edit',
      component: './pages/cms/traffic/scheme/type_edit',
      name: 'scheme-traffic-type-edit',
      title: 'routes.edit',
      meta: {
        breadcrumb: {
          parentName: 'scheme-traffic-type-list',
        },
        module: 'traffic-scheme-list',
      },
    },
    //流量分析
    {
      path: '/admin/traffic/analyse',
      title: '流量分析',
      component: './pages/cms/traffic/analyse/list',
      name: 'traffic-analyse-list',
      meta: {
        module: 'traffic-analyse-list',
      },
    },
    // {
    //   path: '/admin/traffic/analyse/create',
    //   title: 'routes.add',
    //   component: './pages/cms/traffic/analyse/create',
    //   name: 'traffic-analyse-create',
    //   meta: {
    //     auth: false,
    //     breadcrumb: {
    //       parentName: 'traffic-analyse-list',
    //     },
    //   },
    // },
    // {
    //   path: '/admin/traffic/analyse/edit/:resource_id',
    //   title: 'routes.edit',
    //   component: './pages/cms/traffic/analyse/edit',
    //   name: 'traffic-analyse-edit',
    //   meta: {
    //     auth: false,
    //     breadcrumb: {
    //       parentName: 'traffic-analyse-list',
    //     },
    //   },
    // },
    // {
    //   // 流量分析-类型管理
    //   path: '/admin/traffic/analyse/type_list',
    //   component: './pages/cms/traffic/analyse/type_list',
    //   name: 'traffic-analyse-type-list',
    //   title: 'routes.traffic-type-list',
    //   meta: {
    //     breadcrumb: {
    //       parentName: 'traffic-analyse-list',
    //     },
    //     module: 'traffic-analyse-list',
    //   },
    // },
    // {
    //   // 流量分析-类型新增
    //   path: '/admin/traffic/analyse/type_list/add',
    //   component: './pages/cms/traffic/analyse/type_add',
    //   name: 'traffic-analyse-type-add',
    //   title: 'routes.add',
    //   meta: {
    //     breadcrumb: {
    //       parentName: 'traffic-analyse-type-list',
    //     },
    //     module: 'traffic-analyse-list',
    //   },
    // },
    // {
    //   // 流量分析-类型编辑
    //   path: '/admin/traffic/analyse/type_list/edit',
    //   component: './pages/cms/traffic/analyse/type_edit',
    //   name: 'traffic-analyse-type-edit',
    //   title: 'routes.edit',
    //   meta: {
    //     breadcrumb: {
    //       parentName: 'traffic-analyse-type-list',
    //     },
    //     module: 'traffic-analyse-list',
    //   },
    // },
  ],
};
