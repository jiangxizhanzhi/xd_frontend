import _ from 'lodash';
export function formatDate(date, format) {
  // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
  if (!date || date === '') {
    return '';
  }

  if (typeof date === 'string') {
    var mts = date.match(/(\/Date\((\d+)\)\/)/);
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2]);
    }
  }

  date = new Date(date);
  if (!date || date.toUTCString() === 'Invalid Date') {
    return '';
  }

  var map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });

  return format;
}
export function isEqualDateStr(dateStr1, dateStr2) {
  const dateArr1 = dateStr1.split('/');
  const dateArr2 = dateStr2.split('/');
  if (parseInt(dateArr1[0], 10) !== parseInt(dateArr2[0], 10)) {
    return false;
  }
  if (parseInt(dateArr1[1], 10) !== parseInt(dateArr2[1], 10)) {
    return false;
  }
  if (parseInt(dateArr1[2], 10) !== parseInt(dateArr2[2], 10)) {
    return false;
  }
  return true;
}

export function formatTime(second_time, shelf) {
  let time = parseInt(second_time) + shelf.$t('m.s');
  if (parseInt(second_time) > 60) {
    let second = parseInt(second_time) % 60;
    let min = parseInt(second_time / 60);
    time = min + shelf.$t('m.min') + second + shelf.$t('m.s');
    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      let hour = parseInt(parseInt(second_time / 60) / 60);
      time =
        hour +
        shelf.$t('m.hours') +
        min +
        shelf.$t('m.min') +
        second +
        shelf.$t('m.s');
      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        time =
          day +
          shelf.$t('m.day') +
          hour +
          shelf.$t('m.hours') +
          min +
          shelf.$t('m.min') +
          second +
          shelf.$t('m.s');
      }
    }
  }
  return time;
}

export function singleFormatTime(second_time, shelf) {
  let time = parseInt(second_time);
  if (parseInt(second_time) < 60) {
    let second = parseInt(second_time) % 60;
    time = ' ' + second + ' ' + shelf.$t('m.s');
  } else if (parseInt(second_time) >= 60 && parseInt(second_time) <= 60 * 60) {
    // 显示分钟
    let min = parseInt(second_time / 60);
    // time = ' '+ min + ' '+ shelf.$t('m.min')
    if (min > 1) {
      time = ' ' + min + ' ' + shelf.$t('m.mins');
    } else {
      time = ' ' + min + ' ' + shelf.$t('m.min');
    }
  } else if (
    parseInt(second_time) > 60 * 60 &&
    parseInt(second_time) <= 60 * 60 * 24
  ) {
    // 显示小时
    let hour = parseInt(parseInt(second_time / 60) / 60);
    time = ' ' + hour + ' ' + shelf.$t('m.hour');
    if (hour > 1) {
      time = ' ' + hour + ' ' + shelf.$t('m.hour');
    } else {
      time = ' ' + hour + ' ' + shelf.$t('m.hours');
    }
  } else if (
    parseInt(second_time) > 60 * 60 * 24 &&
    parseInt(second_time) <= 60 * 60 * 24 * 3
  ) {
    // 显示天小时
    let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
    let hour = parseInt(parseInt(second_time / 60) / 60) - day * 24;
    if (day > 1) {
      if (hour > 1) {
        time =
          ' ' +
          day +
          ' ' +
          shelf.$t('m.days') +
          ' ' +
          +hour +
          ' ' +
          shelf.$t('m.hour');
      } else {
        time =
          ' ' +
          day +
          ' ' +
          shelf.$t('m.days') +
          ' ' +
          +hour +
          ' ' +
          shelf.$t('m.hours');
      }
    } else {
      if (hour > 1) {
        time =
          ' ' +
          day +
          ' ' +
          shelf.$t('m.day') +
          ' ' +
          +hour +
          ' ' +
          shelf.$t('m.hour');
      } else {
        time =
          ' ' +
          day +
          ' ' +
          shelf.$t('m.day') +
          ' ' +
          +hour +
          ' ' +
          shelf.$t('m.hours');
      }
    }
  } else {
    let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
    if (day > 1) {
      time = ' ' + day + ' ' + shelf.$t('m.days');
    } else {
      time = ' ' + day + ' ' + shelf.$t('m.day');
    }
  }
  return time;
}

export function errorMessage(res, shelf) {
  const datas = res.response.data;
  _.forEach(datas, (value, key) => {
    if (_.isArray(value)) {
      shelf.$message.error(value[0].message);
    } else {
      shelf.$message.error(value.message);
    }
  });
}

export function getValueName(list, mark) {
  let name = '';
  _.forEach(list, (item) => {
    if (item.value === mark) {
      name = item.name.toString();
    }
  });
  return name;
}
