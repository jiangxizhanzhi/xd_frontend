import {
  validateSpaces,
  validateLength,
  validateAlphabetsNumber,
  validateLengthDesc,
  validateLengthOptional,
} from '@/utils/validate-cms';
import {
  validateName,
  validateNamePatch,
} from '@/api/events/assessNameValidate';
import _ from 'lodash';
import { getI18n } from '@/lang/';

/* 禁止空格输入 */
export function forbiddenSpaces(rule, value, callback) {
  if (validateSpaces(value)) {
    callback(new Error());
  } else {
    callback();
  }
}

/* 验证大小写字母、数字、下划线*/
export function isAlphabetsNumber(rule, value, callback) {
  if (!validateAlphabetsNumber(value)) {
    callback(new Error());
  } else {
    callback();
  }
}

/* 验证任务阶段名称title字段的长度在[4，20]之间 */
export function validateStageTitle(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput2')));
  } else if (sum < 4 || sum > 255) {
    callback(new Error(getI18n().t('settings.inputStageNameLength')));
  } else {
    callback();
  }
}

/* 验证任务方案名称title字段的长度在[1，255]之间 */
export function validateStageName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput2')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(getI18n().t('settings.inputTaskNameLength')));
  } else {
    callback();
  }
}

/* 验证测评管理名称字段的长度在[1，255]之间 */
export function validateAssessName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput2')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(getI18n().t('settings.inputAssessNameLength')));
  } else {
    callback();
  }
}

/* 验证自定义探针名称title字段的长度在[1，255]之间 */
export function validateProbeName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput2')));
  } else if (sum < 1 || sum > 40) {
    callback(new Error(getI18n().t('settings.inputProbeName')));
  } else {
    callback();
  }
}

/* 验证采集模板名称title字段的长度在[1，255]之间 */
export function validateTemplateName(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput2')));
  } else if (sum < 1 || sum > 40) {
    callback(new Error(getI18n().t('settings.inputTemplateName')));
  } else {
    callback();
  }
}

/* 探针管理描述字段的长度在[1，500]之间 */
export function validateProbeDesc(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback();
  } else if (sum < 1 || sum > 500) {
    callback(new Error(getI18n().t('settings.inputProbeDescLength')));
  } else {
    callback();
  }
}

// 验证自定义探针参数说明字段长度1-500
export function validateProbeParamrsLength(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback();
  } else if (sum < 1 || sum > 500) {
    callback(new Error(getI18n().t('settings.probeParamDescLengthError')));
  } else {
    callback();
  }
}

/* 验证title字段的长度在[4，40]之间 */
export function validateTitleLength(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput')));
  } else if (sum < 4 || sum > 40) {
    callback(new Error(getI18n().t('settings.inputNameLength')));
  } else {
    callback();
  }
}

/* 验证必填名称的长度在[1，255]之间 */
export function validateTitleLength255(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(getI18n().t('settings.inputNameLength255')));
  } else {
    callback();
  }
}

/* 验证快照名称长度在[1，219]之间 */
export function validateTitleLength219(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput')));
  } else if (sum < 1 || sum > 219) {
    callback(new Error(getI18n().t('settings.inputNameLength219')));
  } else {
    callback();
  }
}

//验证单兵,团队,名称长度[1,255]之间
export const validateTrainTitleLength = (id, type) => {
  return (rule, value, callback) => {
    var sum = validateLength(value);
    if (!sum) {
      callback(new Error(getI18n().t('common.errorInput')));
    } else if (sum < 1 || sum > 255) {
      callback(new Error(getI18n().t('settings.inputTrainNameLength')));
    } else {
      validateThisName(id, type, value, callback);
    }
  };
};
// 名称重复校验
export function validateThisName(id, type, value, callback) {
  if (id) {
    validateNamePatch(value, type, id)
      .then(() => {
        callback();
      })
      .catch((error) => {
        const msg = _.get(error, 'data.message') || '';
        callback(new Error(msg));
      });
  } else {
    validateName(value, type)
      .then((res) => {
        callback();
      })
      .catch((error) => {
        const msg = _.get(error, 'data.message') || '';
        callback(new Error(msg));
      });
  }
}
/* 验证单兵团队红蓝任务阶段添加节点字段的长度在[1，255]之间 */
export function validateTrainTaskLength(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.errorInput')));
  } else if (sum < 1 || sum > 255) {
    callback(new Error(getI18n().t('settings.nameLength')));
  } else {
    callback();
  }
}
/* 验证场景管理Description字段的长度（4-560） */
export function validateScenseDescriptionLength(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.descErrorInput')));
  } else if (sum < 1 || sum > 2048) {
    callback(new Error(getI18n().t('settings.inputScenseDescLength')));
  } else {
    callback();
  }
}
/* 验证普通模块Description字段的长度（4-280） */
export function validateDescriptionLength(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.descErrorInput')));
  } else if (sum < 4 || sum > 280) {
    callback(new Error(getI18n().t('settings.inputDescLength')));
  } else {
    callback();
  }
}

/* 验证描述Description不必填字段的长度（1-2048） */
export function validateDescription(rule, value, callback) {
  var sum = validateLengthOptional(value);
  if (!sum) {
    callback();
    // callback(new Error(getI18n().t('common.descErrorInput')));
  } else if (sum < 1 || sum > 2048) {
    callback(new Error(getI18n().t('settings.inputScenseDescLength')));
  } else {
    callback();
  }
}

// 验证攻击流量的新增参数的参数说明字段长度1-2048
export function validateParametersLength(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.descErrorInput')));
  } else if (sum < 1 || sum > 2048) {
    callback(new Error(getI18n().t('probeRules.parametersLengthError')));
  } else {
    callback();
  }
}

/* 验证Description必填字段的长度（1-2048） */
export function validateDescLength2048(rule, value, callback) {
  var sum = validateLengthDesc(value);
  if (!sum) {
    callback(new Error(getI18n().t('common.descErrorInput')));
  } else if (sum < 1 || sum > 2048) {
    callback(new Error(getI18n().t('settings.descLengthInput2048')));
  } else {
    callback();
  }
}

/* 验证标签内容长度 */
export function validateCategoryLength(rule, value, callback) {
  var sum = validateLength(value);
  if (!sum) {
    callback(new Error(getI18n().t('crScene.errorInput')));
  } else if (sum < 4 || sum > 20) {
    callback(new Error(getI18n().t('settings.inputCategoryLength')));
  } else {
    callback();
  }
}

// 校验输入时间是否为正整数，且小于100
export function validateTime(rule, value, callback) {
  const time = /^[1-9][0-9]*$/;
  if (!time.test(value)) {
    callback(new Error(getI18n().t('crEvent.validateTime')));
  } else if (value > 100) {
    callback(new Error(getI18n().t('crEvent.validateTimeLength')));
  } else {
    callback();
  }
}

//流量管理，校验至少选择一种协议
export function validateProtocolList(rule, value, callback) {
  if (!value || value.length === 0) {
    return callback(new Error(getI18n().t('traffic.selectOneProtocol')));
  }
  for (let i = 0; i < value.length; i++) {
    if (value[i].marked) {
      return callback();
    }
  }
  return callback(new Error(getI18n().t('traffic.selectOneProtocol')));
}
