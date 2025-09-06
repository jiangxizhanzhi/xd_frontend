// 课程管理
export default [
  {
    name: 'class-card',
    path: '/admin/oj/admin/courses/class-card',
    title: 'routes.class-card',
    component: './frame',
    meta: {},
  },
  {
    name: 'classroom-manage',
    title: 'mgRoutes.inClassroom',
    path: '/admin/oj/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'class-card',
      },
    },
  },
  {
    name: 'theory-classroom-manage',
    title: 'mgRoutes.inClassroom',
    path: '/admin/oj/admin/courses/class-card/:lessonId/:courseId/:orgId/theory-classroom-manage',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'class-card',
      },
    },
  },
  {
    name: 'class-monitor',
    title: 'mgRoutes.monitoring',
    path: '/admin/oj/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage/class-monitor',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'classroom-manage',
      },
    },
  },
];
