import { request } from '@cyber/helper';

const getTreeData = (url) => {
  return request.get(url, null, {
    baseURL: '/api/mp',
  });
};

const addTreeNode = (data) => {
  return request.post('/auth/orgs', data, {
    baseURL: '/api/mp',
  });
};

const editTreeNode = (id, data) => {
  return request.patch(`/auth/orgs/${id}`, data, {
    baseURL: '/api/mp',
  });
};

const deleteTreeNode = (id) => {
  return request.delete(`/auth/orgs/${id}`, null, {
    baseURL: '/api/mp',
  });
};

export { getTreeData, addTreeNode, editTreeNode, deleteTreeNode };
