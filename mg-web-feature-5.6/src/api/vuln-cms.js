import { request } from '@cyber/helper';

const baseURL = '/api/vuln';

// 获取平台数据
export function getVulnPlatformData() {
  return request.get('/admin/vuln/platform/', null, {
    baseURL,
  });
}

// 获取漏洞详情
export function getVulnDetail(resourceId) {
  return request.get(`/admin/vuln/detail/${resourceId}/`, null, {
    baseURL,
  });
}

// 获取平台
export function getPlatform() {
  return request.get('/web/vuln/platform/', null, {
    baseURL,
  });
}

//弱点枚举
export function getCweCategory() {
  return request.get('/admin/vuln/cwe_category/', null, {
    baseURL,
  });
}

//图片上传
export function uploadImage(file) {
  return request.post('/public/service/filesystem/upload/image/', file, {
    baseURL,
  });
}

//zip文件上传
// export function uploadZip(file) {
//   return request.post('/public/service/filesystem/upload/zip/', file);
// }

export function uploadZip(file) {
  return request.post(`/common/ad_upload`, file, {
    baseURL: '/api/ojj',
  });
}

//解析md文件上传
export function uploadMd(file) {
  return request.post(`/common/parse/md/`, file, {
    baseURL: '/api/ojj',
  });
}

// 下载漏洞模板
export function downloadVulnTemplate() {
  return request.get('/admin/vuln/download/template/', null, {
    baseURL,
  });
}

// 导入漏洞
export function importVuln(formData) {
  return request.post('/admin/vuln/import/', formData, {
    baseURL,
  });
}

// 批量删除漏洞
export function batchDeleteVuln(data) {
  return request.delete('/admin/vuln/batch/', data, {
    baseURL,
  });
}

// 获取场景配置
export function getVulnSceneConfig(resourceId) {
  return request.get(`/admin/vuln/scene_config/${resourceId}/`, null, {
    baseURL,
  });
}

// 删除POC
export function deleteVulnPoc(id) {
  return request.delete(`/admin/vuln/poc/${id}/`, null, {
    baseURL,
  });
}

// 获取场景分类
export function getVulnSceneCategory() {
  return request.get('/admin/vuln/scene_category/', null, {
    baseURL,
  });
}

// 删除EXP
export function deleteVulnExp(id) {
  return request.delete(`/admin/vuln/exp/${id}/`, null, {
    baseURL,
  });
}

// 上传其他文件
export function uploadOtherFile(formData) {
  return request.post('/public/service/filesystem/upload/other/', formData, {
    baseURL,
  });
}

// 删除漏洞文档
export function deleteVulnPaper(id, params) {
  return request.delete(`/admin/vuln/paper/${id}/`, params, {
    baseURL,
  });
}

// 导出漏洞
export function exportVuln(ids) {
  return request.binaryDownload(
    'get',
    `/admin/vuln/export/?resource_ids=${ids}`,
    {},
    {
      baseURL,
    },
  );
}
