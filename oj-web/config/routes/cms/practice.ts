// 练习管理
export default [
  {
    name: 'practices-folder',
    path: '',
    title: '题库管理',
    children: [
      // 习题集管理
      {
        name: 'exercises',
        path: '/admin/exercises/list',
        title: 'routes.exercises',
        component: './pages/cms/exercises/exercise-list.vue',
        meta: {
          module: 'exercises',
        },
      },
      {
        name: 'add-exercises',
        path: '/admin/exercises/add-exercises',
        title: 'm.add',
        component: './pages/cms/exercises/exercises-add.vue',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
          module: 'exercises',
        },
      },
      {
        name: 'edit-exercises',
        title: 'm.edit',
        path: '/admin/exercises/:exercisesId/edit-exercises',
        component: './pages/cms/exercises/exercises-edit.vue',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
          module: 'exercises',
        },
      },
      {
        name: 'exercises-auth',
        path: '/admin/exercises/:exercisesId/auth',
        component: './pages/cms/exercises/private-exercises.vue',
        title: 'examBreadcrumbs.operation',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
          module: 'exercises',
        },
      },
      {
        name: 'exercises-visibility',
        path: '/admin/exercises/:exercisesId/visibility',
        component: './pages/cms/exercises/manage-exercises.vue',
        title: 'examBreadcrumbs.authorized',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
          module: 'exercises',
        },
      },
      // 理论基础
      {
        name: 'theory-base',
        path: '/admin/exercises/theory-base/list',
        title: 'routes.theory-base',
        component: './pages/cms/exercises/theory-base/index.vue',
        meta: {
          module: 'theory-base',
        },
      },
      {
        name: 'add-theory',
        path: '/admin/exercises/theory-base/add-theory',
        title: 'm.add',
        component: './pages/cms/exercises/theory-base/add-theory.vue',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
          module: 'theory-base',
        },
      },
      {
        name: 'edit-theory',
        path: '/admin/exercises/theory-base/:theoryId/edit-theory',
        title: 'm.edit',
        component: './pages/cms/exercises/theory-base/edit-theory.vue',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
          module: 'theory-base',
        },
      },
      {
        name: 'theory-to-type',
        path: '/admin/exercises/theory-base/to-type',
        title: 'coursesBreadcrumbs.directionManagement',
        component: './pages/cms/exercises/theory-base/to-type.vue',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
          module: 'theory-base',
        },
      },
      {
        name: 'theory-add-type',
        title: 'm.add',
        path: '/admin/exercises/theory-base/to-type/add-type',
        component: './pages/cms/exercises/theory-base/type-add.vue',
        meta: {
          breadcrumb: {
            parentName: 'theory-to-type',
          },
          module: 'theory-base',
        },
      },
      {
        name: 'theory-edit-type',
        title: 'm.edit',
        path: '/admin/exercises/theory-base/to-type/:typeId/edit-type',
        component: './pages/cms/exercises/theory-base/type-edit.vue',
        meta: {
          breadcrumb: {
            parentName: 'theory-to-type',
          },
          module: 'theory-base',
        },
      },
      // 实践操作
      {
        name: 'flags-solve',
        path: '/admin/exercises/flags-solve/list',
        title: 'routes.flags-solve',
        component: './pages/cms/exercises/flags-solve/index.vue',
        meta: {
          module: 'flags-solve',
        },
      },
      {
        name: 'add-flags',
        path: '/admin/exercises/flags-solve/add-flags',
        title: 'm.add',
        component: './pages/cms/exercises/flags-solve/add-flags.vue',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
          module: 'flags-solve',
        },
      },
      {
        name: 'edit-flags',
        title: 'm.edit',
        path: '/admin/exercises/flags-solve/:flagsId/edit-flags',
        component: './pages/cms/exercises/flags-solve/edit-flags.vue',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
          module: 'flags-solve',
        },
      },
      {
        name: 'flags-to-type',
        path: '/admin/exercises/flags-solve/to-type',
        component: './pages/cms/exercises/flags-solve/to-type.vue',
        title: 'coursesBreadcrumbs.directionManagement',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
          module: 'flags-solve',
        },
      },
      {
        name: 'flags-add-type',
        path: '/admin/exercises/flags-solve/add-type',
        component: './pages/cms/exercises/flags-solve/type-add.vue',
        title: 'm.add',
        meta: {
          breadcrumb: {
            parentName: 'flags-to-type',
          },
          module: 'flags-solve',
        },
      },
      {
        name: 'flags-edit-type',
        path: '/admin/exercises/flags-solve/:typeId/edit-type',
        component: './pages/cms/exercises/flags-solve/type-edit.vue',
        title: 'm.edit',
        meta: {
          breadcrumb: {
            parentName: 'flags-to-type',
          },
          module: 'flags-solve',
        },
      },
    ],
  },
];
