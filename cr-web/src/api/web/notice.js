import { request } from '@cyber/helper';

// 红蓝查询 公告
const redBlueSearchNoticeApi = (data) => {
  return request.get(`/cr/notice/rb/list`, data, {
    baseURL: '/api/ojj',
  });
};
// 团队查询 公告
const teamSearchNoticeApi = (data) => {
  return request.get(`/cr/notice/teamList/list`, data, {
    baseURL: '/api/ojj',
  });
};
// 置顶 和 取消置顶
const noticeTopApi = (data) => {
  return request.post(`/cr/notice/top`, data, {
    baseURL: '/api/ojj',
  });
};

// 删除公告
const deleteNoticeApi = (data) => {
  return request.post(`/cr/notice/delete`, data, {
    baseURL: '/api/ojj',
  });
};

// 查询是否有新消息
const checkNewNoticeApi = (data) => {
  return request.get(`/cr/notice/hasNewInfo`, data, {
    baseURL: '/api/ojj',
  });
};

export {
  redBlueSearchNoticeApi,
  teamSearchNoticeApi,
  noticeTopApi,
  deleteNoticeApi,
  checkNewNoticeApi,
};
