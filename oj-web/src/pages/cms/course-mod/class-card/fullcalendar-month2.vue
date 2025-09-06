<template>
  <cb-inner-page class="fullcalendar-month" :background="false">
    <div class="btn-group-full">
      <div>
        <cb-radio-group v-model="currentTab" size="medium">
          <cb-radio-button label="fullCalendar">
            <span>{{ $t('classSchedule.calendarView') }}</span>
          </cb-radio-button>
          <cb-radio-button label="tableList">
            <span>{{ $t('classSchedule.teachingCourse') }}</span>
          </cb-radio-button>
        </cb-radio-group>
      </div>
      <div class="upload-btn-group">
        <cb-upload
          accept=".xls,.xlsx"
          action=""
          :show-file-list="false"
          :http-request="importPlan"
        >
          <cb-button :hollow="true" button-type="import">{{
            $t('classSchedule.importPlan')
          }}</cb-button>
        </cb-upload>
        <cb-popover width="300" placement="bottom-end" trigger="hover">
          <div>
            <p class="download-note">{{ $t('classSchedule.planDemoTip') }}</p>
            <p class="download-template" @click="downloadTemplate">
              {{ $t('classSchedule.downloadTemplate') }}
            </p>
          </div>
          <cb-iconfont
            class="import-icon"
            type="icon-caozuoshuoming1"
            slot="reference"
          ></cb-iconfont>
        </cb-popover>
        <cb-button
          :hollow="true"
          button-type="export"
          @click="exportPlan($event)"
          >{{ $t('classSchedule.exportPlan') }}</cb-button
        >
      </div>
    </div>
    <div class="wrapper-box">
      <div class="mb10" v-if="currentTab === 'fullCalendar'">
        <cb-cascader
          v-model="organizationSetTop"
          style="width: 224px"
          :options="organizationOptions"
          :props="optionProps"
          @change="orgChangeTop"
          clearable
          :placeholder="$t('classSchedule.selectOrg')"
        ></cb-cascader>
        <cb-select
          v-model="courseParams.train_plan_id"
          style="width: 224px"
          :options="planOptions"
          :first="{
            value: '',
            label: $t('classSchedule.allPlan'),
          }"
          @change="planChangeTop"
          clearable
        ></cb-select>
      </div>
      <div v-if="currentTab === 'fullCalendar'" class="calendar-content">
        <FullCalendar
          id="calendar"
          ref="fullCalendars"
          :options="calendarOptions"
        >
        </FullCalendar>
      </div>
      <div v-else class="table-list-content">
        <cb-search-table
          ref="planListRef"
          :selector="selector"
          :selection.sync="selection"
          url="/oj/admin/train/plan/list/page"
          :data.sync="query"
          :cols.sync="columns"
          baseURL="/api/ojj"
          row-key="resource_id"
          :searchBarBg="false"
        >
          <template slot="filter">
            <cb-search-input
              v-model="query.pattern"
              :placeholder="$t('classSchedule.plzEnterPlanName')"
              clearable
              style="width: 224px"
            ></cb-search-input>
            <cb-select
              v-model="query.status"
              :options="statusList"
              clearable
              :placeholder="$t('classSchedule.selectStatus')"
              style="width: 224px"
            ></cb-select>
          </template>
          <template v-slot:search>
            <cb-button-group>
              <cb-button button-type="add" @click="addTablePlan"></cb-button>
              <cb-button
                buttonType="delete"
                hollow
                :disabled="selection.length === 0"
                @click="deleteTablePlan(selection, $event)"
                >{{ $t('m.delete') }}</cb-button
              >
            </cb-button-group>
          </template>
          <template v-slot:course_status="scope">
            <div :style="{ color: scheduleStatusStyle(scope.data.status) }">
              {{ scheduleStatus(scope.data.status) }}
            </div>
          </template>
          <template v-slot:operation="scope">
            <cb-button-group>
              <cb-button
                type="text"
                :disabled="scope.data.resource_id === 'task_set_id'"
                @click="editTablePlan(scope.data)"
                button-type="edit"
              ></cb-button>
              <cb-button
                type="text"
                :disabled="scope.data.resource_id === 'task_set_id'"
                @click="copyScheduleEvent(scope.data)"
                >{{ $t('classSchedule.reuse') }}</cb-button
              >
              <cb-button type="text" @click="goTaskMan(scope.data)">
                {{ $t('classSchedule.taskMan') }}
              </cb-button>
            </cb-button-group>
          </template>
        </cb-search-table>
      </div>
    </div>
    <!-- 点击空白处增加课程、点击详情的编辑 -->
    <cb-dialog
      :title="dialogTitleCom"
      :visible.sync="dialogVisible"
      width="650px"
    >
      <cb-form
        ref="formRef"
        label-position="right"
        label-width="120px"
        :model.sync="modelCourse"
        :rules="rulesCourse"
        :fetchPromise="fetchForm"
      >
        <cb-row>
          <cb-col :span="14">
            <cb-form-item
              :label="$t('classSchedule.courseHours')"
              prop="course_id"
            >
              <cb-select
                v-model="modelCourse.course_id"
                filterable
                :options="courseOptions"
                @change="courseChange"
                :placeholder="$t('classSchedule.plsCourse')"
                clearable
              ></cb-select>
            </cb-form-item>
          </cb-col>
          <cb-col :span="10">
            <cb-form-item label-width="17px" prop="lesson_id">
              <cb-select
                v-model="modelCourse.lesson_id"
                filterable
                :options="lessonOptions"
                :placeholder="$t('classSchedule.plsClass')"
                clearable
              ></cb-select>
            </cb-form-item>
          </cb-col>
        </cb-row>
        <cb-form-item
          :label="$t('classSchedule.startEndTime')"
          prop="range_time"
        >
          <cb-date-picker
            v-if="dialogVisible"
            v-model="modelCourse.range_time"
            type="datetimerange"
            :range-separator="$t('classSchedule.to')"
            :start-placeholder="$t('classSchedule.startTime')"
            :end-placeholder="$t('classSchedule.endTime')"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 428px"
            @change="getDate($event)"
            popper-class="fullcalendar-date-picker"
          ></cb-date-picker>
        </cb-form-item>
        <cb-form-item
          :label="$t('classSchedule.organization')"
          prop="organization_id"
        >
          <cb-cascader
            v-model="organizationSet"
            style="width: 428px"
            :options="organizationOptions"
            :props="optionProps"
            @change="orgChange"
            :placeholder="$t('classSchedule.selectOrg')"
            clearable
          ></cb-cascader>
        </cb-form-item>
        <!-- 日历视图新增课程显示此模块，列表试图新增任务时不展示 -->
        <cb-row v-if="currentTab === 'fullCalendar'">
          <cb-col :span="7" style="margin-left: 28px">
            <cb-checkbox v-model="plan_checked">{{
              $t('classSchedule.relationalSchema')
            }}</cb-checkbox>
          </cb-col>
          <cb-col :span="12" v-if="plan_checked">
            <cb-form-item
              :label="$t('')"
              label-width="10px"
              prop="train_plan_id"
            >
              <cb-select
                style="width: 343px"
                v-model="modelCourse.train_plan_id"
                :options="planOptions"
                :placeholder="$t('classSchedule.selectPlan')"
                clearable
              ></cb-select>
            </cb-form-item>
          </cb-col>
        </cb-row>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button buttonType="confirm" @click="submitForm"></cb-button>
            <cb-button buttonType="cancel" @click="resetForm"></cb-button>
            <cb-button
              v-if="currentTab === 'fullCalendar' && actionType === 2"
              buttonType="delete"
              :hollow="true"
              @click="deleteForm($event)"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
    <!-- 课程详情 -->
    <cb-dialog
      :title="$t('classSchedule.courseDetail')"
      :visible.sync="dialogVisibleCourseDetail"
      width="550px"
    >
      <div class="detail-item">
        <span>{{ $t('classSchedule.subordinatePlan') }}：</span>
        <span :title="courseDetail.train_plan_name || '-'">{{
          courseDetail.train_plan_name || '-'
        }}</span>
      </div>
      <div class="detail-item">
        <span>{{ $t('classSchedule.courseName') }}：</span>
        <span :title="courseDetail.course_name || '-'">{{
          courseDetail.course_name || '-'
        }}</span>
      </div>
      <div class="detail-item">
        <span>{{ $t('classSchedule.lessonName') }}：</span>
        <span :title="courseDetail.lesson_name || '-'">{{
          courseDetail.lesson_name || '-'
        }}</span>
      </div>
      <div class="detail-item">
        <span>{{ $t('classSchedule.organization') }}：</span>
        <span :title="courseDetail.org_path || '-'">{{
          courseDetail.org_path || '-'
        }}</span>
      </div>
      <div class="detail-item">
        <span>{{ $t('classSchedule.courseTime') }}：</span>
        <span
          >{{ courseDetail.start || '-'
          }}<span style="padding: 0 10px">{{ $t('classSchedule.to') }}</span
          >{{ courseDetail.end || '-' }}</span
        >
      </div>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button @click="editCourse">{{
            $t('classSchedule.edit')
          }}</cb-button>
          <cb-button :hollow="true" @click="toClassRoom">{{
            $t('classSchedule.inClass')
          }}</cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
    <!-- 新增编辑教学课程 -->
    <cb-dialog
      :title="
        actionTypePlan === 1
          ? $t('classSchedule.addPlan')
          : $t('classSchedule.editPlan')
      "
      :visible.sync="dialogVisiblePlan"
      width="650px"
    >
      <add-plan :id="planId" @closeDialog="resetPlanForm" />
    </cb-dialog>
    <!-- 教学课程-任务管理弹窗 -->
    <cb-dialog
      :title="taskName + '--' + $t('classSchedule.taskDetail')"
      :visible.sync="dialogVisiblePlanTask"
      width="80%"
      @close="closePlanTask"
    >
      <cb-search-table
        ref="planTaskListRef"
        :selector="selectorTask"
        :selection.sync="selectionTask"
        url="/oj/admin/course/classroom/list/page"
        :data.sync="queryTask"
        :cols.sync="columnsTask"
        row-key="resource_id"
        baseURL="/api/ojj"
        :searchBarBg="false"
      >
        <template slot="filter">
          <cb-cascader
            v-model="organizationSetTask"
            style="width: 224px"
            :options="organizationOptions"
            :props="optionProps"
            @change="orgChangeTask"
            clearable
            :placeholder="$t('classSchedule.selectOrg')"
          ></cb-cascader>
        </template>
        <template v-slot:search>
          <cb-button-group>
            <cb-button button-type="add" @click="addTablePlanTask"></cb-button>
            <cb-button
              buttonType="delete"
              hollow
              :disabled="selectionTask.length === 0"
              @click="deleteTablePlanTask(selectionTask, $event)"
              >{{ $t('m.delete') }}</cb-button
            >
          </cb-button-group>
        </template>
        <template v-slot:operation="scope">
          <cb-button-group>
            <cb-button
              type="text"
              @click="editTablePlanTask(scope.data)"
              button-type="edit"
            ></cb-button>
            <cb-button type="text" @click="goLesson(scope.data)">
              {{ $t('classSchedule.inClass') }}
            </cb-button>
          </cb-button-group>
        </template>
      </cb-search-table>
    </cb-dialog>
    <!-- 复用教学课程弹窗 -->
    <cb-dialog
      :title="$t('classSchedule.reuseCourse')"
      :visible.sync="copyCourseVisible"
      width="650px"
    >
      <div>
        <cb-form
          ref="copyFormRef"
          label-position="right"
          label-width="130px"
          :model.sync="copyModel"
          :rules="copyRules"
          baseURL="/api/ojj"
          :url="'/oj/admin/train/plan/train_plan/reuse'"
          :method="'post'"
          json
        >
          <cb-form-item
            :label="$t('classSchedule.teachingCourseName')"
            prop="name"
          >
            <cb-input
              v-model="copyModel.name"
              :placeholder="$t('classSchedule.plzEnterPlanName')"
            />
          </cb-form-item>
          <div class="form-button-bar">
            <cb-button-group space="middle">
              <cb-button
                buttonType="confirm"
                @click="submitReuseEvent"
              ></cb-button>
              <cb-button
                buttonType="cancel"
                @click="cancelReuseEvent"
              ></cb-button>
            </cb-button-group>
          </div>
        </cb-form>
      </div>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import Utils from '@/utils/util';
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/core/locales/zh-cn';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { getI18N } from '@cyber/helper';
import _ from 'lodash';
import {
  getCourseData,
  getLessonData,
  getOrgData,
  getPlanList,
  addCourse,
  editCurrentCourse,
  deleteCourse,
  getCourseScheduleList,
  importExcelPlan,
  batchDeletePlan,
  batchDeleteTask,
} from '@/api/class-schedule';
import { getComConstantsConfig } from '@/api/common';
import AddPlan from './components/add-plan.vue';

export default {
  components: {
    FullCalendar,
    AddPlan,
  },
  data() {
    const validateName = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (len < 1 || len > 255) {
        callback(this.$t('classSchedule.validatePlanName'));
      } else {
        callback();
      }
    };
    return {
      currentTab: 'fullCalendar',
      selector: {
        maxSelect: 0,
      },
      selection: [],
      query: {
        pattern: '',
        organization_id: '',
        status: '',
      },
      columns: [],
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          momentPlugin,
        ],
        headerToolbar: {
          left: '',
          center: 'prev,title,next',
          right: '',
        },
        initialView: 'dayGridMonth',
        navLinks: false,
        events: [],
        editable: false, // 禁止event拖拽
        selectable: true,
        selectMirror: true,
        contentHeight: 800,
        /* eventBackgroundColor: '#0BDAFF', */
        eventTextColor: '#fff',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: true,
        },
        firstDay: 1,
        locale: getI18N().locale === 'zh-CN' ? 'zh-cn' : 'en-cn',
        dayMaxEvents: 3,
        moreLinkContent: this.moreLinkContentFun,
        moreLinkHint(eventCnt) {
          return '';
        },
        weekends: true,
        select: this.handleSelect,
        eventClick: this.eventClick,
        eventMouseEnter: this.eventMouseEnter,
      },
      courseParams: {
        start_time: '',
        end_time: '',
        organization_id: '',
        train_plan_id: '',
      },

      dialogVisible: false,
      dialogVisibleCourseDetail: false,
      // 增加课程表单项字段
      modelCourse: {
        course_id: '',
        lesson_id: '',
        start_time: '',
        end_time: '',
        organization_id: '',
        train_plan_id: '',
        resource_id: '',
        range_time: [],
      },
      events: [],
      organizationSet: '',
      organizationSetTop: [],
      organizationSetTask: [],
      plan_checked: false,
      courseOptions: [],
      defaultCourseId: '',
      lessonOptions: [],
      planOptions: [],
      organizationOptions: [],
      courseDetail: {
        lesson_type: '',
        resource_id: '',
        course_id: '',
        lesson_id: '',
        organization_id: '',
        parent_org_ids: [],
        train_plan_id: '',
        train_plan_name: '',
        course_name: '',
        lesson_name: '',
        org_path: '',
        start: '',
        end: '',
      },
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      rulesCourse: {
        course_id: [
          {
            required: true,
            message: this.$t('classSchedule.plsCourse'),
            trigger: 'blur',
          },
        ],
        lesson_id: [
          {
            required: true,
            message: this.$t('classSchedule.plsClass'),
            trigger: 'blur',
          },
        ],
        organization_id: [
          {
            required: true,
            message: this.$t('classSchedule.selectOrg'),
            trigger: 'blur, change',
          },
        ],
        range_time: [
          {
            required: true,
            message: this.$t('classSchedule.chooseStartEndTime'),
            trigger: 'blur, change',
          },
        ],
      },
      searchGroup: {
        organization_id: '',
        train_plan_id: '',
      },
      actionType: 1,
      dialogVisiblePlan: false,
      copyCourseVisible: false,
      actionTypePlan: 1,
      actionTypePlanTask: 1,
      planId: '',
      selectorTask: {
        maxSelect: 0,
      },
      selectionTask: [],
      urlTask: '/oj/admin/course/list',
      queryTask: {
        train_plan_id: '',
        organization_id: '',
      },
      taskName: '',
      columnsTask: [
        { label: this.$t('classSchedule.courseName'), prop: 'course_name' },
        { label: this.$t('classSchedule.lessonName'), prop: 'lesson_name' },
        { label: this.$t('classSchedule.startTimeTask'), prop: 'start_time' },
        { label: this.$t('classSchedule.endTimeTask'), prop: 'end_time' },
        {
          label: this.$t('classSchedule.organization'),
          prop: 'org_path',
        },
        { label: this.$t('m.operation'), slot: 'operation' },
      ],
      dialogVisiblePlanTask: false,
      // 复用参数
      copyModel: {
        name: '',
        resource_id: '',
      },
      copyRules: {
        name: [
          {
            required: true,
            message: this.$t('classSchedule.plzEnterPlanName'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateName,
            trigger: ['blur', 'change'],
          },
        ],
      },

      // 教学课程状态
      statusList: [],
    };
  },
  computed: {
    language() {
      return this.$i18n.locale;
    },
    dialogTitleCom() {
      if (this.currentTab === 'fullCalendar') {
        return this.actionType === 1
          ? this.$t('classSchedule.addCourse')
          : this.$t('classSchedule.editCourse');
      } else {
        return this.actionTypePlanTask === 1
          ? this.$t('classSchedule.addTask')
          : this.$t('classSchedule.editTask');
      }
    },
  },
  watch: {
    // 监听弹框的组织
    // organizationSet(val) {
    //   if (val && val.length > 0) {
    //     this.modelCourse.organization_id = val[val.length - 1];
    //   } else {
    //     this.modelCourse.organization_id = '';
    //   }
    // },
    // 监听组织
    organizationSetTop(val) {
      if (val && val.length > 0) {
        this.searchGroup.organization_id = val[val.length - 1];
      } else {
        this.searchGroup.organization_id = '';
      }
    },
    // 任务弹窗组织
    organizationSetTask(val) {
      if (val && val.length > 0) {
        this.queryTask.organization_id = val[val.length - 1];
      } else {
        this.queryTask.organization_id = '';
      }
    },
    // 关联课程switch
    plan_checked(val) {
      if (!val) {
        this.modelCourse.train_plan_id = '';
      }
    },

    currentTab: {
      handler(val) {
        if (val === 'fullCalendar') {
          this.getCourseScheduleData();
          this.getAllCourse();
          this.getPlan();
        }
      },
      deep: true,
    },
  },
  created() {
    this.columns = [
      { label: this.$t('classSchedule.teachingCourseName'), prop: 'name' },
      {
        label: this.$t('classSchedule.courseStatus'),
        slot: 'course_status',
        width: 150,
      },
      {
        label: this.$t('classSchedule.startEndTime'),
        getData(row) {
          if (row.start_time && row.end_time) {
            return `${row.start_time}~${row.end_time}`;
          }
          return '-';
        },
        width: 320,
      },
      {
        label: this.$t('classSchedule.courseTeacher'),
        prop: 'create_user',
      },
      { label: this.$t('classSchedule.tasks'), prop: 'count' },
      {
        label: this.$t('classSchedule.updateTime'),
        prop: 'update_time',
        width: 180,
      },
      { label: this.$t('m.operation'), slot: 'operation', width: 220 },
    ];
  },
  mounted() {
    this.getCourseScheduleData();
    this.getAllCourse();
    this.getOrganization();
    this.getPlan();
    this.getStatusConfig();
  },
  methods: {
    // 获取教学课程状态
    getStatusConfig() {
      getComConstantsConfig({ type: 45 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.statusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },

    moreLinkContentFun(event) {
      return (
        event.shortText +
        (getI18N().locale === 'zh-CN' ? ' 更多...' : ' more...')
      );
    },
    // 选择组织
    orgChangeTop(value) {
      if (value && value.length > 0) {
        this.courseParams.organization_id = value[value.length - 1];
      } else {
        this.courseParams.organization_id = '';
      }
      this.getCourseScheduleData();
    },

    // 选择教学课程
    planChangeTop(value) {
      this.getCourseScheduleData();
    },

    // 导入教学课程
    importPlan(file) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('cover', false);
      importExcelPlan(formData, 1) // intercept: true，自定义catch
        .then((res) => {
          this.$message.success(this.$t('classSchedule.importSuccess'));
          if (this.currentTab === 'fullCalendar') {
            this.getCourseScheduleData();
            this.getPlan();
          } else {
            this.$refs.planListRef.reload(); // 导入成功后刷新列表试图
          }
        })
        .catch((error) => {
          let code = error.data.code,
            message = error.data.message;
          if (code === 'OJ-102036') {
            this.$confirm(
              message + this.$t('classSchedule.cover'),
              this.$t('classSchedule.prompt'),
              {
                confirmButtonText: this.$t('classSchedule.confirm'),
                cancelButtonText: this.$t('classSchedule.cancel'),
                type: 'warning',
              },
            ).then(() => {
              formData.set('cover', true);
              importExcelPlan(formData, 2).then((res) => {
                this.$message.success(this.$t('classSchedule.importSuccess'));
                if (this.currentTab === 'fullCalendar') {
                  this.getCourseScheduleData();
                  this.getPlan();
                } else {
                  this.$refs.planListRef.reload(); // 导入成功后刷新列表试图
                }
              });
            });
          } else {
            this.$message.error(message);
          }
        });
    },

    // 导出教学课程
    exportPlan(done) {
      /* exportExcelAllPlan().then((res) => {
        this.$request.download(
          new Blob([res.data]),
          `${this.$t('训练教学课程')}.xlsx`,
        );
      }); */
      this.$request
        .binaryDownload(
          'get',
          '/oj/admin/course/classroom/train_plan/export',
          null,
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
        })
        .catch(() => {
          done(false);
        });
    },

    // 获取课程表
    getCourseScheduleData() {
      getCourseScheduleList(this.courseParams).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        const tempList = list.map((item) => {
          return {
            start: item.start_time,
            end: item.end_time,
            lesson_type: item.lesson_type,
            title: item.course_name + '/' + item.lesson_name,
            resource_id: item.resource_id,
            train_plan_id: item.train_plan_id,
            train_plan_name: item.train_plan_name,
            lesson_name: item.lesson_name,
            lesson_id: item.lesson_id,
            course_name: item.course_name,
            course_id: item.course_id,
            org_path: item.org_path,
            organization_id: item.organization_id,
            parent_org_ids: item.parent_org_ids,
          };
        });
        this.calendarOptions.events = tempList;
        this.$nextTick(() => {
          this.$refs.fullCalendars.getApi().render();
        });
      });
    },

    eventMouseEnter(info) {
      tippy(info.el, {
        content: info.event._def.title,
        allowHTML: true,
        placement: 'top-start',
        theme: 'cyber',
        maxWidth: 'none',
        arrow: false,
      });
    },

    // 点击event
    eventClick(info) {
      this.actionType = 1;
      this.dialogVisibleCourseDetail = true;
      const {
        lesson_type,
        resource_id,
        course_id,
        lesson_id,
        organization_id,
        parent_org_ids,
        train_plan_id,
        train_plan_name,
        course_name,
        lesson_name,
        org_path,
      } = info.event.extendedProps;
      this.courseDetail = {
        lesson_type,
        resource_id,
        course_id,
        lesson_id,
        organization_id,
        parent_org_ids,
        train_plan_id,
        train_plan_name,
        course_name,
        lesson_name,
        org_path,
        start: moment(info.event.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(info.event.end).format('YYYY-MM-DD HH:mm:ss'),
      };
    },

    // 编辑回显
    editCourse() {
      this.actionType = 2;
      const {
        resource_id,
        course_id,
        lesson_id,
        organization_id,
        parent_org_ids,
        train_plan_id,
        start,
        end,
      } = this.courseDetail;
      if (train_plan_id) {
        this.plan_checked = true;
      }
      this.organizationSet = organization_id;

      this.modelCourse = {
        course_id,
        lesson_id: '',
        start_time: start,
        end_time: end,
        organization_id,
        train_plan_id,
        resource_id,
        range_time: [start, end],
      };
      if (course_id) {
        // 根据课程id查询课时数据
        this.lessonOptions = [];
        getLessonData({
          course_id,
        }).then((res) => {
          const lessonList = _.get(res, 'data.data', []) || [];
          if (lessonList.length) {
            const tempList = lessonList.map((item) => {
              return {
                label: item.name,
                value: item.resource_id,
              };
            });
            this.lessonOptions = tempList;
            this.modelCourse.lesson_id = lesson_id;
          }
        });
      }
      this.dialogVisible = true;
    },

    // 进入课堂
    toClassRoom() {
      if (this.courseDetail.lesson_type === 1) {
        this.$router.push({
          name: 'classroom-manage',
          params: {
            lessonId: this.courseDetail.resource_id,
            courseId: this.courseDetail.lesson_id,
            orgId: this.courseDetail.organization_id,
          },
        });
      } else {
        this.$router.push({
          name: 'theory-classroom-manage',
          params: {
            lessonId: this.courseDetail.resource_id,
            courseId: this.courseDetail.lesson_id,
            orgId: this.courseDetail.organization_id,
          },
        });
      }
    },

    // 点击空白日期
    handleSelect(info) {
      this.actionType = 1;
      // 置空因编辑时回显的值
      this.organizationSet = '';
      this.lessonOptions = [];
      this.plan_checked = false;
      const start = info.startStr + ' ' + '08:00:00';
      const end = info.startStr + ' ' + '20:00:00';
      //添加默认起止时间
      this.modelCourse = {
        course_id: '',
        lesson_id: '',
        start_time: start,
        end_time: end,
        organization_id: '',
        train_plan_id: '',
        resource_id: '',
        range_time: [start, end],
      };
      this.dialogVisible = true;
      /* // 获取课程
      this.getAllCourse();
      // 获取组织
      this.getOrganization();
      // 获取训练教学课程
      this.getPlan(); */
    },

    // 获取课程
    getAllCourse() {
      this.courseOptions = [];
      getCourseData().then((res) => {
        const courseList = _.get(res, 'data.data', []) || [];
        if (courseList.length) {
          const tempList = courseList.map((item) => {
            return {
              label: item.name,
              value: item.resource_id,
            };
          });
          this.courseOptions = tempList;
          this.defaultCourseId = tempList[0].value;
        }
      });
    },

    // 获取课程对应的课时数据
    getLessons(id) {
      this.lessonOptions = [];
      getLessonData({
        course_id: id,
      }).then((res) => {
        const lessonList = _.get(res, 'data.data', []) || [];
        if (lessonList.length) {
          const tempList = lessonList.map((item) => {
            return {
              label: item.name,
              value: item.resource_id,
            };
          });
          this.lessonOptions = tempList;
        }
      });
    },

    // 课程变化时课时也要变化
    courseChange(id) {
      this.modelCourse.lesson_id = ''; // 清空课时
      if (!id) {
        this.lessonOptions = [];
        return;
      }
      this.getLessons(id);
    },

    getDate(value) {
      if (value && value.length) {
        this.modelCourse.start_time = moment(value[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.modelCourse.end_time = moment(value[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      }
    },

    // 查询获取组织
    getOrganization() {
      this.organizationOptions = [];
      getOrgData().then((res) => {
        this.organizationOptions = _.get(res, 'data.data', []) || [];
      });
    },

    //弹框组织变化
    orgChange(value) {
      if (value && value.length > 0) {
        this.modelCourse.organization_id = value[value.length - 1];
      } else {
        this.modelCourse.organization_id = '';
      }
    },

    // 获取训练教学课程
    getPlan() {
      this.planOptions = [];
      getPlanList().then((res) => {
        const planList = _.get(res, 'data.data', []) || [];
        if (planList.length) {
          const tempList = planList.map((item) => {
            return {
              label: item.username
                ? item.train_plan_name + '-' + item.username
                : item.train_plan_name,
              value: item.resource_id,
            };
          });
          this.planOptions = tempList;
        }
      });
    },

    // 增加课程
    fetchForm() {
      const modelParams = _.cloneDeep(this.modelCourse);
      delete modelParams.range_time;
      if (this.currentTab === 'fullCalendar') {
        // 日历视图
        // 新增
        if (this.actionType === 1) {
          return addCourse(modelParams).then((res) => {
            // 刷新课表
            this.getCourseScheduleData();
            this.dialogVisible = false;
            this.dialogVisibleCourseDetail = false;
          });
        } else {
          // 编辑
          return editCurrentCourse(modelParams).then((res) => {
            // 刷新课表
            this.getCourseScheduleData();
            this.dialogVisible = false;
            this.dialogVisibleCourseDetail = false;
          });
        }
      } else {
        // 列表试图
        if (this.actionTypePlanTask === 1) {
          return addCourse(modelParams).then((res) => {
            // 刷新课表
            // this.getCourseScheduleData();
            this.dialogVisible = false;
            this.$refs.planTaskListRef.reload();
            // this.dialogVisibleCourseDetail = false;
          });
        } else {
          // 编辑
          return editCurrentCourse(modelParams).then((res) => {
            // 刷新课表
            // this.getCourseScheduleData();
            this.dialogVisible = false;
            this.$refs.planTaskListRef.reload();
            // this.dialogVisibleCourseDetail = false;
          });
        }
      }
    },

    submitForm() {
      this.$refs.formRef.submit();
    },

    // 删除
    deleteForm(done) {
      let resource_id = this.modelCourse.resource_id;
      deleteCourse({ resource_id })
        .then((res) => {
          done();
          this.dialogVisible = false;
          this.dialogVisibleCourseDetail = false;
          this.getCourseScheduleData();
        })
        .catch((_) => {
          done(false);
        });
    },

    resetForm() {
      this.dialogVisible = false;
    },

    // 下载模板
    downloadTemplate() {
      let xlsxURL =
        getI18N().locale === 'zh-CN'
          ? '/cpms/train_plan/demo.xlsx'
          : '/cpms/train_plan/demo_en.xlsx';
      let url =
        window.top.location.protocol +
        '//' +
        window.top.location.host +
        xlsxURL;
      window.top.open(url, '_blank');
    },

    // 表格-新增教学课程
    addTablePlan() {
      this.actionTypePlan = 1;
      this.planId = '';
      this.dialogVisiblePlan = true;
    },

    // 表格-删除教学课程
    deleteTablePlan(data, done) {
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      }
      batchDeletePlan({ ids: resource_ids })
        .then((res) => {
          done();
          this.selection = [];
          this.$refs.planListRef.reload();
        })
        .catch((err) => {
          done(false);
        });
    },

    // 表格-编辑教学课程
    editTablePlan(row) {
      this.actionTypePlan = 2;
      this.planId = row.resource_id;
      this.dialogVisiblePlan = true;
    },

    // 跳转 任务管理弹窗
    goTaskMan(row) {
      this.queryTask.train_plan_id = row.resource_id;
      this.taskName = row.name;
      this.dialogVisiblePlanTask = true;
    },

    // 教学课程弹窗取消
    resetPlanForm(isRefresh) {
      this.dialogVisiblePlan = false;
      if (isRefresh) {
        this.$refs.planListRef.reload();
      }
    },

    // 任务弹窗新增任务
    addTablePlanTask() {
      this.actionTypePlanTask = 1;
      this.organizationSet = '';
      this.modelCourse = {
        course_id: '',
        lesson_id: '',
        start_time: '',
        end_time: '',
        organization_id: '',
        resource_id: '',
        range_time: [],
      };
      this.modelCourse.train_plan_id = this.queryTask.train_plan_id;
      this.dialogVisible = true;
    },

    // 任务弹窗-删除任务
    deleteTablePlanTask(data, done) {
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      }
      batchDeleteTask({ ids: resource_ids })
        .then((res) => {
          done();
          this.selectionTask = [];
          this.$refs.planTaskListRef.reload();
        })
        .catch((err) => {
          done(false);
        });
    },
    // 任务弹窗-编辑任务
    editTablePlanTask(row) {
      this.actionTypePlanTask = 2;
      const {
        resource_id,
        course_id,
        lesson_id,
        organization_id,
        parent_org_ids,
        train_plan_id,
        start_time,
        end_time,
      } = row;
      this.organizationSet = organization_id;
      this.modelCourse = {
        course_id,
        lesson_id: '',
        start_time,
        end_time,
        organization_id,
        train_plan_id,
        resource_id,
        range_time: start_time && end_time ? [start_time, end_time] : [],
      };
      if (course_id) {
        // 根据课程id查询课时数据
        this.lessonOptions = [];
        getLessonData({
          course_id,
        }).then((res) => {
          const lessonList = _.get(res, 'data.data', []) || [];
          if (lessonList.length) {
            const tempList = lessonList.map((item) => {
              return {
                label: item.name,
                value: item.resource_id,
              };
            });
            this.lessonOptions = tempList;
            this.modelCourse.lesson_id = lesson_id;
          }
        });
      }
      this.dialogVisible = true;
    },

    // 教学课程状态处理
    scheduleStatus(status) {
      const item = this.statusList.find((item) => item.value === status);
      if (item) {
        return item.label;
      } else {
        return '-';
      }
    },

    // 教学课程状态样式
    scheduleStatusStyle(status) {
      if (status === 1) {
        return 'var(--orange-color)';
      } else if (status === 2) {
        return 'var(--green-color)';
      } else if (status === 3) {
        return 'var(--neutral6)';
      } else {
        return 'var(--neutral6)';
      }
    },

    // 复用教学课程
    copyScheduleEvent(row) {
      this.copyModel.resource_id = row.resource_id;
      this.copyCourseVisible = true;
    },

    // 复用教学课程确定
    submitReuseEvent() {
      const params = {
        name: this.copyModel.name,
        resource_id: this.copyModel.resource_id,
      };
      this.$refs.copyFormRef.submit(params).then(() => {
        this.cancelReuseEvent();
        this.$refs.planListRef.reload();
      });
    },

    // 复用教学课程取消
    cancelReuseEvent() {
      this.copyModel = {
        name: '',
        resource_id: '',
      };
      this.copyCourseVisible = false;
    },

    // 任务弹窗-进入课堂
    goLesson(row) {
      if (!row.start_time && !row.end_time && !row.org_path) {
        this.$message.error(this.$t('classSchedule.cannotEnterClassroom'));
        return;
      }
      if (row.lesson_type === 1) {
        this.$router.push({
          name: 'classroom-manage',
          params: {
            lessonId: row.resource_id,
            courseId: row.lesson_id,
            orgId: row.organization_id,
          },
        });
      } else {
        this.$router.push({
          name: 'theory-classroom-manage',
          params: {
            lessonId: row.resource_id,
            courseId: row.lesson_id,
            orgId: row.organization_id,
          },
        });
      }
    },

    closePlanTask() {
      // 列表试图下 关闭任务详情弹窗需要更新列表试图
      if (this.currentTab !== 'fullCalendar') {
        this.$refs.planListRef.reload();
      }
    },
    // 选择组织
    orgChangeTask(value) {
      if (value && value.length > 0) {
        this.queryTask.organization_id = value[value.length - 1];
      } else {
        this.queryTask.organization_id = '';
      }
    },
  },
};
</script>
<style lang="scss"></style>
<style lang="scss" scope>
.fullcalendar-month {
  .wrapper-box {
    background: var(--bg-color-2);
    padding: 16px;
    margin-top: 10px;
    margin-right: 16px;
  }
}

.fullcalendar-date-picker {
  z-index: 3000 !important;
}
.fc .fc-popover {
  z-index: 1999;
}
.fc-content {
  cursor: pointer;
}
.detail-item {
  margin-bottom: 15px;
  > span:first-child {
    width: 140px;
    text-align: right;
    display: inline-block;
  }
  > span:nth-child(2) {
    max-width: 350px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
}
.btn-group-full {
  display: flex;
  justify-content: space-between;
  margin-right: 16px;
}
.upload-btn-group {
  display: flex;
  justify-content: end;
  align-items: center;

  .import-icon {
    margin: 0 12px 0 5px;
    cursor: pointer;
    color: var(--neutral7);
  }
  .import-icon:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
}
.download-note {
  word-wrap: break-word !important;
  word-break: normal;
}
.download-template {
  color: var(--primary-color);
  cursor: pointer;
  text-align: center;
}

#calendar {
  .fc-daygrid-event-harness {
    a {
      color: var(--neutral9);
    }
    &:hover {
      background: var(--neutral0);
    }
  }
  .fc-toolbar h2 {
    display: inline-block;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 32px;
    color: var(--neutral8);
  }
  .fc-prev-button.fc-button.fc-button-primary {
    margin-right: 15px;
  }
  .fc-next-button.fc-button.fc-button-primary {
    margin-left: 15px;
  }
  .fc-prev-button.fc-button.fc-button-primary,
  .fc-next-button.fc-button.fc-button-primary {
    font-size: 16px;
    box-sizing: border-box;
    background: transparent;
    color: var(--neutral8);
    width: 32px;
    height: 32px;
    text-align: center;
    padding: 0;
    border-radius: 50%;
    border-color: var(--neutral3);
    .fc-icon {
      font-size: 24px;
      margin-top: -4px;
    }
    &:hover {
      background: transparent;
      border-color: var(--neutral3);
    }
  }

  .fc-scrollgrid {
    border-color: var(--neutral1) !important;
  }
  .fc-col-header-cell-cushion {
    font-size: 14px;
    color: var(--neutral9);
  }
  td,
  th {
    color: var(--neutral9);
    border-color: var(--neutral1) !important;
    a {
      color: var(--neutral9);
    }
  }
  .fc-event-main {
    color: var(--neutral9) !important;
  }
  .fc-h-event .fc-event-main-frame {
    align-items: center;
  }
  .fc-h-event {
    background-color: var(--primary-color-2);
    border: 1px solid var(--primary-color-2);
    &:hover {
      background-color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
  }
  .fc-h-event .fc-event-title-container {
    width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
    height: 2em;
  }
  .fc-daygrid-event.fc-event-end,
  .fc-daygrid-event.fc-event-start {
    margin-right: 0 !important;
  }
  .fc-daygrid-event.fc-event-start,
  .fc-daygrid-event.fc-event-end {
    margin-left: 0 !important;
  }
  .fc-daygrid-event {
    border-radius: 0;
  }
  .fc-daygrid-event-dot {
    display: none;
  }
  .fc-daygrid-block-event .fc-event-time {
    font-weight: normal;
  }
  .fc-daygrid-block-event .fc-event-time {
    padding: 0;
    margin-right: 10px;
  }
  .fc-daygrid-block-event .fc-event-title {
    padding: 0;
    margin-right: 10px;
    // max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fc-daygrid-event .fc-event-time {
    margin-right: 10px;
  }
  .fc-popover {
    max-width: 470px;
    background-color: var(--bg-color-3);
    color: var(--neutral9);
    border: none;
    .fc-popover-body {
      color: var(--neutral9) !important;
    }
    .fc-event-title {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .fc-daygrid-dot-event .fc-event-title {
    font-weight: normal;
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fc-daygrid-more-link {
    font-size: 12px;
  }
}
.calendar-content {
  overflow-y: hidden;
  padding-top: 5px;
  .fc .fc-daygrid-day.fc-day-today {
    background-color: transparent;
  }
  .fc .fc-day-today .fc-daygrid-day-number {
    color: var(--primary-color) !important;
    font-weight: bold;
  }
}
.tippy-box[data-theme~='cyber'] {
  background-color: var(--bg-color-3);
  box-shadow: none;
}
</style>
