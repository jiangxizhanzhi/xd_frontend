import { request } from '@cyber/helper';

// 物理资源概览
export function getPhyStatics(data) {
  return request.get('/devops/cluster/xd_source/phy_statics', data, {
    baseURL: '/api/mp',
  });
}

// 虚拟资源统计
export function geVirStatics(data) {
  return request.get('/devops/cluster/xd_source/vir_statics', data, {
    baseURL: '/api/mp',
  });
}

// 物理节点资源占用统计
export function gePhyNodeStatics(data) {
  return request.get('/devops/cluster/xd_source/phy_node_statics', data, {
    baseURL: '/api/mp',
  });
}