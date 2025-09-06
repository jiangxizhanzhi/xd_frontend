export default [
  {
    path: '',
    name: 'practice-folder',
    title: 'routes.practice-folder',
    children: [
      {
        path: '/oj/practice',
        name: 'oj-practice',
        title: 'routes.oj-practice',
        component: './frame',
        meta: {},
      },
      {
        path: '/oj/practice/capture-flag',
        name: 'oj-practice-capture-flag',
        title: 'routes.oj-practice-capture-flag',
        component: './frame',
        meta: {},
      },
      {
        path: '/oj/practice/rationale/exercise-details/:id',
        name: 'exercise-details',
        title: 'route.problemDetails',
        meta: {
          // breadcrumb: {
          //   parentName: 'oj-practice',
          // },
          hideInMenu: true,
          breadcrumb: false,
        },

        component: './frame',
      },
      {
        path: '/oj/practice/capture-flag/exercise-details/:id',
        name: 'exercise-capture-detail',
        title: 'route.problemDetails',
        meta: {
          hideInMenu: true,
          breadcrumb: false,
          // breadcrumb: {
          //   parentName: 'oj-practice-capture-flag',
          // },
        },

        component: './frame',
      },
      {
        path: '/oj/practice/rationale/list/:id',
        name: 'rationale',
        title: 'route.problemSets',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'oj-practice',
          },
        },
      },
      {
        path: '/oj/practice/capture-flag/list/:id',
        name: 'capture-flag',
        title: 'route.problemSets',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'oj-practice-capture-flag',
          },
        },
      },
      {
        path: '/oj/profile/collection-exercise-details/:id',
        name: 'collection-exercise-details',
        title: 'route.collectSetsDetails',
        meta: {
          // breadcrumb: {
          //   parentName: 'practice-folder',
          // },
          hideInMenu: true,
          breadcrumb: false,
        },
        component: './frame',
      },
      {
        path: '/oj/practice/record',
        name: 'oj-practice-record',
        title: 'route.practiceRecord',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'oj-practice',
          },
        },
        component: './frame',
      },
      {
        path: '/oj/practice/volume-record',
        name: 'oj-practice-volume-record',
        title: 'route.volumeGroupRecord',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'oj-practice',
          },
        },
        component: './frame',
      },
      {
        path: '/oj/practice/volume-detail/:id',
        name: 'oj-practice-volume-detail',
        title: 'route.volumeGroupDetail',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'oj-practice-volume-record',
          },
        },
        component: './frame',
      },
      {
        path: '/oj/practice/volume-exam/:id',
        name: 'oj-practice-volume-exam',
        title: 'route.volumeExam',
        meta: {
          hideInMenu: true,
          breadcrumb: false,
        },
        component: './frame',
      },
      {
        path: '/oj/capture-flag/record',
        name: 'oj-practice-capture-flag-record',
        title: 'route.problemRecord',
        meta: {
          hideInMenu: true,
          breadcrumb: {
            parentName: 'oj-practice-capture-flag',
          },
        },
        component: './frame',
      },
    ],
  },
];
