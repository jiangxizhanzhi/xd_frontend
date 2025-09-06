import { request } from '@cyber/helper';

// 删除角色
const deleteRole = (data) => {
  return request.delete('/auth/roles/bulk_delete', data, {
    baseURL: '/api/mp',
  });
};

// 获取权限
const permissonList = () => {
  return request.get('/auth/targets/tree', null, {
    baseURL: '/api/mp',
  });
};

// 新增/编辑角色
const addEditRole = (url, data) => {
  return request.post(url, data, {
    baseURL: '/api/mp',
  });
};

// 编辑回显
const editBack = (id) => {
  return request.get(`/auth/roles/${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 角色添加用户
const roleAddUser = (data) => {
  return request.post('/auth/user_roles/bind/roleUsers', data, {
    baseURL: '/api/mp',
  });
};

// 删除角色的关联用户
const deleteRoleUser = (data) => {
  return request.post('/auth/user_roles/delete/byRoleUsers', data, {
    baseURL: '/api/mp',
  });
};
// 获取所有角色
const roleList = (data) => {
  return request.get('/auth/roles/page', data, {
    baseURL: '/api/mp',
  });
};
// 获取所有菜单
const menuList = (data) => {
  return request.get('/sys/admin/menu/tree', data, {
    baseURL: '/api/mp',
  });
};
// 导入文件
const importTemplate = (data) => {
  return request.post('/sys/admin/menu/import_template', data, {
    baseURL: '/api/mp',
  });
};
// 保存模板
const addTemplate = (data) => {
  return request.post('/sys/admin/menu/add_template', data, {
    baseURL: '/api/mp',
  });
};
// 刷新模板应用到系统
const defaultTemplate = (data) => {
  return request.post('/sys/admin/menu/reset_default_menu_template', data, {
    baseURL: '/api/mp',
  });
};
// 查询当前用户菜单
const currentMenu = () => {
  return request.get('/auth/targets/current_user/tree', null, {
    baseURL: '/api/mp',
  });
};
export {
  deleteRole,
  permissonList,
  addEditRole,
  editBack,
  roleAddUser,
  deleteRoleUser,
  roleList,
  menuList,
  importTemplate,
  addTemplate,
  defaultTemplate,
  currentMenu,
};
