import single from './single';
import group from './group';
export default [
  {
    path: '',
    name: 'comprehensive-training-folder',
    // title: 'route.comprehensiveTraining',
    title: 'routes.comprehensive-training-folder',
    children: [...single, ...group],
  },
];
