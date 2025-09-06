export default [
  {
    name: 'career-system-folder',
    path: '',
    title: '职业框架',
    children: [
      // NCWF框架
      {
        name: 'career-system',
        path: '/admin/course-mod/career-system/career-list',
        // title: 'careerSystem.careerSystemTitle',
        title: 'NCWF框架',
        component: './pages/cms/course-mod/career-system/career-list/index.vue',
        meta: {
          module: 'career-system',
        },
      },
      {
        name: 'career-add',
        path: '/admin/course-mod/career-system/career-add',
        title: 'careerSystem.careerSystemAdd',
        component: './pages/cms/course-mod/career-system/career-add/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
          module: 'career-system',
        },
      },
      {
        name: 'career-edit',
        path: '/admin/course-mod/career-system/career-edit',
        title: 'careerSystem.careerSystemEdit',
        component: './pages/cms/course-mod/career-system/career-edit/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
          module: 'career-system',
        },
      },
      //岗位职责库
      {
        name: 'job-database-list',
        path: '/admin/course-mod/career-system/career-job-database/job-database-list',
        title: 'careerSystem.jobResponsibilityLibrary',
        component:
          './pages/cms/course-mod/career-system/career-job-database/job-database-list/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
          module: 'career-system',
        },
      },
      {
        name: 'job-database-add',
        path: '/admin/course-mod/career-system/career-job-database/job-database-add',
        title: 'm.add',
        component:
          './pages/cms/course-mod/career-system/career-job-database/job-database-add/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'job-database-list',
          },
          module: 'career-system',
        },
      },
      {
        name: 'job-database-edit',
        path: '/admin/course-mod/career-system/career-job-database/job-database-edit/:jobId',
        title: 'm.edit',
        component:
          './pages/cms/course-mod/career-system/career-job-database/job-database-edit/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'job-database-list',
          },
          module: 'career-system',
        },
      },
      // 知识点库
      {
        name: 'knowledge-database-list',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-database-list',
        title: 'careerSystem.knowledgeLibrary',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-database-list/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
          module: 'career-system',
        },
      },
      {
        name: 'knowledge-database-add',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-database-add',
        title: 'm.add',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-database-add/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
          module: 'career-system',
        },
      },
      {
        name: 'knowledge-database-edit',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-database-edit/:libraryId',
        title: 'm.edit',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-database-edit/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
          module: 'career-system',
        },
      },
      // 知识类别
      {
        name: 'knowledge-category-list',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-list',
        title: 'careerSystem.knowledgeCategory',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-list/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-database-list',
          },
          module: 'career-system',
        },
      },
      {
        name: 'knowledge-category-add',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-add',
        title: 'm.add',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-add/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-category-list',
          },
          module: 'career-system',
        },
      },
      {
        name: 'knowledge-category-edit',
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-edit/:id',
        title: 'm.edit',
        component:
          './pages/cms/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-edit/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'knowledge-category-list',
          },
          module: 'career-system',
        },
      },
      // 技能库
      {
        name: 'skill-database-list',
        path: '/admin/course-mod/career-system/career-skill-database/skill-database-list',
        title: 'careerSystem.skillLibrary',
        component:
          './pages/cms/course-mod/career-system/career-skill-database/skill-database-list/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'career-system',
          },
          module: 'career-system',
        },
      },
      {
        name: 'skill-database-add',
        path: '/admin/course-mod/career-system/career-skill-database/skill-database-add',
        title: 'm.add',
        component:
          './pages/cms/course-mod/career-system/career-skill-database/skill-database-add/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'skill-database-list',
          },
          module: 'career-system',
        },
      },
      {
        name: 'skill-database-edit',
        path: '/admin/course-mod/career-system/career-skill-database/skill-database-edit/:libraryId',
        title: 'm.edit',
        component:
          './pages/cms/course-mod/career-system/career-skill-database/skill-database-edit/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'skill-database-list',
          },
          module: 'career-system',
        },
      },

      // ATT&CK框架
      {
        name: 'att-ck-frame',
        path: '/admin/career/career-att/career-att-list',
        // title: 'careerSystem.careerSystemTitle',
        title: 'ATT-CK框架',
        component: './pages/cms/career/career-att/career-att-list/index.vue',
        meta: {
          module: 'att-ck-frame',
        },
      },
      {
        name: 'att-ck-frame-task',
        path: '/admin/career/career-att/associated-task',
        title: '关联任务',
        component: './pages/cms/career/components/associated-task/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'att-ck-frame',
          },
          module: 'att-ck-frame',
        },
      },
      // Engage框架
      {
        name: 'engage-frame',
        path: '/admin/career/career-engage/career-engage-list',
        // title: 'careerSystem.careerSystemTitle',
        title: 'Engage框架',
        component:
          './pages/cms/career/career-engage/career-engage-list/index.vue',
        meta: {
          module: 'engage-frame',
        },
      },
      {
        name: 'engage-frame-task',
        path: '/admin/career/career-engage/associated-task',
        title: '关联任务',
        component: './pages/cms/career/components/associated-task/index.vue',
        meta: {
          breadcrumb: {
            parentName: 'engage-frame',
          },
          module: 'engage-frame',
        },
      },
    ],
  },
];
