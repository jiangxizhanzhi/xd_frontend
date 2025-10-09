// 课程管理
export default [
  {
    name: 'courses',
    path: '/admin/oj/admin/courses/list',
    title: 'routes.courses',
    component: './frame',
    meta: {
      iconfont: 'icon-rili',
    },
  },
  {
    name: 'courses-add',
    path: '/admin/oj/admin/courses/add',
    title: '新增课程',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'courses-edit',
    path: '/admin/oj/admin/courses/:courseId/edit/',
    title: '编辑课程',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'courses-detail',
    path: '/admin/oj/admin/courses/:courseId/detail',
    title: '课程详情',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
      module: 'courses',
    },
  },
  {
    name: 'courses-monitor',
    path: '/admin/oj/admin/courses/:resource_id/monitor/',
    title: '学员监控',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
      module: 'courses',
    },
  },
  {
    name: 'courses-visiblity',
    path: '/admin/oj/admin/courses/:courseId/visiblity',
    title: 'mgRoutes.authorizedVisit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'courses-auth',
    path: '/admin/oj/admin/courses/:courseId/auth',
    title: 'mgRoutes.authorizedOperation',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'courses-aspect',
    path: '/admin/oj/admin/courses/aspect/list',
    title: 'mgRoutes.directionManagement',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'courses-aspect-add',
    path: '/admin/oj/admin/courses/aspect/add',
    title: '新增',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses-aspect',
      },
    },
  },
  {
    name: 'courses-aspect-edit',
    title: '编辑',
    path: '/admin/oj/admin/courses/aspect/:aspectId/edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses-aspect',
      },
    },
  },
  {
    name: 'lessons-manage',
    title: 'mgRoutes.classManagement',
    path: '/admin/oj/admin/courses/:courseId/lessons/list',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'courses',
      },
    },
  },
  {
    name: 'lessons-manage-practice',
    path: '/admin/oj/admin/courses/:courseId/lessons/:lessonId/practice',
    title: 'mgRoutes.practice',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'lessons-manage-practice-go',
    path: '/admin/oj/admin/courses/:courseId/lessons/:lessonId/practice/go',
    title: 'mgRoutes.practice',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'lessons-add',
    path: '/admin/oj/admin/course/:courseId/lesson/add',
    title: '新增',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'lessons-edit',
    title: '编辑',
    path: '/admin/oj/admin/course/:courseId/lesson/:lessonId/edit/:itemNum',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'experiment-report',
    path: '/admin/oj/admin/course/:courseId/lesson/:lessonId/report',
    title: 'mgRoutes.labReport',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'learn-monitor',
    path: '/admin/oj/admin/course/:courseId/lesson/:lessonId/monitor',
    title: 'mgRoutes.learnMonitor',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'lessons-manage',
      },
    },
  },
  {
    name: 'student-courses',
    path: '/admin/oj/admin/student-courses/list',
    title: '我的课程',
    component: './frame',
    meta: {
      iconfont: 'icon-yonghuguanli',
    },
  },
  {
    name: 'student-courses-detail',
    path: '/admin/oj/admin/student-courses/:courseId/detail',
    title: '课程详情',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'student-courses',
      },
      module: 'student-courses',
    },
  },
  {
    name: 'student-courses-edit',
    path: '/admin/oj/admin/student-courses/:courseId/edit/',
    title: '课程编辑',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'student-courses',
      },
      module: 'student-courses',
    },
  },
];
