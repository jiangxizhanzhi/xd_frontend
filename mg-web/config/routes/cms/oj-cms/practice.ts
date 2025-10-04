import ctOperationQuestion from '../ct-cms/question-bank-mgr/ct-operation-question';
import ctTestPaperBank from '../ct-cms/question-bank-mgr/ct-test-paper-bank';
import ctAdQuestion from '../ct-cms/question-bank-mgr/ct-ad-question';
import ctCfsQuestion from '../ct-cms/question-bank-mgr/ct-cfs-question';
import ctAwdpQuestion from '../ct-cms/question-bank-mgr/ct-awdp-question';
import ctAiQuestion from '../ct-cms/question-bank-mgr/ct-ai-question';
// 练习管理
export default [
  {
    name: 'practices-folder',
    path: '',
    title: 'routes.question-bank-mgr-folder',
    meta: {
      iconfont: 'icon-lianxitiku',
    },
    children: [
      // 习题集管理
      {
        name: 'exercises',
        path: '/admin/oj/admin/exercises/list',
        title: 'routes.exercises',
        component: './frame',
      },
      {
        name: 'add-exercises',
        path: '/admin/oj/admin/exercises/add-exercises',
        title: '新增',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
        },
      },
      {
        name: 'edit-exercises',
        title: '编辑',
        path: '/admin/oj/admin/exercises/:exercisesId/edit-exercises',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
        },
      },
      {
        name: 'exercises-auth',
        path: '/admin/oj/admin/exercises/:exercisesId/auth',
        component: './frame',
        title: 'mgRoutes.authorizedGrant',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
        },
      },
      {
        name: 'exercises-visibility',
        path: '/admin/oj/admin/exercises/:exercisesId/visibility',
        component: './frame',
        title: 'mgRoutes.authorizedAccess',
        meta: {
          breadcrumb: {
            parentName: 'exercises',
          },
        },
      },
      //试卷库
      ...ctTestPaperBank,
      // 理论基础
      {
        name: 'theory-base',
        path: '/admin/oj/admin/exercises/theory-base/list',
        title: 'routes.theory-base',
        component: './frame',
      },
      {
        name: 'add-theory',
        path: '/admin/oj/admin/exercises/theory-base/add-theory',
        title: '新增',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
        },
      },
      {
        name: 'edit-theory',
        path: '/admin/oj/admin/exercises/theory-base/:theoryId/edit-theory',
        title: '编辑',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
        },
      },
      {
        name: 'theory-to-type',
        path: '/admin/oj/admin/exercises/theory-base/to-type',
        title: 'mgRoutes.directionManagement',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'theory-base',
          },
        },
      },
      {
        name: 'theory-add-type',
        title: '新增',
        path: '/admin/oj/admin/exercises/theory-base/to-type/add-type',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'theory-to-type',
          },
        },
      },
      {
        name: 'theory-edit-type',
        title: '编辑',
        path: '/admin/oj/admin/exercises/theory-base/to-type/:typeId/edit-type',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'theory-to-type',
          },
        },
      },
      // 实践操作
      {
        name: 'flags-solve',
        path: '/admin/oj/admin/exercises/flags-solve/list',
        title: 'routes.flags-solve',
        component: './frame',
      },
      {
        name: 'add-flags',
        path: '/admin/oj/admin/exercises/flags-solve/add-flags',
        title: '新增',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
        },
      },
      {
        name: 'edit-flags',
        title: '编辑',
        path: '/admin/oj/admin/exercises/flags-solve/:flagsId/edit-flags',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
        },
      },
      {
        name: 'flags-to-type',
        path: '/admin/oj/admin/exercises/flags-solve/to-type',
        component: './frame',
        title: 'mgRoutes.directionManagement',
        meta: {
          breadcrumb: {
            parentName: 'flags-solve',
          },
        },
      },
      {
        name: 'flags-add-type',
        path: '/admin/oj/admin/exercises/flags-solve/add-type',
        component: './frame',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'flags-to-type',
          },
        },
      },
      {
        name: 'flags-edit-type',
        path: '/admin/oj/admin/exercises/flags-solve/:typeId/edit-type',
        component: './frame',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'flags-to-type',
          },
        },
      },
      //攻防题
      ...ctAdQuestion,
      // 运维题
      ...ctOperationQuestion,
      //渗透题
      ...ctCfsQuestion,
      ...ctAwdpQuestion,
      ...ctAiQuestion,
    ],
  },
];
