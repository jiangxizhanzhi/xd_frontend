import ReconnectingWebSocket from 'reconnecting-websocket';

const host = window.location.host;
const protocol = window.location.protocol;

export default {
  bind(path, callback, openSendParams = null) {
    // 根据https或者http，确定websocket协议为ws还是wss
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
        // console.log(ex)
      }
    };
    if (openSendParams) {
      socket.onopen = function (e) {
        socket.send(openSendParams);
      };
    } else {
      socket.onopen = function (e) {};
    }
    socket.onclose = function (e) {};
    socket.onerror = function (e) {};
    socket.sendJson = function (json) {
      socket.send(JSON.stringify(json));
    };
    return socket;
  },
  cbind(path, callback, openSendParams = null) {
    return this.bind(path, callback, openSendParams);
  },
};
