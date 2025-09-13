import { IRoute } from '@cyber/cli';
import Practice from './web/practice';
import Course from './web/course';
import practiceCms from './cms/practice';
import courseCms from './cms/course';
import career from './cms/career-system';
import statisticalAnalysis from './cms/statistical-analysis';
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      noframe: true,
    },
    component: './pages/login/index.vue',
  },
  {
    path: '/cr_scene/lesson/cr_scene_case/:id/:course_id/:lesson_id/console',
    component: './pages/web/course/lesson/console-common.vue',
    name: 'ojweb-course-console',
    meta: {
      auth: false,
      module: 'oj-all-course',
    },
  },
  {
    name: 'ojcms-course-console',
    path: '/admin/course/class-card/:lessonId/:userId/console',
    component: './pages/cms/course-mod/class-card/console-common.vue',
    meta: {
      auth: false,
      module: 'class-card',
    },
  },
  // 教学直播iframe
  {
    name: 'teaching-live',
    path: '/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage/teaching-live',
    component:
      './pages/cms/course-mod/class-card/components/live/index-iframe.vue',
    meta: {
      auth: false,
      module: 'class-card',
    },
  },
  // {
  //   path: '/',
  //   name: 'web-layout',
  //   meta: {
  //     layout: true,
  //   },
  //   component: './layouts/web-layout',
  //   children: [
  //     // {
  //     //   path: '',
  //     //   name: 'web-default',
  //     //   redirect: { name: 'oj-all-course' },
  //     // },
  //     // ...Course,
  //     // Practice,
  //   ],
  // },
  {
    path: '/admin',
    name: 'cms-layout',
    meta: {
      layout: true,
    },
    component: './layouts/cms-layout',
    children: [
      {
        path: '',
        name: 'cms-default',
        redirect: { name: 'learn-statistics' },
      },
      // ...statisticalAnalysis,
      ...courseCms,
      ...practiceCms,
      ...career,
    ],
  },
] as IRoute[];
