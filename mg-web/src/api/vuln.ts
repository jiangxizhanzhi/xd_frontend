import { request } from '@cyber/helper';

const baseURL = '/api/vuln';

// 漏洞统计相关接口
export function getVulnStatisticsIndustry() {
  return request.get('/web/vuln/statistics/industry/', null, {
    baseURL,
  });
}

export function getVulnStatisticsInfo() {
  return request.get('/web/vuln/statistics/info/', null, {
    baseURL,
  });
}

// 漏洞概览相关接口
export function getVulnOverviewIndustry() {
  return request.get('/web/vuln/overview/industry/', null, {
    baseURL,
  });
}

export function getVulnOverviewInfo() {
  return request.get('/web/vuln/overview/info/', null, {
    baseURL,
  });
}

// 漏洞排名相关接口
export function getVulnOverviewTopTen() {
  return request.get('/web/vuln/overview/topten/', null, {
    baseURL,
  });
}

export function getVulnStatisticsTopTen() {
  return request.get('/web/vuln/statistics/topten/', null, {
    baseURL,
  });
}

// 漏洞发布趋势相关接口
export function getVulnOverviewTime() {
  return request.get('/web/vuln/overview/time/', null, {
    baseURL,
  });
}
export function getVulnStatisticsTime() {
  return request.get('/web/vuln/statistics/time/', null, {
    baseURL,
  });
}
// 漏洞分类统计相关接口
export function getVulnOverviewCategory() {
  return request.get('/web/vuln/overview/category/', null, {
    baseURL,
  });
}

// 漏洞等级统计相关接口
export function getVulnOverviewLevel() {
  return request.get('/web/vuln/overview/level/', null, {
    baseURL,
  });
}

export function getVulnStatisticsLevel() {
  return request.get('/web/vuln/statistics/level/', null, {
    baseURL,
  });
}

// 漏洞情报相关接口
export function getVulnPlatform() {
  return request.get('/web/vuln/platform/', null, {
    baseURL,
  });
}

// 漏洞详情相关接口
export function getVulnPaper(resourceId: string) {
  return request.get(`/web/vuln/${resourceId}/paper/`, null, {
    baseURL,
  });
}

export function getVulnScene(resourceId: string) {
  return request.get(`/web/vuln/${resourceId}/scene/`, null, {
    baseURL,
  });
}

export function postVulnScene(resourceId: string, data: any) {
  return request.post(`/web/vuln/${resourceId}/scene/`, data, {
    baseURL,
  });
}

export function deleteVulnScene(resourceId: string) {
  return request.delete(`/web/vuln/${resourceId}/scene/`, null, {
    baseURL,
  });
}

// 漏洞利用相关接口
export function getVulnExp(resourceId: string) {
  return request.get(`/web/vuln/${resourceId}/exp/`, null, {
    baseURL,
  });
}

export function getVulnSceneRestart(resourceId: string, params: any) {
  return request.get(`/web/vuln/${resourceId}/scene/restart/`, params, {
    baseURL,
  });
}

export function getVulnSceneRebuild(resourceId: string, params: any) {
  return request.get(`/web/vuln/${resourceId}/scene/rebuild/`, params, {
    baseURL,
  });
}

// 漏洞搜索相关接口
export function getVulnSearch(params: any) {
  return request.get('/web/vuln/search/', params, {
    baseURL,
  });
}

// GHDB 工具相关接口
export function getToolGHdb(params: any) {
  return request.get('/web/vuln/tools/ghdb', params, {
    baseURL,
  });
}

// 工具利用相关接口
export function getToolEXP(params: any) {
  return request.get('/web/vuln/tools/exploit', params, {
    baseURL,
  });
}

// 漏洞分类统计相关接口
export function getVulnStatisticsCategory() {
  return request.get('/web/vuln/statistics/category/', null, {
    baseURL,
  });
}

// 漏洞详情相关接口
export function getVulnDetail(resourceId: string) {
  return request.get(`/web/vuln/${resourceId}/`, null, {
    baseURL,
  });
}

// Shellcode 工具相关接口
export function getToolShellcode(params: any) {
  return request.get('/web/vuln/tools/shellcode', params, {
    baseURL,
  });
}
