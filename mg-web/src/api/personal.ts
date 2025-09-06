import { request } from '@cyber/helper';

//w我的学习记录
// 获取个人训练统计数据
export function getTask(data) {
  return request.get(
    '/oj/admin/course/personal-stats/person-stats-detail/course',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 我的错题
export function getMyMistake(data) {
  return request.get('/oj/person/mistake', data, {
    baseURL: '/api/ojj',
  });
}
//获取各种类型--公共方法
export function getComConstantsConfig(data) {
  return request.get('/cr/common/constants_config', data, {
    baseURL: '/api/ojj',
  });
}
// 批量移除错题
export function deleteBatchMistake(data) {
  return request.delete('/oj/person/mistake', data, {
    baseURL: '/api/ojj',
  });
}

// 我的提问
export function getMyQsuestion(data) {
  return request.get('/oj/person/comments', data, {
    baseURL: '/api/ojj',
  });
}

// 我的回复
export function getMyReply(data) {
  return request.get('/oj/person/replies', data, {
    baseURL: '/api/ojj',
  });
}
// 我的笔记
export function getMyNotes(data) {
  return request.get('/oj/person/notes/', data, {
    baseURL: '/api/ojj',
  });
}

// 他人笔记--暂时没有这个
export function getOtherNotes(data) {
  return request.get('/note/notes/get_shared_note_list/', data, {
    baseURL: '/api/oj/api',
  });
}

// 我的收藏
export function getMyCollection(data) {
  return request.get('/oj/person/collections/', data, {
    baseURL: '/api/ojj',
  });
}

// 公告消息列表
export function getBulletin(data) {
  return request.get('/sys/notice/currentuser/page', data, {
    baseURL: '/api/mp',
  });
}

// 学习记录
export function getStudyRecord(data) {
  return request.get('/oj/person/study_period_records/', data, {
    baseURL: '/api/ojj',
  });
}

// 历史课程--暂时没有这个
// export function getHistoryCourse() {
//   return request.get(
//     '/person/get_history_courses/',
//     {},
//     {
//       baseURL: '/api/oj/api',
//     },
//   );
// }

// 修改职业目标模块-获取数据信息 暂时没有这个
// export function getGoalsVisDatas() {
//   return request.get(
//     '/occupation/occupation_systems/',
//     {},
//     {
//       baseURL: '/api/oj/api',
//     },
//   );
// }

// 公告消息列表-当前用户
export function getMyBulletin(data) {
  return request.get('/sys/notice/currentuser/page', data, {
    baseURL: '/api/mp',
  });
}

// 获取个人信息
export function getPersonalDataInfo() {
  return request.get('/auth/users/current', null, {
    baseURL: '/api/mp',
  });
}
// 修改个人信息
export function postPersonalData(data) {
  return request.post('/auth/users/modify', data, {
    baseURL: '/api/mp',
  });
}
// 上传头像
export function uploadImgage(data) {
  return request.post('/auth/avatar/upload', data, {
    baseURL: '/api/mp',
  });
}

// 获取课程计划
export function getDayPlanData(data) {
  return request.get('/oj/course/class/room/list/', data, {
    baseURL: '/api/ojj',
  });
}

// 我的资源
export function getMyResource() {
  return request.get('/agg/dashboard/user_resource', null, {
    baseURL: '/api/mp',
  });
}
// 课程跳转签到接口
export function addSign(data) {
  return request.post('/oj/course/class/room/sign_in/', data, {
    baseURL: '/api/ojj',
  });
}

// 学习训练学习记录
export function getViewStudy(data) {
  return request.get(
    '/oj/person/study_records',
    {},
    {
      baseURL: '/api/ojj',
    },
  );
}

// 岗位学习进度
export function getStudyProcess(data) {
  return request.get(
    '/rtks/statistic/role/knowledge/study_record/',
    {},
    {
      baseURL: '/api/ojj',
    },
  );
}

// 知识点完成进度折线图
export function getProcesLine(data) {
  return request.get(
    '/rtks/statistic/role/knowledge/percent',
    {},
    {
      baseURL: '/api/ojj',
    },
  );
}

// 岗位知识点雷达图
export function getJobRadar(data) {
  return request.get(
    '/rtks/statistic/role/knowledge/radar',
    {},
    {
      baseURL: '/api/ojj',
    },
  );
}
// 获取所有岗位
export function frameTree(data) {
  return request.get('/rtks/training-plan/tree/', data, {
    baseURL: '/api/ojj',
  });
}

// 更换岗位
export function postRole(data) {
  return request.post('/relate/user/role', data, {
    baseURL: '/api/ojj',
  });
}

// 获取职业技能树
export function getMindData(data) {
  return request.get('/rtks/training-plan/learning-path', data, {
    baseURL: '/api/ojj',
  });
}

// 获取学习路径
export function getLearnPath(data) {
  return request.get('/rtks/training-plan/getKnowledgeCourseList', data, {
    baseURL: '/api/ojj',
  });
}

// 获取个人训练统计数据
export function getTraining(data) {
  return request.get('/cr/common/training_statistics/', data, {
    baseURL: '/api/ojj',
  });
}

// 获取默认logo
export function defaultLogo() {
  return request.get(
    `/agg/default-img/get-sys-logo-img/`,
    { defaultImgDirEnum: 'SYS_LOGO' },
    {
      baseURL: '/api/mp',
    },
  );
}
