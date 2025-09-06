import ReconnectingWebSocket from 'reconnecting-websocket';

const host = window.location.host;
const protocol = window.location.protocol;

export default {
  bind(path, callback) {
    // 根据https或者http，确定websocket协议为ws还是wss
    /* const url =
      protocol === 'http:'
        ? `ws://10.100.1.28${path}`
        : `wss://10.100.1.28${path}`; */
    const url =
      protocol === 'http:' ? `ws://${host}${path}` : `wss://${host}${path}`;
    const socket = new ReconnectingWebSocket(url, undefined, {
      connectionTimeout: 10000,
      maxRetries: 1,
    });

    socket.onmessage = function (e) {
      try {
        const data = JSON.parse(e.data);
        callback(data);
      } catch (ex) {
        console.log(ex);
      }
    };
    socket.onopen = function (e) {};
    socket.onclose = function (e) {};
    socket.onerror = function (e) {};
    socket.sendJson = function (json) {
      socket.send(JSON.stringify(json));
    };
    return socket;
  },
  cbind(path, callbackMapping = {}) {
    return this.bind(path, (data) => {
      const callback = callbackMapping[data.code];
      if (callback) {
        callback(data.data);
      }
    });
  },
};
