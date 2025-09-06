import { request } from '@cyber/helper';

// 录屏/截屏列表
const screenList = (url, data) => {
  return request.get(url, data, {
    baseURL: '/api/mg',
  });
};

// 录屏文件删除
const screenRecordingDelete = (data) => {
  return request.delete('/devops/cluster/screenrecord/batch_delete', data, {
    baseURL: '/api/mp',
  });
};

// 录屏文件按时间删除
const recordShotDelete = (data) => {
  return request.delete('/devops/cluster/screenrecord/time_delete', data, {
    baseURL: '/api/mp',
  });
};

// 截屏文件按时间删除
const screenShotDelete = (data) => {
  return request.delete('/devops/cluster/screenshot/time_delete', data, {
    baseURL: '/api/mp',
  });
};
// 截屏文件批量删除
const clusterScreenShotDelete = (data) => {
  return request.delete('/devops/cluster/screenshot/batch_delete', data, {
    baseURL: '/api/mp',
  });
};

// 录屏文件占用空间
const screenRecordingPercent = () => {
  return request.get('/devops/cluster/screenrecord/used_space', null, {
    baseURL: '/api/mp',
  });
};

// 截屏文件占用空间
const screenShotsPercent = () => {
  return request.get('/devops/cluster/screenshot/used_space', null, {
    baseURL: '/api/mp',
  });
};
// 查询录屏空间上限配置
const searchSpaceLimit = () => {
  return request.get(
    '/devops/cluster/screenrecord/get_restore_limit_config',
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
export {
  screenList,
  screenRecordingDelete,
  screenShotDelete,
  screenRecordingPercent,
  screenShotsPercent,
  clusterScreenShotDelete,
  recordShotDelete,
  searchSpaceLimit,
};
