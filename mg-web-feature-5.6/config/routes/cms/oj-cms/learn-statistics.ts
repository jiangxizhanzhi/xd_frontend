// 学习统计
export default [
  {
    name: 'learn-statistics',
    path: '/admin/oj/admin/course/learn-statistics/list',
    title: 'routes.learn-statistics',
    component: './frame',
    meta: {},
  },
  {
    name: 'period-statistics',
    path: '/admin/oj/admin/course/learn-statistics/period-statistics/:courseId/:courseName',
    title: 'mgRoutes.classStatistics',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'learn-statistics',
      },
    },
  },
  {
    name: 'user-info',
    path: '/admin/oj/admin/course/learn-statistics/person-statistics/:userId/detail',
    component: './frame',
    title: 'mgRoutes.personalInformation',
    meta: {
      type: 0,
      breadcrumb: {
        parentName: 'learn-statistics',
      },
    },
  },
];
