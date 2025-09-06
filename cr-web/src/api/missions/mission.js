import { request } from '@cyber/helper';

// 获取分类列表

// 获取任务类型分类
export function fetchCategoryList(data) {
  return request.get('/cr/admin/mission/missions/get_category/', data, {
    baseURL: '/api/ojj',
  });
}

// 选择任务方案点击确认
export function getACombatTech(url, query) {
  return request.get('/cr/admin/mission/combat_techs/', query, {
    baseURL: '/api/ojj',
  });
}

// 获取雷达标签
export function getRadarLabels() {
  return request.get('/cr/admin/mission/missions/radar_labels/', null, {
    baseURL: '/api/ojj',
  });
}

// 任务md上传
export function uploadMissionMd(data) {
  return request.post('/cr/admin/mission/parse/md/', data, {
    baseURL: '/api/ojj',
  });
}
