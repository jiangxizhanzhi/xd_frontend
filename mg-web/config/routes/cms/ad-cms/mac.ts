export default [
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/systemDevOps/mac',
    component: './frame',
    name: 'ad-MAC-manage',
    title: 'MAC地址管理',
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/systemDevOps/macDetail',
    component: './frame',
    name: 'ad-MAC-detail',
    title: 'MAC地址详情',
    meta: {
      breadcrumb: {
        parentName: 'ad-MAC-manage',
      },
    },
  },
];
