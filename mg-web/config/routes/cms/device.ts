export default [
  {
    name: 'cr-standard-device-folder',
    path: '',
    // title: 'mgRoutes.targetManagement',
    title: 'routes.cr-standard-device-folder',
    meta: {
      iconfont: 'icon-rongqi',
    },
    children: [
      {
        name: 'image-manage',
        path: '/admin/std/image-manage',
        // 镜像管理
        title: '镜像管理',
        component: './pages/cms/device/image/list/index',
        meta: {
          module: 'image-manage',
          iconfont: 'icon-babiaoguanli',
        },
      },
      {
        path: '/admin/std/image-manage/quick-create',
        component: './pages/cms/device/image/quick-create/index',
        name: 'image-manage-quick-create',
        title: '快速构建',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      {
        path: '/admin/std/image-manage/create',
        title: '新增镜像',
        component: './pages/cms/device/image/create/index',
        name: 'image-manage-create',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      {
        path: '/admin/std/image-manage/author-operation',
        title: '授权操作',
        component: './pages/cms/device/image/list/AuthorUser',
        name: 'cr-image-manage-auth-operation',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      {
        path: '/admin/std/image-manage/edit/:id',
        component: './pages/cms/device/image/edit/index',
        name: 'image-manage-edit',
        title: '编辑镜像',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      // USB仿真
      // {
      //   name: 'usb-emulation',
      //   path: '/admin/std/usb-emulation',
      //   title: 'routes.usb-emulation',
      //   component: './pages/cms/device/usb-emulation/list',
      //   meta: {
      //     module: 'usb-emulation',
      //   },
      // },
      // {
      //   path: '/admin/std/usb-emulation/create',
      //   component: './pages/cms/device/usb-emulation/create',
      //   name: 'usb-emulation-create',
      //   title: '新增',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'usb-emulation',
      //     },
      //     module: 'usb-emulation',
      //   },
      // },
      // {
      //   path: '/admin/usb-emulation/edit/:id',
      //   component: './pages/cms/device/usb-emulation/edit',
      //   name: 'usb-emulation-edit',
      //   title: '编辑',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'usb-emulation',
      //     },
      //     module: 'usb-emulation',
      //   },
      // },
      // {
      //   name: 'real-manage',
      //   path: '/admin/std/instance-manage',
      //   // 基础设施管理
      //   title: '基础设施管理',
      //   component: './pages/cms/device/real/list',
      //   meta: {
      //     module: 'real-manage',
      //     iconfont: 'icon-zhongduanshebei1',
      //   },
      // },
      // {
      //   path: '/admin/std/instance-manage/create',
      //   component: './pages/cms/device/real/create',
      //   name: 'real-create',
      //   title: '新增设备',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'real-manage',
      //     },
      //     module: 'real-manage',
      //   },
      // },
      // {
      //   path: '/admin/std/instance-manage/edit/:id',
      //   component: './pages/cms/device/real/edit',
      //   name: 'real-edit',
      //   title: '编辑设备',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'real-manage',
      //     },
      //     module: 'real-manage',
      //   },
      // },
      // {
      //   path: '/admin/std/service-manage',
      //   // 服务管理
      //   title: 'routes.service-manage',
      //   component: './pages/cms/device/service/list',
      //   name: 'service-manage',
      //   meta: {
      //     module: 'service-manage',
      //   },
      // },
      // {
      //   path: '/admin/std/service-manage/create',
      //   component: './pages/cms/device/service/create',
      //   name: 'service-manage-create',
      //   title: '新增',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'service-manage',
      //     },
      //     module: 'service-manage',
      //   },
      // },
      // {
      //   path: '/admin/service-manage/edit/:id',
      //   component: './pages/cms/device/service/edit',
      //   name: 'service-manage-edit',
      //   title: '编辑',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'service-manage',
      //     },
      //     module: 'service-manage',
      //   },
      // },
      {
        path: '/admin/cr/admin/probe/universal-probe',
        title: '通用采集管理',
        name: 'universal-probe',
        component: './frame',
        meta: {
          iconfont: 'icon-tanzhenguanli',
        }
      },
      {
        path: '/admin/cr/admin/probe/custom-probe',
        title: '自定义探针管理',
        name: 'custom-probe',
        component: './frame',
        meta: {
          iconfont: 'icon-xuanzeceshiduixiang',
        }
      },
      {
        path: '/admin/cr/admin/probe/custom-probe/create',
        component: './frame',
        title: '新增自定义探针',
        name: 'custom-probe-create',
        meta: {
          breadcrumb: {
            parentName: 'custom-probe',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/custom-probe/edit/:id',
        component: './frame',
        title: '编辑自定义探针',
        name: 'custom-probe-edit',
        meta: {
          breadcrumb: {
            parentName: 'custom-probe',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/collection-template',
        title: '采集模板管理',
        name: 'collection-template',
        component: './frame',
        meta: {
          iconfont: 'icon-jianda',
        }
      },
      {
        path: '/admin/cr/admin/probe/collection-template/create',
        component: './frame',
        title: '新增采集模板',
        name: 'collection-template-create',
        meta: {
          breadcrumb: {
            parentName: 'collection-template',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/collection-template/edit/:id',
        component: './frame',
        title: '编辑采集模板',
        name: 'collection-template-edit',
        meta: {
          breadcrumb: {
            parentName: 'collection-template',
          },
        },
      },
      // {
      //   path: '/admin/cr/admin/probe/collection-analyse',
      //   name: 'collection-analyse',
      //   title: 'routes.collection-analyse',
      //   component: './frame',
      // },
    ],
  },
];
