import _ from 'lodash';
import { getMainWin } from '@cyber/helper';

export function setMemory(key, value) {
  const mainWin = getMainWin();
  _.set(mainWin, `cbUiMemoryStorage.${key}`, value);
}

export function getMemory(key) {
  const mainWin = getMainWin();
  return _.get(mainWin, `cbUiMemoryStorage.${key}`);
}

export function clearMemory() {
  const mainWin = getMainWin();
  _.set(mainWin, `cbUiMemoryStorage`, {});
}

export function delMemory(key) {
  setMemory(key, undefined);
}
