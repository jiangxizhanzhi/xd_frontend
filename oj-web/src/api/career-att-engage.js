import { request } from '@cyber/helper';
const baseURL = '/api/ojj';
// 获取att&ck列表
const getAttCkList = () => {
  return request.get('/career/framework/attack/all', null, {
    baseURL,
  });
};
// 获取ics列表
const getAttCkIcs = () => {
  return request.get('/career/framework/attack_ics/all', null, {
    baseURL,
  });
};
// 获取att&ck子技术详情列表
const getAttCkDetailList = (data) => {
  return request.get('/career/framework/attack', data, {
    baseURL,
  });
};
// 获取ics子技术详情列表
const getAttCkIcsDetailList = (data) => {
  return request.get('/career/framework/attack_ics', data, {
    baseURL,
  });
};

// att&ck关联场景
const postAttCkDetailList = (data) => {
  return request.post('/career/framework/attack', data, {
    baseURL,
  });
};

// ics关联场景
const postAttCkIcsDetailList = (data) => {
  return request.post('/career/framework/attack_ics', data, {
    baseURL,
  });
};

// 获取engage列表
const getEngageList = () => {
  return request.get('/career/framework/engage/all', null, {
    baseURL,
  });
};

// 获取engage子技术详情列表
const getEngageDetailList = (data) => {
  return request.get('/career/framework/engage', data, {
    baseURL,
  });
};

// engage关联场景
const postEngageDetailList = (data) => {
  return request.post('/career/framework/engage', data, {
    baseURL,
  });
};

export {
  getAttCkList,
  getAttCkIcs,
  getAttCkDetailList,
  getAttCkIcsDetailList,
  postAttCkDetailList,
  postAttCkIcsDetailList,
  getEngageList,
  getEngageDetailList,
  postEngageDetailList,
};
