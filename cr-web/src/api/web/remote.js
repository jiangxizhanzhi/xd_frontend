import _ from 'lodash';

const util = {
  setCookie(iframe, data, callback) {
    util.remoteEvent(iframe, 'setCookie', data, callback);
  },
  setLanguage(iframe, language, callback) {
    util.remoteEvent(iframe, 'setLanguage', language, callback);
  },
  captureScreen(iframe, callback) {
    util.remoteEvent(iframe, 'captureScreen', null, callback);
  },
  focus(iframe, callback) {
    util.remoteEvent(iframe, 'editFocus', null, callback);
  },
  reload(iframe, callback) {
    util.remoteEvent(iframe, 'windowReload', null, callback);
  },
  remoteEvent(iframe, type, data, callback) {
    const receiveEvent = (event) => {
      if (iframe.src.startsWith(event.origin)) {
        const { data } = event;
        if (data.type === type) {
          window.removeEventListener('message', receiveEvent);
          if (callback) {
            callback(data.data);
          }
        }
      }
    };
    window.addEventListener('message', receiveEvent);

    iframe.contentWindow.postMessage(
      {
        type: type,
        data: data,
      },
      iframe.src,
    );
  },
};

export default util;

// 截图方法
const guid2 = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export function triggerJmsEvent(
  targetWindow,
  targetSrc,
  eventType,
  data,
  callback,
) {
  const callId = guid2();
  targetWindow.postMessage(
    {
      callId: callId,
      type: eventType,
      data: data,
    },
    '*',
  );

  const receiveEvent = (event) => {
    if (event.data && event.data.callId === callId && event.data.status) {
      const eventData = event.data;
      if (eventData.type === eventType) {
        window.removeEventListener('message', receiveEvent);
        if (callback) {
          callback(eventData.data);
        }
      }
    }
  };
  window.addEventListener('message', receiveEvent);
  setTimeout(() => {
    window.removeEventListener('message', receiveEvent);
  }, 5000);
}

// 检测ifram文件上传下载
// 注册主窗口origin到iframe
export function registerParentWindow(iframe, callback) {
  // 触发jumpserver提供的父窗口注册事件
  triggerJmsEvent(
    iframe.contentWindow,
    iframe.src,
    'registerParentWindow',
    {
      origin: window.origin,
    },
    (data) => {
      if (callback) {
        callback(data);
      }
    },
  );
}
