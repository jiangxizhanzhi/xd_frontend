import courses from './courses';
import coursesCard from './courses-card';
import learnStatistics from "./learn-statistics";
// 实验管理
import { experimentalManageRouter } from '../../web/cr-web/experimental-management/index';
// 科目管理
import { subjectManageRouter } from '../../web/cr-web/subject-management/index';
// 单兵训练
import single from '../../web/cr-web/comprehensive-training/single';
// 课程管理
export default [
  {
    name: 'courses-manage-folder',
    path: '',
    title: 'routes.courses-manage-folder',
    meta: {
      iconfont: 'icon-kechengguanli',
    },
    children: [
      // ...learnStatistics,
      ...courses,
      ...coursesCard,
      experimentalManageRouter,
      subjectManageRouter,
      ...single,
    ],
  },
];
