export default {
  name: 'practice-folder',
  path: '',
  title: 'practice.practice',
  children: [
    {
      path: '/practice',
      name: 'oj-practice',
      title: 'practice.theoreticalBasis',
      meta: {
        module: 'oj-practice',
      },
      component: './pages/web/practice/theory/index.vue',
    },
    {
      // 新加页面
      path: '/practice/record',
      name: 'oj-practice-record',
      title: '练习记录',
      meta: {
        hideInMenu: true,
        auth: false,
        breadcrumb: {
          parentName: 'oj-practice',
        },
        module: 'oj-practice',
      },
      component: './pages/web/practice/theory/theory-record.vue',
    },
    // 组卷记录-新加页面
    {
      path: '/practice/volume-record',
      name: 'oj-practice-volume-record',
      title: '组卷记录',
      meta: {
        hideInMenu: true,
        auth: false,
        breadcrumb: {
          parentName: 'oj-practice',
        },
        module: 'oj-practice',
      },
      component: './pages/web/practice/theory/volume-record.vue',
    },
    {
      path: '/practice/volume-detail/:id',
      name: 'oj-practice-volume-detail',
      title: '组卷记录详情',
      meta: {
        hideInMenu: true,
        auth: false,
        breadcrumb: {
          parentName: 'oj-practice-volume-record',
        },
        module: 'oj-practice',
      },
      component: './pages/web/practice/theory/volume-detail.vue',
    },
    {
      path: '/practice/volume-exam/:id',
      name: 'oj-practice-volume-exam',
      title: '组卷考试页面',
      meta: {
        hideInMenu: true,
        auth: false,
        breadcrumb: {
          parentName: 'oj-practice',
        },
        module: 'oj-practice',
      },
      component: './pages/web/practice/theory/volume-exam.vue',
    },
    {
      path: '/practice-old',
      name: 'oj-practice-old',
      title: 'practice.theoreticalBasis',
      meta: {
        auth: false,
        module: 'oj-practice',
      },
      component: './pages/web/practice/rationale.vue',
    },
    {
      path: '/practice/capture-flag',
      name: 'oj-practice-capture-flag',
      title: 'practice.practicalOperation',
      meta: {
        module: 'oj-practice-capture-flag',
      },
      component: './pages/web/practice/flag/index.vue',
    },
    {
      path: '/practice/capture-flag-old',
      name: 'oj-practice-capture-flag-old',
      title: 'practice.practicalOperation',
      meta: {
        auth: false,
        module: 'oj-practice',
      },
      component: './pages/web/practice/capture-flag.vue',
    },
    {
      // 新加页面
      path: '/capture-flag/record',
      name: 'oj-practice-capture-flag-record',
      title: '解题记录',
      meta: {
        hideInMenu: true,
        auth: false,
        breadcrumb: {
          parentName: 'oj-practice-capture-flag',
        },
        module: 'oj-practice-capture-flag',
      },
      component: './pages/web/practice/flag/flag-record.vue',
    },
    {
      path: '/practice/rationale/exercise-details/:id',
      name: 'exercise-details',
      title: 'pageTitle.exerciseDetail',
      meta: {
        hideInMenu: true,
        breadcrumb: false,
        // parentName: 'oj-practice',
        module: 'oj-practice',
      },

      component: './pages/web/practice/exercise-details/exercise-detail.vue',
    },
    {
      path: '/practice/capture-flag/exercise-details/:id',
      name: 'exercise-capture-detail',
      title: 'pageTitle.exerciseDetail',
      meta: {
        breadcrumb: {
          parentName: 'oj-practice-capture-flag',
        },
        module: 'oj-practice-capture-flag',
      },

      component:
        './pages/web/practice/exercise-details/exercise-capture-detail.vue',
    },
    {
      path: '/practice/rationale-old/list/:id',
      name: 'rationale',
      title: 'practice.theoreticalBasis',
      component: './pages/web/practice/workbook-old.vue',
      meta: {
        auth: false,
        breadcrumb: {
          parentName: 'practice-folder',
        },
        module: 'oj-practice',
      },
    },
    {
      path: '/practice/rationale/list/:id',
      name: 'rationale',
      title: '理论习题集',
      component: './pages/web/practice/workbook.vue',
      meta: {
        breadcrumb: {
          parentName: 'oj-practice',
        },
        module: 'oj-practice',
      },
    },
    {
      path: '/practice/capture-flag/list/:id',
      name: 'capture-flag',
      title: '实操习题集',
      component: './pages/web/practice/workbook.vue',
      meta: {
        breadcrumb: {
          parentName: 'oj-practice-capture-flag',
        },
        module: 'oj-practice-capture-flag',
      },
    },
    {
      path: '/profile/collection-exercise-details/:id',
      name: 'collection-exercise-details',
      title: 'practice.collectExercisesDetails',
      meta: {
        // breadcrumb: {
        //   parentName: 'practice-folder',
        // },
        hideInMenu: true,
        breadcrumb: false,
        module: 'personal-folder',
      },
      component:
        './pages/web/personal/my-collection/exercise-details/index.vue',
    },
  ],
};
