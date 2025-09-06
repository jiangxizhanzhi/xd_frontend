import { request } from '@cyber/helper';

// 删除用户
const deleteUser = (data) => {
  return request.delete('/auth/users/bulk_delete', data, {
    baseURL: '/api/mp',
  });
};
// 禁用、恢复用户
const disableUser = (url, data) => {
  return request.post(url, data, {
    baseURL: '/api/mp',
  });
};
// 导入
const importExcelUser = (data) => {
  return request.post('/auth/users/excel/import', data, {
    baseURL: '/api/mp',
  });
};
// 下载模板
const downloadExcelTemplate = () => {
  return request.get('/auth/users/excel/template', null, {
    baseURL: '/api/mp',
    responseType: 'arraybuffer',
  });
};
// 导出
const exportExcelUser = (data) => {
  return request.post('/auth/users/excel/export', data, {
    baseURL: '/api/mp',
    responseType: 'arraybuffer',
  });
};
// 重置密码
const resetPassword = (data) => {
  return request.post('/auth/users/resetpwd', data, {
    baseURL: '/api/mp',
  });
};
// 新增\编辑用户获取组织
const getOrgData = () => {
  return request.get('/auth/orgs/tree', null, {
    baseURL: '/api/mp',
  });
};
// 新增\编辑用户获取角色
const getRoleData = (data) => {
  return request.get(
    '/auth/roles/all',
    { sort: data },
    {
      baseURL: '/api/mp',
    },
  );
};
// 新增用户
const addEditUser = (url, data) => {
  return request.post(url, data, {
    baseURL: '/api/mp',
  });
};
// 用户默认头像列
const avatarList = () => {
  return request.get('/unauth/avatar/all', null, {
    baseURL: '/api/mp',
  });
};
// 用户头像上传
const avatarUpload = (data) => {
  return request.post('/auth/avatar/upload', data, {
    baseURL: '/api/mp',
  });
};
// 编辑回显用户信息
const echoUserMessage = (id) => {
  return request.get(`/auth/users/${id}`, null, {
    baseURL: '/api/mp',
  });
};
// 获取头像图标
const getDefaultLogo = () => {
  return request.get(
    `/agg/default-img/get-default-img/?defaultImgDirEnum=AVATAR`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
export {
  deleteUser,
  disableUser,
  downloadExcelTemplate,
  importExcelUser,
  exportExcelUser,
  resetPassword,
  getOrgData,
  getRoleData,
  addEditUser,
  avatarList,
  avatarUpload,
  echoUserMessage,
  getDefaultLogo,
};
