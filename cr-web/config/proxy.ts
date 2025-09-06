import { IProxy } from '@cyber/cli';

const serverIp = '10.2.99.10';
const serverPort = 80; // server port
const serverPortCloud = 11111; // 云平台端口

const server = `http://${serverIp}:${serverPort}`;
const serverCloud = `http://${serverIp}:${serverPortCloud}`;
const wsServer = `ws://${serverIp}:${serverPort}`;

const serverIpJava = '10.2.99.10';
const serverPortJava = 80;
const serverJava = `http://${serverIpJava}:${serverPortJava}`;
const wsServerJava = `ws://${serverIpJava}:${serverPortJava}`;

export default {
  '/api/ojj': {
    target: serverJava,
    changeOrigin: true,
  },
  '/cpms': {
    target: serverJava,
    changeOrigin: true,
  },
  '/api': {
    target: server,
    changeOrigin: true,
  },
  '/api/mp': {
    target: server,
    changeOrigin: true,
  },
  '/media': {
    target: server,
    changeOrigin: true,
  },
  '/api/ojj/ws': {
    target: wsServer,
    ws: true,
    changOrigin: true,
  },
  '/api/cr/ws': {
    target: wsServer,
    ws: true,
    changOrigin: true,
  },
  '/ojj/ws': {
    target: wsServerJava,
    ws: true,
    changOrigin: true,
  },
  '/mp/ws': {
    target: wsServerJava,
    ws: true,
    changOrigin: true,
  },

  '/jms': {
    target: server,
    changeOrigin: true,
  },
  '/fdfs': {
    target: server,
    changeOrigin: true,
  },

  '/cpcloud/guacamole/v1': {
    target: serverCloud,
    changeOrigin: true,
  },
  '/cr/file': {
    target: server,
    changeOrigin: true,
  },
} as IProxy;
