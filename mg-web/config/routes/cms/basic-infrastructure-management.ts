export default [
  {
    name: 'basic-infrastructure-management',
    path: '/admin/basic-infrastructure-management',
    title: '基础设施管理',
    component: './pages/cms/system-operation/basic-infrastructure-management/list',
    meta: {
      module: 'basic-infrastructure-management',
      iconfont: 'icon-shujucaijibianpaimoshi',
    },
  },
  {
    path: '/admin/basic-infrastructure-management/create',
    component:
      './pages/cms/system-operation/basic-infrastructure-management/create',
    name: 'basic-infrastructure-management-add',
    title: '新增基础设施',
    meta: {
      breadcrumb: {
        parentName: 'basic-infrastructure-management',
      },
      module: 'basic-infrastructure-management',
    },
  },
  {
    path: '/admin/basic-infrastructure-management/edit/:id',
    component: './pages/cms/system-operation/basic-infrastructure-management/edit',
    name: 'basic-infrastructure-management-edit',
    title: '编辑基础设施',
    meta: {
      breadcrumb: {
        parentName: 'basic-infrastructure-management',
      },
      module: 'basic-infrastructure-management',
    },
  },
];
