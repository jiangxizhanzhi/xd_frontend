import _ from 'lodash';

export default {
  serverError(ex, vm, defaultMsg) {
    let msg = _.get(ex, 'response.data[0].message');
    if (!msg) {
      msg = _.get(ex, 'response.data.__global.message');
    }
    if (!msg) {
      const data = _.get(ex, 'response.data');
      if (data) {
        const keyValuePairs = _.toPairs(data);
        for (const pair of keyValuePairs) {
          msg = _.get(pair, '[1][0].message');
          if (!msg) {
            msg = _.get(pair, '[1].message');
          }
          if (msg) {
            break;
          }
        }
      }
    }
    if (msg) {
      vm.$message.error(msg);
    } else if (defaultMsg) {
      if (typeof defaultMsg === 'function') {
        vm.$message.error(defaultMsg());
      } else {
        vm.$message.error(defaultMsg);
      }
    }
  },
  error(msg, vm) {
    vm.$message.error(msg);
  },
  success(msg, vm) {
    vm.$message.success(msg);
  },
  info(msg, vm) {
    vm.$message.info(msg);
  },
  warning(msg, vm) {
    vm.$message.warning(msg);
  },
  confirm(
    { msg, title, type = 'warning', cancelButtonClass = 'btn-cancel-confirm' },
    vm,
  ) {
    return vm.$confirm(msg, title, {
      type,
      cancelButtonClass,
    });
  },
};
