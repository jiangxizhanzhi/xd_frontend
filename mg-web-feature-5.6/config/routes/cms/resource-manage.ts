import tool from './cr-cms/tool';
// import vulnerability from './cr-cms/vulnerability';
import vulnCms from './ct-cms/vuln-cms';
// 资源管理
export default [
  {
    name: 'resource-manage-folder',
    path: '',
    // title: 'mgRoutes.resourceManagement',
    title: 'routes.resource-manage-folder',
    meta: {
      iconfont: 'icon-ziyuanguanli',
    },
    children: [...tool, ...vulnCms],
  },
];
