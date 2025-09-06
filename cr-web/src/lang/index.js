import _ from 'lodash';
import { getI18N } from '@cyber/helper';

let i18n;
const supported = ['zh', 'en'];
const langProcess = (raw) => {
  if (!raw) {
    return supported[0];
  }
  let trunc = raw;
  if (raw.length > 2) {
    trunc = raw.substring(0, 2);
  }
  if (supported.includes(trunc)) {
    return trunc;
  } else {
    return supported[0];
  }
};

export function setI18n(_i18n) {
  i18n = _i18n;
  i18n.getCurLanAbbr = getCurLanAbbr;
}
export function getCurLanAbbr() {
  const locale = getI18N().locale;
  return langProcess(locale);
}

export function getI18n() {
  return getI18N();
}

export function gettext(str) {
  let data = getI18n().messages[getI18n().locale];
  for (const key of str.split('.')) {
    data = data[key];
  }
  if (!data) {
    data = str;
  }

  return data;
}

const transMap = {};
export function setTransMap(messageList) {
  _.forEach(messageList, (messageMap) => {
    _.forEach(messageMap, (str, locale) => {
      transMap[str] = messageMap;
    });
  });
}
export function trans(str) {
  const messageMap = transMap[str];
  let result;
  if (messageMap) {
    //i18n.locale is en-Us or cn-ZH not match messageMap
    result = messageMap[getCurLanAbbr()];
  }

  return result || str;
}
