import _ from 'lodash';
import { getI18N } from '@cyber/helper';

let i18n = getI18N();

function gettext(str) {
  let data = i18n.messages[i18n.locale];
  for (const key of str.split('.')) {
    data = data[key];
  }
  if (!data) {
    data = str;
  }

  return data;
}

class Value {
  constructor(value, name) {
    _.assign(this, { value, name });
  }

  toString() {
    return this.value.toString();
  }

  valueOf() {
    return this.value;
  }

  equals(value) {
    return this.value === value;
  }
}

class Name {
  constructor(str) {
    this.str = str;
  }

  toString() {
    return getI18N().t(this.str);
  }

  valueOf() {
    return this.toString();
  }
}

function convertListAndDict(data) {
  const listDict = {};
  const dictDict = {};

  const list = [];
  _.forEach(data, (value, key) => {
    if (value instanceof Value) {
      list.push(value);
      dictDict[value.value] = value.name;
    } else {
      [listDict[key], dictDict[key]] = convertListAndDict(value);
    }
  });

  if (list.length > 0) {
    return [list, dictDict];
  } else {
    return [listDict, dictDict];
  }
}

export function V(value, name) {
  return new Value(value, name);
}

export function N(str) {
  return new Name(str);
}

function getTarget(obj, prefix) {
  let target = obj;
  if (prefix) {
    _.forEach(prefix.split('.'), (key) => {
      target[key] = target[key] || {};
      target = target[key];
    });
  }
  return target;
}

export function getNewConstant({ prefix, data, aid, setting } = {}) {
  const constant = {
    add(data, prefix) {
      const target = getTarget(this, prefix);
      const listTarget = getTarget(this.LIST, prefix);
      const dictTarget = getTarget(this.DICT, prefix);

      _.assign(target, data);
      const [listData, dictData] = convertListAndDict(data);
      _.assign(listTarget, listData);
      _.assign(dictTarget, dictData);

      return this;
    },
    addAid(aid, prefix) {
      if (prefix == 'WS') {
        console.log('aid', aid);
      }
      const target = getTarget(this.AID, prefix);
      _.assign(target, aid);
    },
    addSetting(setting, prefix) {
      const target = getTarget(this.SETTING, prefix);
      _.assign(target, setting);
    },
    LIST: {},
    DICT: {},
    AID: {},
    SETTING: {},
  };

  if (data) {
    constant.add(data, prefix);
  }

  if (aid) {
    constant.addAid(aid);
  }

  if (setting) {
    constant.addSetting(setting);
  }

  return constant;
}

export const Constant = getNewConstant();
