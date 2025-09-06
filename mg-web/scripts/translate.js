const _ = require('lodash');
const fs = require('fs');
const cryptoJS = require('crypto-js');
const qs = require('qs');
const babelRegister = require('./utils/babel-register.js').default;

const utils = require('./utils/utils');
const axios = require('axios');

main();

async function main(filePath = {}) {
  try {
    const root = process.cwd();
    const zhLangPath = filePath.zh || root + '/src/locales/zh-CN';
    const enLangPath = filePath.en || root + '/src/locales/en-US';
    let path = fs.readdirSync(zhLangPath);
    let newPath = fs.readdirSync(enLangPath);
    let zhMap = new Map();
    let enMap = new Map();
    let diffMap = new Map();

    newPath.forEach((element) => {
      if (element === 'index.js') {
        return;
      }
      if (utils.isDirectory(enLangPath + '/' + element)) {
        return;
      }
      babelRegister([enLangPath + '/' + element]);
      const obj = utils.requireEnhance(enLangPath + '/' + element);
      let result = {};
      // 筛除中文
      for (let i in obj) {
        const value = obj[i];
        if (i !== 'colon' && i !== 'delimiter' && !containZh(value)) {
          result[i] = value;
        }
      }
      enMap.set(element, result);
    });

    for (const element of path) {
      if (element === 'index.js') {
        continue;
      }
      if (utils.isDirectory(zhLangPath + '/' + element)) {
        const zh = zhLangPath + '/' + element;
        const en = enLangPath + '/' + element;
        main({ zh, en });
      }
      babelRegister([zhLangPath + '/' + element]);
      const obj = utils.requireEnhance(zhLangPath + '/' + element);
      zhMap.set(element, obj);
      let newObject = obj;
      if (enMap.get(element)) {
        newObject = diffObject(zhMap.get(element), enMap.get(element));

        const extra = diffObject(enMap.get(element), zhMap.get(element));
        let flag = false;
        if (_.isPlainObject(extra) && !_.isEmpty(extra)) {
          for (let i in extra) {
            if (
              (_.isPlainObject(extra[i]) && !_.isEmpty(extra[i])) ||
              (_.isString(extra[i]) && extra[i] !== '')
            ) {
              flag = true;
            }
          }
        }
        flag && console.log('多余英文国际化：', element, extra);
      }
      if (newObject) {
        const newData = await rangeObj(newObject, {});
        diffMap.set(element, newData);
      }
    }

    writeFileSync(diffMap, enMap, enLangPath);
  } catch (e) {
    console.log('获取文件路径异常');
    console.log(e);
  }
}

/**
 * 合并对象
 * @param obj
 * @param newData
 */
async function rangeObj(obj, newData) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      newData[key] = {};
      await rangeObj(obj[key], newData[key]);
    } else {
      let newWord = '';
      if (key === 'colon') {
        newWord = '：';
        newData[key] = newWord;
      } else if (newWord !== obj[key]) {
        newWord = await translateWord(obj[key]);
        newData[key] = utils.toFirstUpperCase(newWord);
      }
    }
  }
  return newData;
}

async function translateWord(str) {
  let config = {
    appID: '3083b21662cda5d7',
    appKey: '33rtckA4axlUQD5cwhWq0AXnYQYGxkfm',
    developerID: '84b13e55c0954e4b9045e943f593e9a2',
    from: 'zh-CHS',
    to: 'en',
  };
  const key = config.appKey,
    appKey = config.appID,
    query = str,
    from = config.from,
    to = config.to,
    vocabId = config.developerID;
  let currentTime = Math.round(new Date().getTime() / 1000),
    salt = new Date().getTime(),
    str1 = appKey + truncate(query) + salt + currentTime + key,
    sign = cryptoJS.SHA256(str1).toString(cryptoJS.enc.Hex),
    data = {
      q: query,
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
      signType: 'v3',
      curtime: currentTime,
      vocabId: vocabId,
    };

  let res = await axios({
    method: 'post',
    url: 'http://openapi.youdao.com/api',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (res.data.errorCode == '0') {
    console.log(`翻译中...`);
    return res.data.translation[0];
  }
  return str;
}

function diffObject(obj, newData, diff = {}) {
  for (const key in obj) {
    if (newData[key]) {
      if (typeof obj[key] === 'object') {
        diff[key] = {};
        diffObject(obj[key], newData[key], diff[key]);
      }
    } else {
      diff[key] = obj[key];
    }
  }
  return diff;
}

function truncate(q) {
  let len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function containZh(s) {
  const paten = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  if (!paten.exec(s)) {
    return false;
  } else {
    return true;
  }
}

function writeFileSync(diffMap, enMap, newLangPath) {
  diffMap.forEach((value, key) => {
    enMap.set(key, _.merge(enMap.get(key), value));
    let code = 'export default ' + JSON.stringify(enMap.get(key));
    code = utils.prettierCode(code);
    fs.writeFileSync(newLangPath + '/' + key, code);
  });
}
