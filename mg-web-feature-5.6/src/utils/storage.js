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
