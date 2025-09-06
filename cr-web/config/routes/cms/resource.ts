/* 资源管理 */
export const resourceRouter = {
  path: '',
  // title: '资源管理',
  title: 'routes.resource-manage-folder',
  name: 'resource-manage-folder',
  children: [
    // 工具库
    {
      path: '/admin/tool/tool',
      // title: '工具库',
      title: 'routes.tool',
      component: './pages/cms/tool/tools/list.vue',
      name: 'tool',
      meta: {
        module: 'tool',
      },
    },
    {
      // 工具库新增
      path: '/admin/tool/create',
      component: './pages/cms/tool/tools/create',
      name: 'tool-create',
      title: '新增',
      meta: {
        breadcrumb: {
          parentName: 'tool',
        },
        module: 'tool',
      },
    },
    {
      // 工具库更新
      path: '/admin/tool/edit/:id',
      component: './pages/cms/tool/tools/edit',
      name: 'tool-update',
      title: '编辑',
      meta: {
        breadcrumb: {
          parentName: 'tool',
        },
        module: 'tool',
      },
    },
    {
      // 工具库分类
      path: '/admin/tool/category',
      component: './pages/cms/tool/tools/category/list',
      name: 'tool-category-list',
      title: '工具库分类',
      meta: {
        breadcrumb: {
          parentName: 'tool',
        },
        module: 'tool',
      },
    },
    {
      // 工具库分类新增
      path: '/admin/tool/category/create',
      component: './pages/cms/tool/tools/category/create',
      name: 'tool-category-create',
      title: '新增',
      meta: {
        breadcrumb: {
          parentName: 'tool-category-list',
        },
        module: 'tool',
      },
    },
    {
      // 工具库分类更新
      path: '/admin/tool/category/edit/:id',
      component: './pages/cms/tool/tools/category/update',
      name: 'tool-category-update',
      title: '编辑',
      meta: {
        breadcrumb: {
          parentName: 'tool-category-list',
        },
        module: 'tool',
      },
    },
  ],
};
