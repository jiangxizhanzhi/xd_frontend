import { request } from '@cyber/helper';

// 多维度运营
export function getPhyStatics(data) {
  return request.get('/devops/cluster/xd_source/phy_statics', data, {
    baseURL: '/api/mp',
  });
}