import { request } from '@cyber/helper';
export function getPersonalData(data) {
  return request.get('/training-plan/getRoleDetailRes', data, {
    baseURL: '/api/ojj/rtks',
  });
}
// 岗位知识点六棱图统计
export function getKnowRadar() {
  return request.get('/statistic/role/knowledge/radar', null, {
    baseURL: '/api/ojj/rtks',
  });
}
// 知识清单
export function getCourseData(data) {
  return request.get('/training-plan/getRelatedCourseList', data, {
    baseURL: '/api/ojj/rtks',
  });
}

// 岗位课程学习记录折线图
export function getLearnData(data) {
  return request.get('/statistic/role/course/study', data, {
    baseURL: '/api/ojj/rtks',
  });
}
// 岗位课程
export function getPositionCourse(data) {
  return request.get('/course/train/knowledge', data, {
    baseURL: '/api/ojj',
  });
}

// 岗位技能训练记录折线图
export function getSkillLearnData(data) {
  return request.get('/statistic/role/mission/study', data, {
    baseURL: '/api/ojj/rtks',
  });
}
