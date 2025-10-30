import notice from './notice';
export default [
  {
    name: 'system-management-folder',
    path: '',
    title: 'routes.system-management-folder',
    meta: {
      iconfont: 'icon-xitongguanli',
    },
    children: [
      {
        name: 'cloud-platform-monitoring',
        path: '/admin/system-operation/cloud-platform-monitoring',
        title: 'routes.cloud-platform-monitoring',
        component:
          './pages/cms/system-operation/cloud-platform-monitoring/index.vue',
        meta: {
          module: 'cloud-platform-monitoring',
          iconfont: 'icon-ziyuanguanli',
        },
      },
      {
        name: 'system-config',
        path: '/admin/system-management/system-config',
        title: 'routes.system-config',
        component: './pages/cms/system-management/system-config/index.vue',
        meta: {
          module: 'system-config',
          iconfont: 'icon-daohanglan-xitong',
        },
      },
      // {
      //   name: 'audit-log',
      //   path: '/admin/system-management/audit-log',
      //   title: 'routes.audit-log',
      //   component: './pages/cms/system-management/audit-log.vue',
      //   meta: {
      //     module: 'audit-log',
      //   },
      // },
      // {
      //   name: 'system-log',
      //   path: '/admin/system-management/system-log',
      //   title: 'routes.system-log',
      //   component: './pages/cms/system-management/run-log.vue',
      //   meta: {
      //     module: 'system-log',
      //   },
      // },
      {
        name: 'user-manage',
        path: '/admin/system-management/user-management',
        title: 'routes.user-manage',
        component:
          './pages/cms/system-management/user-management/user-list/index.vue',
        meta: {
          module: 'user-manage',
          iconfont: 'icon-yonghuguanli',
        },
      },
      {
        name: 'user-add',
        path: '/admin/user-management/add',
        title: '新增用户',
        component:
          './pages/cms/system-management/user-management/user-add/index.vue',
        props: true,
        meta: {
          breadcrumb: {
            parentName: 'user-manage',
          },
          module: 'user-manage',
        },
      },
      {
        name: 'user-edit',
        path: '/admin/user-management/edit',
        title: '编辑用户',
        component:
          './pages/cms/system-management/user-management/user-edit/index.vue',
        props: true,
        meta: {
          routeTabActive: true,
          breadcrumb: {
            parentName: 'user-manage',
          },
          module: 'user-manage',
        },
      },
      {
        name: 'user-check',
        path: '/admin/user-management/check',
        title: 'systemManagement.userManage.userCheck',
        component:
          './pages/cms/system-management/user-management/user-check/index.vue',
        props: true,
        meta: {
          breadcrumb: {
            parentName: 'user-manage',
          },
          module: 'user-manage',
        },
      },
      {
        name: 'role-management',
        path: '/admin/system-management/role-management/',
        title: 'routes.role-management',
        component:
          './pages/cms/system-management/role-management/role-list/index.vue',
        meta: {
          module: 'role-management',
          iconfont: 'icon-shenhe',
        },
      },
      {
        name: 'role-add',
        path: '/admin/role-management/role-add/',
        title: '新增角色',
        component:
          './pages/cms/system-management/role-management/add-role/index.vue',
        props: true,
        meta: {
          breadcrumb: {
            parentName: 'role-management',
          },
          module: 'role-management',
        },
      },
      {
        name: 'role-edit',
        path: '/admin/role-management/role-edit/',
        title: '编辑角色',
        component:
          './pages/cms/system-management/role-management/edit-role/index.vue',
        props: true,
        meta: {
          routeTabActive: true,
          breadcrumb: {
            parentName: 'role-management',
          },
          module: 'role-management',
        },
      },
      {
        name: 'add-role-users',
        path: '/admin/role-management/add-role-users/',
        title: 'systemManagement.roleManage.addRoleUser',
        component:
          './pages/cms/system-management/role-management/add-role-users/index.vue',
        props: true,
        meta: {
          routeTabActive: true,
          breadcrumb: {
            parentName: 'role-management',
          },
          module: 'role-management',
        },
      },
      // {
      //   name: 'message-management',
      //   path: '/admin/message-management/',
      //   title: 'routes.message-management',
      //   component: './pages/cms/system-management/message-management/index.vue',
      //   meta: {
      //     module: 'message-management',
      //   },
      // },
      // ...notice,
    ],
  },
];
