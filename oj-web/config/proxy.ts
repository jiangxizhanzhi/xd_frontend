import { IProxy } from '@cyber/cli';

const serverIp = '10.2.99.10';
const serverPort = 80; // server port

const server = `http://${serverIp}:${serverPort}`;
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
  '/media/ojj': {
    target: serverJava,
    changeOrigin: true,
  },
  '/api/ojj/oj': {
    target: serverJava,
    changeOrigin: true,
  },
  '/api/ojj/rtks': {
    target: serverJava,
    changeOrigin: true,
  },
  '/api': {
    target: server,
    changeOrigin: true,
  },
  '/oj/media': {
    target: server,
    changeOrigin: true,
  },
  '/media': {
    target: server,
    changeOrigin: true,
  },
  '/ojj/ws': {
    target: wsServerJava,
    changeOrigin: true,
    ws: true,
  },
  '/ws': {
    target: wsServer,
    ws: true,
    changOrigin: true,
  },
  '/api/oj/ws': {
    target: wsServer,
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
  '/cpms': {
    target: serverJava,
    changeOrigin: true,
  },
  '/download/cpms': {
    target: serverJava,
    changeOrigin: true,
  },
} as IProxy;
