export default [
  {
    // 态势管理菜单
    name: 'situation-3D-manage-folder',
    path: '',
    title: 'routes.situation-3D-manage-folder',
    meta: {
      iconfont: 'icon-tuopujiegoubianpaimoshi',
    },
    children: [
      /************************************************ 动效资源菜单 **********************************************/
      {
        // 动效资源菜单
        name: 'dynamic-effects-resources-list',
        path: '/admin/situation-3D-manage/dynamic-effects-resources',
        title: 'routes.dynamic-effects-resources-list',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/index.vue',
        meta: {
          module: 'dynamic-effects-resources-list',
          breadcrumb: {},
        },
      },
      // 动效资源页面路由
      {
        // 新增-动效资源页面
        name: 'dynamic-effects-resources-create',
        path: '/admin/situation-3D-manage/dynamic-effects-resources/create',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/create',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'dynamic-effects-resources-list',
          },
          module: 'dynamic-effects-resources-list',
        },
      },
      {
        // 编辑-动效资源页面
        path: '/admin/situation-3D-manage/dynamic-effects-resources/edit/:id',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/detail',
        name: 'dynamic-effects-resources-detail',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'dynamic-effects-resources-list',
          },
          module: 'dynamic-effects-resources-list',
        },
      },
      // 分类管理--动效资源页面
      {
        path: '/admin/situation-3D-manage/dynamic-effects-resources/group',
        title: '分类管理',
        name: 'dynamic-effects-resources-group',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/group-management/index.vue',
        meta: {
          module: 'dynamic-effects-resources-list',
          breadcrumb: {
            parentName: 'dynamic-effects-resources-list',
          },
        },
      },
      // 分组管理新增--动效资源页面
      {
        path: '/admin/situation-3D-manage/dynamic-effects-resources/group/create',
        title: '新增',
        name: 'dynamic-effects-resources-group-create',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/group-management/create.vue',
        meta: {
          module: 'dynamic-effects-resources-list',
          breadcrumb: {
            parentName: 'dynamic-effects-resources-group',
          },
        },
      },
      // 分组管理编辑--动效资源页面
      {
        path: '/admin/situation-3D-manage/dynamic-effects-resources/group/edit/:id',
        title: '编辑',
        name: 'dynamic-effects-resources-group-edit',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-resources/group-management/edit.vue',
        meta: {
          module: 'dynamic-effects-resources-list',
          breadcrumb: {
            parentName: 'dynamic-effects-resources-group',
          },
        },
      },
      /************************************************ 动效关联菜单 **********************************************/
      {
        // 动效关联菜单
        name: 'dynamic-effects-relationships',
        path: '/admin/situation-3D-manage/dynamic-effects-relationships',
        title: 'routes.dynamic-effects-relationships',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-relationships/index.vue',
        meta: {
          module: 'dynamic-effects-relationships',
          breadcrumb: {},
        },
      },
      {
        // 新增-动效关联
        name: 'dynamic-effects-relationships-create',
        path: '/admin/situation-3D-manage/dynamic-effects-relationships/create',
        title: '新增',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-relationships/create.vue',
        meta: {
          module: 'dynamic-effects-relationships',
          breadcrumb: {
            parentName: 'dynamic-effects-relationships',
          },
        },
      },
      {
        // 编辑-动效关联
        name: 'dynamic-effects-relationships-edit',
        path: '/admin/situation-3D-manage/dynamic-effects-relationships/edit/:id',
        title: '编辑',
        component:
          './pages/cms/situation-3D-manage/dynamic-effects-relationships/detail.vue',
        meta: {
          module: 'dynamic-effects-relationships',
          breadcrumb: {
            parentName: 'dynamic-effects-relationships',
          },
        },
      },
    ],
  },
];
