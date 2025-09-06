import _ from 'lodash';

const log = (msg) => {
  console.log(`${reqId} ========>> ${msg}`);
};
let reqId = false;
const util = {
  setCookie(iframe, data, callback) {
    util.remoteEvent(iframe, 'setCookie', data, callback);
    log('trigger set cookie event.');
  },
  setLanguage(iframe, language, callback) {
    util.remoteEvent(iframe, 'setLanguage', language, callback);
  },
  remoteEvent(iframe, type, data, callback) {
    const receiveEvent = (event) => {
      log(`message recieved. ${type}: ${JSON.stringify(data)}`);
      if (iframe.src.startsWith(event.origin)) {
        const { data } = event;
        if (data.type === type) {
          window.removeEventListener('message', receiveEvent);
          if (callback) {
            callback(data.data);
          }
        }
      } else {
        log(`quit ${type} due to event.origin`);
        log(`iframe.src: ${iframe.src}`);
        log(`event.origin: ${event.origin}`);
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
    log(`message posted. ${type}: ${JSON.stringify(data)}`);
  },
};

export default util;
