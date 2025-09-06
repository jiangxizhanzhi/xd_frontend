export default [
  {
    name: 'system-notice-folder',
    path: '/admin/system-notice',
    title: 'routes.system-notice-folder',
    component: './pages/cms/system-notice/index.vue',
    meta: {
      module: 'system-notice-folder',
    },
  },
  {
    name: 'notice-add',
    path: '/admin/system-notice/add',
    title: 'notice.addNotice',
    component: './pages/cms/system-notice/notice-add.vue',
    meta: {
      breadcrumb: {
        parentName: 'system-notice-folder',
      },
      module: 'system-notice-folder',
    },
  },
  {
    name: 'notice-edit',
    path: '/admin/system-notice/edit',
    title: 'notice.editNotice',
    component: './pages/cms/system-notice/notice-edit.vue',
    meta: {
      breadcrumb: {
        parentName: 'system-notice-folder',
      },
      module: 'system-notice-folder',
    },
  },
];
