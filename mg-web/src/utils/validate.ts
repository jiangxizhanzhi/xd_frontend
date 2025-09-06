import { getI18N } from '@cyber/helper';

const i18n = getI18N();
import Utils from './util';
export default {
  logo: (rule, value, callback) => {
    if (!value) {
      callback(new Error(i18n.t('personal.pleaseUploadPicture')));
    } else {
      callback();
    }
  },
  startTime: (rule, value, callback) => {
    if (!value) {
      callback(new Error(i18n.t('personal.startTimePh')));
    } else {
      callback();
    }
  },
  endTime: (rule, value, callback) => {
    if (!value) {
      callback(new Error(i18n.t('personal.endTimePh')));
    } else {
      callback();
    }
  },

  validateUsername: (rule, value, callback) => {
    if (!value) {
      return callback(i18n.t('personal.nameNull'));
    }
    var sum = Utils.getByteLen(value) >= 4 && Utils.getByteLen(value) <= 40;
    if (!sum) {
      callback(new Error(i18n.t('personal.nameLength')));
    } else {
      callback();
    }
  },
  validateSignature: (rule, value, callback) => {
    var sum = Utils.getByteLen(value) <= 1000;
    if (!sum) {
      callback(new Error(i18n.t('personal.signatureLength')));
    } else {
      callback();
    }
  },
  studentId: (rule, value, callback) => {
    const len = Utils.getByteLen(value);
    if (len > 32) {
      callback(new Error(i18n.t('personal.validataStudentIdTip')));
    } else {
      callback();
    }
  },
  address: (rule, value, callback) => {
    const len = Utils.getByteLen(value);
    if (len > 256) {
      callback(new Error(i18n.t('personal.validataAddressTip')));
    } else {
      callback();
    }
  },
  validateIdCard: (rule, value, callback) => {
    const len = Utils.getByteLen(value);
    if (len > 32) {
      callback(new Error(i18n.t('personal.validataStudentIdTip')));
    } else {
      callback();
    }
  },
  validateMobile: (rule, value, callback) => {
    const len = Utils.getByteLen(value);
    if (len > 32) {
      callback(new Error(i18n.t('personal.validataStudentIdTip')));
    } else {
      callback();
    }
  },
};
