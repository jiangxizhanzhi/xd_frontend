//测评管理
import assessmentAlgorithm from './assessment-algorithm';
import assessmentIndicators from './assessment-indicators';
import assessmentModel from './assessment-model';
export default [
  {
    name: 'assessment-system',
    path: '',
    title: 'routes.assessment-system',
    meta: {
      iconfont: 'icon-cepingguanli',
    },
    children: [
      ...assessmentAlgorithm,
      ...assessmentModel,
      ...assessmentIndicators,
    ],
  },
];
