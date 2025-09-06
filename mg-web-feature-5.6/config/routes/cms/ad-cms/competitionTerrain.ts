export default [
  {
    path: '',
    name: 'competition-terrain-folder',
    title: '赛事管理',
    meta: {
      iconfont: 'icon-saichangguanli',
    },
    children: [
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/match/index',
        component: './frame',
        name: 'ad-match-list',
        title: '赛场管理',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/match/createNewMatch',
        component: './frame',
        name: 'ad-create-new-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-match-list',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/match/editNewMatch',
        component: './frame',
        name: 'ad-edit-new-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-match-list',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/match/data',
        component: './frame',
        name: 'ad-new-match-data',
        title: '数据分析',
        meta: {
          breadcrumb: {
            parentName: 'ad-match-list',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/match/empower',
        component: './frame',
        name: 'ad-empower-new-match',
        title: '赛场授权',
        meta: {
          breadcrumb: {
            parentName: 'ad-match-list',
          },
        },
      },

      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/index',
        component: './frame',
        name: 'ad-theory-list-match',
        title: '理论赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/createMatch',
        component: './frame',
        name: 'ad-create-theory-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/editMatch/editMatch',
        component: './frame',
        name: 'ad-edit-theory-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/editMatch/importTopic',
        component: './frame',
        name: 'ad-import-topic',
        title: '导入题目',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/scoreManage',
        component: './frame',
        name: 'ad-score-manage',
        title: '理论赛管理',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/inspect',
        component: './frame',
        name: 'ad-inspect',
        title: '检查成绩',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/scoring',
        component: './frame',
        name: 'ad-scoring',
        title: '阅卷',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/theory/fastScoring',
        component: './frame',
        name: 'ad-fastScoring',
        title: '快速阅卷',
        meta: {
          breadcrumb: {
            parentName: 'ad-theory-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/index',
        component: './frame',
        name: 'ad-jeopardy-list-match',
        title: '解题赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/createMatch',
        component: './frame',
        name: 'ad-create-jeopardy-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/editMatch/editMatch',
        component: './frame',
        name: 'ad-edit-jeopardy-match-view',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/editMatch/editTopic',
        component: './frame',
        name: 'ad-edit-jeopardy-match-topic',
        title: '编辑赛题',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/editMatch/addInetnet',
        component: './frame',
        name: 'ad-add-jeopardy-inetnet',
        title: '增加网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/accredit',
        component: './frame',
        name: 'ad-accredit-jeopardy-match',
        title: '授权管理',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/operation/index',
        component: './frame',
        name: 'ad-operation-jeopardy-home',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/operation/editTopic',
        component: './frame',
        name: 'ad-edit-jeopardy-question',
        title: '赛题编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/jeopardy/operation/addTopic',
        component: './frame',
        name: 'ad-add-jeopardy-question',
        title: '新建赛题',
        meta: {
          breadcrumb: {
            parentName: 'ad-jeopardy-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/index',
        component: './frame',
        name: 'ad-defense-list-match',
        title: '攻防赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/createMatch',
        component: './frame',
        name: 'ad-create-defense-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/editMatch/editMatch',
        component: './frame',
        name: 'ad-edit-defense-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/editMatch/editTopic',
        component: './frame',
        name: 'ad-edit-defense-match-topic',
        title: '编辑赛题',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/editMatch/addInetnet',
        component: './frame',
        name: 'ad-add-defense-inetnet',
        title: '增加网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/editMatch/editInetnet',
        component: './frame',
        name: 'ad-edit-defense-inetnet',
        title: '编辑网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/defense/operation',
        component: './frame',
        name: 'ad-operation-defense-match',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-defense-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/index',
        component: './frame',
        name: 'ad-Dev-ops-list-match',
        title: '运维赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/createMatch',
        component: './frame',
        name: 'ad-create-dev-ops-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/createMatch/createMatch',
        component: './frame',
        name: 'ad-edit-dev-ops-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/createMatch/editTopic',
        component: './frame',
        name: 'ad-edit-dev-ops-match-topic',
        title: '编辑赛题',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/createMatch/addInetnet',
        component: './frame',
        name: 'ad-add-dev-ops-inetnet',
        title: '增加网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/createMatch/editInetnet',
        component: './frame',
        name: 'ad-edit-dev-ops-inetnet',
        title: '编辑网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/DevOps/operation',
        component: './frame',
        name: 'ad-operation-dev-ops-match',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-Dev-ops-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/index',
        component: './frame',
        name: 'ad-layered-list-match',
        title: '闯关赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/createMatch',
        component: './frame',
        name: 'ad-create-layered-match',
        title: '新建',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/createMatch/createMatch',
        component: './frame',
        name: 'ad-edit-layered-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/createMatch/editTopic',
        component: './frame',
        name: 'ad-edit-layered-match-topic',
        title: '编辑赛题',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/createMatch/addInetnet',
        component: './frame',
        name: 'ad-add-layered-inetnet',
        title: '增加网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/createMatch/editInetnet',
        component: './frame',
        name: 'ad-edit-layered-inetnet',
        title: '编辑网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/layered/operation/index',
        component: './frame',
        name: 'ad-operation-layered-match',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-layered-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/index',
        component: './frame',
        name: 'ad-rw-list-match',
        title: 'RealWorld',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/createMatch',
        component: './frame',
        name: 'ad-create-rw-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/createMatch/createMatch',
        component: './frame',
        name: 'ad-edit-rw-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/operation/index',
        component: './frame',
        name: 'ad-operation-rw-home',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/operation/editTopic',
        component: './frame',
        name: 'ad-edit-rw-question',
        title: '赛题编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/operation/applyRecord',
        component: './frame',
        name: 'ad-apply-record-team',
        title: '战队申请记录',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/rw/operation/auditRecord',
        component: './frame',
        name: 'ad-apply-record-audit',
        title: '裁判审核记录',
        meta: {
          breadcrumb: {
            parentName: 'ad-rw-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/index',
        component: './frame',
        name: 'ad-penetration-list-match',
        title: '渗透赛',
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/createMatch',
        component: './frame',
        name: 'ad-create-penetration-match',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/createMatch/createMatch',
        component: './frame',
        name: 'ad-edit-penetration-match',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/createMatch/addInetnet',
        component: './frame',
        name: 'ad-add-penetration-inetnet',
        title: '增加网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/createMatch/editInetnet',
        component: './frame',
        name: 'ad-edit-penetration-inetnet',
        title: '编辑网络',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/accredit',
        component: './frame',
        name: 'ad-accredit-penetration-match',
        title: '授权管理',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
      {
        path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/competition/penetration/operation/index',
        component: './frame',
        name: 'ad-operation-penetration-home',
        title: '赛项运维',
        meta: {
          breadcrumb: {
            parentName: 'ad-penetration-list-match',
          },
        },
      },
    ],
  },
];
