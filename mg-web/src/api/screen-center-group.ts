import { request } from '@cyber/helper';
// 训练场景
export const traniningScense = (url: string, room_id: string) => {
  return request.get(`${url}${room_id}`, null, {
    baseURL: '/api/cr/api',
  });
};

//综合演训,训练人数/api/training_team/v/user_list/{room_id}/
export const trainingTeamUser = (room_id: string) => {
  return request.get(`/training_team/v/user_list/${room_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};
//综合演训任务状态 /api/training_team/v/mission_statistics/{room_id}/
export const trainingTeamMission = (room_id: string) => {
  return request.get(`/training_team/v/mission_statistics/${room_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};
//综合演训-学员得分排名 /api/training_team/v/student_ranking/{room_id}/
export const trainingTeamStudentRank = (room_id: string) => {
  return request.get(`/training_team/v/student_ranking/${room_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};
//综合演训技能类别 /api/training_team/v/skill_statistics/{room_id}/
export const trainingTeamSkill = (room_id: string) => {
  return request.get(`/training_team/v/skill_statistics/${room_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};
// 训练人员

export const traniningRole = (url: string, room_id: string) => {
  return request.get(`${url}${room_id}`, null, {
    baseURL: '/api/cr/api',
  });
};

// 训练技能
export const traniningSkill = (url: string, room_id: string) => {
  return request.get(`${url}${room_id}`, null, {
    baseURL: '/api/cr/api',
  });
};

// 训练动态
export const traniningDynamic = (url: string, room_id: string) => {
  return request.get(`${url}${room_id}`, null, {
    baseURL: '/api/cr/api',
  });
};
