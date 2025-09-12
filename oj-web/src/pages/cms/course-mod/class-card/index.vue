<template>
  <cb-inner-page :background="true" title="课程表">
    <div class="calendar-content">
      <div class="select-div">
        <div>
          <cb-button>{{ $t('m.viewClass') }}</cb-button>
          <cb-tooltip
            class="marleft20"
            :disabled="!organizationTitle"
            effect="dark"
            :content="organizationTitle"
            placement="top-start"
            v-show="chooseValue === 'class'"
          >
            <cb-cascader
              v-model="organizationId"
              v-show="chooseValue === 'class'"
              :options="organizationOptions"
              :placeholder="$t('views.notice.validator.selectOrganization')"
              :props="optionProps"
              :clearable="true"
              @change="handleChange"
              ref="orgaztionIdCascader"
            ></cb-cascader>
          </cb-tooltip>
        </div>
      </div>
      <FullCalendar
        ref="fullCalendar"
        id="calendar"
        @select="handleSelect"
        @eventRender="eventRender"
        @eventClick="eventClick"
        @eventMouseEnter="eventMouseover"
        @eventMouseLeave="eventMouseout"
        :plugins="calendarPlugins"
        :all-day-slot="false"
        :slot-event-overlap="false"
        :select-overlap="false"
        :header="{ left: '', center: 'prev,title,next', right: 'today' }"
        :business-hours="{
          startTime: '08:00',
          endTime: '21:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        }"
        :events="events"
        :firstDay="1"
        height="auto"
        :select-mirror="true"
        min-time="00:00:00"
        max-time="24:00:00"
        selectable="true"
        slot-duration="00:60"
        slot-label-format="HH:mm"
        title-format="YYYY-MM-DD"
        default-view="timeGridWeek"
        :locale="language === 'zh-CN' ? 'zh-cn' : 'en-cn'"
        :custom-buttons="customButtons"
      ></FullCalendar>
      <cb-dialog
        :title="$t('m.addCourse')"
        :visible.sync="dialogVisible"
        width="920px"
      >
        <div>
          <div class="cal-dialog-content">
            <label
              ><i>*</i><span>{{ $t('m.courseHours') }}：</span></label
            >
            <cb-select
              class="marginRight35"
              style="width: 320px"
              v-model="courseValue"
              @change="getLessons(courseValue)"
              :options="coursesOptions"
              :placeholder="$t('m.plsCourse')"
            ></cb-select>
            <cb-select
              class="marginRight35"
              :class="lessonFlag ? 'lessonWarnBorder' : ''"
              style="width: 320px"
              v-model="lessonValue"
              :options="lessonsOptions"
              @change="changeLesson"
              :placeholder="$t('m.plsClass')"
            ></cb-select>
            <div v-show="lessonFlag" class="lessonWarn">
              {{ $t('m.courseHoursEmpty') }}
            </div>
          </div>
          <div class="cal-dialog-content">
            <label
              ><i>*</i><span>{{ $t('m.zeroTime') }}：</span></label
            >
            <cb-date-picker
              v-model="startTime"
              style="width: 320px"
              type="datetime"
              :editable="true"
              v-if="dialogVisible"
            ></cb-date-picker
            ><span class="marginlr">{{ $t('scene.To') }}</span>
            <cb-date-picker
              v-model="endTime"
              style="width: 320px"
              type="datetime"
              :editable="true"
              v-if="dialogVisible"
            ></cb-date-picker>
          </div>
          <div class="cal-dialog-content">
            <label
              ><i>*</i><span>{{ $t('m.orgs') }}：</span></label
            >
            <cb-tooltip
              class="item"
              :disabled="isShow"
              effect="dark"
              :content="title"
              placement="top-start"
            >
              <cb-cascader
                v-model="organizationDialogId"
                style="width: 320px"
                :options="organizationDialogOptions"
                :props="optionProps"
                @change="handleDialogChange"
                ref="orgaztionIdDialogCascader"
              ></cb-cascader>
            </cb-tooltip>
          </div>
          <div class="btn-groups">
            <cb-button
              mr="mr"
              @click="save"
              button-type="confirm"
              v-if="addflag"
            ></cb-button>
            <cb-button
              mr="mr"
              @click="edit"
              button-type="confirm"
              v-if="editflag"
            ></cb-button>
            <cb-button
              mr="mr"
              color-type="red hollow"
              :warnMsg="$t('m.confirmDelete')"
              @click="deleteCourse"
              v-if="editflag"
              >{{ $t('m.delete') }}</cb-button
            >
            <cb-button button-type="cancel" @click="cancel">{{
              $t('m.cancel')
            }}</cb-button>
          </div>
        </div>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlulgin from '@fullcalendar/timegrid';
import '@fullcalendar/core/locales/zh-cn';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import _ from 'lodash';
import { getOrgData } from '@/api/organization.js';
import { request } from '@cyber/helper';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      lessonFlag: false,
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      personTitle: '',
      organizationTitle: '',
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlulgin,
        momentPlugin,
        interactionPlugin,
      ],
      dialogVisible: false,
      personOptions: [],
      perosnId: '',
      chooseValue: 'class',
      organizationId: '',
      organizationOptions: [],
      organizationDialogId: '',
      organizationDialogOptions: [],
      courseValue: '',
      coursesOptions: [],
      lessonValue: '',
      lessonsOptions: [],
      events: [],
      addflag: false,
      editflag: false,
      editEvent: '',
      startTime: new Date(),
      endTime: new Date(),
      flashFlag: true,
      title: '',
      isShow: false,
      start: null,
      end: null,
      customButtons: {
        today: {
          text: this.$t('m.today'),
          click: () => {
            const calendarApi = this.$refs.fullCalendar.getApi();
            calendarApi.today();
            const weekOfday = parseInt(moment().format('E'));
            this.start = moment()
              .subtract(weekOfday - 1, 'days')
              .format('YYYY-MM-DD');
            this.end = moment()
              .add(7 - weekOfday + 1, 'days')
              .format('YYYY-MM-DD');
            this.getAllSchedules();
          },
        },
        prev: {
          click: () => {
            const calendarApi = this.$refs.fullCalendar.getApi();
            calendarApi.prev();
            this.start = moment(calendarApi.view.currentStart).format(
              'YYYY-MM-DD',
            );
            this.end = moment(calendarApi.view.currentEnd).format('YYYY-MM-DD');
            this.getAllSchedules();
          },
        },
        next: {
          click: () => {
            const calendarApi = this.$refs.fullCalendar.getApi();
            calendarApi.next();
            this.start = moment(calendarApi.view.currentStart).format(
              'YYYY-MM-DD',
            );
            this.end = moment(calendarApi.view.currentEnd).format('YYYY-MM-DD');
            this.getAllSchedules();
          },
        },
      },
    };
  },
  computed: {
    language() {
      return this.$i18n.locale;
    },
    personOptionNew() {
      let newArray = this.personOptions.map((item) => {
        return {
          label: item.name + '(' + item.username + ')',
          value: item.resource_id,
        };
      });
      return newArray;
    },
  },
  watch: {
    lessonValue: {
      handler(nv, oldval) {
        if (nv != '') {
          this.lessonFlag = false;
        }
      },
      immediate: false,
    },
  },
  created() {
    const weekOfday = parseInt(moment().format('E'));
    this.start = moment()
      .subtract(weekOfday - 1, 'days')
      .format('YYYY-MM-DD');
    this.end = moment()
      .add(7 - weekOfday + 1, 'days')
      .format('YYYY-MM-DD');
    this.getUsers();
    this.getFirstOrganization('init');
    this.getAllCourse();
  },
  methods: {
    changeLesson() {
      if (this.lessonValue == '') {
        this.lessonFlag = true;
      } else {
        this.lessonFlag = false;
      }
    },
    // 查询教员
    getUsers() {
      this.getAllSchedules();
    },
    // 查询获取用户组织
    getFirstOrganization() {
      getOrgData().then((res) => {
        this.organizationOptions = _.get(res, 'data.data', []);
        this.organizationDialogOptions = _.get(res, 'data.data', []);
      });
    },
    handlePersonChange(val) {
      this.$nextTick(() => {
        const newObj = _.find(
          this.personOptions,
          (ele) => ele.resource_id === val,
        );
        this.personTitle = `${newObj.name}(${newObj.username})`;
        this.getAllSchedules();
      });
    },
    handleChange() {
      this.$nextTick(() => {
        if (
          typeof this.$refs.orgaztionIdCascader.getCheckedNodes()[0] ==
          'undefined'
        ) {
          this.organizationId = '';
        } else {
          this.organizationId =
            this.$refs.orgaztionIdCascader.getCheckedNodes()[0].data.id;
        }
        if (
          this.$refs.orgaztionIdCascader.getCheckedNodes()[0] &&
          this.$refs.orgaztionIdCascader.getCheckedNodes()[0].pathLabels
            .length > 0
        ) {
          for (var i in this.$refs.orgaztionIdCascader.getCheckedNodes()[0]
            .pathLabels) {
            if (i === '0') {
              this.organizationTitle =
                this.$refs.orgaztionIdCascader.getCheckedNodes()[0].pathLabels[0];
            } else {
              this.organizationTitle =
                this.organizationTitle +
                '/' +
                this.$refs.orgaztionIdCascader.getCheckedNodes()[0].pathLabels[
                  i
                ];
            }
          }
        }
        this.getAllSchedules();
      });
    },
    handleDialogChange() {
      this.organizationDialogId =
        this.$refs.orgaztionIdDialogCascader.getCheckedNodes()[0].data.id;
      if (
        this.$refs.orgaztionIdDialogCascader.getCheckedNodes()[0].pathLabels
          .length > 0
      ) {
        for (var i in this.$refs.orgaztionIdDialogCascader.getCheckedNodes()[0]
          .pathLabels) {
          if (i === '0') {
            this.title =
              this.$refs.orgaztionIdDialogCascader.getCheckedNodes()[0].pathLabels[0];
          } else {
            this.title =
              this.title +
              '/' +
              this.$refs.orgaztionIdDialogCascader.getCheckedNodes()[0]
                .pathLabels[i];
          }
        }
        this.isShow = false;
      }
    },
    // 获取所有课程
    getAllCourse() {
      request
        .get('/oj/admin/course/all/course', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const coursesOptions = res.data.data;
          for (let item of coursesOptions) {
            item.label = item.name;
            item.value = item.resource_id;
          }
          this.coursesOptions = coursesOptions;
          const courseValue = res.data.data[0].resource_id;
          this.courseValue = courseValue;
          this.getLessons(this.courseValue);
        });
    },
    // 获取对应课程的课时数据
    getLessons(courseValue, edit) {
      request
        .get(
          '/oj/admin/lesson/simple/list',
          {
            course_id: courseValue,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.lessonsOptions = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.resource_id,
            };
          });
          if (edit) {
            this.lessonValue = edit;
          } else {
            if (res.data.data.length > 0) {
              this.lessonValue = res.data.data[0].resource_id;
            } else {
              this.lessonValue = '';
            }
          }
        });
    },
    // 获取课程表数据
    getAllSchedules() {
      const param = {
        start_time: this.start,
        end_time: this.end,
      };
      if (this.chooseValue === 'user') {
        param.create_user = this.perosnId;
      } else {
        param.organization_id = this.organizationId;
      }
      const that = this;
      that.events = [];
      request
        .get('/oj/admin/course/classroom/list', param, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          that.events = [];
          res.data.data.forEach((item) => {
            const obj = {};
            obj.start = item.start_time;
            obj.end = item.end_time;
            obj.title = that.infoHtml(item);
            obj.resource_id = item.resource_id;
            obj.course = item.course_id;
            obj.lesson = item.lesson_id;
            obj.organization = item.organization_id;
            obj.lesson_type = item.lesson_type;
            obj.organization_data = item.organization_name;
            that.events.push(obj);
            that.flashFlag = false;
            setTimeout(() => {
              that.flashFlag = true;
            }, 0);
          });
          this.$refs.fullCalendar.getApi().render(that.events);
          document.getElementById('clickMe').click();
        });
    },
    infoHtml(item) {
      const lesson = `<p> ${item.course_name} / ${item.lesson_name} </p>`;
      const time = `<p class="colorGrey">${moment(item.start_time).format(
        'HH:mm',
      )}-${moment(item.end_time).format('HH:mm')}</p>`;
      let org = '';
      org = `<p class="colorGrey"> ${item.organization_name} </p>`;
      return `<div class="class-card-message">${lesson} ${org} ${time}</div>`;
    },
    overHtml() {
      return (
        `<div class="class-card-btn-groups">` +
        `<div onClick="editCourse()" class="btn-private-all btn-class" style="width: 70px; height: 32px;line-height: 32px;border-radius: 0;margin-top: 5px;display:inline-block;margin-left:5px">${this.$t(
          'm.edit',
        )}</div>
        <div class="btn-private-all btn-class" onClick="toclass()" style="width: 70px; height: 32px;line-height: 32px;margin-top: 5px; border-radius: 0;display:inline-block;margin-left:5px">${this.$t(
          'm.enterClassroom',
        )}</div>
        </div>`
      );
    },
    eventRender(info) {
      info.el.innerHTML = info.event.title;
    },
    // 当选择结束的时候获取开始和结束时间
    handleSelect(info) {
      this.startTime = new Date(info.startStr);
      this.endTime = new Date(info.endStr);
      this.addflag = true;
      this.editflag = false;
      this.organizationDialogId = '';
      this.title = '';
      this.isShow = true;
      this.courseValue = '';
      this.lessonValue = '';
      this.dialogVisible = true;
    },
    eventClick(info) {
      info.el.innerHTML = this.overHtml();
      const that = this;
      window.editCourse = function () {
        that.editCourse();
      };
      window.toclass = function () {
        that.toclass();
      };
    },
    eventMouseover(info) {
      this.editEvent = info.event;
    },
    eventMouseout(info) {
      info.el.innerHTML = this.editEvent.title;
    },
    editCourse() {
      // 回显课程
      this.courseValue = this.editEvent.extendedProps.course;
      this.getLessons(this.courseValue, this.editEvent.extendedProps.lesson);
      // 回显时间
      this.startTime = new Date(this.editEvent.start);
      this.endTime = new Date(this.editEvent.end);
      // 回显组织
      this.organizationDialogId = this.editEvent.extendedProps.organization;
      this.title = this.editEvent.extendedProps.organization_data;
      this.addflag = false;
      this.editflag = true;
      this.isShow = false;
      this.dialogVisible = true;
    },
    deleteCourse(done) {
      request
        .delete(
          '/oj/admin/course/classroom',
          {
            resource_id: this.editEvent.extendedProps.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message({ type: 'success', message: this.$t('m.successful') });
          this.getAllSchedules();
          this.dialogVisible = false;
          done();
        })
        .catch((error) => {
          done(false);
        });
    },
    edit() {
      request
        .patch(
          '/oj/admin/course/classroom',
          {
            course_id: this.courseValue,
            lesson_id: this.lessonValue,
            start_time: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
            organization_id: this.organizationDialogId,
            resource_id: this.editEvent.extendedProps.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.getAllSchedules();
          this.courseValue = this.coursesOptions[0].resource_id;
          this.lessonValue = this.lessonsOptions[0].resource_id;
          this.dialogVisible = false;
        });
    },
    toclass() {
      if (this.editEvent.extendedProps.lesson_type === 0) {
        const { resource_id, lesson, organization } =
          this.editEvent.extendedProps;
        this.$router.push({
          name: 'theory-classroom-manage',
          params: {
            lessonId: resource_id,
            courseId: lesson,
            orgId: organization,
          },
        });
      } else if (this.editEvent.extendedProps.lesson_type === 1) {
        this.$router.push({
          name: 'classroom-manage',
          params: {
            lessonId: this.editEvent.extendedProps.resource_id,
            courseId: this.editEvent.extendedProps.lesson,
            orgId: this.editEvent.extendedProps.organization,
          },
        });
      }
    },
    // 新增课程表
    save() {
      const that = this;
      if (this.lessonValue == '') {
        this.lessonFlag = true;
        return;
      }
      request
        .post(
          '/oj/admin/course/classroom',
          {
            course_id: this.courseValue,
            lesson_id: this.lessonValue,
            start_time: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
            organization_id: this.organizationDialogId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getAllSchedules();
          this.courseValue = this.coursesOptions[0].resource_id;
          this.lessonValue = this.lessonsOptions[0].resource_id;
          this.dialogVisible = false;
        });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss">
.lessonWarnBorder .el-input__inner {
  border: transparent !important;
}
</style>
<style lang="scss" scope>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
.lessonWarn {
  position: absolute;
  left: 530px;
  color: var(--red-color);
  font-size: 12px;
}
.lessonWarnBorder {
  border: 1px solid var(--red-color) !important;
}

.fc-button-primary:disabled,
.fc-button-primary {
  background: transparent;
}
.fc-button-primary:not(:disabled) {
  background: transparent;
}

.fc-button-primary:not(:disabled):active,
.fc-button-primary:not(:disabled).fc-button-active {
  background: transparent;
  box-shadow: none !important;
}
.fc-time-grid .fc-event > .class-card-message > p.colorGrey {
  color: var(--font-color-regular) !important;
}
.fc-unthemed th,
.fc-unthemed td,
.fc-unthemed thead,
.fc-unthemed tbody,
.fc-unthemed .fc-divider,
.fc-unthemed .fc-row,
.fc-unthemed .fc-content,
.fc-unthemed .fc-popover,
.fc-unthemed .fc-list-view,
.fc-unthemed .fc-list-heading td {
  border-color: var(--border-color-secondary);
}
.el-radio-button__inner {
  color: var(--font-color-secondary);
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  border-color: var(--primary-color) !important;
}
.fc-time-grid .fc-event > .class-card-message > p {
  color: var(--font-color-primary) !important;
}
.fc-prev-button.fc-button.fc-button-primary,
.fc-next-button.fc-button.fc-button-primary {
  background: var(--primary-color);
}
.fc-prev-button.fc-button.fc-button-primary,
.fc-next-button.fc-button.fc-button-primary {
  // color: #242c3b;
  background: transparent;
  color: var(--font-color-third);
}
.fc .fc-button-primary:hover {
  border-color: var(--neutral3);
}
.fc-button-primary:hover {
  background: transparent;
  border-color: var(--neutral3);
}
.fc-view-container {
  color: var(--font-color-primary);
}
.fc-toolbar h2 {
  color: var(--font-color-primary);
}
.fc-button-primary {
  border-color: var(--primary-color) !important;
}
.fc-today-button.fc-button.fc-button-primary {
  border: 1px solid var(--primary-color) !important;
  color: var(--primary-color);
  border-radius: 0;
}

.fc-today-button:active {
  border: 1px solid var(--primary-color) !important;
  color: var(--primary-color);
  border-radius: 0;
  background-color: transparent;
}
.fc-time-grid .fc-event {
  background: var(--bg-color-third) !important;

  & > .class-card-message {
    & > p {
      color: var(--blue-color);
    }
    &:before {
      background: var(--primary-color);
    }
    background: var(--bg-color-third);
  }

  .btn-class {
    background: var(--primary-color);
    color: var(--font-color-third);
  }
}
.fc-time-grid .fc-event.fc-allow-mouse-resize {
  background: var(--orange-color);
}
.calendar-content {
  .select-div {
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: var(--primary-color);
      color: var(--font-color-primary);
    }
  }
}
.el-radio-button__inner:hover {
  color: var(--primary-color);
}

.fc-time-grid .fc-slats td {
  height: 90px;
}
.el-radio-button__inner {
  padding: 8px 10px;
  border: none;
  background-color: transparent;
}
.el-radio-button:first-child .el-radio-button__inner {
  border-left: none !important;
  border-radius: 0 !important;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 !important;
  margin-left: 4px;
}
.el-radio-button.is-active .el-radio-button__inner {
  border-radius: 0 !important;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  box-shadow: none !important;
}
.fc-nonbusiness,
.fc-bgevent {
  background: none !important;
}
.fc-time-grid .fc-event > .class-card-message > p {
  margin-left: 5px;
}
.fc-prev-button.fc-button.fc-button-primary,
.fc-next-button.fc-button.fc-button-primary {
  width: 32px;
  height: 32px;
  text-align: center;
  padding: 0;
  border-radius: 50%;
  .fc-icon {
    font-size: 20px;
    margin-top: -4px;
    color: var(--primary-color);
  }
}
.fc-prev-button.fc-button.fc-button-primary {
  margin-right: 20px;
}
.fc-next-button.fc-button.fc-button-primary {
  margin-left: 20px;
}
.fc-prev-button.fc-button.fc-button-primary,
.fc-next-button.fc-button.fc-button-primary {
  font-size: 16px;
  box-sizing: border-box;
  margin-top: -1px;
}
.fc-view-container {
  border-radius: 10px;
  font-size: 14px;
  .fc-widget-header {
    height: 3rem;
    line-height: 3rem;
  }
}
.fc-widget-content {
  color: var(--font-color-primary);
}
.fc-unthemed td.fc-today {
  background: transparent !important;
}
.fc-toolbar h2 {
  display: inline-block;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 32px;
}
.fc-today-button.fc-button.fc-button-primary {
  width: 100px;
  height: 32px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  cursor: pointer;
}
.fc-event-container {
  position: relative;
}
.fc-time-grid-event {
  &:hover {
    position: absolute;
    left: 0 !important;
    width: 100%;
    z-index: 10 !important;
  }
}
.fc-time-grid-event-inset {
  box-shadow: none;
}
.fc-time-grid .fc-event {
  word-break: break-all;
  overflow: hidden;
  text-align: center;
  border-radius: 0;
  border: none !important;

  & > .class-card-message {
    position: relative;
    padding: 0 5px;
    & > p {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      text-align: left;
      margin-bottom: 0px;
    }
    & > p:first-child {
      padding-top: 10px;
      font-size: 14px;
    }
    & > p:last-child {
      padding-bottom: 10px;
    }
    &:before {
      position: absolute;
      left: 0px;
      content: '';
      width: 5px;
      height: 100%;
    }
    height: 100%;
  }
}
.fc-time-grid .fc-event.fc-allow-mouse-resize {
  border: 0px;
}
.fc-time-grid .fc-event:after,
.fc-time-grid .fc-event.fc-allow-mouse-resize:after {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.fc-time-grid .fc-event .class-card-btn-groups,
.fc-time-grid .fc-event.fc-allow-mouse-resize {
  display: inline-block;
  vertical-align: middle;
}
.fc-ltr .fc-time-grid .fc-event-container {
  margin: 0 !important;
}
</style>
<style scoped lang="scss">
::v-deep .el-input .el-input__icon {
  line-height: 32px;
}
</style>
<style scoped lang="scss">
.marleft20 {
  margin-left: 20px;
}
.select-div {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.dialogLabel {
  width: 60px;
}
.cal-dialog-content {
  text-align: left;
  margin-bottom: 24px;
  .marginRight35 {
    margin-right: 35px;
  }
  label {
    display: inline-block;
    width: 120px;
    margin-right: 18px;
    text-align: right;
  }
  i {
    color: var(--red-color);
    margin-right: 5px;
  }
  span.marginlr {
    display: inline-block;
    width: 35px;
    margin: 0;
    text-align: center;
  }
}
.btn-groups {
  clear: both;
  text-align: center;
}
</style>
