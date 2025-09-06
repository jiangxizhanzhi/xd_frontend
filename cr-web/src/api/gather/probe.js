import { request } from '@cyber/helper';

//获取自定义探针类型
export function getProbes() {
  return request.get('/probes/types', null, {
    baseURL: '/api/mp',
  });
}

//获取自定义探针系统分类
export function getProbeSystems() {
  return request.get('probes/os-types', null, {
    baseURL: '/api/mp',
  });
}
