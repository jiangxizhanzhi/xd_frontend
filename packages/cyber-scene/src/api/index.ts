// @ts-ignore
import { request } from '@cyber/helper';
import PageStatus from '../pages/store/page-status';
import _ from 'lodash';
import {
  getCommonProbes,
  getDynamicsData,
} from '../utils/data-conversion/target-to-element';
import SceneStore from '../store/scene-store';

/**
 * 获取常用靶标列表
 */
export function getShortcutList(data: any) {
  return request.get(`/devops/cluster/target/common-targets`, data, {
    baseURL: '/api/mp',
  });
}

/**
 * 上传图片
 * @param formData 文件流
 */
export function uploadFile(formData: any) {
  return request.post(`/base/file/upload`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 上传场景中的附件
 * 如：其他配置中的附件上传
 */
export function uploadFileAttachment(formData: any) {
  return request.post(`/cscene/file/attachment_upload`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 上传场景中的图标
 */
export function uploadIcon(formData: any) {
  return request.post(`/cscene/file/icon_upload`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 上传场景中的模板截图
 */
export function uploadScreenshot(formData: any) {
  return request.post(
    `/cscene/file/scene_template_screenshot_upload`,
    formData,
    { baseURL: '/api/mp' },
  );
}

/**
 * 上传节点秘钥
 */
export function uploadPrivateKey(formData: any) {
  return request.post(`/cscene/file/private_key_upload`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 下载文件
 */
export function downloadFile(url: string) {
  return request.download(url);
}

/**
 * 获取节点默认图标列表
 */
export function setDefaultIcon() {
  request
    .get(
      `/agg/default-img/get-default-img/`,
      {
        defaultImgDirEnum: 'TARGET',
      },
      {
        baseURL: '/api/mp',
      },
    )
    .then((res: any) => {
      const icon = _.get(res.data, 'data', []);
      PageStatus.setDefaultIcon(icon);
    });
}

/**
 * 获取节点激活数据
 */
export function setMaxNodeCount() {
  request
    .get(`/sys/activation/status`, {}, { baseURL: '/api/mp' })
    .then((res: any) => {
      const items = _.get(res, 'data.data.items', []);
      items?.forEach((item: any) => {
        if (item.key === 'LCS-RES-CR-EDITNODES') {
          PageStatus.setMaxCount(Number(item.value));
        }
      });
    });
}

/**
 * 获取3d模型
 */
export function setModel3DData() {
  request
    .get(`/cpms/u3d_model/index.json`, {}, { baseURL: '' })
    .then((res: any) => {
      PageStatus.setModel3DData(res?.data || []);
    });
}

/**
 * 通用探针
 */
export async function setCommonProbes() {
  if (
    PageStatus.state.showMenu &&
    (_.isEmpty(PageStatus.state.menubar) ||
      PageStatus.state.menubar.includes('probe'))
  ) {
    SceneStore.state.commonProbes = await getCommonProbes();
  }
}

/**
 * 查询dynamic相关的信息
 */
export async function setDynamics() {
  SceneStore.state.dynamicsData = await getDynamicsData();
}

/**
 * 查询靶标对应的探针系统分类(操作系统类型)
 */
export function getProbeSystemType() {
  request
    .get(
      `/system_type_to_agent_support`,
      {},
      { baseURL: '/api/mp/cscene/config' },
    )
    .then((res: any) => {
      PageStatus.setSystemType(res.data.data);
    });
}

export function getSnapShotsByName(image: string) {
  return request.get(
    `/devops/cluster/images/snapshot/by-name/`,
    { name: image },
    { baseURL: '/api/mp' },
  );
}
/**
 * 获取终端节点的默认接入方式
 */
export function getProtocolsDefault(res: any) {
  return request.get(
    `/devops/cluster/images/page/front`,
    { likeName: false, name: res },
    { baseURL: '/api/mp' },
  );
}
/**
 * 获取自定义探针列表
 */
export function getCustomProbes(queryData: any) {
  return request.get(
    '/probes/page/',
    {
      pageSize: 1000,
      types: 1,
      name: queryData.name,
      osTypes: queryData.osTypes,
      probeCategories: queryData.probeCategories,
    },
    { baseURL: '/api/mp' },
  );
}
/**
 * 获取探针采集模板列表
 */
export function getProbesList(queryData: any) {
  return request.get(
    '/collection/template/page/',
    { pageSize: 1000, osTypes: queryData.osTypes, name: queryData.name },
    { baseURL: '/api/mp' },
  );
}
/**
 * 获取探针采集模板详情
 */
export function getProbesTemplateDetail(queryData: any) {
  return request.get(
    `/collection/template/`,
    { id: queryData.id },
    { baseURL: '/api/mp' },
  );
}
/**
 * 根据集合id批量查询流量列表数据
 */
export function getListByCollectionIds(collectionIds: any) {
  return request.get(
    `/flow/info/list_by_collection_ids/`,
    { collectionIds: collectionIds },
    { baseURL: '/api/mp' },
  );
}

/**
 * 查询所有二级分类
 */
export function getTypesL2Categories(formData: any) {
  return request.get(`/devops/cluster/types/l2-categories`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 查询靶标列表
 */
export function getTargetListAll(formData: any) {
  return request.get(`/devops/cluster/target/listAll`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 轮询场景链路状态
 */
export function getLinkStatus(formData: any) {
  return request.get(`/cscene/cscene_instances/link_status/`, formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 查询快照历史，用于获取历史版本的个数
 */
export function getSnapshotHistory(id: string) {
  return request.get(`/devops/cluster/images/${id}/snapshot/list`, undefined, {
    baseURL: '/api/mp',
  });
}

/**
 * 查询实体设备信息，鼠标悬浮数据信息框
 */
export function getRealEquipmentInfo(exactName: string) {
  return request.get(
    `/devops/cluster/real-equipment/page`,
    {
      exactName: exactName,
    },
    {
      baseURL: '/api/mp',
    },
  );
}

/**
 * 查询虚拟usb列表
 */
export function getVirtualUsb(queryData: any) {
  return request.get(`/devops/cluster/virtual_usb/page`, queryData, {
    baseURL: '/api/mp',
  });
}

/**
 * 查询实装usb列表
 */
export function getEntityUsb() {
  return request.get(
    `/devops/cluster/real-equipment/page`,
    { category: 5, second_category: 600, per_page: 1000, name: '' },
    {
      baseURL: '/api/mp',
    },
  );
}

/**
 * 获取靶标的设备类型，用于获取菜单名称
 */
export function getImageCategory() {
  return request.get('/devops/cluster/types/image-mg-categories', undefined, {
    baseURL: '/api/mp',
  });
}

/**
 * SNMP采集 上传mib文件
 */
export function mibImport(formData: any) {
  return request.post('/cscene/file/mib_import', formData, {
    baseURL: '/api/mp',
  });
}

/**
 * 获取mib节点信息
 */
export function mibNodeInfo(data: any) {
  return request.get('/cscene/protocol/collection/mib_nodeinfo', data, {
    baseURL: '/api/mp',
  });
}

/**
 * 获取dynamips节点的端口下拉框选项
 */
export function getDynamicImageInfoOptions(data: any) {
  return request.get('/devops/cluster/images/dynamic_image_info', data, {
    baseURL: '/api/mp',
  });
}

/**
 * 根据层id查询场景实例
 * @param sceneId 场景id
 * @param areaId 层id
 * @param business_id 训练房间id， 团队、单兵的room_id
 * @param role_id	训练角色id
 */
export function getSceneClsTopology(
  sceneId: string,
  areaId: string,
  business_id?: string,
  role_id?: string,
) {
  if (business_id || role_id) {
    return request.get(
      `/cr/scene/get_by_area`,
      {
        scene_id: sceneId,
        area_id: areaId,
        business_id: business_id || undefined,
        role_id: role_id || undefined,
      },
      {
        baseURL: '/api/ojj',
      },
    );
  } else {
    return request.get(
      `/cscene/cscene_instances/get_by_area`,
      { id: sceneId, area_id: areaId },
      {
        baseURL: '/api/mp',
      },
    );
  }
}
/**
 * 获取层级树结构数据
 */
export function setTopologyTreeData(sceneId: string, sceneEid: string) {
  if (sceneEid) {
    request
      .get(
        `/cscene/cscene_instances/tree`,
        { id: sceneEid },
        {
          baseURL: '/api/mp',
        },
      )
      .then((res: any) => {
        PageStatus.setTopologyTreeData(res?.data?.data?.area_list || []);
      });
  } else {
    request
      .get(
        `/cscene/cscenes/tree`,
        { id: sceneId },
        {
          baseURL: '/api/mp',
        },
      )
      .then((res: any) => {
        PageStatus.setTopologyTreeData(res?.data?.data?.area_list || []);
      });
  }
}
/**
 * 场景编辑时，查询层级拓扑
 */
export function getLayerTopologyData(sceneId: string, areaId: string) {
  return request.get(
    `/cscene/cscenes/get_by_area`,
    { id: sceneId, area_id: areaId },
    {
      baseURL: '/api/mp',
    },
  );
}
// 更新区域显示参数，比如位移、缩放值
export function updateArea(params: any) {
  return request.post(`/cscene/cscenes/update_area`, params, {
    baseURL: '/api/mp',
  });
}
/**
 * 更新层级拓扑数据--不校验空节点的场景
 */
export function saveTopologyWithoutCheck(params: any) {
  return request.post(`/cscene/cscenes/sync_with_out_check`, params, {
    baseURL: '/api/mp',
  });
}
/**
 * 更新层级拓扑数据
 */
export function saveTopology(params: any, config: any) {
  return request.post(`/cscene/cscenes/sync`, params, {
    baseURL: '/api/mp',
    ...(config || []),
  });
}
// 更新场景拓扑(模板拖拽)
export function syncWithTemplate(params: any) {
  return request.post(`/cscene/cscenes/sync_with_template`, params, {
    baseURL: '/api/mp',
  });
}
// 获取全量拓扑 TODO
export function getSceneDetail(sceneId: any) {
  return request.get(
    `/topology/detail`,
    { sceneId: sceneId },
    {
      baseURL: '/config/api/v1',
    },
  );
}
// 导入当前场景数据 含多层
export function importSceneData(params: any) {
  return request.post(`/cscene/cscenes/import_template`, params, {
    baseURL: '/api/mp',
  });
}
// 是否可删除连线等的校验
export function deleteCheck(params: any) {
  return request.get(`/cscene/cscenes/delete_check`, params, {
    baseURL: '/api/mp',
  });
}
// 多层拓扑-创建模板
export function createTemplateLayer(params: any, config: any) {
  return request.post(`/cscene/cscenes/create_template`, params, {
    baseURL: '/api/mp',
    ...config,
  });
}
// 单层拓扑-创建模板
export function createTemplateOld(params: any) {
  return request.post(`/cscene/cscenes/sync`, params, {
    baseURL: '/api/mp',
  });
}
// 获取镜像名称 主要用于鼠标悬浮节点展示的信息框
export function getSnapshotByName(params: any) {
  return request.get(`/devops/cluster/images/snapshot/by-name/`, params, {
    baseURL: '/api/mp',
  });
}
// 获取层面包屑数据
export function getLayerTreeData(params: any) {
  return request.get(`/cscene/cscenes/tree`, params, {
    baseURL: '/api/mp',
  });
}
