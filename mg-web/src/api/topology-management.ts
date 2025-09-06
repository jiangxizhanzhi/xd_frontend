import { request } from '@cyber/helper';

// 批量删除场景数据
export function deleteSceneModel(data) {
  return request.delete('/cscene/cscenes/bulk_delete', data, {
    baseURL: '/api/mp',
  });
}

// 新增拓扑模板
export function createTopology(data) {
  return request.post('/cscene/cscenes/sync', data, {
    baseURL: '/api/mp',
  });
}

// 上传场景模板logo截图
export function uploadLogo(data) {
  return request.post('/cscene/file/scene_template_screenshot_upload', data, {
    baseURL: '/api/mp',
  });
}

// 获取场景模板数据详情
export function getTopologyDetail(data) {
  return request.get(`/cscene/cscenes`, data, {
    baseURL: '/api/mp',
  });
}
