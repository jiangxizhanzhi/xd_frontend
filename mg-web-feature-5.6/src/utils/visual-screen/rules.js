import _ from 'lodash';
import { getI18N } from '@cyber/helper';
const i18n = getI18N();

/* 验证任务阶段名称title字段的长度在[1，255]之间 */
export function validateStageTitle(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(i18n.t('dynamicControl.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(i18n.t('dynamicControl.inputStageNameLength')));
  } else {
    callback();
  }
}

/* 验证任务方案名称title字段的长度在[1，255]之间 */
export function validateStageName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(i18n.t('dynamicControl.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(i18n.t('dynamicControl.inputTaskNameLength')));
  } else {
    callback();
  }
}
//方案名称
export function validatePlanName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(i18n.t('dynamicControl.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(i18n.t('dynamicControl.inputPlanNameLength')));
  } else {
    callback();
  }
}

/* 验证title字符串的长度(包含'_','-') */
export function validateLength(str) {
  var sum = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  const re = /^[_a-zA-Z0-9\s]/;
  for (var s = 0; s < value.length; s++) {
    if (re.test(value[s]) || value[s] === '-') {
      sum = sum + 1;
    } else if (cn_re.test(value[s])) {
      sum = sum + 2;
    } else {
      return false;
    }
  }
  return sum;
}
