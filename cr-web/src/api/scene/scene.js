import { request as cyRequest } from '@cyber/helper';

/**
 * 场景节点的重启
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
export function sceneNodeRestart(scene_manager_id, node_id) {
  return cyRequest.post(
    'admin/ceBase/crEvents/testScene/node/restart',
    {
      node_id: node_id,
      resource_id: scene_manager_id,
    },
    { baseURL: '/api/ojj' },
  );
}

/**
 * 场景节点的重建
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
export function sceneNodeRecreate(scene_manager_id, node_id) {
  return cyRequest.post(
    '/admin/ceBase/crEvents/testScene/node/recreate',
    {
      node_id: node_id,
      resource_id: scene_manager_id,
    },
    { baseURL: '/api/ojj' },
  );
}

/**
 * 场景节点的启动
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
export function sceneNodeStart(scene_manager_id, node_id) {
  return cyRequest.post(
    '/admin/ceBase/crEvents/node/create',
    {
      node_id: node_id,
      resource_id: scene_manager_id,
    },
    { baseURL: '/api/ojj' },
  );
}

// 保存快照
export function saveSnapshot(data) {
  return cyRequest.post('cs/scene/node/snapshot', data, {
    baseURL: '/api/ojj',
  });
}

// 获取快照历史
export function getSnapshot(data) {
  return cyRequest.get('/cs/scene/node/snapshot', data, {
    baseURL: '/api/ojj',
  });
}

// 获取所有快照信息，包括原始节点
export function getAllSnapshot(data) {
  return cyRequest.get('/devops/cluster/images/snapshot/by-name', data, {
    baseURL: '/api/mp',
  });
}

// 删除快照
export function deleteshot(data) {
  return cyRequest.delete('/cs/scene/node/snapshot', data, {
    baseURL: '/api/ojj',
  });
}
// 动态更新场景
export function updateTopologyDynamic(data) {
  return cyRequest.put('/cr/scene/update/dynamic', data, {
    baseURL: '/api/ojj',
  });
}
// 动态更新节点属性
export function updateNodeDynamic(data) {
  return cyRequest.post('/cs/scene/node/update', data, {
    baseURL: '/api/ojj',
  });
}
// 动态删除节点
export function deleteNodeDynamic(data) {
  return cyRequest.delete('/cr/scene/node/delete', data, {
    baseURL: '/api/ojj',
  });
}
