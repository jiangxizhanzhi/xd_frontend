import businessServiceMonitoring from './business-service-monitoring';
export default [
  {
    name: 'system-operation-folder',
    path: '',
    title: 'routes.system-operation-folder',
    meta: {
      iconfont: 'icon-xitongyunwei',
    },
    children: [
      {
        name: 'system-alarm',
        path: '/admin/system-operation/system-alarm',
        title: 'routes.system-alarm',
        component: './pages/cms/system-operation/system-alarm/index.vue',
        meta: {
          module: 'system-alarm',
          iconfont: 'icon-xitongyunwei',
          isThird: true,
        },
      },
      {
        name: 'cloud-platform-monitoring',
        path: '/admin/system-operation/cloud-platform-monitoring',
        title: 'routes.cloud-platform-monitoring',
        component:
          './pages/cms/system-operation/cloud-platform-monitoring/index.vue',
        meta: {
          module: 'cloud-platform-monitoring',
        },
      },
      ...businessServiceMonitoring,
      {
        name: 'instance-monitoring',
        path: '/admin/system-operation/instance-monitoring',
        title: 'routes.instance-monitoring',
        component: './pages/cms/system-operation/instance-monitoring/list.vue',
        meta: {
          module: 'instance-monitoring',
          isThird: true,
        },
      },
      {
        name: 'cluster-management',
        path: '/admin/system-operation/cluster-management',
        title: 'routes.cluster-management',
        component:
          './pages/cms/system-operation/cluster-management/cluster-tabs.vue',
        meta: {
          module: 'cluster-management',
        },
      },
      {
        name: 'network-management',
        path: '/admin/system-operation/network-management',
        title: 'routes.network-management',
        component:
          './pages/cms/system-operation/network-management/cluster-tabs.vue',
        meta: {
          module: 'network-management',
        },
      },
      {
        name: 'real-equipment-management',
        path: '/admin/system-operation/real-equipment-management/real-list',
        title: 'routes.real-equipment-management',
        component:
          './pages/cms/system-operation/real-equipment-management/real-list/index.vue',
        meta: {
          module: 'real-equipment-management',
        },
      },
      {
        name: 'resource-usage-management',
        path: '/admin/system-operation/resource-usage-management',
        title: 'routes.resource-usage-management',
        component: './pages/cms/system-operation/resource-usage-management/',
        meta: {
          module: 'iresource-usage-management',
        },
      },
      {
        name: 'scene-detail',
        path: '/admin/system-operation/instance-monitoring/scene-detail/:id',
        title: '监控详情',
        component:
          './pages/cms/system-operation/instance-monitoring/scene-detail.vue',
        meta: {
          breadcrumb: {
            parentName: 'instance-monitoring',
          },
          module: 'instance-monitoring',
        },
      },
    ],
  },
];
