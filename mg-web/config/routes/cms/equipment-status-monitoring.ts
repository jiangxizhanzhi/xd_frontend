export default [
  {
    name: 'cluster-management',
    path: '/admin/cluster-management',
    title: '设备状态监控',
    component: './pages/cms/system-operation/equipment-status-monitoring/list',
    meta: {
      module: 'cluster-management',
      iconfont: 'icon-yunhangtongji',
    },
  },
  {
    path: '/admin/cluster-management/create',
    component:
      './pages/cms/system-operation/equipment-status-monitoring/create',
    name: 'cluster-management-add',
    title: '新增设备状态',
    meta: {
      breadcrumb: {
        parentName: 'cluster-management',
      },
      module: 'cluster-management',
    },
  },
  {
    path: '/admin/cluster-management/edit/:id',
    component: './pages/cms/system-operation/equipment-status-monitoring/edit',
    name: 'cluster-management-edit',
    title: '编辑设备状态',
    meta: {
      breadcrumb: {
        parentName: 'cluster-management',
      },
      module: 'cluster-management',
    },
  },
];
