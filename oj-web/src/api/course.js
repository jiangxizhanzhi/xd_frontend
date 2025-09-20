import { request } from '@cyber/helper';

// 视频播放检查点上报
const videoCheckpointReport = (data) => {
  return request.post('/cs/video/check/report', data, {
    baseURL: '/api/ojj',
    intercept: true,
  });
};

// 开启直播，获取推送直播链接
const postPublishUrl = (data) => {
  return request.post('/cs/video/rtc/publish', data, {
    baseURL: '/api/ojj',
    intercept: true,
  });
};
// 观看直播，获取直播链接
const getPublishUrl = (data) => {
  return request.post('/cs/video/rtc/play', data, {
    baseURL: '/api/ojj',
    intercept: true,
  });
};

// 课程训练-课程方向分类
const courseDirection = () => {
  return request.get('/oj/course/direction', null, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-课程难度分类
const courseDifficulty = (data) => {
  return request.get('/cr/common/constants_config', data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-课程列表
const courseList = (data) => {
  return request.get(`/oj/course/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-自学课程-学习进度&最近在学
const learnProgress = () => {
  return request.get(`/oj/course/statistics`, null, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-教学课程-我的课表
const roomCourseList = (data) => {
  return request.get(`/oj/course/class/room/course/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-教学课程-我的课后练习
const roomPracticeList = (data) => {
  return request.get(`/oj/course/class/room/practice/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-教学课程-我的实验报告
const roomReportList = (data) => {
  return request.get(`/oj/course/class/room/report/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-教学课程-我的学习
const mineStudyPlanList = (data) => {
  return request.get(`/oj/train/plan/list/page`, data, {
    baseURL: '/api/ojj',
  });
};

// 课程训练-教学课程-我的课表签到
const mineStudySign = (data) => {
  return request.post(`/oj/course/class/room/sign_in`, data, {
    baseURL: '/api/ojj',
  });
};

const monthDateMark = (data) => {
  return request.get(`/oj/course/class/room/calendar`, data, {
    baseURL: '/api/ojj',
  });
};
const getCourseList = (data) => {
  return request.get(`/oj/course/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 通用常量
const getConstantsConfig = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};
// 课程详情 （对应课程详情页面的左半部分）
const getCourseDetailData = (data) => {
  return request.get(`/oj/course`, data, {
    baseURL: '/api/ojj',
  });
};
// 课程详情 （对应课程详情页面的右半部分）
const getStudyProfileData = (data) => {
  return request.get(`/oj/course/single/statistics`, data, {
    baseURL: '/api/ojj',
  });
};


// 实时监控数据
const getRealTimeMonitoringDataApi = (data) => {
  return request.get(`/cr/training_team/training_team_teacher/score/list`, data, {
    baseURL: '/api/ojj',
  });
};

export {
  getStudyProfileData,
  getCourseDetailData,
  getConstantsConfig,
  getCourseList,
  videoCheckpointReport,
  postPublishUrl,
  getPublishUrl,
  courseDirection,
  courseDifficulty,
  courseList,
  learnProgress,
  roomCourseList,
  roomPracticeList,
  roomReportList,
  mineStudyPlanList,
  mineStudySign,
  monthDateMark,
  getRealTimeMonitoringDataApi,
};
