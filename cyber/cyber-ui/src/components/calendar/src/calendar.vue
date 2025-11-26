
<template>
  <div class="cb-calendar">
    <calendar-date
      :schedules="data"
      :dateField="dateField"
      :width="width"
      :showToday="showToday"
      :showActive="showActive"
      @select="select"
      @prevMonth="prevMonth"
      @nextMonth="nextMonth"
      @prevYear="prevYear"
      @nextYear="nextYear"
    ></calendar-date>
  </div>
</template>

<script>
import CalendarDate from './components/date.vue';
/**
 * @displayName cb-calendar 日历
 * @classify Form/表单
 */
export default {
  name: 'CbCalendar',
  components: {
    CalendarDate,
  },
  props: {
    /**
     * 日历宽度
     */
    width: {
      type: String,
      default: '322px',
    },
    /**
     * 日期绑定值
     */
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     *
     */
    dateField: {
      type: String,
      default: 'date',
    },
    /**
     * 是否展示“今天”
     */
    showToday: {
      type: Boolean,
      default: true,
    },
    /**
     * 日期是否被选中，用于页面样式
     */
    showActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },

  computed: {},

  methods: {
    select(...args) {
      /**
       * 用户选定值时触发
       * @event select
       * @property {String} schedules 选择的日期
       */
      this.$emit('select', ...args);
    },
    prevMonth(...args) {
      /**
       * 用户选定上个月时触发
       * @event prevMonth
       * @property {String} date 上个月
       */
      this.$emit('prevMonth', ...args);
    },
    nextMonth(...args) {
      /**
       * 用户选定下个月时触发
       * @event nextMonth
       * @property {String} date 下个月
       */
      this.$emit('nextMonth', ...args);
    },
    prevYear(...args) {
      /**
       * 用户选定上一年时触发
       * @event prevYear
       * @property {String} year 上一年
       */
      this.$emit('prevYear', ...args);
    },
    nextYear(...args) {
      /**
       * 用户选定下一年时触发
       * @event nextYear
       * @property {String} year 下一年
       */
      this.$emit('nextYear', ...args);
    },
  },
};
</script>
