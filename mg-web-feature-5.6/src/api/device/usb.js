import { request } from '@cyber/helper';
const baseURL = '/api/mp';

// 新增usb
const postVirtualUsb = (params) => {
  return request.post('/devops/cluster/virtual_usb/add', params, {
    baseURL,
  });
};
// 更新usb
const updateVirtualUsb = (params) => {
  return request.post('/devops/cluster/virtual_usb/update', params, {
    baseURL,
  });
};
// 删除usb
const deleteVirtualUsb = (params) => {
  return request.delete('/devops/cluster/virtual_usb/delete', params, {
    baseURL,
  });
};
// usb详情
const getVirtualUsbDetail = (params) => {
  return request.get('/devops/cluster/virtual_usb/find_by_uuid', params, {
    baseURL,
  });
};
// usb文件列表
const getUsbFileList = (params) => {
  return request.get('/devops/cluster/virtual_usb/file_list_by_uuid', params, {
    baseURL,
  });
};
// usb文件上传
const uploadUsbFile = (params) => {
  return request.post('/devops/cluster/virtual_usb/upload', params, {
    baseURL,
  });
};
// usb文件下载
const downloadUsbFile = (params) => {
  return request.get('/devops/cluster/virtual_usb/download_file', params, {
    baseURL,
  });
};
// usb文件删除
const deleteUsbFile = (params) => {
  return request.delete(
    `/devops/cluster/virtual_usb/delete_file?fileName=${params.fileName}&uuid=${params.uuid}`,
    undefined,
    {
      baseURL,
    },
  );
};
// usb文件格式化
const deleteAllUsbFile = (uuid) => {
  return request.delete(
    `/devops/cluster/virtual_usb/delete_all_files?uuid=${uuid}`,
    undefined,
    {
      baseURL,
    },
  );
};
export {
  postVirtualUsb,
  updateVirtualUsb,
  deleteVirtualUsb,
  getVirtualUsbDetail,
  getUsbFileList,
  uploadUsbFile,
  downloadUsbFile,
  deleteUsbFile,
  deleteAllUsbFile,
};
