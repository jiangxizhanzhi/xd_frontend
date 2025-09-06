// 职业框架管理
export default [
  {
    name: 'career-system-folder',
    path: '',
    title: 'routes.career-system-folder',
    meta: {
      iconfont: 'icon-xiangqing',
    },
    children: [
      {
        name: 'career-system',
        path: '/admin/oj/admin/course-mod/career-system/career-list',
        title: 'routes.career-system',
        component: './frame',
        meta: {},
      },
      {
        name: 'career-add',
        path: '/admin/oj/admin/course-mod/career-system/career-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      {
        name: 'career-edit',
        path: '/admin/oj/admin/course-mod/career-system/career-edit',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      //框架管理
      {
        name: 'framework-management-list',
        path: '/admin/oj/admin/course-mod/career-system/framework-management-list',
        title: 'mgRoutes.frameworkManagement',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      {
        name: 'framework-management-add',
        path: '/admin/oj/admin/course-mod/career-system/framework-management-list/framework-management-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'framework-management-list',
          },
        },
      },
      {
        name: 'framework-management-edit',
        path: '/admin/oj/admin/course-mod/career-system/framework-management-list/framework-management-edit/:frameworkId',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'framework-management-list',
          },
        },
      },
      //岗位职责库
      {
        name: 'job-database-list',
        path: '/admin/oj/admin/course-mod/career-system/career-job-database/job-database-list',
        title: 'mgRoutes.jobResponsibilityLibrary',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      {
        name: 'job-database-add',
        path: '/admin/oj/admin/course-mod/career-system/career-job-database/job-database-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'job-database-list',
          },
        },
      },
      {
        name: 'job-database-edit',
        path: '/admin/oj/admin/course-mod/career-system/career-job-database/job-database-edit/:jobId',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'job-database-list',
          },
        },
      },
      // 知识点库
      {
        name: 'knowledge-database-list',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-list',
        title: 'mgRoutes.knowledgeRepository',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      {
        name: 'knowledge-database-add',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
        },
      },
      {
        name: 'knowledge-database-edit',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-edit/:libraryId',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
        },
      },
      // 知识类别
      {
        name: 'knowledge-category-list',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-list',
        title: 'mgRoutes.knowledgeCategory',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
        },
      },
      {
        name: 'knowledge-category-add',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-category-list',
          },
        },
      },
      {
        name: 'knowledge-category-edit',
        path: '/admin/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-edit/:id',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-category-list',
          },
        },
      },
      // 技能库
      {
        name: 'skill-database-list',
        path: '/admin/oj/admin/course-mod/career-system/career-skill-database/skill-database-list',
        title: 'mgRoutes.skillBank',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
        },
      },
      {
        name: 'skill-database-add',
        path: '/admin/oj/admin/course-mod/career-system/career-skill-database/skill-database-add',
        title: 'mgRoutes.add',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'skill-database-list',
          },
        },
      },
      {
        name: 'skill-database-edit',
        path: '/admin/oj/admin/course-mod/career-system/career-skill-database/skill-database-edit/:skillId',
        title: 'mgRoutes.edit',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'skill-database-list',
          },
        },
      },
      // ATT&CK框架
      {
        name: 'att-ck-frame',
        path: '/admin/oj/admin/career/career-att/career-att-list',
        title: 'routes.att-ck-frame',
        component: './frame',
      },
      {
        name: 'att-ck-frame-task',
        path: '/admin/oj/admin/career/career-att/associated-task',
        title: 'mgRoutes.associatedTask',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'att-ck-frame',
          },
        },
      },
      // Engage框架
      {
        name: 'engage-frame',
        path: '/admin/oj/admin/career/career-engage/career-engage-list',
        title: 'routes.engage-frame',
        component: './frame',
      },
      {
        name: 'engage-frame-task',
        path: '/admin/oj/admin/career/career-engage/associated-task',
        title: 'mgRoutes.associatedTask',
        component: './frame',
        meta: {
          breadcrumb: {
            parentName: 'engage-frame',
          },
        },
      },
    ],
  },
];
