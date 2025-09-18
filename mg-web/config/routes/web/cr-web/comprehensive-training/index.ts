import single from './single';
import group from './group';
export default [
  {
    path: '',
    name: 'comprehensive-training-folder',
    // title: 'route.comprehensiveTraining',
    title: 'routes.comprehensive-training-folder',
    meta: {
      iconfont: 'icon-honglanduikang',
    },
    children: [...single, ...group],
  },
];
