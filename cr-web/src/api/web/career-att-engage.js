import { request } from '@cyber/helper';
const baseURL = '/api/ojj';
// 获取att&ck列表
const getAttCkRelatedData = (data) => {
  return request.get('/career/framework/attack/related', data, {
    baseURL,
  });
};
// 获取engage列表
const getEngageRelatedData = (data) => {
  return request.get('/career/framework/engage/related', data, {
    baseURL,
  });
};

export { getAttCkRelatedData, getEngageRelatedData };
