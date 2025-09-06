import { request as request1 } from '@cyber/helper';

//导演任务下发
export function deliveryStatus(url, data) {
  return request1.post('/cr/director/red_vs_blue/red_vs_blue/missions', data, {
    baseURL: '/api/ojj',
  });
}
//提交演习文书
export function exercisePaper(url, data) {
  return request1.post(
    '/cr/director/red_vs_blue/red_vs_blue/add_exercise_paper',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 获取演习文书

export function getExercisePaper(url, query) {
  return request1.get(
    '/cr/director/red_vs_blue/red_vs_blue/get_exercise_paper',
    query,
    {
      baseURL: '/api/ojj',
    },
  );
}

// 任务删除

export function deleteMission(url, data) {
  return request1.post(
    '/cr/director/red_vs_blue/red_vs_blue/mission_delete',
    data,
    { baseURL: '/api/ojj' },
  );
}

// 导演编辑任务

export function updateMission(url, data) {
  return request1.put('/cr/admin/mission/mission_update', data, {
    baseURL: '/api/ojj',
  });
}

// 是否开放题解
export function isWriteUp(url, data) {
  return request1.post(
    '/cr/director/red_vs_blue/red_vs_blue/update_show_write_up',
    data,
    { baseURL: '/api/ojj' },
  );
}

//查询红蓝对抗导演时间线
export function timeLine(url, data) {
  return request1.get(
    '/cr/director/red_vs_blue/red_vs_blue/mission_timeline',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

// 获取任务分类
export function fetchCategoryList(data) {
  return request1.get('/cr/admin/mission/missions/get_category/', data, {
    baseURL: '/api/ojj',
  });
}

// 任务md上传
export function uploadMissionMd(data) {
  return request1.post('/cr/admin/mission/parse/md/', data, {
    baseURL: '/api/ojj',
  });
}
