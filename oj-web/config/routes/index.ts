import { IRoute } from '@cyber/cli';
// import Practice from './web/practice';
// import Course from './web/course';
import practiceCms from './cms/practice';
import courseCms from './cms/course';
import career from './cms/career-system';
// import statisticalAnalysis from './cms/statistical-analysis';
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      noframe: true,
    },
    component: './pages/login/index.vue',
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
      {
        name: 'learn-statistics',
        path: '/admin/course/learn-statistics/list',
        title: 'routes.learn-statistics',
        component: './pages/cms/statistical-analysis/index.vue',
        meta: {
          module: 'learn-statistics',
          breadcrumb: false,
        },
      },
      ...courseCms,
      ...practiceCms,
      ...career,
    ],
  },
] as IRoute[];
