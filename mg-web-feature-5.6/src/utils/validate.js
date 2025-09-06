import { getI18N } from '@cyber/helper';
import Utils from './util';
let i18n = getI18N();
function gettext(str) {
  return i18n.t(str);
}

export default {
  name: (rule, value, callback) => {
    const i18n = getI18N();
    if (!value) {
      return callback(new Error(i18n.t('m.namePh')));
    }
    const len = Utils.getByteLen(value);
    if (len < 4 || len > 40) {
      callback(new Error(i18n.t('m.validataNameTip')));
    } else {
      callback();
    }
  },
  courseName: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(gettext('m.namePh')));
    }
    const len = Utils.getByteLen(value);
    if (len < 4 || len > 100) {
      callback(new Error(gettext('m.validataCourseNameTip')));
    } else {
      callback();
    }
  },
  description: (rule, value, callback) => {
    const i18n = getI18N();
    if (!value) {
      callback(new Error(i18n.t('m.specificationPh')));
    } else {
      const len = Utils.getByteLen(value);
      if (len < 4 || len > 280) {
        callback(new Error(i18n.t('m.validataDescTip')));
      } else {
        callback();
      }
    }
  },

  checkReplyComment: (rule, value, callback) => {
    const i18n = getI18N();
    if (!value) {
      return callback(new Error(i18n.t('m.exercise.emptyComment')));
    }
    var l = Utils.getByteLen(value) >= 0 && Utils.getByteLen(value) <= 250;
    if (!l) {
      callback(new Error(i18n.t('m.exercise.maxComment')));
    } else {
      callback();
    }
  },
  checkShortAnswer: (rule, value, callback) => {
    const i18n = getI18N();

    if (!value) {
      return callback(new Error(i18n.t('m.exercise.emptyAnswer')));
    }
    var l = Utils.getByteLen(value) >= 0 && Utils.getByteLen(value) <= 2048;
    if (!l) {
      callback(new Error(i18n.t('m.exercise.blankShortAnswer2048')));
    } else {
      callback();
    }
  },
  checkCompletion: (rule, value, callback) => {
    const i18n = getI18N();

    if (!value) {
      return callback(new Error(i18n.t('m.exercise.emptyAnswer')));
    }
    var l = Utils.getByteLen(value) >= 0 && Utils.getByteLen(value) <= 255;
    if (!l) {
      callback(
        new Error(
          i18n.t('m.exercise.blankShortAnswer', [
            i18n.t('subject.fillPosition'),
          ]),
        ),
      );
    } else {
      callback();
    }
  },

  jobName: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(gettext('m.namePh')));
    }
    const len = Utils.getByteLen(value);
    if (len < 1 || len > 255) {
      callback(new Error(gettext('m.jobNameTip')));
    } else {
      callback();
    }
  },
  //讲师非必填字段64
  lecturers64: (rule, value, callback) => {
    if (!value) {
      callback();
    } else {
      const len = Utils.getByteLen(value);
      if (len > 64) {
        callback(new Error(getI18N().t('m.lecturerLength')));
      } else {
        callback();
      }
    }
  },
};
