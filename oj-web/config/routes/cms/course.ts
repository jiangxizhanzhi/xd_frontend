// 课程管理
export default [
  {
    name: 'courses-manage-folder',
    path: '',
    title: '课程管理',
    children: [
      {
        name: 'learn-statistics',
        path: '/admin/course/learn-statistics/list',
        title: 'routes.learn-statistics',
        component: './pages/cms/course-mod/learn-statistics/index.vue',
        meta: {
          module: 'learn-statistics',
        },
      },
      {
        name: 'courses',
        path: '/admin/courses/list',
        title: 'routes.courses',
        component: './pages/cms/course-mod/course-list.vue',
        meta: {
          module: 'courses',
        },
      },
      {
        name: 'class-card',
        path: '/admin/courses/class-card',
        title: 'routes.class-card',
        component: './pages/cms/course-mod/class-card/fullcalendar-month2.vue',
        meta: {
          module: 'class-card',
        },
      },
      {
        name: 'classroom-manage',
        title: 'm.enterClassroom',
        path: '/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage',
        component: './pages/cms/course-mod/class-card/classroom-manage.vue',
        meta: {
          breadcrumb: {
            parentName: 'class-card',
          },
          module: 'class-card',
        },
      },
      {
        name: 'courses-add',
        path: '/admin/courses/add',
        title: 'm.add',
        component: './pages/cms/course-mod/course-add.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-edit',
        path: '/admin/courses/:courseId/edit/',
        title: 'm.edit',
        component: './pages/cms/course-mod/course-edit.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-detail',
        path: '/admin/courses/:courseId/detail',
        title: '课程详情',
        component: './pages/cms/course-mod/course-detail.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-auth',
        path: '/admin/courses/:courseId/auth',
        title: 'm.authorizedOperation',
        component: './pages/cms/course-mod/private-course.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-visiblity',
        path: '/admin/courses/:courseId/visiblity',
        title: 'm.authorizedAccess',
        component: './pages/cms/course-mod/manage-auth.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-aspect',
        path: '/admin/courses/aspect/list',
        title: 'coursesBreadcrumbs.directionManagement',
        component: './pages/cms/course-mod/course-aspect-list.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-aspect-add',
        path: '/admin/courses/aspect/add',
        title: 'm.add',
        component: './pages/cms/course-mod/course-aspect-form-add.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses-aspect',
          },
          module: 'courses',
        },
      },
      {
        name: 'courses-aspect-edit',
        title: 'm.edit',
        path: '/admin/courses/aspect/:aspectId/edit',
        component: './pages/cms/course-mod/course-aspect-form-edit.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses-aspect',
          },
          module: 'courses',
        },
      },
      {
        name: 'lessons-manage',
        title: 'coursesBreadcrumbs.lessonsManage',
        path: '/admin/courses/:courseId/lessons/list',
        component: './pages/cms/course-mod/class-manage/lesson-list.vue',
        meta: {
          breadcrumb: {
            parentName: 'courses',
          },
          module: 'courses',
        },
      },
      {
        name: 'lessons-manage-practice',
        path: '/admin/courses/:courseId/lessons/:lessonId/practice',
        title: 'coursesBreadcrumbs.lessonsManagePractice',
        component: './pages/cms/exam/exercise-set/practice-set-course.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'lessons-manage-practice-go',
        path: '/admin/courses/:courseId/lessons/:lessonId/practice/go',
        title: 'coursesBreadcrumbs.lessonsManagePractice',
        component: './pages/cms/exam/exercise-set/practice-set-course-go.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'lessons-add',
        path: '/admin/course/:courseId/lesson/add',
        title: 'm.add',
        component: './pages/cms/course-mod/class-manage/add-lesson.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'lessons-edit',
        title: 'm.edit',
        path: '/admin/course/:courseId/lesson/:lessonId/edit/:itemNum',
        component: './pages/cms/course-mod/class-manage/edit-lesson.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'experiment-report',
        path: '/admin/course/:courseId/lesson/:lessonId/report',
        title: 'm.experimentReport',
        component: './pages/cms/course-mod/class-manage/experiment-report.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'theory-classroom-manage',
        path: '/admin/courses/class-card/:lessonId/:courseId/:orgId/theory-classroom-manage',
        title: 'm.enterClassroom',
        component:
          './pages/cms/course-mod/class-card/theory-classroom-manage.vue',
        meta: {
          breadcrumb: {
            parentName: 'class-card',
          },
          module: 'class-card',
        },
      },
      {
        name: 'learn-monitor',
        path: '/admin/course/:courseId/lesson/:lessonId/monitor',
        title: 'coursesBreadcrumbs.learnMonitor',
        component: './pages/cms/course-mod/class-manage/learn-monitor.vue',
        meta: {
          breadcrumb: {
            parentName: 'lessons-manage',
          },
          module: 'courses',
        },
      },
      {
        name: 'class-monitor',
        path: '/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage/class-monitor',
        title: 'm.monitor',
        component:
          './pages/cms/course-mod/class-card/components/classroom-monitoring/classroom-monitoring.vue',
        meta: {
          breadcrumb: {
            parentName: 'classroom-manage',
          },
          module: 'class-card',
        },
      },
    ],
  },
];
