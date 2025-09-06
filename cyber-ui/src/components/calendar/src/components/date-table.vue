<template>
  <table
    cellspacing="0"
    cellpadding="0"
    class="el-date-table"
    @click="handleClick"
  >
    <tbody>
      <tr>
        <th v-for="(week, key) in WEEKS" :key="key">
          {{ $t('el.datepicker.weeks.' + week) }}
        </th>
      </tr>
      <tr class="el-date-table__row" v-for="(row, key) in rows" :key="key">
        <td v-for="(cell, key) in row" :class="getCellClasses(cell)" :key="key">
          <div>
            <span>
              {{ cell.text }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getStartDateOfMonth,
  nextDate,
  isDate,
  arrayFindIndex,
  clearTime as _clearTime,
} from '../utils/date-util';

import dayjs from 'dayjs';

import _ from 'lodash';

const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const getDateTimestamp = function (time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return _clearTime(new Date(time)).getTime();
  } else if (time instanceof Date) {
    return _clearTime(time).getTime();
  } else {
    return NaN;
  }
};

// remove the first element that satisfies `pred` from arr
// return a new array if modification occurs
// return the original array otherwise
const removeFromArray = function (arr, pred) {
  const idx =
    typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred);
  return idx >= 0 ? [...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr;
};

export default {
  props: {
    schedules: {
      type: Array,
      default() {
        return [];
      },
    },
    dateField: {
      type: String,
      default: 'date',
    },
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: (val) => val >= 1 && val <= 7,
    },

    value: {},

    defaultValue: {
      validator(val) {
        // either: null, valid Date object, Array of valid Date objects
        return (
          val === null ||
          isDate(val) ||
          (Array.isArray(val) && val.every(isDate))
        );
      },
    },

    date: {},

    disabledDate: {},

    cellClassName: {},
    showActive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    offsetDay() {
      const week = this.firstDayOfWeek;
      // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
      return week > 3 ? 7 - week : -week;
    },

    WEEKS() {
      const week = this.firstDayOfWeek;
      return WEEKS.concat(WEEKS).slice(week, week + 7);
    },

    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },

    rows() {
      const date = new Date(this.year, this.month, 1);
      let day = getFirstDayOfMonth(date); // day of first day
      const dateCountOfMonth = getDayCountOfMonth(
        date.getFullYear(),
        date.getMonth(),
      );
      const dateCountOfLastMonth = getDayCountOfMonth(
        date.getFullYear(),
        date.getMonth() === 0 ? 11 : date.getMonth() - 1,
      );

      day = day === 0 ? 7 : day;

      const offset = this.offsetDay;
      const rows = this.tableRows;
      let count = 1;

      const startDate = this.startDate;
      const disabledDate = this.disabledDate;
      const cellClassName = this.cellClassName;
      const getScheduleData = this.getScheduleData;
      const now = getDateTimestamp(new Date());

      for (let i = 0; i < 6; i++) {
        const row = rows[i];

        for (let j = 0; j < 7; j++) {
          let cell = row[j];
          if (!cell) {
            cell = {
              row: i,
              column: j,
              type: 'normal',
            };
          }

          cell.type = 'normal';

          const index = i * 7 + j;
          const time = nextDate(startDate, index - offset).getTime();
          cell.timestamp = time;
          cell.schedule = getScheduleData(time);
          const isToday = time === now;

          if (isToday) {
            cell.type = 'today';
          }

          if (i >= 0 && i <= 1) {
            const numberOfDaysFromPreviousMonth =
              day + offset < 0 ? 7 + day + offset : day + offset;

            if (j + i * 7 >= numberOfDaysFromPreviousMonth) {
              cell.text = count++;
            } else {
              cell.text =
                dateCountOfLastMonth -
                (numberOfDaysFromPreviousMonth - (j % 7)) +
                1 +
                i * 7;
              cell.type = 'prev-month';
            }
          } else {
            if (count <= dateCountOfMonth) {
              cell.text = count++;
            } else {
              cell.text = count++ - dateCountOfMonth;
              cell.type = 'next-month';
            }
          }

          let cellDate = new Date(time);
          cell.disabled =
            typeof disabledDate === 'function' && disabledDate(cellDate);
          cell.customClass =
            typeof cellClassName === 'function' && cellClassName(cellDate);
          this.$set(row, j, cell);
        }
      }

      return rows;
    },
  },

  watch: {
    showActive: {
      handler(nv, ov) {
        if (!nv) {
          this.currentClick = '';
        }
      },
    },
  },

  data() {
    return {
      tableRows: [[], [], [], [], [], []],
      lastRow: null,
      lastColumn: null,
      currentClick: '',
    };
  },

  methods: {
    getScheduleData(timestamp) {
      let date;
      this.schedules.some((i) => {
        const day = dayjs(i[this.dateField]);
        if (day.isSame(timestamp, 'date')) {
          date = i;
          return true;
        }
        return false;
      });
      return date;
    },
    cellMatchesDate(cell, date) {
      const value = new Date(date);
      return (
        this.year === value.getFullYear() &&
        this.month === value.getMonth() &&
        Number(cell.text) === value.getDate()
      );
    },

    getCellClasses(cell) {
      const defaultValue = this.defaultValue
        ? Array.isArray(this.defaultValue)
          ? this.defaultValue
          : [this.defaultValue]
        : [];

      let classes = [];
      if (cell.schedule) {
        classes.push('schedule');
      }
      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
        classes.push('available');
        if (cell.type === 'today') {
          classes.push('today');
        }
      } else {
        classes.push(cell.type);
      }

      if (
        cell.type === 'normal' &&
        defaultValue.some((date) => this.cellMatchesDate(cell, date))
      ) {
        classes.push('default');
      }

      if (cell.disabled) {
        classes.push('disabled');
      }

      if (cell.selected) {
        classes.push('selected');
      }

      if (cell.customClass) {
        classes.push(cell.customClass);
      }
      if (this.currentClick === cell.timestamp) {
        classes.push('current-click');
      }

      return classes.join(' ');
    },

    getDateOfCell(row, column) {
      const offsetFromStart = row * 7 + column - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },
    handleClick(event) {
      this.currentClick = '';
      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') {
        return;
      }

      const row = target.parentNode.rowIndex - 1;
      const column = target.cellIndex;
      const cell = this.rows[row][column];
      if (!cell.disabled && cell.schedule) {
        this.currentClick = cell && cell.timestamp ? cell.timestamp : '';
      }
      const position = {
        x: event.clientX,
        y: event.clientY,
      };
      this.$emit('pick', cell.schedule, position);
    },
  },
};
</script>
