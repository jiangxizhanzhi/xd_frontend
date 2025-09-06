/* 资源中心 */
export const resourceCenterRouter = {
  path: '',
  title: 'routes.recourse-center-folder',
  name: 'recourse-center-folder',
  children: [
    {
      name: 'tool-magazine',
      path: '/tool_magazine',
      title: 'routes.tool-magazine',
      component: './pages/web/ResourceCenter/tool_magazine.vue',
      meta: {
        module: 'tool-magazine',
      },
    },
    {
      name: 'tool-magazine-details',
      path: '/tool_magazine_details/:id',
      title: 'm.toolMagazineDetails',
      meta: {
        breadcrumb: {
          parentName: 'tool-magazine',
        },
        module: 'tool-magazine',
      },
      component: './pages/web/ResourceCenter/tool_magazine_details.vue',
    },
  ],
};
