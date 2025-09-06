import validateUtils from '@/utils/validate';
import { getI18N } from '@cyber/helper';

/* 验证title字段的长度在[4，40]之间 */
export function validateTitleLength(rule, value, callback) {
  var sum = validateUtils.validateLength(value);
  if (!sum) {
    callback(new Error(getI18N().t('common.errorInput')));
  } else if (sum < 4 || sum > 40) {
    callback(new Error(getI18N().t('m.inputNameLength')));
  } else {
    callback();
  }
}

/* 验证普通模块Description字段的长度（4-280） */
export function validateDescriptionLength(rule, value, callback) {
  var sum = validateUtils.validateLengthDesc(value);
  if (!sum) {
    callback(new Error(getI18N().t('common.descErrorInput')));
  } else if (sum < 4 || sum > 280) {
    callback(new Error(getI18N().t('m.inputDescLength')));
  } else {
    callback();
  }
}
/* 验证title字段的长度在[1.255]之间 */
export function validateTitleLength255(rule, value, callback) {
  var sum = validateUtils.validateLength(value);
  if (!sum) {
    callback(new Error(getI18N().t('common.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(getI18N().t('m.nameLength')));
  } else {
    callback();
  }
}
