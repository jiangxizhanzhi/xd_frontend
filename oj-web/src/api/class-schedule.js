import { request } from '@cyber/helper';
const baseURL = '/api/ojj';

// 获取所有课程表
const getCourseScheduleList = (data) => {
  return request.get('/oj/admin/course/classroom/list', data, {
    baseURL,
  });
};

// 获取课程数据
const getCourseData = () => {
  return request.get('/oj/admin/course/all/course', null, {
    baseURL,
  });
};

// 获取课程对应的课时数据
const getLessonData = (data) => {
  return request.get('/oj/admin/lesson/simple/list', data, {
    baseURL,
  });
};

// 获取用户组织
const getOrgData = () => {
  return request.get('/auth/orgs/tree', null, {
    baseURL: '/api/mp',
  });
};

// 获取训练计划
const getPlanList = () => {
  return request.get('/oj/admin/train/plan/list', null, {
    baseURL: '/api/ojj',
  });
};

// 课程表创建
const addCourse = (data) => {
  return request.post('/oj/admin/course/classroom', data, {
    baseURL: '/api/ojj',
  });
};

// 课程表编辑
const editCurrentCourse = (data) => {
  return request.patch('/oj/admin/course/classroom', data, {
    baseURL: '/api/ojj',
  });
};

// 课程表删除
const deleteCourse = (data) => {
  return request.delete('/oj/admin/course/classroom', data, {
    baseURL: '/api/ojj',
  });
};

// 导入计划
const importExcelPlan = (data, type) => {
  return request.post('/oj/admin/course/classroom/train_plan/import', data, {
    baseURL: '/api/ojj',
    intercept: type === 1 ? true : false,
  });
};

// 导出计划
const exportExcelAllPlan = (_) => {
  return request.get('/oj/admin/course/classroom/train_plan/export', null, {
    baseURL: '/api/ojj',
  });
};

// 批量删除计划
const batchDeletePlan = (data) => {
  return request.delete('/oj/admin/train/plan/delete_batch', data, {
    baseURL: '/api/ojj',
  });
};
// 批量删除任务
const batchDeleteTask = (data) => {
  return request.delete('/oj/admin/course/classroom/delete_batch', data, {
    baseURL: '/api/ojj',
  });
};

// 获取解题思路
const getSolveIdea = (data) => {
  return request.get('/oj/note', data, {
    baseURL: '/api/ojj',
  });
};

// 课堂实验报告导出
const exportExperimentReport = (data) => {
  return request.binaryDownload(
    'get',
    '/oj/admin/course/classroom/report/export',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

export {
  getCourseData,
  getLessonData,
  getOrgData,
  getPlanList,
  addCourse,
  editCurrentCourse,
  deleteCourse,
  getCourseScheduleList,
  importExcelPlan,
  exportExcelAllPlan,
  batchDeletePlan,
  batchDeleteTask,
  getSolveIdea,
  exportExperimentReport,
};
