import { request } from '@cyber/helper';
// 红蓝得分,红蓝折线图得分趋势 /api/red_vs_blue/s/team_score_progress
export const teamScoreProgress = (resource_id, role_type) => {
  return request.get(
    `/red_vs_blue/s/team_score_progress/${resource_id}/${role_type}`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
};

// 红蓝任务进度/api/red_vs_blue/s/team_mission_progress/{resource_id}/{role_type}
export const teamMissionProgress = (resource_id, role_type) => {
  return request.get(
    `/red_vs_blue/s/team_mission_progress/${resource_id}/${role_type}`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
};

// 任务状态,饼图任务分类/api/red_vs_blue/s/team_mission_evaluation/{resource_id}/{role_type}}
export const teamMissionEvaluation = (resource_id, role_type) => {
  return request.get(
    `/red_vs_blue/s/team_mission_evaluation/${resource_id}/${role_type}`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
};

// 任务时间轴 /api/red_vs_blue/red_vs_blue_directors/{resource_id}/mission_timeline/
export const redBlueDirectors = (resource_id) => {
  return request.get(
    `/red_vs_blue/red_vs_blue_directors/${resource_id}/mission_timeline`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
};
// 演练动态/api/red_vs_blue/v/training_trends/{resource_id}/
export const trainingTrends = (resource_id, role_type) => {
  return request.get(
    `/red_vs_blue/v/training_trends/${resource_id}/${role_type}`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
};
// 演练动态/api/red_vs_blue/v/training_trends/{resource_id}/
export const trainingTrendsNoType = (resource_id) => {
  return request.get(`/red_vs_blue/v/training_trends/${resource_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};

export function getTime(resource_id: string) {
  return request.get(
    `/red_vs_blue/red_vs_blue_commons/${resource_id}/get_time_management`,
    null,
    {
      baseURL: '/api/cr/api',
    },
  );
}
// 红蓝对抗资产监控
export const trainingAsset = (url: string, resource_id: string) => {
  return request.get(`${url}${resource_id}/`, null, {
    baseURL: '/api/cr/api',
  });
};

interface trafficType {
  per_page: number;
  page: number;
  sceneId: string;
  start_time: string;
  end_time: string;
}
// 红蓝对抗战场流量
export const redBlueTraffic = (url: string, data: trafficType) => {
  return request.get(`${url}`, data, {
    baseURL: '/api/mp',
  });
};
