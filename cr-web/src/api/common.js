import _ from 'lodash';
import { request, requestForm } from '@/utils/request';
// 红蓝对抗request1
import { request as request1 } from '@cyber/helper';

export function getOrganization() {
  return request1.get('/auth/orgs/tree/', null, {
    baseURL: '/api/mp',
  });
}

//前台markdown上传图片
export function saveImageWeb(data) {
  return request1.post('/common/web/image_upload', data, {
    baseURL: '/api/ojj',
  });
}

//后台markdown上传图片
export function saveImageAdmin(data) {
  return request1.post('/common/admin/image_upload', data, {
    baseURL: '/api/ojj',
  });
}

// 前台普通附件上传
export function uploadAttachmentWeb(data) {
  return request1.post('/common/web/attachment_upload/', data, {
    baseURL: '/api/ojj',
  });
}

// 后台普通附件上传
export function uploadAttachmentAdmin(data) {
  return request1.post('/common/admin/attachment_upload/', data, {
    baseURL: '/api/ojj',
  });
}

// md解析包上传

export function uploadMd(data) {
  return request1.post('/common/parse/md/', data, {
    baseURL: '/api/ojj',
  });
}
// 红蓝对抗,getDataRB,request1
export function getDataRB(url, query) {
  return request1.get(url, query, {
    baseURL: '/api/ojj',
  });
}
// 获取雷达标签
export function getRadarLabels() {
  return request1.get('/cr/admin/mission/missions/radar_labels', null, {
    baseURL: '/api/ojj',
  });
}
//获取时间管理数据
export function getData(url, query) {
  return request1.get(
    '/cr/red_vs_blue/red_vs_blue/get_time_management',
    query,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 创建时间管理
export function postData(url, query) {
  return request1.post(
    '/cr/red_vs_blue/red_vs_blue/create_time_management',
    query,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 红蓝授时查询
export function getTimeApi(data) {
  return request1.get('/cr/red_vs_blue/red_vs_blue/time', data, {
    baseURL: '/api/ojj',
  });
}

// 红蓝授时新增修改
export function postTimeApi(data) {
  return request1.post('/cr/red_vs_blue/red_vs_blue/time', data, {
    baseURL: '/api/ojj',
  });
}

// 单兵、团队、红蓝几个模块里节点的关机
export const nodeShutDown = (data) => {
  return request1.post(`/cs/scene/node/stop/`, data, {
    baseURL: '/api/ojj',
  });
};

// 单兵、团队、红蓝几个模块里节点的开机
export const nodeShutUp = (data) => {
  return request1.post(`/cs/scene/node/start/`, data, {
    baseURL: '/api/ojj',
  });
};

export function getList(url, query, nodeId) {
  return request({
    url: url,
    method: 'get',
    params: query,
    headers: { 'x-request-id': nodeId },
  });
}

export function batchSet(url, ids, field, value) {
  return request({
    url: url,
    method: 'patch',
    data: {
      ids,
      field,
      value,
    },
  });
}

export function batchDestroy(url, ids) {
  return request({
    url: url,
    method: 'delete',
    data: {
      ids,
    },
  });
}

export function formSubmit(
  action,
  url,
  data,
  query,
  { onUploadProgress, timeout } = {},
) {
  const options = {
    baseURL: '/api/ojj',
    url: url,
    method: action,
    data: data,
    params: query,
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable && onUploadProgress) {
        const percent = (progressEvent.loaded / progressEvent.total) * 100;
        onUploadProgress(percent, progressEvent);
      }
    },
  };

  if (timeout) {
    options.timeout = timeout;
  }

  return requestForm(options);
}

class Error {
  constructor(code, error) {
    _.assign(this, { code, error });
  }
}

function convertError(error) {
  if (_.isArray(error)) {
    const errors = [];
    _.forEach(error, (e) => {
      errors.push(convertError(e));
    });
    return errors;
  }

  return new Error(error.code, error.message);
}

export function parseError(res, status) {
  const error = {};
  _.forEach(res, (value, key) => {
    error[key] = convertError(value);
  });

  const keys = _.keys(error);
  let text = '';
  if (keys.length > 0) {
    let firstError = error[keys[0]];
    if (_.isArray(firstError)) {
      firstError = firstError[0];
    }
    text = firstError.error;
  }
  if (!text || keys.length === 0) {
    if (status.toString().startsWith('4')) {
      text = gettext('apiError.noPermission');
    } else {
      text = gettext('apiError.serverError');
    }
  }
  return text;
}

export function parseDetailError(res, status) {
  const error = {};
  _.forEach(res, (value, key) => {
    error[key] = convertError(value);
  });
  if (_.isEmpty(error)) {
    let text;
    if (status.toString().startsWith('4')) {
      text = gettext('apiError.noPermission');
    } else {
      text = gettext('apiError.serverError');
    }
    error[''] = text;
  }

  return error;
}

export const apiActor = {
  handleRequester(requester, successCallback, errorCallback) {
    requester()
      .then((response) => {
        if (
          successCallback &&
          successCallback(response.data, response) === false
        ) {
          return;
        }
        this.$message({
          type: 'success',
          message: this.$t('common.operateSuccess'),
        });
      })
      .catch((error) => {
        let errorTxt;
        if (error.response) {
          errorTxt = parseError(error.response.data, error.response.status);
        } else {
          errorTxt = error.message;
        }
        if (errorCallback && errorCallback(errorTxt, error) === false) {
          return;
        }
        this.$alert(errorTxt, this.$t('common.error'), {
          type: 'error',
        });
      });
  },
  confirm(message, requester, successCallback, errorCallback, cancelCallback) {
    this.$confirm(message, this.$t('common.confirm'), {
      type: 'warning',
    })
      .then(() => {
        apiActor.handleRequester.call(
          this,
          requester,
          successCallback,
          errorCallback,
        );
      })
      .catch((error) => {
        if (cancelCallback) {
          cancelCallback(error);
        }
      });
  },
};

// 查询当前用户菜单
export function getCurrentMenu() {
  return request1.get('/auth/targets/current_user/tree', null, {
    baseURL: '/api/mp',
  });
}
