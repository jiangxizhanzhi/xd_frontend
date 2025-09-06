import assess from './assess';
import instance from './instance';
import singleTrain from './singleTrain';
import grade from './grade';
import device from './device';
import missions from './missions';
import probe from './probe';
import scene from './scene';
import resourceCenter from './resourceCenter';
import traffic from './traffic';
import cate from './cate';
import teamTrain from './teamTrain';
import weapon from './weapon';
import dataDisplay from './dataDisplay';
import crScene from './cr-scene';
import crEvent from './cr-event';
import softTestZh from './soft-test';
import zh from './zh';
import _ from 'lodash';
import routes from './routes.js';
import rangeTest from './rangeTest';
import flowEmulation from './flow-emulation';
import dynamicControl from './dynamic-control';
import flowTypes from './flow-types';
import redBlue from './red-blue';
import notice from './notice';
import rbt from './red-blue-team';

const allZh = _.merge(
  notice,
  redBlue,
  rangeTest,
  rbt,
  assess,
  cate,
  dataDisplay,
  device,
  singleTrain,
  grade,
  missions,
  probe,
  scene,
  resourceCenter,
  traffic,
  teamTrain,
  weapon,
  instance,
  crScene,
  crEvent,
  softTestZh,
  zh,
);

export default {
  ...allZh,
  routes,
  flowEmulation,
  dynamicControl,
  flowTypes,
};
