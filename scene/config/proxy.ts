import { IProxy } from '@cyber/cli';

const serverIp = '10.4.8.12';
const serverPort = 80;
const server = `http://${serverIp}:${serverPort}`;
const wsServer = `ws://${serverIp}:${serverPort}`;

const fdfsServerIp = '10.4.8.12';
const fdfsPort = 80;
const fdfsServer = `http://${fdfsServerIp}:${fdfsPort}`;

export default {
  '/api/mp': {
    target: server,
    changeOrigin: true,
  },
  '/fdfs': {
    target: fdfsServer,
    changeOrigin: true,
  },
  '/ws': {
    target: wsServer,
    ws: true,
    changOrigin: true,
  },
} as IProxy;
