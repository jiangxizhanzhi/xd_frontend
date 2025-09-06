import {
  sceneNodeRestart,
  sceneNodeRecreate,
  sceneNodeStart,
} from '@/api/scene/scene';

/**
 * 场景节点的重启
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
function nodeRestart(scene_manager_id, node_id) {
  if (_.isEmpty(scene_manager_id)) {
    return;
  }
  sceneNodeRestart(scene_manager_id, node_id).then((res) => {});
}

/**
 * 场景节点的重建
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
function nodeRecreate(scene_manager_id, node_id) {
  if (_.isEmpty(scene_manager_id)) {
    return;
  }
  sceneNodeRecreate(scene_manager_id, node_id).then((res) => {});
}
/**
 * 场景节点的启动
 * @param {*} scene_manager_id 场景的id
 * @param {*} node_id 节点的id
 * @returns
 */
function nodeStart(scene_manager_id, node_id) {
  if (_.isEmpty(scene_manager_id)) {
    return;
  }
  sceneNodeStart(scene_manager_id, node_id).then((res) => {});
}

export { nodeRestart, nodeRecreate, nodeStart };
