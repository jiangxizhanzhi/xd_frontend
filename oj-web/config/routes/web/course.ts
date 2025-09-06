export default [
  {
    path: '/all-course',
    name: 'oj-all-course',
    title: 'routes.course-folder',
    meta: {
      breadcrumb: false,
      module: 'oj-all-course',
    },
    component: './pages/web/course/all-course.vue',
  },

  {
    path: '/all-course/learn-plan',
    name: 'oj-all-course-learn-plan',
    title: 'course.schedule',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/learn-plan.vue',
  },

  {
    path: '/all-course/detail/:resource_id',
    name: 'oj-all-course-detail',
    title: 'course.detail',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/detail/index.vue',
  },

  {
    path: '/all-course/lesson/:resource_id/:lesson_id',
    name: 'oj-all-course-lesson',
    title: 'pageTitle.paragraphDetail',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course-detail',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/lesson/index.vue',
  },

  {
    path: '/all-course/lesson/:resource_id/:lesson_id/:exercise_id',
    name: 'oj-all-course-exercises',
    title: 'pageTitle.practice',
    meta: {
      breadcrumb: {
        hide: true,
        parentName: 'oj-all-course-lesson',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/practice/index.vue',
  },
  // 用于我的职业 课程路径
  {
    path: '/course/detail/:resource_id',
    name: 'oj-course-detail',
    title: 'course.detail',
    meta: {
      breadcrumb: {
        parentName: 'oj-all-course',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/detail/index.vue',
  },
  {
    path: '/course/lesson/:resource_id/:lesson_id',
    name: 'oj-course-lesson',
    title: 'pageTitle.paragraphDetail',
    meta: {
      breadcrumb: {
        parentName: 'oj-course-detail',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/lesson/index.vue',
  },
  {
    path: '/course/lesson/:resource_id/:lesson_id/:exercise_id',
    name: 'oj-course-exercises',
    title: 'pageTitle.practice',
    meta: {
      breadcrumb: {
        parentName: 'oj-course-lesson',
      },
      module: 'oj-all-course',
    },
    component: './pages/web/course/practice/index.vue',
  },
];
