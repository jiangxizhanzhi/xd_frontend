import { getI18N } from '@cyber/helper';
import Utils from '@/utils/util';
import { indexOf } from 'codemirror/src/util/misc';

export default {
  name: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(getI18N().t('m.namePh')));
    }
    const len = Utils.getByteLen(value);
    if (!len) {
      callback(new Error(getI18N().t('m.errorInputTip')));
    } else if (len < 4 || len > 40) {
      callback(new Error(getI18N().t('m.validataNameTip')));
    } else {
      callback();
    }
  },
  name255: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(getI18N().t('m.namePh')));
    }
    const len = Utils.getByteLen(value);
    if (!len) {
      callback(new Error(getI18N().t('m.errorInputTip')));
    } else if (len < 1 || len > 255) {
      callback(new Error(getI18N().t('m.validataNameTip255')));
    } else {
      callback();
    }
  },
  description: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('m.specificationPh')));
    } else {
      const len = Utils.getLenByDesc(value);
      if (len < 4 || len > 560) {
        callback(new Error(getI18N().t('m.validataDescTip')));
      } else {
        callback();
      }
    }
  },
  description2048: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('m.specificationPh')));
    } else {
      const len = Utils.getByteDescLen(value);
      if (len < 1 || len > 2048) {
        callback(new Error(getI18N().t('m.validataDescTip2048')));
      } else {
        callback();
      }
    }
  },

  startTime: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('m.startTimePh')));
    } else {
      callback();
    }
  },
  endTime: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('m.endTimePh')));
    } else {
      callback();
    }
  },
  preSkill: (rule, value, callback) => {
    if (value.length == 0) {
      callback(new Error('请设置前置技能标签'));
    } else {
      callback();
    }
  },
  trainSkill: (rule, value, callback) => {
    if (value.length == 0) {
      callback(new Error('请设置训练技能标签'));
    } else {
      callback();
    }
  },
  validateLength: (str) => {
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
  },

  validateLengthDesc: (str) => {
    var sum = 0;
    const value = str.trim();
    const cn_re = /[\u4e00-\u9fa5]/;
    const re = /^[^\u4e00-\u9fa5]/;
    for (var s = 0; s < value.length; s++) {
      if (re.test(value[s])) {
        sum = sum + 1;
      } else if (cn_re.test(value[s])) {
        sum = sum + 2;
      } else {
        return false;
      }
    }
    return sum;
  },
  //非必填2048
  desc2048: (rule, value, callback) => {
    if (!value) {
      // callback(new Error(getI18N().t('m.specificationPh')));
      callback();
    } else {
      const len = Utils.getByteDescLength(value);
      if (len < 1 || len > 2048) {
        callback(new Error(getI18N().t('m.validataDescTip2048')));
      } else {
        callback();
      }
    }
  },
  //测试描述2048非必填
  testDesc2048: (rule, value, callback) => {
    if (!value) {
      // callback(new Error(getI18N().t('m.specificationPh')));
      callback();
    } else {
      const len = Utils.getByteDescLength(value);
      if (len > 2048) {
        callback(new Error(getI18N().t('test.inputTestDescLength')));
      } else {
        callback();
      }
    }
  },
  // 操作过程必填2048
  operationProc2048: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('test.EnterOperationProc')));
      callback();
    } else {
      const len = Utils.getByteDescLength(value);
      if (len > 2048) {
        callback(new Error(getI18N().t('test.inputOperationProcLength')));
      } else {
        callback();
      }
    }
  },
  // 公告内容必填2048
  noticeContent2048: (rule, value, callback) => {
    if (!value) {
      callback(new Error(getI18N().t('notice.plzEnterAnnouncementContent')));
      callback();
    } else {
      const len = Utils.getByteDescLength(value);
      if (len > 2048) {
        callback(new Error(getI18N().t('notice.announcementContent2048')));
      } else {
        callback();
      }
    }
  },
};
