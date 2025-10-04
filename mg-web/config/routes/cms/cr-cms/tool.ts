/* 工具库 */
export default [
  {
    path: '/admin/cr/admin/tool/tool',
    name: 'tool',
    // title: 'mgRoutes.toolMagazine',
    title: 'routes.tool',
    component: './frame',
    meta: {},
    children: [
      {
        // 工具库新增
        name: 'tool-create',
        path: '/admin/cr/admin/tool/create',
        title: '新增',
        component: './frame',
        meta: {
          breadcrumb: {
            hideInMenu: false,
            parentName: 'tool',
          },
        },
      },
      {
        // 工具库更新
        path: '/admin/cr/admin/tool/edit/:id',
        component: './frame',
        name: 'tool-update',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'tool',
          },
        },
      },
      {
        // 工具库分类
        path: '/admin/cr/admin/tool/category',
        component: './frame',
        name: 'tool-category-list',
        title: 'mgRoutes.toolMagazineType',
        meta: {
          breadcrumb: {
            parentName: 'tool',
          },
        },
      },
      {
        // 工具库分类新增
        path: '/admin/cr/admin/tool/category/create',
        component: './frame',
        name: 'tool-category-create',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'tool-category-list',
          },
        },
      },
      {
        // 工具库分类更新
        path: '/admin/cr/admin/tool/category/edit/:id',
        component: './frame',
        name: 'tool-category-update',
        title: '编辑',
        meta: {
          // hideInMenu: true,
          // title: 'toolsManagement',
          // icon: 'tools',
          breadcrumb: {
            parentName: 'tool-category-list',
          },
        },
      },
    ],
  },
];
