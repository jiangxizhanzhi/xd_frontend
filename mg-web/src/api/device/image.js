import { request } from '@cyber/helper';

// 镜像管理列表用到的分类
const getImageCategory = () => {
  return request.get('/devops/cluster/types/image-mg-categories', null, {
    baseURL: '/api/mp',
  });
};

// 删除
const deleteSelectedData = (data) => {
  return request.delete('/devops/cluster/images/page', data, {
    baseURL: '/api/mp',
  });
};

// 文件注入导入文件
const uploadFile = (data) => {
  return request.post('/devops/cluster/images/file/upload/inject', data, {
    baseURL: '/api/mp',
  });
};

// 文件注入
const injectFile = (data) => {
  return request.post('/devops/cluster/images/inject-file', data, {
    baseURL: '/api/mp',
  });
};
// 文件注入查看
const getFileList = (data) => {
  return request.get('/devops/cluster/images/inject-file', data, {
    baseURL: '/api/mp',
  });
};
// 删除注入文件
const deleteInjectFile = (data) => {
  return request.delete('/devops/cluster/images/inject-file', data, {
    baseURL: '/api/mp',
  });
};
// 虚拟机配置
const getFlavor = () => {
  return request.get('/devops/cluster/images/page-flavor', null, {
    baseURL: '/api/mp',
  });
};

// 磁盘格式
const getDiskFormat = () => {
  return request.get('/devops/cluster/types/disk-format', null, {
    baseURL: '/api/mp',
  });
};

// 新增
const addImage = (data) => {
  return request.post('/devops/cluster/images/add', data, {
    baseURL: '/api/mp',
  });
};

// 授权：获取已授权的用户
const getAuthorisedUsers = (data) => {
  return request.get('/devops/cluster/images/auth-users', data, {
    baseURL: '/api/mp',
  });
};

// 授权
const imageAuth = (data) => {
  return request.post('/devops/cluster/images/auth', data, {
    baseURL: '/api/mp',
  });
};

// 快速构建
const quickBuild = (data) => {
  return request.post('/devops/cluster/images/build', data, {
    baseURL: '/api/mp',
  });
};

// 上传镜像
const imageUpload = (data) => {
  return request.post('/devops/cluster/images/custom/upload', data, {
    baseURL: '/api/mp',
  });
};

// 编辑回显
const getEditBackData = (id) => {
  return request.get(`/devops/cluster/images/search/${id}`, null, {
    baseURL: '/api/mp',
  });
};

const editImage = (data) => {
  return request.post('/devops/cluster/images/update', data, {
    baseURL: '/api/mp',
  });
};

// 创建场景
const createImageScene = (id) => {
  return request.post(`/devops/cluster/images/${id}/create`, null, {
    baseURL: '/api/mp',
  });
};

// 删除场景
const deleteImageScene = (data) => {
  return request.post(`/devops/cluster/images/delete-instance`, data, {
    baseURL: '/api/mp',
  });
};

// 释放镜像
const freeImageScene = (data) => {
  return request.post(`/devops/cluster/images/delete-instance`, data, {
    baseURL: '/api/mp',
  });
};

// 镜像导出
const exportImage = (id, name) => {
  return request.get(
    `/devops/cluster/images/export?id=${id}&image_name=${name}`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};

// 根据设备ID获取登录链接信息
const getImageSceneMessage = (id) => {
  return request.get(`/devops/cluster/images/connection?uuid=${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 查看快照历史
const getSnapshot = (id) => {
  return request.get(`/devops/cluster/images/${id}/snapshot/list`, null, {
    baseURL: '/api/mp',
  });
};

// 合并快照历史
const mergeSnapshot = (data) => {
  return request.post(`/devops/cluster/images/snapshot/merge`, data, {
    baseURL: '/api/mp',
  });
};

// 保存快照
const createSnapshot = (data) => {
  return request.post(`/devops/cluster/images/snapshot/create`, data, {
    baseURL: '/api/mp',
  });
};

// 删除快照
const deleteshot = (data) => {
  return request.post(`/devops/cluster/images/snapshot/delete`, data, {
    baseURL: '/api/mp',
  });
};

// 快速构建 查看服务详情
const getServiceDetail = (id) => {
  return request.get(`/devops/cluster/service/${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 重启镜像场景
const restartImage = (data) => {
  return request.post(`/devops/cluster/images/reboot`, data, {
    baseURL: '/api/mp',
  });
};

// 获取FTP信息
const getFtpIp = () => {
  return request.get(`/devops/cluster/target/ftp-info`, null, {
    baseURL: '/api/mp',
  });
};

// 获取靶标图标
const getDefaultLogo = () => {
  return request.get(
    `/agg/default-img/get-default-img/?defaultImgDirEnum=TARGET`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
// 获取靶标图集分类图标
const getCategoryIcon = () => {
  return request.get(`/agg/default-img/get-default-img-target`, null, {
    baseURL: '/api/mp',
  });
};
// 上传密钥
const encryptionUpload = (data) => {
  return request.post(`/devops/cluster/images/file/upload/ssh`, data, {
    baseURL: '/api/mp',
  });
};

// dynamic 平台
const getDynamicPlat = () => {
  return request.get(`/devops/cluster/images/dynamic_image_info`, null, {
    baseURL: '/api/mp',
  });
};
// dynamic 内存和硬盘、NVRAM
const getDynamicSize = () => {
  return request.get(`/devops/cluster/images/dynamic_type_info`, null, {
    baseURL: '/api/mp',
  });
};
// 获取图集数据
const getDefaultLogoSet = () => {
  return request.get(
    `/agg/default-img/get-default-img-all/?defaultImgDirEnum=AVATAR`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
// 获取图集数据
const getFirmwareType = () => {
  return request.get(`/devops/cluster/images/firmware_type`, null, {
    baseURL: '/api/mp',
  });
};
export {
  getFirmwareType,
  deleteSelectedData,
  injectFile,
  uploadFile,
  getFileList,
  deleteInjectFile,
  getFlavor,
  getDiskFormat,
  addImage,
  getAuthorisedUsers,
  imageAuth,
  quickBuild,
  imageUpload,
  getEditBackData,
  editImage,
  getImageCategory,
  createImageScene,
  deleteImageScene,
  exportImage,
  getImageSceneMessage,
  freeImageScene,
  getSnapshot,
  mergeSnapshot,
  createSnapshot,
  deleteshot,
  getServiceDetail,
  restartImage,
  getFtpIp,
  getDefaultLogo,
  encryptionUpload,
  getDynamicPlat,
  getDynamicSize,
  getDefaultLogoSet,
  getCategoryIcon,
};
