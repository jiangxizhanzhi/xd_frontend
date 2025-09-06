import _ from 'lodash';
import { request as request1 } from '@cyber/helper';

export function getOrganization() {
  return request1.get('/auth/orgs/tree/', null, {
    baseURL: '/api/mp',
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
