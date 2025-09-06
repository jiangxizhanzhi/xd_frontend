export default [
  {
    name: 'learn-statistics',
    path: '/admin/course/learn-statistics/list',
    title: 'routes.learn-statistics',
    component: './pages/cms/course-mod/learn-statistics/index.vue',
    meta: {
      module: 'learn-statistics',
    },
  },
  // 课时统计-新增路由
  {
    name: 'period-statistics',
    path: '/admin/course/learn-statistics/period-statistics/:courseId/:courseName',
    title: 'coursesBreadcrumbs.classStatistics',
    component:
      './pages/cms/course-mod/learn-statistics/lesson-statistics/index.vue',
    meta: {
      breadcrumb: {
        parentName: 'learn-statistics',
      },
      module: 'learn-statistics',
    },
  },
  {
    name: 'theory-learn-count',
    path: '/admin/course/learn-statistics/:lessonId/learn-count/theory-list',
    title: 'routes.learn-statistics',
    component: './pages/cms/course-mod/learn-statistics/learn-count.vue',
    meta: {
      type: 0,
      breadcrumb: {
        parentName: 'learn-statistics',
      },
      module: 'learn-statistics',
    },
  },
  {
    name: 'learn-count',
    title: 'routes.learn-statistics',
    path: '/admin/course/learn-statistics/:lessonId/learn-count/list',
    component: './pages/cms/course-mod/learn-statistics/learn-count.vue',
    meta: {
      breadcrumb: {
        parentName: 'learn-statistics',
      },
      type: 1,
      module: 'learn-statistics',
    },
  },
  {
    name: 'user-info',
    path: '/admin/course/learn-statistics/person-statistics/:userId/detail',
    component: './pages/cms/course-mod/learn-statistics/user-info.vue',
    title: '个人信息',
    meta: {
      breadcrumb: {
        parentName: 'learn-statistics',
      },
      module: 'learn-statistics',
    },
  },
];
