// 流量管理
import background from './traffic-background';
import intelligent from './traffic-intelligent';
// 开启流量集合菜单
import scheme from './traffic-scheme';
//
export default [
  {
    name: 'traffic-manage-folder',
    path: '',
    // title: 'mgRoutes.trafficManagement',
    title: 'routes.traffic-manage-folder',
    meta: {
      iconfont: 'icon-liuliangguanli',
    },
    children: [
      ...background,
      ...intelligent,
      ...scheme,
      {
        path: '/admin/cr/admin/traffic/analyse',
        component: './frame',
        name: 'traffic-analyse-list',
        title: 'routes.traffic-analyse',
      },
    ],
  },
];
