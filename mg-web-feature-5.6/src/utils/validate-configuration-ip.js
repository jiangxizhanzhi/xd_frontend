import _ from 'lodash';
import { getI18N } from '@cyber/helper';
let i18n = getI18N();

export const patternIp =
  /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
// /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

// 网络段地址池范围
export function networkAddressRangeValidate(rule, value, callback, maskCode) {
  if (value) {
    let splitArr = value.split('-');
    if (splitArr.length !== 2) {
      return callback(new Error(i18n.t('configuration.rangeAddressError')));
    } else {
      let isCorrect = true;
      if (splitArr.length) {
        for (let i = 0; i < splitArr.length; i++) {
          if (patternIp.test(splitArr[i]) == false) {
            isCorrect = false;
          }
        }
      }
      if (!isCorrect) {
        callback(new Error(i18n.t('configuration.rangeAddressError')));
      } else {
        if (!maskCode) {
          callback(new Error(i18n.t('configuration.noGetMaskError')));
        } else {
          const sameNetworkSegment = isEqualIPAddress(
            splitArr[0],
            splitArr[1],
            maskCode,
          );
          if (!sameNetworkSegment) {
            callback(new Error(i18n.t('configuration.noSameNetwork')));
          } else {
            callback();
          }
        }
      }
    }
  } else {
    callback();
  }
}
export function isEqualIPAddress(addr1, addr2, mask) {
  var res1 = [],
    res2 = [];
  addr1 = addr1.split('.');
  addr2 = addr2.split('.');
  mask = mask.split('.');
  for (var i = 0, ilen = addr1.length; i < ilen; i += 1) {
    res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
    res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
  }
  if (res1.join('.') == res2.join('.')) {
    // '在同一个网段'
    return true;
  } else {
    // '不在同一个网段'
    return false;
  }
}
