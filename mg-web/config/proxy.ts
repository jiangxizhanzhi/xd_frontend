import { IProxy } from '@cyber/cli';
const serverIp = '8.159.138.178';
const serverPort = 81;

const mpServerIp = '8.159.138.178';
const mpServerPort = 81;

const server = `http://${serverIp}:${serverPort}`;
const mpServer = `http://${mpServerIp}:${mpServerPort}`;
const wsServer = `ws://${serverIp}:${serverPort}`;
export default {
  '/ai': {
    target: server,
    changeOrigin: true,
  },
  '/chat': {
    target: server,
    changeOrigin: true,
  },
  '/knapsack': {
    target: server,
    changeOrigin: true,
  },
  '/api/drm': {
    target: server,
    changeOrigin: true,
  },
  '/api/ojj': {
    target: server,
    changeOrigin: true,
  },
  '/api/vuln/ws': {
    target: wsServer,
    changeOrigin: true,
    ws: true,
    secure: false,
  },
  '/ojj/ws': {
    target: wsServer,
    ws: true,
    changeOrigin: true,
  },
  '/api/cr': {
    target: server,
    changeOrigin: true,
  },
  '/api/mg/api': {
    target: server,
    changeOrigin: true,
  },
  '/api/mp': {
    target: mpServer,
    changeOrigin: true,
  },
  '/api': {
    target: server,
    changeOrigin: true,
  },
  '/static/adminYWRtaW5kZ2lkZzVkZzVyMTVERVNHNDUxNTJW': {
    target: server,
    changeOrigin: true,
  },
  '/page': {
    target: server,
    changeOrigin: true,
  },
  '/fdfs': {
    target: server,
    changeOrigin: true,
  },
  '/jms': {
    target: server,
    changeOrigin: true,
  },
  '/mg': {
    target: server,
    changeOrigin: true,
  },
  '/api/cr/ws': {
    target: server,
    ws: true,
  },
  '/ct/upload': {
    target: server,
    changeOrigin: true,
  },
  '/cpms': {
    target: server,
    changeOrigin: true,
  },
} as IProxy;
