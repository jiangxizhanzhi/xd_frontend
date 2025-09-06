import { component } from 'vue/types/umd';

export default [
  {
    name: 'personal-center',
    path: '',
    title: 'routes.personal-center',
    children: [
      // 我的主页
      {
        name: 'personal-folder',
        path: '/personal',
        title: 'routes.personal-folder',
        meta: {
          breadcrumb: true,
          module: 'personal-folder',
        },
        component: './pages/web/personal/index.vue',
      },
      // 我的职业
      {
        path: '/course',
        name: 'oj-course',
        title: 'routes.my-profession',
        meta: {
          breadcrumb: true,
          module: 'oj-course',
        },
        // component: './pages/web/course/professional-courses.vue',
        component: './pages/web/personal/my-career/index.vue',
      },
      {
        path: '/oj/course/detail/:resource_id',
        name: 'oj-course-detail',
        title: 'route.courseDetails',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'oj-course',
          },
          module: 'oj-course',
        },
      },
      {
        path: '/oj/course/lesson/:resource_id/:lesson_id',
        name: 'oj-course-lesson',
        title: 'route.sectionDetails',
        meta: {
          breadcrumb: {
            parentName: 'oj-course-detail',
          },
          module: 'oj-course',
        },
        component: './frame',
      },
      {
        path: '/oj/course/lesson/:resource_id/:lesson_id/:exercise_id',
        name: 'oj-course-exercises',
        title: 'route.homework',
        meta: {
          breadcrumb: {
            parentName: 'oj-course-lesson',
          },
          module: 'oj-course',
        },
        component: './frame',
      },
      // 岗位评估
      {
        name: 'job-evaluation',
        path: '/personal/job-evaluation',
        title: 'personal.jobEvaluation',
        component: './pages/web/personal/job-evaluation/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'personal-folder',
          },
          module: 'personal-folder',
        },
      },
    ],
  },
];
