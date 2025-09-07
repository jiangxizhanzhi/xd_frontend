import { MessageBox } from 'element-ui';
import Message from '../../../components/message';
//import { setParentMask } from '../../../utils/utils';
import { setState } from '../../../utils';
import { getResponse, getI18N, isSubFrame } from '@cyber/helper';
import _ from 'lodash';
const CbMessageBox = Message;
const cbMessage = _.cloneDeep(Message);

// 上一个弹出信息
let compareMsg = null;
let timeOut = null;

//消息提示
CbMessageBox.serverError = (ex, defaultMsg) => {
  let msg = '';
  if (_.isPlainObject(ex) && ex.message) {
    msg = ex.message;
  } else {
    msg = getResponse(ex).message;
  }

  if (msg) {
    CbMessageBox.error(msg);
  } else if (defaultMsg) {
    if (typeof defaultMsg === 'function') {
      CbMessageBox.error(defaultMsg());
    } else {
      CbMessageBox.error(defaultMsg);
    }
  } else {
    CbMessageBox.error(getI18N().t('g.defaultErrorMsg'));
  }
};
//消息提示
CbMessageBox.error = (msg) => {
  showMessage('error', msg);
};
//消息提示
CbMessageBox.success = (msg) => {
  showMessage('success', msg);
};
//消息提示
CbMessageBox.info = (msg) => {
  showMessage('info', msg);
};
//消息提示
CbMessageBox.warning = (msg) => {
  showMessage('warning', msg);
};

//提交内容W
CbMessageBox.prompt = (message, title, options) => {
  //frame的弹框设置外层遮罩
  //setParentMask(true, 'msgbox');
  const callback = () => {
    //setParentMask(false, 'msgbox');
  };

  return new Promise((resolve, reject) => {
    MessageBox(
      Object.assign(
        {
          title: title,
          message: message,
          $type: 'prompt',
          showInput: true,
          showCancelButton: true,
          showClose: true,
          center: true,
          cancelButtonClass: 'cb-button-cancel el-button--medium',
          confirmButtonClass: 'cb-button-confirm el-button--medium',
          closeOnClickModal: false,
          customClass: 'cb-prompt-msg-box',
        },
        options,
      ),
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        callback();
      });
  });
};

//消息弹框
CbMessageBox.confirm = (message, title, options) => {
  //frame的弹框设置外层遮罩
  //setParentMask(true, 'msgbox');
  if (typeof title === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  const callback = () => {
    //setParentMask(false, 'msgbox');
  };

  return new Promise((resolve, reject) => {
    MessageBox(
      Object.assign(
        {
          title: title,
          message: message,
          $type: 'confirm',
          showCancelButton: true,
          showClose: false,
          center: true,
          type: 'warning',
          cancelButtonClass: 'cb-button-cancel el-button--medium',
          confirmButtonClass: 'cb-button-confirm el-button--medium',
          closeOnClickModal: false,
        },
        options,
      ),
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        callback();
      });
  });
};

CbMessageBox.closeMsgBox = () => {
  try {
    MessageBox.close();
  } catch (error) {
    console.log(error);
  }
};

function showMessage(method, msg) {
  // 若已经弹出了message && 报错信息跟上次的一样 两秒内不显示相同信息弹窗
  const removeDomScope = _.get(window, '__CY_MICRO_APP.removeDomScope');
  removeDomScope && removeDomScope();
  if (
    document.getElementsByClassName('el-message').length !== 0 &&
    compareMsg === msg
  ) {
    return;
  }
  compareMsg = msg;
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    compareMsg = null;
  }, 2000);

  if (isSubFrame()) {
    setState('show_message', { method, message: msg });
  } else {
    cbMessage[method](msg);
  }
}

export default CbMessageBox;
