import businessServiceMonitoring from './business-service-monitoring';
import equipmentStatusMonitoring from './equipment-status-monitoring';
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
          // iconfont: 'icon-xitongyunwei',
          isThird: true,
        },
      },
      ...businessServiceMonitoring,
      // 新生命周期管理
      {
        name: 'life-cycle',
        path: '/admin/system-operation/life-cycle',
        title: 'routes.life-cycle',
        component: './pages/cms/system-operation/life-cycle/list.vue',
        meta: {
          module: 'life-cycle',
          isThird: true,
          // iconfont: 'icon-xinxitongji',
        },
      },
      {
        name: 'life-cycle-detail',
        path: '/admin/system-operation/life-cycle/detail/:id',
        title: '查看全生命周期',
        component: './pages/cms/system-operation/life-cycle/detail.vue',
        meta: {
          breadcrumb: {
            parentName: 'life-cycle',
          },
          module: 'life-cycle',
          isThird: true,
        },
      },
      // 设备状态监控->新型网络设备管理
      ...equipmentStatusMonitoring,
      // 基础设施管理（原来的基础设施管理）
      {
        name: 'real-manage',
        path: '/admin/std/instance-manage',
        // 基础设施管理
        title: '基础设施管理',
        component: './pages/cms/device/real/list',
        meta: {
          module: 'real-manage',
          iconfont: 'icon-zhongduanshebei1',
        },
      },
      {
        path: '/admin/std/instance-manage/create',
        component: './pages/cms/device/real/create',
        name: 'real-create',
        title: '新增基础设施',
        meta: {
          breadcrumb: {
            parentName: 'real-manage',
          },
          module: 'real-manage',
        },
      },
      {
        path: '/admin/std/instance-manage/edit/:id',
        component: './pages/cms/device/real/edit',
        name: 'real-edit',
        title: '编辑基础设施',
        meta: {
          breadcrumb: {
            parentName: 'real-manage',
          },
          module: 'real-manage',
        },
      },
      // 演巡生命周期（原来的生命周期管理）
      {
        name: 'instance-monitoring',
        path: '/admin/system-operation/instance-monitoring',
        title: 'routes.instance-monitoring',
        component: './pages/cms/system-operation/instance-monitoring/list.vue',
        meta: {
          module: 'instance-monitoring',
          iconfont: 'icon-lianjie',
        },
      },
      // {
      //   name: 'cluster-management',
      //   path: '/admin/system-operation/cluster-management',
      //   title: 'routes.cluster-management',
      //   component:
      //     './pages/cms/system-operation/cluster-management/cluster-tabs.vue',
      //   meta: {
      //     module: 'cluster-management',
      //   },
      // },
      {
        name: 'network-management',
        path: '/admin/system-operation/network-management',
        title: 'routes.network-management',
        component:
          './pages/cms/system-operation/network-management/cluster-tabs.vue',
        meta: {
          module: 'network-management',
          iconfont: 'icon-xitongyunwei',
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
