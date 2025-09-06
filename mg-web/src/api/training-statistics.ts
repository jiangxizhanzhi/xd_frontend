import { request } from '@cyber/helper';

// 单兵训练统计 个人排名TOP5
export function getSinglePersonTop5() {
  return request.get('/cr/admin/single_train_statistics/personal_rank', null, {
    baseURL: '/api/ojj',
  });
}
// 单兵训练统计 组织排名TOP5
export function getSingleOrgTop5() {
  return request.get(
    '/cr/admin/single_train_statistics/organization_rank',
    null,
    {
      baseURL: '/api/ojj',
    },
  );
}

//团队训练统计 个人排名TOP5
export function getTeamPersonTop5() {
  return request.get('cr/admin/team_train_statistics/personal_rank', null, {
    baseURL: '/api/ojj',
  });
}

//团队训练统计 组织排名TOP5
export function getTeamOrgTop5() {
  return request.get('cr/admin/team_train_statistics/organization_rank', null, {
    baseURL: '/api/ojj',
  });
}

//红蓝对抗统计 个人排名TOP5
export function getRedBluePersonTop5() {
  return request.get('/cr/admin/red_vs_blue_statistics/personal_rank', null, {
    baseURL: '/api/ojj',
  });
}

//红蓝对抗统计 组织排名TOP5
export function getRedBlueOrgTop5() {
  return request.get(
    'cr/admin/red_vs_blue_statistics/organization_rank',
    null,
    {
      baseURL: '/api/ojj',
    },
  );
}
