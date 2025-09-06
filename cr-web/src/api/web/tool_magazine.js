import { request } from '@/utils/request';

// 获取工具镜像
export function getToolImage(resource_id) {
  return request({
    url: `/tool/tools/${resource_id}/tool_image/`,
    method: 'get',
  });
}

// 创建工具镜像
export function createToolImage(resource_id) {
  return request({
    url: `/tool/tools/${resource_id}/tool_image/`,
    method: 'post',
  });
}

// 打开控制台
export function openConsole(resource_id, data) {
  return request({
    url: `tool/tools/${resource_id}/tool_image_console_url/`,
    method: 'post',
    data,
  });
}

// 重启工具镜像
export function restartTool(resource_id, data) {
  return request({
    url: `tool/tools/${resource_id}/tool_image_restart/`,
    method: 'post',
    data,
  });
}

// 删除工具镜像
export function deleteTool(resource_id) {
  return request({
    url: `/tool/tools/${resource_id}/tool_image/`,
    method: 'DELETE',
  });
}
