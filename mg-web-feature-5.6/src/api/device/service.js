import { request } from '@cyber/helper';
const baseURL = '/api/mp';

// 分类
const getServiceCategoriesData = () => {
  return request.get('/devops/cluster/types/service-categories', null, {
    baseURL,
  });
};
const getServiceCategoriesMgData = () => {
  return request.get('/devops/cluster/types/service-mg-categories', null, {
    baseURL,
  });
};
const delServiceData = (data) => {
  return request.delete('/devops/cluster/service', data, {
    baseURL,
  });
};

export { delServiceData, getServiceCategoriesData, getServiceCategoriesMgData };
