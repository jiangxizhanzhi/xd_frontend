import { request } from '@cyber/helper';

// 分类
const getDeviceCategory = (data) => {
  return request.get('/devops/cluster/types/categories', data, {
    baseURL: '/api/mp',
  });
};
// 图标
const getDefaultLogos = () => {
  return request.get('/devops/cluster/logo/list', null, {
    baseURL: '/api/mp',
  });
};

// 获取 交换机端口数
const getSwitchTree = () => {
  return request.get('/devops/cluster/types/switch-tree-list', null, {
    baseURL: '/api/mp',
  });
};

// 所有访问类型，如：接入类型
const getAccessType = () => {
  return request.get('/devops/cluster/types/access-type', null, {
    baseURL: '/api/mp',
  });
};

// 新增实装设备
const addRealEquipment = (data) => {
  return request.post('/devops/cluster/real-equipment/add', data, {
    baseURL: '/api/mp',
  });
};

// 删除实装设备
const deleteSelectedData = (data) => {
  return request.delete('/devops/cluster/real-equipment/delete', data, {
    baseURL: '/api/mp',
  });
};

// 编辑回显
const getEditBackData = (id) => {
  return request.get(`devops/cluster/real-equipment/${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 获取登录信息
const getLoginMessage = (data) => {
  return request.get('/devops/cluster/real-equipment/connection', data, {
    baseURL: '/api/mp',
  });
};

// 上传图标
const uploadLogo = (data) => {
  return request.post('/devops/cluster/target/upload/icon', data, {
    baseURL: '/api/mp',
  });
};

// 编辑
const editRealEquipment = (data) => {
  return request.put('/devops/cluster/real-equipment/update', data, {
    baseURL: '/api/mp',
  });
};

// 获取串口配置
const getPortList = () => {
  return request.get('/devops/cluster/types/serial-port-list', null, {
    baseURL: '/api/mp',
  });
};

// 获取服务器节点配置
const getServerNodeList = () => {
  return request.get(
    '/devops/cluster/real-equipment/hypervisor_list',
    undefined,
    {
      baseURL: '/api/mp',
    },
  );
};

// 根据hostName查询usb列表
const getUSBListByHostname = (params) => {
  return request.get('/devops/cluster/real-equipment/usb_list', params, {
    baseURL: '/api/mp',
  });
};

// 获取登录跳转链接
const getLoginConnection = (data) => {
  return request.get('/devops/cluster/real-equipment/get_connection', data, {
    baseURL: '/api/mp',
  });
};

export {
  getDeviceCategory,
  getDefaultLogos,
  getSwitchTree,
  getAccessType,
  addRealEquipment,
  deleteSelectedData,
  getEditBackData,
  getLoginMessage,
  uploadLogo,
  editRealEquipment,
  getPortList,
  getServerNodeList,
  getUSBListByHostname,
  getLoginConnection,
};
