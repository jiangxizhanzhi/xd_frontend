export default [
  {
    name: 'cr-standard-device-folder',
    path: '',
    // title: 'mgRoutes.targetManagement',
    title: 'routes.cr-standard-device-folder',
    meta: {
      iconfont: 'icon-babiaoguanli',
    },
    children: [
      {
        name: 'image-manage',
        path: '/admin/std/image-manage',
        // 镜像管理
        title: 'routes.image-manage',
        component: './pages/cms/device/image/list/index',
        meta: {
          module: 'image-manage',
        },
      },
      {
        path: '/admin/std/image-manage/quick-create',
        component: './pages/cms/device/image/quick-create/index',
        name: 'image-manage-quick-create',
        title: 'mgRoutes.quicklyBuild',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      {
        path: '/admin/std/image-manage/create',
        title: 'mgRoutes.add',
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
        title: 'mgRoutes.authorizedGrant',
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
        title: 'mgRoutes.edit',
        meta: {
          breadcrumb: {
            parentName: 'image-manage',
          },
          module: 'image-manage',
        },
      },
      // USB仿真
      {
        name: 'usb-emulation',
        path: '/admin/std/usb-emulation',
        title: 'routes.usb-emulation',
        component: './pages/cms/device/usb-emulation/list',
        meta: {
          module: 'usb-emulation',
        },
      },
      {
        path: '/admin/std/usb-emulation/create',
        component: './pages/cms/device/usb-emulation/create',
        name: 'usb-emulation-create',
        title: 'mgRoutes.add',
        meta: {
          breadcrumb: {
            parentName: 'usb-emulation',
          },
          module: 'usb-emulation',
        },
      },
      {
        path: '/admin/usb-emulation/edit/:id',
        component: './pages/cms/device/usb-emulation/edit',
        name: 'usb-emulation-edit',
        title: 'mgRoutes.edit',
        meta: {
          breadcrumb: {
            parentName: 'usb-emulation',
          },
          module: 'usb-emulation',
        },
      },
      {
        name: 'real-manage',
        path: '/admin/std/instance-manage',
        // 实装管理
        title: 'routes.real-manage',
        component: './pages/cms/device/real/list',
        meta: {
          module: 'real-manage',
        },
      },
      {
        path: '/admin/std/instance-manage/create',
        component: './pages/cms/device/real/create',
        name: 'real-create',
        title: 'mgRoutes.add',
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
        title: 'mgRoutes.edit',
        meta: {
          breadcrumb: {
            parentName: 'real-manage',
          },
          module: 'real-manage',
        },
      },
      {
        path: '/admin/std/service-manage',
        // 服务管理
        title: 'routes.service-manage',
        component: './pages/cms/device/service/list',
        name: 'service-manage',
        meta: {
          module: 'service-manage',
        },
      },
      {
        path: '/admin/std/service-manage/create',
        component: './pages/cms/device/service/create',
        name: 'service-manage-create',
        title: 'mgRoutes.add',
        meta: {
          breadcrumb: {
            parentName: 'service-manage',
          },
          module: 'service-manage',
        },
      },
      {
        path: '/admin/service-manage/edit/:id',
        component: './pages/cms/device/service/edit',
        name: 'service-manage-edit',
        title: 'mgRoutes.edit',
        meta: {
          breadcrumb: {
            parentName: 'service-manage',
          },
          module: 'service-manage',
        },
      },
    ],
  },
];
