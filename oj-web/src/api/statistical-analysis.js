import { request } from '@cyber/helper';
const baseURL = '/api/ojj';

// 训练场次统计
export function getXdTeamTimesApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_team_times`, data, {
    baseURL,
  });
}

// 训练人数趋势
export function getXdTeamPersonNumApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_team_person_num`, data, {
    baseURL,
  });
}

// 训练总分top5
export function getXdTeamScoreAllApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_person_score`, data, {
    baseURL,
  });
}

// 实验总分top5
export function getXdTeamScoreSyApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_person_score_sy`, data, {
    baseURL,
  });
}

// 科目总分top5
export function getXdTeamScoreKmApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_person_score_km`, data, {
    baseURL,
  });
}

// 综合演训总分top5
export function getXdTeamScoreZhyxApi(data) {
  return request.get(`/cr/admin/xd_statistics/xd_person_score_zhyx`, data, {
    baseURL,
  });
}

// 实验统计
export function getXdOutInterfaceApi(data) {
  return request.get(`/cr/out_interface/team_train_list`, data, {
    baseURL,
  });
}

// 训练学员统计
export function getXdStatisticsDetailApi(data) {
  return request.get(`/cr/admin/xd_statistics/detail`, data, {
    baseURL,
  });
}

// 获取训练报告
export function trainReportApi(data) {
  return request.get('/cr/team_train/room/mission/getTrainReports/', data, {
    baseURL: '/api/ojj',
  });
};