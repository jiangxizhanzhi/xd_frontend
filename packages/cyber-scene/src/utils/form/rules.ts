import _ from 'lodash';
import t from '../i18n/index';

export const ipRexp =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/;
const integerRexp = /^-?[0-9]\d*$/;
const integerAnd0Rexp = /^[0-9]\d*$/;
const positiveIntegerRexp = /^[1-9]\d*$/;
const ipSegment =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?\/(?:[0-9]|[12][0-9]|3[012])$/;
const ipSegment_IP =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?(\/(?:[0-9]|[12][0-9]|3[012]))?$/;
const INIT_COLON = /^(-?[1-9]\d*:-?[0-9]\d*$)|^(-?[1-9]\d*$)|0/; // 冒号 + 前后数字 || 数字
const INIT_COMMA = /^([0-9]+,?:?)+$/; // 逗号、冒号和整数
/**
 * 匹配ip格式
 * @param value
 */
export function matchIp(value: string) {
  if (_.isEmpty(value)) {
    return true;
  }
  return ipRexp.test(value.toString());
}

export function validateIp(rule: Array<any>, value: string, callback: any) {
  if (value && !ipRexp.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.ip')));
  } else {
    callback();
  }
}

/**
 * 校验 ip 网段 xxx.xxx.xxx.xxx/xxx
 */
export function validateIpSegment(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !ipSegment.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.ipSegment')));
  } else {
    callback();
  }
}

/**
 * 校验整数
 */
export function validateInteger(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !integerRexp.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.integer')));
  } else {
    callback();
  }
}

/**
 * 0和正整数
 */
export function validatePositiveIntegerOrZero(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !integerAnd0Rexp.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.integerOrZero')));
  } else {
    callback();
  }
}

/**
 * 校验正整数 1-4294967295
 */
export function validatePositiveInteger(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !positiveIntegerRexp.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.positiveInteger')));
  } else {
    callback();
  }
}

/**
 * 校验空值
 */
export function validateEmpty(rule: Array<any>, value: string, callback: any) {
  if (!value.trim()) {
    callback(new Error(t('menu.dialog.validator.empty')));
  } else {
    callback();
  }
}

/**
 * 校验vlanID (1-4096)
 */
export function validateVlanId(rule: Array<any>, value: string, callback: any) {
  let num = Number(value);
  if (num && (num < 1 || num > 4094)) {
    callback(
      new Error(t('menu.dialog.validator.numberSize', { min: 1, max: 4094 })),
    );
  } else {
    callback();
  }
}

/**
 * 校验时延最大值500
 */
export function validate500(rule: Array<any>, value: string, callback: any) {
  let num = Number(value);
  if (num && (num < 0 || num > 500)) {
    callback(
      new Error(t('menu.dialog.validator.numberSize', { min: 0, max: 500 })),
    );
  } else {
    callback();
  }
}

/**
 * 校验peer、peerAs
 */
export function validatePeer(rule: Array<any>, value: string, callback: any) {
  let num = Number(value);
  if (num && (num < 1 || num > 4294967295)) {
    callback(
      new Error(
        t('menu.dialog.validator.numberSize', { min: 1, max: 4294967295 }),
      ),
    );
  } else {
    callback();
  }
}

/**
 * 校验bool
 */
export function validateBool(rule: Array<any>, value: string, callback: any) {
  if (!['true', 'false'].includes(value)) {
    callback(new Error(t('menu.dialog.validator.bool')));
  } else {
    callback();
  }
}

/**
 * 校验端口大小 (1-65535)
 */
export function validatePort(rule: Array<any>, value: string, callback: any) {
  let num = Number(value);
  if (num && (num < 1 || num > 65535)) {
    callback(
      new Error(t('menu.dialog.validator.numberSize', { min: 1, max: 65535 })),
    );
  } else {
    callback();
  }
}

/**
 * 校验丢包率 1-99 整数
 */
export function validateLoss(rule: Array<any>, value: string, callback: any) {
  let num = Number(value);
  if (num && (num < 1 || num > 99)) {
    callback(
      new Error(t('menu.dialog.validator.numberSize', { min: 1, max: 99 })),
    );
  } else {
    callback();
  }
}

/**
 * 校验ip格式或者ip网段格式
 */
export function validateIpAddress(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !ipSegment_IP.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.ipAddress')));
  } else {
    callback();
  }
}

/**
 * 校验防火墙源端口和目标端口，x:y -> x范围为0-65535，正整数，y范围为1-65535，正整数。且x<y
 */
export function validateFirewallPort(
  rule: Array<any>,
  value: string,
  callback: any,
) {
  if (value && !INIT_COMMA.test(value.toString())) {
    callback(new Error(t('menu.dialog.validator.intAndSymbol')));
  } else {
    if (value?.includes(',')) {
      let strArr = value.split(',');
      strArr.forEach((item, index) => {
        let errTxt = hasColon(item);
        if (errTxt) {
          callback(new Error(hasColon(item)));
        }
      });
    } else {
      let errTxt = hasColon(value);
      if (errTxt) {
        callback(new Error(hasColon(value)));
      }
      if (Number(value) > 65535) {
        callback(
          new Error(
            t('menu.dialog.validator.numberSize', { min: 0, max: 65535 }),
          ),
        );
      }
    }
    callback();
  }
}

/**
 * 逗号的单元，判断是否有冒号，如果有 是否符合规则
 * @param value
 */
function hasColon(value: string) {
  let portValue = t('menu.dialog.validator.portValue');
  if (value?.includes(':')) {
    // 如果有冒号，判断冒号前后的，没有冒号，判断整数范围
    if (!INIT_COLON.test(value.toString())) {
      return t('menu.dialog.validator.firewallPort');
    }
    let colon = value.split(':');
    for (let i = 0; i < colon.length; i++) {
      if (Number(colon[i]) > 65535) {
        return (
          portValue +
          t('menu.dialog.validator.numberSize', { min: 0, max: 65535 })
        );
      }
    }
    if (Number(colon[0]) >= Number(colon[1])) {
      return t('menu.dialog.validator.shouldBeLarger');
    }
  } else {
    if (Number(value) > 65535) {
      return (
        portValue +
        t('menu.dialog.validator.numberSize', { min: 0, max: 65535 })
      );
    }
  }
}
