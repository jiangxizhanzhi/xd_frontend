import { request } from '@cyber/helper';

// 岗位推荐
const careerRoleList = (data) => {
  return request.get('/rtks/role/list', data, {
    baseURL: '/api/ojj',
  });
};

// 用户的岗位匹配度等数据
const userCareerMessage = () => {
  return request.get('/rtks/training-plan/getRoleDetailRes', null, {
    baseURL: '/api/ojj',
  });
};

// 课程学习-职业关联的课程 & 总进度
const courseOfCareer = () => {
  return request.get('/course/train/knowledge', null, {
    baseURL: '/api/ojj',
  });
};

// 课程学习-课程的课时
const courseLesson = (data) => {
  return request.get('/oj/lessonconfig', data, {
    baseURL: '/api/ojj',
  });
};

// 选择岗位-关联用户
const chooseCareerToRelateUser = (data) => {
  return request.post('/relate/user/role', data, {
    baseURL: '/api/ojj',
  });
};

// 技能练习-职业关联的训练 & 总进度
const trainOfCareer = () => {
  return request.get('/rtks/training-plan/training/path', null, {
    baseURL: '/api/ojj',
  });
};

export {
  careerRoleList,
  userCareerMessage,
  courseOfCareer,
  courseLesson,
  chooseCareerToRelateUser,
  trainOfCareer,
};
