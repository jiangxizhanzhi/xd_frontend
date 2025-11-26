<template>
  <div class="el-picker-panel el-date-picker" :style="{ width: width }">
    <div class="el-picker-panel__body-wrapper">
      <div class="el-picker-panel__body">
        <div
          class="el-date-picker__header"
          :class="{
            'el-date-picker__header--bordered':
              currentView === 'year' || currentView === 'month',
          }"
        >
          <button
            type="button"
            @click="prevYear"
            class="
              el-picker-panel__icon-btn
              el-date-picker__prev-btn
              el-icon-d-arrow-left
            "
          ></button>
          <button
            type="button"
            @click="prevMonth"
            v-show="currentView === 'date'"
            class="
              el-picker-panel__icon-btn
              el-date-picker__prev-btn
              el-icon-arrow-left
            "
          ></button>
          <span
            @click="showYearPicker"
            role="button"
            class="el-date-picker__header-label"
            >{{ yearLabel }}</span
          >
          <span
            @click="showMonthPicker"
            v-show="currentView === 'date'"
            role="button"
            class="el-date-picker__header-label"
            :class="{ active: currentView === 'month' }"
            >{{ $t(`el.datepicker.month${month + 1}`) }}</span
          >
          <button
            type="button"
            @click="nextYear"
            class="
              el-picker-panel__icon-btn
              el-date-picker__next-btn
              el-icon-d-arrow-right
            "
          ></button>
          <button
            type="button"
            @click="nextMonth"
            v-show="currentView === 'date'"
            class="
              el-picker-panel__icon-btn
              el-date-picker__next-btn
              el-icon-arrow-right
            "
          ></button>
        </div>

        <div class="el-picker-panel__content">
          <date-table
            v-show="currentView === 'date'"
            @pick="handleDatePick"
            :first-day-of-week="firstDayOfWeek"
            :value="value"
            :default-value="defaultValue ? new Date(defaultValue) : null"
            :date="date"
            :schedules="schedules"
            :dateField="dateField"
            :cell-class-name="cellClassName"
            :disabled-date="disabledDate"
            :showActive="showActive"
          >
          </date-table>
          <year-table
            v-show="currentView === 'year'"
            @pick="handleYearPick"
            :value="value"
            :default-value="defaultValue ? new Date(defaultValue) : null"
            :date="date"
            :disabled-date="disabledDate"
          >
          </year-table>
          <month-table
            v-show="currentView === 'month'"
            @pick="handleMonthPick"
            :value="value"
            :default-value="defaultValue ? new Date(defaultValue) : null"
            :date="date"
            :disabled-date="disabledDate"
          >
          </month-table>
        </div>
      </div>
    </div>
    <div
      class="cb-picker-panel__footer"
      v-show="showToday && currentView === 'date'"
    >
      <cb-button type="text" @click="changeToNow">
        {{ $t('g.today') }}
      </cb-button>
    </div>
  </div>
</template>

<script type="text/babel">
import {
  isDate,
  prevYear,
  nextYear,
  prevMonth,
  nextMonth,
  changeYearMonthAndClampDate,
  extractDateFormat,
} from '../utils/date-util';
import CbButton from '../../../button';

import YearTable from './year-table.vue';
import MonthTable from './month-table.vue';
import DateTable from './date-table.vue';

export default {
  components: {
    YearTable,
    MonthTable,
    DateTable,
    CbButton,
  },
  props: {
    width: {
      type: String,
      default: '322px',
    },
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
    showToday: {
      type: Boolean,
      default: true,
    },
    showActive: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      if (isDate(val)) {
        this.date = new Date(val);
      } else {
        this.date = this.getDefaultValue();
      }
    },

    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    },
  },

  methods: {
    changeToNow() {
      this.date = new Date();
    },
    showMonthPicker() {
      this.currentView = 'month';
    },

    showYearPicker() {
      this.currentView = 'year';
    },

    prevMonth() {
      this.date = prevMonth(this.date);
      this.$emit('prevMonth', this.date);
    },

    nextMonth() {
      this.date = nextMonth(this.date);
      this.$emit('nextMonth', this.date);
    },

    prevYear() {
      if (this.currentView === 'year') {
        this.date = prevYear(this.date, 10);
      } else {
        this.date = prevYear(this.date);
      }
      this.$emit('prevYear', this.date);
    },

    nextYear() {
      if (this.currentView === 'year') {
        this.date = nextYear(this.date, 10);
      } else {
        this.date = nextYear(this.date);
      }
      this.$emit('nextYear', this.date);
    },

    handleMonthPick(month) {
      this.date = changeYearMonthAndClampDate(this.date, this.year, month);
      this.currentView = 'date';
    },

    handleDatePick(schedule, position) {
      this.$emit('select', schedule, position);
    },

    handleYearPick(year) {
      this.date = changeYearMonthAndClampDate(this.date, year, this.month);
      this.currentView = 'month';
    },

    getDefaultValue() {
      return this.defaultValue ? new Date(this.defaultValue) : new Date();
    },
  },

  data() {
    return {
      date: new Date(),
      value: '',
      defaultValue: null, // use getDefaultValue() for time computation
      currentView: 'date',
      disabledDate: '',
      cellClassName: '',
      firstDayOfWeek: 7,
      format: '',
    };
  },

  computed: {
    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    monthDate() {
      return this.date.getDate();
    },

    yearLabel() {
      const yearTranslation = this.$t('el.datepicker.year');
      if (this.currentView === 'year') {
        const startYear = Math.floor(this.year / 10) * 10;
        if (yearTranslation) {
          return (
            startYear +
            ' ' +
            yearTranslation +
            ' - ' +
            (startYear + 9) +
            ' ' +
            yearTranslation
          );
        }
        return startYear + ' - ' + (startYear + 9);
      }
      return this.year + ' ' + yearTranslation;
    },

    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return 'yyyy-MM-dd';
      }
    },
  },
};
</script>
