import CbCalendar from './src/calendar.vue';
/* istanbul ignore next */
CbCalendar.install = function (Vue) {
  Vue.component(CbCalendar.name, CbCalendar);
};
export default CbCalendar;
