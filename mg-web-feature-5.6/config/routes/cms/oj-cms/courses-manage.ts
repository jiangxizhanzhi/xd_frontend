import courses from './courses';
import coursesCard from './courses-card';
// 课程管理
export default [
  {
    name: 'courses-manage-folder',
    path: '',
    title: 'routes.courses-manage-folder',
    meta: {
      iconfont: 'icon-kechengguanli',
    },
    children: [...courses, ...coursesCard],
  },
];
