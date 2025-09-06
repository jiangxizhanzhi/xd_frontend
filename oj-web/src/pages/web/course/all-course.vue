<template>
  <cb-inner-page :background="false">
    <div class="content-tab">
      <div
        v-for="(item, index) in contentTabList"
        :key="item.name"
        class="tab-item"
        :class="{ 'tab-item-active': activeTab === index }"
        @click="tabClick(index)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="main-content">
      <!-- 自学课程 -->
      <div class="tab-public" v-if="activeTab === 0">
        <div class="course-content">
          <div class="search-model">
            <cb-search-input
              v-model="searchInfo.name"
              class="mb20"
              :placeholder="$t('m.namePh')"
              @change="getSearchName"
            ></cb-search-input>
            <div class="search-content">
              <div class="classify-list">
                <cb-filter-condition
                  class="filter-condition-width"
                  v-model="filterDefaultValue"
                  :condition="$t('m.category')"
                  :filter-list="classifyLists"
                  :props="{ label: 'name', value: 'resource_id' }"
                  @change="getClassifyId"
                ></cb-filter-condition>
                <cb-filter-condition
                  v-model="filterDefaultValue"
                  :condition="$t('m.difficulty')"
                  :filter-list="difficultLists"
                  :props="{ label: 'name', value: 'resource_id' }"
                  @change="getStatus"
                ></cb-filter-condition>
              </div>
            </div>
          </div>
          <div class="course-list" v-if="pagination.total > 0">
            <div class="table-content">
              <div
                class="package-card"
                v-for="item in courseLists"
                :key="item.resource_id"
                @click="gotoDetail(item)"
              >
                <course-card :card-data="item"></course-card>
              </div>
            </div>
            <div class="pagination-content">
              <cb-pagination
                :total="pagination.total"
                :current-page="pagination.currentPage"
                :current="pagination.currentPage"
                :page-size.sync="pagination.per_page"
                @current-change="handleChange"
                @size-change="handleSizeChange"
              ></cb-pagination>
            </div>
          </div>
          <div class="empty-wrapper" v-else>
            <empty></empty>
          </div>
        </div>
        <div class="statistic-content">
          <div class="learn-progress">
            <Block :title="$t('m.learnProgress')"></Block>
            <div class="progress-content">
              <cb-progress
                type="circle"
                :percentage="learnPercent"
                :strokeWidth="9"
                strokeLinecap="round"
                :width="120"
                ><template v-slot:circle-text>
                  <div class="number">
                    <span>{{ learnPercent }}</span
                    ><span>%</span>
                  </div>
                  <div class="name">{{ $t('course.courseProgress') }}</div>
                </template>
              </cb-progress>
            </div>
            <div class="course-percent">
              <div class="circle"></div>
              <div class="name">{{ $t('course.courseLearning') }}</div>
              <div class="number">{{ coursePercent }}</div>
            </div>
          </div>
          <div class="learn-recently">
            <div style="padding: 0 8px">
              <Block :title="$t('course.studyRecently')"></Block>
            </div>
            <div class="course-recent" v-if="courseRecent.length">
              <div
                class="course-item"
                v-for="item in courseRecent"
                :key="item.lesson_id"
                @click="toRecentCourse(item)"
              >
                <div class="course-name" :title="item.course_name">
                  {{ item.course_name }}
                </div>
                <div class="class-date">
                  <div
                    class="class"
                    :title="`${item.lesson_index} ${item.lesson_name}`"
                  >
                    {{ `${item.lesson_index} ${item.lesson_name}` }}
                  </div>
                  <div class="date">
                    {{
                      item.lesson_record_date
                        ? item.lesson_record_date.slice(5, -3)
                        : '-'
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="empty-wrapper" v-else>
              <empty></empty>
            </div>
          </div>
        </div>
      </div>
      <!-- 教学课程 -->
      <div class="tab-private" v-else>
        <div class="top-content">
          <div class="schedule">
            <Block :title="$t('course.timetable')"></Block>
            <div class="date-wrapper" @click="showDatePickerEvent">
              <div class="weeks-wrapper">
                <cb-iconfont
                  :size="18"
                  type="icon-kechengkeshi"
                  style="cursor: pointer"
                ></cb-iconfont>
                <div class="weeks">
                  <span v-show="language === 'zh-CN'">第</span>
                  <span>{{ scheduleModel.week }}</span>
                  <span>{{ $t('course.week') }}</span>
                </div>
                <cb-date-picker
                  v-model="scheduleModel.chose"
                  ref="scheduleModelDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="getDateRange($event)"
                  popperClass="course-schedule-date"
                  placeholder=""
                  prefix-icon=""
                  style="opacity: 0; width: 0; height: 0; position: absolute"
                  :picker-options="pickerOptions"
                >
                </cb-date-picker>
              </div>
            </div>
            <div class="start-end-date">
              <cb-iconfont
                :size="14"
                color="var(--neutral3)"
                type="icon-shijian1"
              ></cb-iconfont>
              <span style="margin-left: 4px">{{
                scheduleModel.startDate
              }}</span>
              <span>{{ $t('classSchedule.to') }}</span>
              <span>{{ scheduleModel.endDate }}</span>
            </div>
            <div class="pre-next">
              <div class="pre" @click="schedulePreClick">
                <cb-iconfont
                  :size="14"
                  color="var(--neutral7)"
                  type="icon-xiangyou"
                ></cb-iconfont>
              </div>
              <div class="next" @click="scheduleNextClick">
                <cb-iconfont
                  :size="14"
                  color="var(--neutral7)"
                  type="icon-xiangzuo"
                ></cb-iconfont>
              </div>
            </div>
            <div class="schedule-wrapper">
              <div class="top-weeks">
                <div
                  class="week-item"
                  v-for="item in dateOfWeeks"
                  :key="item.date"
                >
                  <span
                    class="date"
                    :style="{
                      color: isToday(item) ? 'var(--primary-color)' : '',
                      fontWeight: isToday(item) ? 'bold' : 'normal',
                    }"
                    >{{ item.date.substring(5) }}</span
                  >
                  <span
                    class="week"
                    :style="{
                      color: isToday(item) ? 'var(--primary-color)' : '',
                      fontWeight: isToday(item) ? 'bold' : 'normal',
                    }"
                    >{{ item.week }}</span
                  >
                </div>
              </div>
              <div class="bottom-course cyber-scroll-bar-small">
                <div
                  class="course-item"
                  v-for="item in dateOfWeeks"
                  :key="item.date"
                >
                  <template v-if="item.data.length">
                    <div
                      class="lesson-item"
                      v-for="(lessonItem, index) in item.data"
                      :key="
                        lessonItem.lesson_id + lessonItem.start_time + index
                      "
                      @click="goLessonDetail(lessonItem)"
                    >
                      <div class="time">
                        <span>{{
                          lessonItem.start_time
                            ? lessonItem.start_time.slice(-9)
                            : ''
                        }}</span>
                        <span>-</span>
                        <span>{{
                          lessonItem.end_time
                            ? lessonItem.end_time.slice(-9)
                            : ''
                        }}</span>
                      </div>
                      <div class="lesson-name" :title="lessonItem.lesson_name">
                        {{ lessonItem.lesson_name }}
                      </div>
                      <div class="icon-font">
                        <span class="icon">
                          <cb-iconfont
                            type="icon-kechengguanli"
                            :size="14"
                            color="var(--neutral6)"
                          ></cb-iconfont></span
                        ><span class="font" :title="lessonItem.plan_name">{{
                          lessonItem.plan_name
                        }}</span>
                      </div>
                      <div class="icon-font">
                        <span class="icon">
                          <cb-iconfont
                            type="icon-yonghu"
                            :size="14"
                            color="var(--neutral6)"
                          ></cb-iconfont></span
                        ><span class="font">{{
                          lessonItem.create_user_name
                        }}</span>
                      </div>
                      <div
                        class="sign"
                        :class="{ 'sign-in': lessonItem.is_sign_in }"
                        @click.stop="signEvent(lessonItem)"
                      >
                        <cb-iconfont
                          v-if="lessonItem.is_sign_in"
                          type="icon-gou"
                          :size="12"
                          color="var(--primary-color-4)"
                        ></cb-iconfont>
                        <span>{{
                          lessonItem.is_sign_in
                            ? $t('course.signIn')
                            : $t('course.notSignIn')
                        }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="study">
            <Block :title="$t('course.myStudies')"></Block>
            <div class="study-main">
              <div class="header">
                <span class="first">{{ $t('course.schedule') }}</span>
                <span class="second">{{ $t('course.studyTask') }}</span>
                <span class="third">{{ $t('course.status') }}</span>
              </div>
              <div class="body" v-if="mineStudyList.length">
                <div
                  class="body-item"
                  v-for="item in mineStudyList"
                  :key="item.resource_id"
                >
                  <span class="first">{{ item.name || '-' }}</span>
                  <span class="second">{{
                    item.mission_count_total || '-'
                  }}</span>
                  <span
                    class="third"
                    :title="scheduleStatus(item.plan_status)"
                    :style="{
                      color: scheduleStatusStyle(item.plan_status),
                    }"
                    >{{ scheduleStatus(item.plan_status) }}</span
                  >
                </div>
              </div>
              <div class="empty-wrapper" v-else>
                <empty></empty>
              </div>
              <div class="more" @click="mineStudyMore()">
                <span>{{ $t('course.more') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-content">
          <div class="practice">
            <Block :title="$t('course.myPractice')"></Block>
            <div class="practice-content">
              <div class="practice-list" v-if="practiceList.length">
                <div
                  class="practice-item"
                  v-for="(item, index) in practiceList"
                  :key="item.lesson_id + item.start_time + index"
                  :class="{ 'practice-item-active': item.submit_status === 1 }"
                  @click="goLessonDetail(item)"
                >
                  <div class="icon">
                    <cb-iconfont
                      :size="20"
                      type="icon-lianxitiku"
                    ></cb-iconfont>
                  </div>
                  <div class="name" :title="item.lesson_name">
                    {{ item.lesson_name || '-' }}
                  </div>
                  <div class="class">
                    <span class="class-icon">
                      <cb-iconfont
                        type="icon-kechengguanli"
                        :size="14"
                        color="var(--neutral6)"
                      ></cb-iconfont></span
                    ><span class="class-font" :title="item.plan_name">{{
                      item.plan_name || '-'
                    }}</span>
                  </div>
                  <div class="status">
                    <span
                      class="status-font"
                      :title="practiceReportStatus(item.submit_status)"
                      :class="practiceReportStatusStyle(item.submit_status)"
                    >
                      {{ practiceReportStatus(item.submit_status) }}</span
                    >
                    <span
                      class="status-practice"
                      :title="practiceStatus(item.level)"
                      :style="{ color: practiceStatusStyle(item.level) }"
                    >
                      {{ practiceStatus(item.level) }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="empty-wrapper" v-else>
                <empty></empty>
              </div>
              <div class="practice-pagination" v-if="practiceList.length">
                <cb-pagination
                  :total="practicePagination.total"
                  :current-page.sync="practicePagination.page"
                  :page-size.sync="practicePagination.per_page"
                  @current-change="practiceCurrentPageChange"
                  :showSizeChanger="false"
                  :showQuickJumper="false"
                ></cb-pagination>
              </div>
            </div>
          </div>
          <div class="practice report">
            <Block :title="$t('course.myReport')"></Block>
            <div class="practice-content">
              <div class="practice-list" v-if="reportList.length">
                <div
                  class="practice-item"
                  v-for="(item, index) in reportList"
                  :key="item.lesson_id + item.start_time + index"
                  :class="{ 'practice-item-active': item.submit_status === 1 }"
                  @click="goLessonDetail(item)"
                >
                  <div class="icon">
                    <cb-iconfont
                      :size="20"
                      type="icon-shiyanbaogaoceshi"
                    ></cb-iconfont>
                  </div>
                  <div class="name" :title="item.lesson_name">
                    {{ item.lesson_name || '-' }}
                  </div>
                  <div class="class">
                    <span class="class-icon">
                      <cb-iconfont
                        type="icon-kechengguanli"
                        :size="14"
                        color="var(--neutral6)"
                      ></cb-iconfont></span
                    ><span class="class-font" :title="item.plan_name">{{
                      item.plan_name || '-'
                    }}</span>
                  </div>
                  <div class="status">
                    <span
                      class="status-font"
                      :class="practiceReportStatusStyle(item.submit_status)"
                      :title="practiceReportStatus(item.submit_status)"
                    >
                      {{ practiceReportStatus(item.submit_status) }}</span
                    >
                    <span
                      class="status-score"
                      :class="{ 'status-score-passed': item.passed }"
                      :title="reportPassedStatus(item)"
                    >
                      {{ reportPassedStatus(item) }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="empty-wrapper" v-else>
                <empty></empty>
              </div>
              <div class="practice-pagination" v-if="reportList.length">
                <cb-pagination
                  :total="reportPagination.total"
                  :current-page.sync="reportPagination.page"
                  :page-size.sync="reportPagination.per_page"
                  @current-change="reportCurrentPageChange"
                  :showSizeChanger="false"
                  :showQuickJumper="false"
                ></cb-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Empty from '@/components/empty/index.vue';
import Block from '@/components/block';
import CourseCard from '@/components/course-card/index';
import {
  courseDirection,
  courseDifficulty,
  courseList,
  learnProgress,
  roomCourseList,
  roomPracticeList,
  roomReportList,
  mineStudyPlanList,
  mineStudySign,
  monthDateMark,
} from '@/api/course';
import { getComConstantsConfig } from '@/api/common';
import moment from 'moment';
import { getLanguage } from '@cyber/helper';
import _ from 'lodash';

export default {
  components: { Empty, Block, CourseCard },
  data() {
    return {
      // 页面内容tab
      contentTabList: [
        {
          name: this.$t('course.selfStudy'),
        },
        {
          name: this.$t('course.schedule'),
        },
      ],
      activeTab: 0,

      language: getLanguage(),
      filterDefaultValue: null,
      ratio: 0,
      searchInfo: {
        classify: '',
        difficult: '',
        name: '',
      },
      classifyLists: [],
      // 难度分类数据
      difficultLists: [],
      courseLists: [],
      pagination: {
        currentPage: 1,
        per_page: 10,
        total: 0,
      },
      learnPercent: 0,
      coursePercent: '',
      // 最近在学
      courseRecent: [],

      // 我的课表 start
      // 课表的周和日期的字段
      scheduleModel: {
        chose: moment().format('YYYY-MM-DD'),
        week: '',
        startDate: '',
        endDate: '',
      },
      // 一周内的日期和星期
      dateOfWeeks: [],
      oneWeek: [
        this.$t('m.monday'),
        this.$t('m.tuesday'),
        this.$t('m.wednesday'),
        this.$t('m.thursday'),
        this.$t('m.friday'),
        this.$t('m.saturday'),
        this.$t('m.sunday'),
      ],
      // 课表数据
      scheduleList: [],
      // 有标记的日期
      marketDateList: [],
      pickerOptions: {
        cellClassName: (date) => {
          const ymdDate = this.formatDateToYMD(date);
          return this.marketDateList.includes(ymdDate)
            ? 'course-date-picker-marked-date'
            : '';
        },
      },

      // 我的课表 end
      // 我的学习 start
      mineStudyList: [],
      statusList: [],
      // 我的学习 end

      // 我的课后练习 start
      practiceList: [],
      practicePagination: {
        page: 1,
        per_page: 8,
        total: 0,
      },
      submitStatusList: [],
      levelStatusList: [],
      // 我的课后练习 end

      // 我的实验报告 start
      reportList: [],
      reportPagination: {
        page: 1,
        per_page: 8,
        total: 0,
      },
      // 我的实验报告 end
    };
  },
  mounted() {
    this.getCourseDirection();
    this.getCourseDifficult();
    this.getCourseList();
    this.getLearnProgress();
    this.getStatusConfig();
    this.getPracticeReportConfig();
    this.getLevelStatusConfig();
  },
  methods: {
    // tab切换
    tabClick(i) {
      if (this.activeTab != i) {
        this.activeTab = i;
        if (i === 0) {
          this.getCourseList();
          this.getLearnProgress();
        } else {
          // 获取当天对应的周等数据
          this.getWeekDate(moment().format('YYYY-MM-DD'));
          this.getPracticeList();
          this.getReportList();
          this.getMineLearnList();
        }
      }
    },

    // 是否是今天
    isToday(data) {
      if (data.date === moment().format('YYYY-MM-DD')) {
        return true;
      }
    },
    // 获取教学课程状态常量
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

    // 获取练习和报告状态常量
    getPracticeReportConfig() {
      getComConstantsConfig({ type: 46 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.submitStatusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },

    // 获取练习水平常量
    getLevelStatusConfig() {
      getComConstantsConfig({ type: 47 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.levelStatusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
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

    // 练习和报告状态处理
    practiceReportStatus(status) {
      const item = this.submitStatusList.find((item) => item.value === status);
      if (item) {
        return item.label;
      } else {
        return '-';
      }
    },

    // 练习和报告状态样式
    practiceReportStatusStyle(status) {
      if (status === 1) {
        return 'status-font-red';
      } else if (status === 2) {
        return 'status-font-orange';
      } else if (status === 3) {
        return 'status-font-green';
      } else {
        return 'var(--neutral6)';
      }
    },

    // 练习水平状态
    practiceStatusStyle(level) {
      if (level === 1) {
        return 'var(--green-color)';
      } else if (level === 2) {
        return 'var(--primary-color)';
      } else if (level === 3) {
        return 'var(--orange-color)';
      } else if (level === 4) {
        return 'var(--red-color)';
      } else {
        return 'var(--neutral6)';
      }
    },

    // 练习水平状态样式
    practiceStatus(level) {
      const item = this.levelStatusList.find((item) => item.value === level);
      if (item) {
        return item.label;
      } else {
        return '';
      }
    },

    reportPassedStatus(data) {
      if (data.submit_status === 3) {
        if (data.passed) {
          return this.$t('course.passedReport');
        } else {
          return this.$t('course.notPass');
        }
      }
    },
    // 方向分类变化
    getClassifyId(data) {
      this.pagination.currentPage = 1;
      this.searchInfo.classify = data.resource_id;
      this.getCourseList();
    },

    // 难度分类变化
    getStatus(data) {
      this.pagination.currentPage = 1;
      this.searchInfo.difficult = data.resource_id;
      this.getCourseList();
    },

    // 搜索值变化时请求课程接口
    getSearchName(val) {
      this.searchInfo.name = val;
      this.pagination.currentPage = 1;
      this.getCourseList();
    },

    // 分页变化
    handleChange(val) {
      this.pagination.currentPage = val;
      this.getCourseList();
    },

    // 条数变化
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.getCourseList();
    },

    // 点击进入详情
    gotoDetail(item) {
      this.$router.push({ path: `/all-course/detail/${item.resource_id}/` });
    },

    // 获取课程方向分类
    getCourseDirection() {
      courseDirection().then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.classifyLists = result;
        this.classifyLists.unshift({
          resource_id: null,
          name: this.$t('m.allTitle'),
        });
      });
    },

    // 获取难度
    getCourseDifficult() {
      courseDifficulty({ type: 9 }).then((res) => {
        let arr = _.get(res, 'data.data', []) || [];
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        arr.unshift({
          resource_id: null,
          name: this.$t('m.allTitle'),
        });
        this.difficultLists = arr;
      });
    },

    // 获取课程列表
    getCourseList() {
      const params = {
        pattern: this.searchInfo.name,
        direction: this.searchInfo.classify,
        difficulty: this.searchInfo.difficult,
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
      };
      courseList(params).then((res) => {
        this.pagination.total = res.data.data.total;
        const data = _.get(res, 'data.data.list');
        this.courseLists = data;
        window.scrollTo(0, 0);
      });
    },

    // 学习进度 & 最近在学
    getLearnProgress() {
      learnProgress().then((res) => {
        const result = _.get(res, 'data.data', {}) || {};
        this.coursePercent = `${result.completed_course_count}/${result.course_count}`;
        if (result.completed_course_count && result.course_count) {
          this.learnPercent = Number(
            (
              (result.completed_course_count * 100) /
              result.course_count
            ).toFixed(0),
          );
        } else {
          this.learnPercent = 0;
        }
        this.courseRecent = result?.lesson_records || [];
      });
    },

    // 跳转到最近在学的课程课时
    toRecentCourse(data) {
      this.$router.push({
        name: 'oj-all-course-lesson',
        params: {
          resource_id: data.course_id,
          lesson_id: data.lesson_id,
        },
      });
    },

    // 点击周显示日期选择器
    showDatePickerEvent() {
      this.$refs.scheduleModelDate.focus();
      this.datePickerFocus();
      this.getMarketDateList(
        moment(this.scheduleModel.chose).format('YYYY-MM'),
      );
    },

    // 日期组件focus，获取年月元素，绑定点击事件请求标记接口
    datePickerFocus() {
      this.$nextTick(() => {
        const parent = document.querySelector('.course-schedule-date');
        if (parent) {
          parent
            .querySelectorAll('.el-picker-panel__icon-btn')
            .forEach((item) =>
              item.addEventListener('click', () => this.arrowClick(parent)),
            );
          // 中间的年月暂时不让点击，要处理字符串是英文的情况，麻烦
          parent
            .querySelectorAll('.el-date-picker__header-label')
            .forEach((item) => (item.style.pointerEvents = 'none'));
        }
      });
    },

    arrowClick(parent) {
      const year = parent
        .querySelectorAll('.el-date-picker__header-label')[0]
        .innerHTML.slice(0, 4);
      let month = '';
      if (this.language === 'en-US') {
        month = parent
          .querySelectorAll('.el-date-picker__header-label')[1]
          .innerHTML.replace(/\s+/g, '');
        month = this.getMonthNumber(month);
      } else {
        month = parent
          .querySelectorAll('.el-date-picker__header-label')[1]
          .innerHTML.replace(/\s+/g, '')
          .slice(0, -1);
      }
      if (Number(month) < 10) {
        month = `0${month}`;
      }
      const yearMonthStr = `${year}-${month}`;
      this.getMarketDateList(yearMonthStr);
    },

    // 英文月份转换
    getMonthNumber(monthStr) {
      const m = moment(monthStr, ['MMMM', 'MMM'], true);
      return m.isValid() ? m.month() + 1 : null;
    },

    // 标记接口
    getMarketDateList(month) {
      monthDateMark({ month }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        result.forEach((item) => {
          this.marketDateList.push(item.date);
        });
      });
    },

    // 我的课表-日期点击
    getDateRange(value) {
      this.getWeekDate(value);
    },

    // 获取周和周对应的日期等
    getWeekDate(date) {
      this.scheduleModel.chose = date; // 给日历动态赋值
      this.dateOfWeeks = [];
      const week = moment(date).week();
      const start = moment(date).startOf('isoWeek');
      const end = moment(date).endOf('isoWeek');
      // 第几周
      this.scheduleModel.week = week;
      // 周的第一天日期 和 最后一天日期
      this.scheduleModel.startDate = start.format('YYYY-MM-DD');
      this.scheduleModel.endDate = end.format('YYYY-MM-DD');

      // 一周内的所有日期
      const allDateInWeek = [],
        startDate = moment(this.scheduleModel.startDate),
        endDate = moment(this.scheduleModel.endDate);
      for (
        let m = moment(startDate);
        m.isBefore(endDate) || m.isSame(endDate, 'day');
        m.add(1, 'days')
      ) {
        allDateInWeek.push(m.format('YYYY-MM-DD'));
      }

      this.dateOfWeeks = allDateInWeek.map((item, index) => {
        return {
          date: item,
          week: this.oneWeek[index],
          data: [],
        };
      });
      // 周的第一天日期 和 最后一天日期 作为参数
      this.getScheduleList();
    },

    formatDateToYMD(dateStr) {
      const date = new Date(dateStr);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    // 我的课表数据
    getScheduleList() {
      const params = {
        start_time: this.scheduleModel.startDate,
        end_time: this.scheduleModel.endDate,
      };
      roomCourseList(params).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        const scheduleList = result;
        this.dateOfWeeks.forEach((item) => {
          item.data = [];
          scheduleList.forEach((data) => {
            if (data.start_time.includes(item.date)) {
              item.data.push(data);
            }
          });
        });
      });
    },

    // 课表上一页
    schedulePreClick() {
      const beforeSevenDate = moment(this.scheduleModel.startDate).subtract(
        7,
        'days',
      );

      const date = beforeSevenDate.format('YYYY-MM-DD');
      this.getWeekDate(date);
    },

    // 课表下一页
    scheduleNextClick() {
      const nextOneDate = moment(this.scheduleModel.endDate)
        .clone()
        .add(1, 'days');
      const date = nextOneDate.format('YYYY-MM-DD');
      this.getWeekDate(date);
    },

    // 我的课表-课程课时详情
    goLessonDetail(data) {
      this.$router.push({
        name: 'oj-all-course-lesson',
        params: {
          resource_id: data.course_id,
          lesson_id: data.lesson_id,
        },
        query: {
          room_id: data.room_id,
        },
      });
    },

    // 签到
    signEvent(data) {
      mineStudySign({ resource_id: data.room_id }).then((res) => {
        const result = _.get(res, 'data.data', false);
        if (result) this.getScheduleList();
      });
    },

    // 我的学习
    getMineLearnList() {
      const params = {
        page: 1,
        per_page: 7,
      };
      mineStudyPlanList(params).then((res) => {
        const result = _.get(res, 'data.data.list', []) || [];
        this.mineStudyList = result;
      });
    },

    // 我的学习-跳转
    mineStudyMore() {
      this.$router.push({
        name: 'oj-all-course-learn-plan',
      });
    },

    // 我的课后练习-列表数据
    getPracticeList() {
      const params = {
        page: this.practicePagination.page,
        per_page: this.practicePagination.per_page,
      };
      roomPracticeList(params).then((res) => {
        const result = _.get(res, 'data.data.list', []) || [];
        const total = _.get(res, 'data.data.total', 0);
        this.practiceList = result;
        this.practicePagination.total = total;
      });
    },

    // 我的课后练习-分页变化
    practiceCurrentPageChange(val) {
      this.practicePagination.page = val;
      this.getPracticeList();
    },

    // 我的实验报告-列表数据
    getReportList() {
      const params = {
        page: this.reportPagination.page,
        per_page: this.reportPagination.per_page,
      };
      roomReportList(params).then((res) => {
        const result = _.get(res, 'data.data.list', []) || [];
        const total = _.get(res, 'data.data.total', 0);
        this.reportList = result;
        this.reportPagination.total = total;
      });
    },

    // 我的实验报告-分页变化
    reportCurrentPageChange(val) {
      this.reportPagination.page = val;
      this.getReportList();
    },
  },
};
</script>
<style>
.el-date-table td.course-date-picker-marked-date span::after {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  margin: 1px auto 0;
  background-color: var(--primary-color);
  border-radius: 50%;
}
</style>
<style lang="scss" scoped>
.empty-wrapper {
  width: 100%;
  height: 300px;
}
@mixin learnAll($height, $padding) {
  background-color: var(--bg-color-2);
  border-radius: 4px;
  padding: $padding;
  height: $height;
}
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content-tab {
  display: flex;
  justify-content: center;
  margin: 0 0 16px 0;
  color: var(--neutral8);
  font-size: 14px;
  .tab-item {
    display: flex;
    align-items: center;
    padding: 6px 14px;
    border: solid 1px var(--neutral3);
    cursor: pointer;
  }
  .tab-item:first-child {
    border-right: none;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .tab-item:last-child {
    border-left: none;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .tab-item-active {
    border: solid 1px var(--primary-color) !important;
    color: var(--primary-color);
  }
}
.main-content {
  height: calc(100% - 50px);
  .tab-public {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .course-content {
      width: calc(100% - 264px - 16px);
      height: 100%;
      .search-model {
        border-radius: 4px;
        .search-content {
          .classify-list {
            position: relative;
            .filter-condition-width {
              width: 100%;
            }
          }
        }
      }
      .course-list {
        min-height: 300px;
        .table-content {
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .package-card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: calc(20% - 12.8px);
          background: var(--bg-color-2);
          border-radius: 4px;
        }
        .pagination-content {
          margin-top: 16px;
        }
      }
      .empty-data {
        width: 100%;
        height: 300px;
      }
    }
    .statistic-content {
      width: 264px;
      height: 100%;
      .learn-progress {
        @include learnAll(257px, 12px 16px);
        .progress-content {
          width: 100%;
          display: flex;
          justify-content: center;
          .number {
            span {
              color: var(--neutral8);
            }
            span:first-child {
              font-size: 24px;
              font-weight: 600;
            }
            span:last-child {
              font-size: 12px;
            }
          }
          .name {
            font-size: 12px;
            color: var(--neutral5);
            margin-top: 6px;
          }
        }
        .course-percent {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 32px 0 0;
          .circle {
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background-color: var(--primary-color);
            margin-right: 8px;
          }
          .name {
            font-size: 14px;
            color: var(--neutral8);
            margin-right: 12px;
          }
          .number {
            font-size: 18px;
            color: var(--neutral9);
          }
        }
      }
      .learn-recently {
        margin-top: 12px;
        @include learnAll(390px, 12px 8px);
        .course-recent {
          .course-item {
            padding: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            .course-name {
              color: var(--neutral8);
              font-size: 14px;
              width: 100%;
              margin-bottom: 8px;
              @include ellipsis;
            }
            .class-date {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              .class {
                width: calc(100% - 85px);
                color: var(--neutral7);
                @include ellipsis;
              }
              .date {
                width: 80px;
                color: var(--neutral5);
                text-align: right;
              }
            }
          }
          .course-item:hover {
            background-color: var(--neutral0);
          }
        }
      }
    }
  }
  .tab-private {
    height: 100%;
    .top-content {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      height: 480px;
      .schedule,
      .study {
        background-color: var(--bg-color-2);
        padding: 16px;
        border-radius: 4px;
      }
      .schedule {
        margin-right: 16px;
        width: calc(100% - 280px);
        position: relative;
        .date-wrapper {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          cursor: pointer;
          .weeks-wrapper {
            display: flex;
            align-items: center;
            .weeks {
              color: var(--neutral6);
              font-size: 16px;
              margin-left: 8px;
              span:nth-child(2) {
                font-size: 18px;
                font-weight: bold;
                color: var(--primary-color);
              }
            }
          }
        }
        .start-end-date {
          position: absolute;
          top: 18px;
          left: calc(55%);
          font-size: 14px;
          color: var(--neutral3);
          display: flex;
          align-items: center;
        }
        .pre-next {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 14px;
          color: var(--neutral3);
          display: flex;
          align-items: center;
          > div {
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            cursor: pointer;
            background-color: var(--neutral1);
          }
          > div:hover {
            background-color: var(--neutral3);
          }
          .pre {
            margin-right: 8px;
          }
        }
        .schedule-wrapper {
          height: calc(100% - 42.5px);
          .top-weeks {
            width: 100%;
            height: 40px;
            margin-bottom: 8px;
            display: flex;
            background-color: var(--neutral0);
            .week-item {
              width: 14.285%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              .date {
                color: var(--neutral6);
              }
              .week {
                color: var(--neutral9);
              }
            }
          }
          .bottom-course {
            width: 100%;
            height: calc(100% - 48px);
            overflow: auto;
            display: flex;
            column-gap: 12px;
            justify-content: space-between;

            .course-item {
              flex: 1;
              display: flex;
              flex-direction: column;
              min-width: 0;
              .lesson-item {
                width: 100%;
                background-color: var(--neutral0);
                margin-bottom: 12px;
                padding: 12px;
                cursor: pointer;
                border-radius: 4px;
                border-top: solid 2px transparent;
                .time {
                  color: var(--neutral7);
                  font-size: 12px;
                  margin-bottom: 8px;
                }
                .lesson-name {
                  font-size: 14px;
                  color: var(--neutral9);
                  margin-bottom: 8px;
                  width: 100%;
                  @include ellipsis;
                }
                .icon-font {
                  font-size: 12px;
                  color: var(--neutral6);
                  margin-bottom: 4px;
                  display: flex;
                  align-items: center;
                  .font {
                    margin-left: 4px;
                    width: calc(100% - 20px);
                    @include ellipsis;
                  }
                }
                .sign {
                  display: none;
                  width: 100%;
                  height: 24px;
                  border: solid 1px var(--primary-color);
                  color: var(--primary-color);
                  font-size: 12px;
                  margin-top: 8px;
                  border-radius: 2px;
                  justify-content: center;
                  align-items: center;
                  > span:last-child {
                    margin-left: 4px;
                  }
                }
              }
              .lesson-item:hover {
                background-color: var(--neutral1);
                border-top: solid 2px var(--primary-color);
              }
              .lesson-item:hover .sign {
                display: flex;
              }
              .lesson-item:hover .sign-in {
                display: flex;
                border: solid 1px var(--primary-color-4);
                color: var(--primary-color-4);
              }
            }
          }
        }
      }
      .study {
        width: 264px;
        .study-main {
          position: relative;
          height: calc(100% - 42.5px);
          .header {
            display: flex;
            padding: 8px;
            background-color: var(--neutral0);
            font-size: 12px;
            color: var(--neutral6);
            span.first {
              width: calc(100% - 115px);
            }
            span.second {
              width: 60px;
              text-align: center;
            }
            span.third {
              width: 50px;
              text-align: center;
            }
          }
          .body {
            display: flex;
            flex-direction: column;
            .body-item {
              padding: 8px;
              margin-top: 8px;
              display: flex;
              flex-direction: row;
              span.first {
                width: calc(100% - 115px);
                @include ellipsis;
                color: var(--neutral8);
                font-size: 14px;
              }
              span.second {
                width: 60px;
                color: var(--neutral8);
                font-size: 12px;
                text-align: center;
              }
              span.third {
                width: 50px;
                font-size: 12px;
                text-align: center;
                @include ellipsis;
              }
            }
            .body-item:hover {
              background-color: var(--neutral0);
            }
          }
          .more {
            padding: 12px 0;
            border-top: solid 1px var(--neutral1);
            display: flex;
            justify-content: center;
            color: var(--primary-color);
            font-size: 14px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            cursor: pointer;
          }
        }
      }
    }
    .bottom-content {
      height: 420px;
      display: flex;
      column-gap: 16px;
      .practice,
      .report {
        width: calc(50% - 8px);
        background: var(--bg-color-2);
        padding: 16px;
        border-radius: 4px;
      }
      .practice-content {
        height: calc(100% - 42.5px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .practice-list {
          display: flex;
          flex-flow: wrap;
          gap: 12px;
          height: calc(100% - 42px);
          .practice-item {
            width: calc(25% - 9px);
            height: calc(50% - 9px);
            border-radius: 4px;
            background-color: var(--neutral0);
            padding: 12px;
            border-top: solid 2px transparent;
            cursor: pointer;
            .icon {
              height: 40px;
              width: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 20px;
              background-color: var(--neutral0);
            }
            .name {
              width: 100%;
              color: var(--neutral9);
              font-size: 14px;
              margin-top: 8px;
              @include ellipsis;
            }
            .class {
              font-size: 12px;
              color: var(--neutral6);
              margin-top: 4px;
              display: flex;
              align-items: center;
              &-font {
                margin-left: 4px;
                width: calc(100% - 20px);
                @include ellipsis;
              }
            }
            .status {
              margin-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &-font {
                font-size: 12px;
                padding: 2px 8px;
                max-width: 49%;
                @include ellipsis;
              }
              &-font-red {
                background-color: var(--yellow-color-2);
                color: var(--yellow-color);
              }
              &-font-orange {
                background-color: var(--orange-color-2);
                color: var(--orange-color);
              }
              &-font-green {
                background-color: var(--green-color-2);
                color: var(--green-color);
              }
              &-practice {
                text-align: right;
                font-size: 14px;
                color: var(--neutral6);
                width: 49%;
                @include ellipsis;
              }
              &-score {
                text-align: right;
                font-size: 14px;
                color: var(--red-color);
                width: 49%;
                @include ellipsis;
              }
              &-score-passed {
                color: var(--green-color);
              }
            }
          }
          .practice-item-active {
            border-top: solid 2px var(--red-color);
          }
          .practice-item:hover {
            background-color: var(--neutral1);
          }
        }
      }
    }
  }
}
</style>
