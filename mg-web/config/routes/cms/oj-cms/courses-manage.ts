import courses from './courses';
import coursesCard from './courses-card';
import learnStatistics from "./learn-statistics";
// 课程管理
export default [
  {
    name: 'courses-manage-folder',
    path: '',
    title: 'routes.courses-manage-folder',
    meta: {
      iconfont: 'icon-kechengguanli',
    },
    children: [...learnStatistics, ...courses, ...coursesCard],
  },
];
