import { getI18N } from '@cyber/helper';

let i18n = getI18N();
export function gettext(str) {
  return i18n.t(str);
}

/* 计算字符长度, 包含特俗字符 */
export function handlerLength(str) {
  var length = 0;
  const value = str.trim();
  const re = /[\u4e00-\u9fa5]/;
  for (var i = 0; i < value.length; i++) {
    if (re.test(value[i])) {
      length = length + 1;
    } else {
      length = length + 1;
    }
  }
  return length;
}

/* 验证知识库技能库技能编号长度 */
export function validateSkillNumberLength(rule, value, callback) {
  var sum = handlerLength(value);
  if (sum < 1 || sum > 255) {
    callback(new Error(gettext('careerSystem.enterNumber255')));
  } else {
    callback();
  }
}
// 知识库 技能库编号 校验规则
// 1、支持大小写英文字母
// 2、支持数字
// 3、支持特殊字符  ！ # ￥ %  * -
export function validateSkillNumberRules(rule, value, callback) {
  var regRule = /^[0-9a-zA-Z!#￥%*-]+$/;
  if (!regRule.test(value)) {
    callback(new Error(gettext('careerSystem.skillNumberRules')));
  } else {
    callback();
  }
}

/* 验证知识库技能库内容长度 */
export function validateSkillTitleLength(rule, value, callback) {
  var sum = handlerLength(value);
  if (sum < 1 || sum > 2048) {
    callback(new Error(gettext('careerSystem.enterContent2048')));
  } else {
    callback();
  }
}
