import system from './system.js';
import crEvent from './cr-event';
import crScene from './cr-scene.js';
import device from './device.js';
import missions from './missions.js';
import probe from './probe.js';
import scene from './scene.js';
import tool from './tool.js';
import traffic from './traffic.js';
import langEn from './zh.js';
import routes from './routes.js';
import assessment from './assessment.js';
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
export default {
  ...elementZhLocale,
  ...langEn,
  ...system,
  ...crEvent,
  ...crScene,
  ...device,
  ...missions,
  ...probe,
  ...scene,
  ...tool,
  ...traffic,
  routes,
  assessment,
};
