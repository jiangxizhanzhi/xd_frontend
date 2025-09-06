export class Storage {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getData() {
    const value = localStorage.getItem(this.storageKey);
    if (!value) {
      return {};
    }

    let data;
    try {
      data = JSON.parse(value);
    } catch (e) {
      data = {};
    }

    return data;
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  get(key) {
    const data = this.getData();
    return data[key];
  }

  set(key, value) {
    const data = this.getData();
    data[key] = value;
    this.saveData(data);
  }
}

export default function getStorage(storageKey) {
  return new Storage(storageKey);
}

export const ls = {};

const ssPrefix = `${window.location.protocol}://${location.host}:${window.location.port}:SS`;
sessionStorage[ssPrefix] = sessionStorage[ssPrefix] || '{}';
const ssJson = JSON.parse(sessionStorage[ssPrefix]);
const ssSet = (key, value) => {
  ssJson[key] = value;
  sessionStorage[ssPrefix] = JSON.stringify(ssJson);
};
export const ss = {
  set: ssSet,
  get(key, defaultValue, setBack = false) {
    const val = ssJson[key];
    if (val === undefined) {
      if (setBack) {
        ssSet(key, defaultValue);
      }
      return defaultValue;
    }
    return val;
  },
};
