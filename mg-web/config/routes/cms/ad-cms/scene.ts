export default [
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/scene/scene/index',
    component: './frame',
    name: 'ad-scene-list',
    title: '渗透场景编排',
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/scene/scene/createScene',
    component: './frame',
    name: 'ad-create-scene',
    title: '新增渗透场景',
    meta: {
      breadcrumb: {
        parentName: 'ad-scene-list',
      },
    },
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/scene/scene/editScene',
    component: './frame',
    name: 'ad-edit-scene',
    title: '编辑渗透场景',
    meta: {
      breadcrumb: {
        parentName: 'ad-scene-list',
      },
    },
  },
  {
    path: '/admin/ad/admin/poiuqad1231AWDPQJAWe813aqembQWECKAN123/scene/scene/empower',
    component: './frame',
    name: 'ad-scene-empower',
    title: '渗透场景授权',
    meta: {
      breadcrumb: {
        parentName: 'ad-scene-list',
      },
    },
  },
];
