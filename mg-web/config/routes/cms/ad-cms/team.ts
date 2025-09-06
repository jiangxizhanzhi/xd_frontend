export default [
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/account/team/index',
    component: './frame',
    name: 'ad-team-list',
    title: '战队管理',
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/account/team/addTeam',
    component: './frame',
    name: 'ad-add-team',
    title: '新增战队',
    meta: {
      breadcrumb: {
        parentName: 'ad-team-list',
      },
    },
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/account/team/editTeam',
    component: './frame',
    name: 'ad-edit-team',
    title: '编辑战队',
    meta: {
      breadcrumb: {
        parentName: 'ad-team-list',
      },
    },
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/account/team/teamManage',
    component: './frame',
    name: 'ad-team-manage',
    title: '战队成员管理',
    meta: {
      breadcrumb: {
        parentName: 'ad-team-list',
      },
    },
  },
];
