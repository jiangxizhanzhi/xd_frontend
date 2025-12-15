/**
 * Created by PanJiaChen on 16/11/18.
 */

import { indexOf } from 'codemirror/src/util/misc';

/* 大小写字母、数字、下划线*/
export function validateAlphabetsNumber(str) {
  const reg = /^[_a-zA-Z0-9]+$/;
  return reg.test(str);
}

/* 验证字段是否包含空格 */
export function validateSpaces(str) {
  const re = /\s/;
  return re.test(str);
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

/* 验证version字符串的长度 */
export function validateLengthVer(str) {
  var sum = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  for (var s = 0; s < value.length; s++) {
    if (cn_re.test(value[s])) {
      sum = sum + 2;
    } else {
      sum = sum + 1;
    }
  }
  return sum;
}

/* 验证任务技能点字符串的长度 */
export function validateLengthSkill(str) {
  var sum = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  const re = /^[_a-zA-Z0-9\s]/;
  const rr = /\s/;
  for (var s = 0; s < value.length; s++) {
    if (cn_re.test(value[s])) {
      sum = sum + 2;
    } else if (re.test(value[s]) || rr.test(value[s])) {
      sum = sum + 1;
    } else {
      return false;
    }
  }
  return sum;
}

/* 验证Description的长度 */
export function validateLengthDesc(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const a = str.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 1;
    }
  }
  return len;
}

//验证描述长度不是必填项
export function validateLengthOptional(str) {
  let len = 0;
  if (str && str.length) {
    for (let i = 0; i < str.length; i++) {
      const a = str.charAt(i);
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 1;
      } else {
        len += 1;
      }
    }
  }

  return len;
}

/* 计算镜像title字符长度, 包含特俗字符['.', '-', '_', ':'] */
export function handlerImageLength(str) {
  var length = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  const re = /^[a-zA-Z0-9]/;
  const rr = /\s/;
  const character_re = ['.', '-', '_', ':'];
  for (var i = 0; i < value.length; i++) {
    if (cn_re.test(value[i])) {
      length = length + 2;
    } else if (
      re.test(value[i]) ||
      rr.test(value[i]) ||
      indexOf(character_re, value[i]) !== -1
    ) {
      length = length + 1;
    } else {
      return false;
    }
  }
  return length;
}
