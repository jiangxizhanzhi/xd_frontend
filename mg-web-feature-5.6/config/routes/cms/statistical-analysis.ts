import learnStatistics from './oj-cms/learn-statistics';
export default [
  {
    name: 'statistical-analysis-folder',
    path: '',
    title: 'routes.statistical-analysis-folder',
    meta: {
      iconfont: 'icon-xinxitongji',
    },
    children: [
      ...learnStatistics,
      // 竞赛统计
      {
        name: 'ct-contest-statistic',
        path: '/admin/ct/admin/dashboard/contest-statistic',
        title: 'routes.ct-contest-statistic',
        component: './frame',
      },
      {
        name: 'individual-training-statistics',
        path: '/admin/single-statistics',
        title: 'routes.individual-training-statistics',
        component:
          './pages/cms/training-statistics/single-train-statistics/index.vue',
        meta: {
          module: 'individual-training-statistics',
        },
      },
      {
        name: 'team-training-statistics',
        path: '/admin/team-statistics',
        title: 'routes.team-training-statistics',
        component:
          './pages/cms/training-statistics/team-train-statistics/index.vue',
        meta: {
          module: 'team-training-statistics',
        },
      },
      {
        name: 'red-vs-blue-statistics',
        path: '/admin/red-blue-statistics',
        title: 'routes.red-vs-blue-statistics',
        component:
          './pages/cms/training-statistics/red-blue-statistics/index.vue',
        meta: {
          module: 'red-vs-blue-statistics',
        },
      },
    ],
  },
];
