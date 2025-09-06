export default [
  {
    path: '/oj/all-course',
    name: 'oj-all-course',
    title: 'routes.course-folder',
    meta: {
      breadcrumb: false,
    },
    component: './frame',
  },
  // 我的教学课程
  {
    path: '/oj/all-course/learn-plan',
    name: 'oj-all-course-learn-plan',
    title: 'course.schedule',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course',
      },
    },
    component: './frame',
  },
  {
    path: '/oj/all-course/detail/:resource_id',
    name: 'oj-all-course-detail',
    title: 'route.courseDetails',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course',
      },
    },
    component: './frame',
  },
  {
    path: '/oj/all-course/lesson/:resource_id/:lesson_id',
    name: 'oj-all-course-lesson',
    title: 'route.sectionDetails',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course-detail',
      },
    },
    component: './frame',
  },
  {
    path: '/oj/all-course/lesson/:resource_id/:lesson_id/:exercise_id',
    name: 'oj-all-course-exercises',
    title: 'message.noticeType.practice',
    meta: {
      breadcrumb: {
        hide: true,
        parentName: 'oj-all-course-lesson',
      },
    },
    component: './frame',
  },
  //     ],
  //   },
];
