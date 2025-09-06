<template>
  <cb-inner-page :background="false">
    <div class="content-wrapper" ref="contentWrapper">
      <div class="careers-list">
        <Block :title="$t('personal.JobRecommendation')"></Block>
        <div class="pre-next">
          <div class="pre" v-if="!preBtnDisabled" @click="preClick">
            <cb-iconfont
              :size="14"
              color="var(--neutral7)"
              type="icon-xiangyou"
            ></cb-iconfont>
          </div>
          <div class="next" v-if="!nextBtnDisabled" @click="nextClick">
            <cb-iconfont
              :size="14"
              color="var(--neutral7)"
              type="icon-xiangzuo"
            ></cb-iconfont>
          </div>
        </div>
        <div class="career-wrapper">
          <div
            class="career-item"
            v-for="item in currentPageCareerList"
            :key="item.resource_id"
            :class="{
              'career-item-active':
                item.resource_id === careerMessage.resource_id,
            }"
          >
            <div class="header"><img :src="item.avatar" /></div>
            <div class="name-choose">
              <div class="name" :title="item.name">{{ item.name }}</div>
              <div class="choose" @click="chooseCareer(item)">
                {{ $t('personal.selectPost') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="career-content">
        <div class="career-detail cyber-scroll-bar-small">
          <div class="user-logo">
            <cb-progress
              class="progress-wrapper"
              type="circle"
              :percentage="careerMessage.percent"
              :color="colors"
              :stroke-width="2"
              :width="88"
            >
              <template v-slot:circle-text>
                <img
                  style="
                    width: 76px;
                    height: 76px;
                    border-radius: 40px;
                    background-color: var(--neutral5);
                  "
                  :src="careerMessage.avatar || avatar"
                /> </template
            ></cb-progress>
            <div class="career-percent">
              {{ $t('personal.matchedDegree')
              }}{{ careerMessage.percent ? `${careerMessage.percent}%` : 0 }}
            </div>
          </div>
          <div class="career-name" :title="careerMessage.name">
            {{ careerMessage.name }}
          </div>
          <div class="career-level">
            <span>{{ $t('personal.positionHierarchy') }}：</span>
            <span :title="careerMessage.levelName">{{
              careerMessage.levelName
            }}</span>
          </div>
          <div class="career-description" :title="careerMessage.description">
            {{ careerMessage.description }}
          </div>
          <div class="career-tks">
            <div @click="goAnchor('t')" class="t-box">
              <CircleTKS
                type="T"
                :count="taskData.length"
                :desc="$t('m.jobResponsibilities')"
              />
            </div>
            <div @click="goAnchor('k')" class="k-box">
              <CircleTKS
                type="K"
                :count="knowledgeData.length"
                :desc="$t('m.exercise.knowledgePoint')"
              />
            </div>
            <div @click="goAnchor('s')">
              <CircleTKS
                type="S"
                :count="skillData.length"
                :desc="$t('m.skillPoint')"
              />
            </div>
          </div>
        </div>
        <div class="course-skill-content">
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
            <div
              ref="coursePositionContent"
              class="position-content cyber-scroll-bar-small"
            >
              <!-- 课程学习 -->
              <div class="tab-content" v-if="activeTab === 0">
                <div class="tab-main-content" v-if="courseOfCareerList.length">
                  <div class="progress-total">
                    <span>{{ $t('personal.learningCourses') }}：</span>
                    <span>{{ `${completedCourseCount}/${courseCount}` }}</span>
                    <span class="font">{{ $t('personal.process') }}：</span>
                    <div class="progress">
                      <div
                        :style="{ width: completedCoursePercent + '%' }"
                        class="progress-inner"
                      ></div>
                    </div>
                    <span class="percent">{{
                      `${completedCoursePercent}%`
                    }}</span>
                  </div>
                  <div class="avatar">
                    <img :src="careerMessage.avatar || avatar" />
                    <div class="start">{{ $t('personal.start') }}</div>
                  </div>
                  <template>
                    <div class="tree-content">
                      <div class="top-line"></div>
                      <div
                        v-for="(item, index) in courseOfCareerList"
                        :key="item.resource_id"
                        class="node-line-leaf-content"
                      >
                        <div
                          class="node-item"
                          :class="{
                            'node-item-finished': item.process === 100,
                          }"
                        >
                          <div
                            class="node-item-number"
                            :class="{
                              'node-item-number-finished': item.process === 100,
                            }"
                          >
                            {{ index + 1 }}
                          </div>
                        </div>
                        <div
                          class="line-item"
                          :class="`mainAxisLine${index}`"
                        ></div>
                        <div
                          class="leaf-item"
                          :class="
                            (index + 1) % 2 === 0
                              ? 'leaf-item-right'
                              : 'leaf-item-left'
                          "
                        >
                          <div class="leaf-item-veins">
                            <div class="leaf-item-veins-image">
                              <img :src="item.logo || defaultCourseLog" />
                              <div
                                class="level"
                                :class="
                                  item.difficulty === 0
                                    ? 'level-low'
                                    : item.difficulty === 1
                                    ? 'level-middle'
                                    : 'level-hight'
                                "
                              >
                                <span>{{
                                  item.difficulty === 0
                                    ? $t('m.lowLevel')
                                    : item.difficulty === 1
                                    ? $t('m.middleLevel')
                                    : $t('m.highLevel')
                                }}</span>
                              </div>
                            </div>
                            <div class="leaf-item-veins-message">
                              <div class="message-title" :title="item.name">
                                {{ item.name || '-' }}
                              </div>
                              <div class="message-content">
                                <div class="message-content-lesson">
                                  <cb-iconfont
                                    :size="12"
                                    type="icon-kechengkeshi"
                                    color="var(--neutral8)"
                                  ></cb-iconfont>
                                  <span class="num">{{
                                    item.lesson_count || '-'
                                  }}</span>
                                  <span>{{ $t('m.lesson') }}</span>
                                </div>
                                <div class="message-content-progress">
                                  <div class="font">
                                    {{ $t('personal.completed') }}
                                  </div>
                                  <div class="percent-bottom">
                                    <div
                                      :style="{
                                        width: item.process + '%',
                                      }"
                                      class="percent"
                                    ></div>
                                  </div>
                                  <div class="font">{{ item.process }}%</div>
                                </div>
                                <div
                                  class="message-content-operate"
                                  @click="lookLessonClick(index, item)"
                                >
                                  <span>{{ $t('personal.chapter') }}</span>
                                  <cb-iconfont
                                    v-if="!item.checked"
                                    :size="12"
                                    type="icon-xiala"
                                    color="var(--primary-color)"
                                  ></cb-iconfont>
                                  <cb-iconfont
                                    v-if="item.checked"
                                    :size="12"
                                    type="icon-control"
                                    color="var(--primary-color)"
                                  ></cb-iconfont>
                                </div>
                              </div>
                            </div>
                            <!-- 点击“查看章节”--下拉展示章节、课时 -->
                            <div
                              class="course-down-content"
                              :class="`courseDownContent${index}`"
                              v-if="item.checked"
                            >
                              <div
                                class="course-down-item"
                                v-for="(item, indexIn) in courseLessonList"
                                :key="indexIn"
                              >
                                <!-- 章节-->
                                <chapter-lesson
                                  :node-index="index"
                                  :chapter-data="item"
                                ></chapter-lesson>
                                <!-- 课时 -->
                                <lesson
                                  :item="item"
                                  v-if="item.node_type === 2"
                                >
                                </lesson>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="finish-flag">
                        <img :src="finishFlag" />
                      </div>
                    </div>
                  </template>
                </div>
                <div v-else class="no-data">
                  <empty></empty>
                </div>
              </div>
              <!-- 技能练习 -->
              <div class="tab-content" v-if="activeTab === 1">
                <div class="tab-main-content" v-if="trainOfCareerList.length">
                  <div class="progress-total">
                    <span>{{ $t('course.skillTraining') }}：</span>
                    <span>{{ `${completedTrainCount}/${trainCount}` }}</span>
                    <span class="font">{{ $t('personal.process') }}：</span>
                    <div class="progress">
                      <div
                        :style="{ width: completedTrainPercent + '%' }"
                        class="progress-inner"
                      ></div>
                    </div>
                    <span class="percent">{{
                      `${completedTrainPercent}%`
                    }}</span>
                  </div>
                  <template v-if="showTrainOfCareerLine">
                    <div class="avatar">
                      <img :src="careerMessage.avatar || avatar" />
                      <div class="start">{{ $t('personal.start') }}</div>
                    </div>
                    <div class="tree-content">
                      <div class="top-line"></div>
                      <div
                        v-for="(item, index) in trainOfCareerList"
                        :key="item.mission_template_id"
                        class="node-line-leaf-content node-line-leaf-content-small"
                      >
                        <div
                          class="node-item"
                          :class="{
                            'node-item-finished': item.completion_status,
                          }"
                        >
                          <div
                            class="node-item-number"
                            :class="{
                              'node-item-number-finished':
                                item.completion_status,
                            }"
                          >
                            {{ index + 1 }}
                          </div>
                        </div>
                        <div
                          class="line-item"
                          :style="{
                            height:
                              32 +
                              (item.related_trainings.length - 1) * 104 +
                              'px',
                          }"
                        ></div>
                        <div
                          class="leaf-item-group"
                          :class="
                            (index + 1) % 2 === 0
                              ? 'leaf-item-right'
                              : 'leaf-item-left'
                          "
                        >
                          <template v-if="item.available">
                            <div
                              class="leaf-item"
                              v-for="itemLeaf in item.related_trainings"
                              :key="itemLeaf.training_id"
                              @click="toSceneTask(itemLeaf)"
                            >
                              <div class="leaf-item-veins">
                                <div class="leaf-item-veins-image">
                                  <img
                                    :src="
                                      itemLeaf.logo ||
                                      trainDefaultLog(itemLeaf.training_type)
                                    "
                                  />
                                  <div
                                    class="level"
                                    :class="
                                      trainDifficultyStyle(itemLeaf.difficulty)
                                    "
                                  >
                                    <span>{{
                                      trainDifficultyName(itemLeaf.difficulty)
                                    }}</span>
                                  </div>
                                </div>
                                <div class="leaf-item-veins-message">
                                  <div
                                    class="message-title"
                                    :title="itemLeaf.mission_title"
                                  >
                                    {{ itemLeaf.mission_title }}
                                  </div>
                                  <div class="message-content">
                                    <span
                                      class="message-type"
                                      :class="
                                        trainTypeStyle(itemLeaf.training_type)
                                      "
                                      >{{
                                        trainTypeName(itemLeaf.training_type)
                                      }}</span
                                    >
                                    <span :title="itemLeaf.training_name">{{
                                      itemLeaf.training_name
                                    }}</span>
                                  </div>
                                </div>
                                <div
                                  class="message-status"
                                  :class="
                                    trainStatusStyle(itemLeaf.training_status)
                                  "
                                >
                                  <span>{{
                                    trainStatusName(itemLeaf.training_status)
                                  }}</span>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="leaf-item leaf-item-no-data">
                              <div class="task-name">
                                <cb-iconfont
                                  :size="18"
                                  color="var(--neutral9)"
                                  type="icon-renwufangan"
                                ></cb-iconfont>
                                <div
                                  class="name"
                                  :title="
                                    $t('course.taskName') +
                                    ' ' +
                                    (item.title || '-')
                                  "
                                >
                                  {{
                                    $t('course.taskName') +
                                    ' ' +
                                    (item.title || '-')
                                  }}
                                </div>
                              </div>
                              <div class="no-train-des">
                                {{ $t('course.allSkillTaskNoTrainData') }}
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="finish-flag">
                        <img :src="finishFlag" />
                      </div>
                    </div>
                  </template>
                  <no-train-data v-else></no-train-data>
                </div>
                <div v-else class="no-data">
                  <empty></empty>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RTKSPoint
      ref="rtksPointRef"
      :tData="taskData"
      :kData="knowledgeData"
      :sData="skillData"
    />
  </cb-inner-page>
</template>
<script>
import Block from '@/components/block';
import Empty from '@/components/empty/index.vue';
import defaultUserLogo from '@/assets/img/course/default.png';
import defaultCourseLog from '@/assets/img/course/logo.jpg';
import defaultSingleLog from '@/assets/img/personal/single.png';
import defaultTeamLog from '@/assets/img/personal/team.png';
import defaultRedBlueLog from '@/assets/img/personal/red-blue.jpg';
import CircleTKS from './components/circle-tks.vue';
import RTKSPoint from './components/rtks-point.vue';

import {
  careerRoleList,
  userCareerMessage,
  courseOfCareer,
  courseLesson,
  chooseCareerToRelateUser,
  trainOfCareer,
} from '@/api/my-career';

import finishFlag from '@/assets/img/personal/finish-flag.png';
import _ from 'lodash';
import Lesson from './components/lesson.vue';
import {
  DIFFICULTY,
  TRARN_STATUE,
  TRARN_DIFFICULTY,
  TRAIN_TYPE,
  REDVSBLUE,
} from './constant.js';
import NoTrainData from './components/no-train-data.vue';

export default {
  components: { Empty, Block, CircleTKS, RTKSPoint, Lesson, NoTrainData },
  data() {
    return {
      careerList: [], // 岗位集合
      currentPageCareer: 1,
      pageSizeCareer: 5,

      colors: ['var(--green-color)'],
      defaultLogo: defaultUserLogo,
      careerMessage: {
        resource_id: '',
        name: '',
        percent: 0,
        levelName: '',
        description: '',
        avatar: '',
      },

      taskData: [],
      knowledgeData: [],
      skillData: [],

      contentTabList: [
        {
          name: this.$t('personal.courseLearns'),
        },
        {
          name: this.$t('course.skillTraining'),
        },
      ],
      activeTab: 0,
      // 课程学习-总进度
      completedCourseCount: 0,
      courseCount: 0,
      completedCoursePercent: 0,
      // 课程学习-关联课程
      courseOfCareerList: [],
      finishFlag: finishFlag,
      // 课程的章节数据
      courseLessonList: [],
      defaultCourseLog: defaultCourseLog,
      // 技能练习-总进度
      completedTrainCount: 0,
      trainCount: 0,
      completedTrainPercent: 0,
      // 技能练习-关联训练
      trainOfCareerList: [],
      defaultSingleLog: defaultSingleLog,
      defaultTeamLog: defaultTeamLog,
      defaultRedBlueLog: defaultRedBlueLog,
    };
  },
  computed: {
    // 岗位页数
    careerTotalPage() {
      return Math.ceil(this.careerList.length / this.pageSizeCareer);
    },

    // 当前页岗位
    currentPageCareerList() {
      const start = (this.currentPageCareer - 1) * this.pageSizeCareer;
      const end = start + this.pageSizeCareer;
      return this.careerList.slice(start, end);
    },

    preBtnDisabled() {
      if (this.currentPageCareer === 1) {
        return true;
      } else {
        return false;
      }
    },

    nextBtnDisabled() {
      if (this.currentPageCareer === this.careerTotalPage) {
        return true;
      } else {
        return false;
      }
    },

    // 头像
    avatar() {
      return this.$store.state.user.avatar;
    },
  },
  mounted() {
    this.getCareerList();
    // this.getUserCareerMessage();
    this.getCourseOfCareer();
  },
  methods: {
    // 获取岗位
    getCareerList() {
      const params = {
        per_page: 10000,
        page: 1,
        frameId: 'default',
      };
      careerRoleList(params).then((res) => {
        const list = _.get(res, 'data.data.list', []) || [];
        this.careerList = list;
        this.getUserCareerMessage();
      });
    },

    // 岗位上一页
    preClick() {
      if (this.currentPageCareer > 1) {
        this.currentPageCareer--;
      }
    },
    // 岗位下一页
    nextClick() {
      if (this.currentPageCareer < this.careerTotalPage) {
        this.currentPageCareer++;
      }
    },

    // 选择岗位
    chooseCareer(data) {
      this.courseOfCareerList = [];
      this.trainOfCareerList = [];
      this.activeTab = 0;
      const params = {
        role_id: data.resource_id,
      };
      chooseCareerToRelateUser(params).then(() => {
        this.getUserCareerMessage();
        this.getCourseOfCareer();
      });
    },

    // 获取用户岗位、匹配度、描述等
    getUserCareerMessage() {
      userCareerMessage().then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        this.careerMessage.resource_id = data.resource_id || '';
        this.careerMessage.name = data.name || '-';
        this.careerMessage.percent = data.percent ? parseInt(data.percent) : 0;
        this.careerMessage.levelName = data.level_name || '-';
        this.careerMessage.description = data.description || '-';
        const choseItem = this.careerList.find(
          (item) => item.resource_id === data.resource_id,
        );
        if (choseItem) {
          this.careerMessage.avatar = choseItem.avatar;
        }
        // TKS数据
        this.knowledgeData = data.knowledge_data_list || [];
        this.taskData = data.task_data_list || [];
        this.skillData = data.skill_data_list || [];
      });
    },

    // TKS 弹框锚点
    goAnchor(type) {
      this.$refs.rtksPointRef.dialogPoint = true;
      setTimeout(() => {
        const a = '#' + type;
        this.$el.querySelector(a).scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },

    // tab切换
    tabClick(i) {
      if (this.activeTab != i) {
        this.activeTab = i;
        if (i === 0) {
          // 请求课程学习接口
          this.getCourseOfCareer();
        } else {
          // 请求技能练习接口
          this.getTrainOfCareer();
        }
        this.$refs.coursePositionContent.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    },

    // 课程学习
    getCourseOfCareer() {
      courseOfCareer().then((res) => {
        const result = _.get(res, 'data.data', {}) || {};
        this.completedCourseCount = result.completed_course_count;
        this.courseCount = result.course_count;
        if (this.completedCourseCount && this.courseCount) {
          this.completedCoursePercent = Number(
            ((this.completedCourseCount * 100) / this.courseCount).toFixed(1),
          );
        }

        const list = _.get(res, 'data.data.knowledge_bos', []) || [];
        this.courseOfCareerList = list.map((item) => {
          return {
            ...item,
            checked: false,
          };
        });
        // 切换岗位时会重新请求接口，此时线的高度要重置
        this.$nextTick(() => {
          this.courseOfCareerList.forEach((_, i) => {
            const element = document.querySelector(`.mainAxisLine${i}`);
            element.style.height = '32px';
          });
          this.$refs.coursePositionContent.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
      });
    },

    // 课程的查看章节按钮点击
    lookLessonClick(index, itemData) {
      // todo: 1.document.querySelector改成ref；
      this.courseLessonList = [];
      this.courseOfCareerList.forEach((item, i) => {
        if (item.resource_id != itemData.resource_id) {
          const element = document.querySelector(`.mainAxisLine${i}`);
          element.style.height = '32px';
          // 课程处理
          item.checked = false;
        }
      });
      itemData.checked = !itemData.checked;

      // 点击当前课程的“查看章节”--展开章节、课时；请求章节、课时接口和设置线的高度
      if (itemData.checked) {
        courseLesson({ course_id: itemData.resource_id }).then((res) => {
          const result = _.get(res, 'data.data', {}) || {};
          const children = result.children || [];

          this.courseLessonList = this.childrenChecked(children);

          this.$nextTick(() => {
            const lineElement = document.querySelector(`.mainAxisLine${index}`);
            const downElement = document.querySelector(
              `.courseDownContent${index}`,
            );
            lineElement.style.height = downElement.offsetHeight + 'px';
          });
        });
      } else {
        // 再次点击当前课程的“查看章节”--收起章节、课时，恢复线的高度
        const lineElement = document.querySelector(`.mainAxisLine${index}`);
        lineElement.style.height = '32px';
      }
    },

    // 章节标题点击
    /* chapterClick(index, itemData) {
      this.courseLessonList.forEach((item) => {
        if (item.resource_id != itemData.resource_id) {
          if (item.node_type === 1) {
            item.checked = false;
          }
        } else {
          item.checked = !item.checked;
        }
      });
      this.$nextTick(() => {
        const lineElement = document.querySelector(`.mainAxisLine${index}`);
        const downElement = document.querySelector(
          `.courseDownContent${index}`,
        );
        lineElement.style.height = downElement.offsetHeight + 'px';
      });
    }, */

    // 章节课时递归
    childrenChecked(data) {
      data.forEach((item) => {
        if (item.node_type == 1) {
          // 章节处理
          item.checked = false;
          if (item.children && item.children.length) {
            this.childrenChecked(item.children);
          }
        }
      });
      return data;
    },

    // 章节进度
    captorProgress(item) {
      if (item.children.length) {
        let finishedAll = 0;
        item.children.forEach((value) => {
          if (value.learn === 100) {
            finishedAll++;
          }
        });
        return `${finishedAll}/${item.children.length}`;
      } else {
        return '';
      }
    },

    // 技能练习
    getTrainOfCareer() {
      trainOfCareer().then((res) => {
        const result = _.get(res, 'data.data', {}) || {};
        this.completedTrainCount = result.completed_course_count;
        this.trainCount = result.course_count;

        if (this.completedTrainCount && this.trainCount) {
          this.completedTrainPercent = Number(
            ((this.completedTrainCount * 100) / this.trainCount).toFixed(1),
          );
        }

        const list = _.get(res, 'data.data.path', []) || [];
        // 判断所有的技能任务里是否都没有训练实例
        const existTrainInstance = list.find((item) => item.available === true);
        if (existTrainInstance) {
          this.showTrainOfCareerLine = true;
        } else {
          this.showTrainOfCareerLine = false;
        }
        this.trainOfCareerList = list.map((item) => {
          return {
            ...item,
          };
        });
      });
    },

    // 点击技能任务(待测)
    toSceneTask(active) {
      const host = window.location.host;
      const protocol = window.location.protocol;
      let joinUrl = '';
      if (active.training_type === TRAIN_TYPE.SINGLE) {
        // 单兵训练
        joinUrl = `${protocol}//${host}/page/mg/cr/single_train/${active.training_id}/`;
      } else if (active.training_type === TRAIN_TYPE.TEAM) {
        // 团队训练
        if (active.role_group === 2) {
          joinUrl = `${protocol}//${host}/page/mg/cr/student_combat/${active.training_id}`;
        } else {
          joinUrl = `${protocol}//${host}/page/mg/cr/train-detail-home/${active.training_id}`;
        }
      } else if (active.training_type === TRAIN_TYPE.RED) {
        // 红蓝对抗
        if (active.role_group === REDVSBLUE.ADMIN) {
          joinUrl = `${protocol}//${host}/page/mg/cr/manage-home/${active.training_id}`;
        } else if (active.role_group === REDVSBLUE.DIRECTOR) {
          joinUrl = `${protocol}//${host}/page/mg/cr/director-home/${active.training_id}`;
        } else if (active.role_group === REDVSBLUE.REFEREE) {
          joinUrl = `${protocol}//${host}/page/mg/cr/referee-home/${active.training_id}`;
        } else {
          this.$request
            .get(
              '/cr/red_vs_blue/user/get_running_status',
              { resource_id: active.training_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              // 学员登录点击列表
              if (res.data.data.time_management_status !== 4) {
                joinUrl = `${protocol}//${host}/page/mg/cr/access-center-member/${active.training_id}`;
                window.open(joinUrl, '_self');
              } else {
                this.$message.warning(this.$t('course.trainNotStart'));
              }
            });
        }
      }
      window.open(joinUrl, '_self');
    },

    // 技能练习-训练状态样式
    trainStatusStyle(status) {
      if (status === TRARN_STATUE.NOT_START) {
        return 'message-status-not-started';
      } else if (
        status === TRARN_STATUE.RUNNING ||
        status === TRARN_STATUE.RECOVERY
      ) {
        return 'message-status-running';
      } else if (status === TRARN_STATUE.END) {
        return 'message-status-finished';
      } else if (status === TRARN_STATUE.PAUSE) {
        return 'message-status-pause';
      }
    },

    // 技能练习-训练状态
    trainStatusName(status) {
      if (status === TRARN_STATUE.NOT_START) {
        return this.$t('course.nostart');
      } else if (
        status === TRARN_STATUE.RUNNING ||
        status === TRARN_STATUE.RECOVERY
      ) {
        return this.$t('course.running');
      } else if (status === TRARN_STATUE.END) {
        return this.$t('course.hasEnded');
      } else if (status === TRARN_STATUE.PAUSE) {
        return this.$t('course.pause');
      }
    },

    // 技能练习-训练类型样式
    trainTypeStyle(type) {
      if (type === TRAIN_TYPE.SINGLE) {
        return 'message-type-single';
      } else if (type === TRAIN_TYPE.TEAM) {
        return 'message-type-team';
      } else {
        return 'message-type-red-blue';
      }
    },

    // 技能练习-训练类型
    trainTypeName(type) {
      if (type === TRAIN_TYPE.SINGLE) {
        return this.$t('trainType.single');
      } else if (type === TRAIN_TYPE.TEAM) {
        return this.$t('trainType.team');
      } else {
        return this.$t('trainType.red');
      }
    },

    // 技能练习-困难等级样式
    trainDifficultyStyle(type) {
      if (type === TRARN_DIFFICULTY.PRIMARY) {
        return 'level-low';
      } else if (type === TRARN_DIFFICULTY.MEDIUM) {
        return 'level-middle';
      } else {
        return 'level-hight';
      }
    },

    // 技能训练默认图片
    trainDefaultLog(type) {
      if (type === TRAIN_TYPE.SINGLE) {
        return this.defaultSingleLog;
      } else if (type === TRAIN_TYPE.TEAM) {
        return this.defaultTeamLog;
      } else {
        return this.defaultRedBlueLog;
      }
    },

    // 技能练习-困难等级
    trainDifficultyName(type) {
      if (type === TRARN_DIFFICULTY.PRIMARY) {
        return this.$t('m.lowLevel');
      } else if (type === TRARN_DIFFICULTY.MEDIUM) {
        return this.$t('m.middleLevel');
      } else {
        return this.$t('m.highLevel');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@mixin contentStyle {
  padding: 12px 16px;
  background-color: var(--bg-color-2);
  border-radius: 4px;
}
.content-wrapper {
  height: 100%;
  .careers-list {
    @include contentStyle;
    .pre-next {
      position: absolute;
      top: 12px;
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
    .career-wrapper {
      display: flex;
      overflow: hidden;
      column-gap: 10px;
      .career-item {
        width: calc(20% - 8px);
        height: 64px;
        background: var(--neutral0);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        .header {
          width: 48px;
          height: 48px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .name-choose {
          margin-left: 12px;
          .name {
            font-size: 14px;
            color: var(--neutral8);
            font-weight: 600;
            width: 120px;
            @include ellipsis;
          }
          .choose {
            display: none;
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 12px;
            border: solid 1px var(--primary-color);
            color: var(--primary-color);
            cursor: pointer;
          }
        }
      }
      .career-item:hover {
        background-color: var(--primary-color-2);
        border: solid 1px var(--primary-color);
        .choose {
          display: inline-block;
          margin-top: 4px;
        }
      }
      .career-item-active {
        background-color: var(--primary-color-2);
        border: solid 1px var(--primary-color);
        .choose {
          display: none;
          margin-top: 0;
        }
      }
      .career-item-active:hover {
        background-color: var(--primary-color-2);
        border: solid 1px var(--primary-color);
        .choose {
          display: none;
          margin-top: 0;
        }
      }
    }
  }
  .career-content {
    margin-top: 12px;
    height: calc(100% - 143px);
    display: flex;
    .career-detail {
      width: 298px;
      height: 100%;
      overflow: auto;
      @include contentStyle;
      display: flex;
      flex-direction: column;
      align-items: center;
      .user-logo {
        position: relative;
        .progress-wrapper {
          ::v-deep {
            .cb-progress-circle__text {
              display: flex !important;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .career-percent {
          position: absolute;
          background-color: var(--green-color-2);
          color: var(--green-color);
          width: 80px;
          font-size: 12px;
          border-radius: 10px;
          padding: 2px 4px;
          z-index: 99;
          bottom: -2px;
          left: 50%;
          text-align: center;
          transform: translateX(-50%);
        }
      }
      .career-name {
        color: var(--neutral9);
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        margin-top: 12px;
        width: 100%;
        text-align: center;
        @include ellipsis;
      }
      .career-level {
        color: var(--neutral6);
        font-size: 12px;
        display: flex;
        margin-bottom: 12px;
        span:last-child {
          width: 180px;
          @include ellipsis;
        }
      }
      .career-description {
        height: 142px;
        width: 100%;
        padding: 8px;
        color: var(--neutral7);
        font-size: 12px;
        background-color: var(--neutral0);
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .career-tks {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 32px;
      }
    }
    .course-skill-content {
      margin-left: 12px;
      width: calc(100% - 310px);
      /* height: 100%; */
      @include contentStyle;
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
        display: flex;
        justify-content: center;
        position: relative;
        .position-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
        }
        .tab-content {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .tab-main-content {
          position: relative;
          width: 100%;
          height: 100%;
          .progress-total {
            position: absolute;
            top: 8px;
            left: 50px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: var(--neutral7);
            .font {
              margin-left: 24px;
            }
            .progress {
              width: 100px;
              height: 8px;
              border-radius: 4px;
              background-color: var(--neutral1);
              position: relative;
              .progress-inner {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                border-radius: 4px;
                background-color: var(--green-color);
              }
            }
            .percent {
              margin-left: 8px;
              color: var(--green-color);
            }
          }
          .avatar {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
              width: 76px;
              height: 76px;
              border-radius: 40px;
            }
            .start {
              background-color: var(--green-color-2);
              color: var(--green-color);
              font-size: 12px;
              border-radius: 10px;
              padding: 2px 20px;
              text-align: center;
            }
          }
          .tree-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            .top-line,
            .last-line {
              width: 8px;
              height: 26px;
              background-color: var(--primary-color-4);
            }
            .finish-flag {
              width: 60px;
              height: 82px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .node-line-leaf-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
              .node-item {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: var(--primary-color-2);
                position: relative;
                .node-item-number {
                  position: absolute;
                  z-index: 9;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background-color: var(--primary-color-8);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: var(--neutral9);
                  font-size: 18px;
                  font-weight: 600;
                }
                .node-item-number-finished {
                  background-color: var(--green-color-8);
                }
              }
              .node-item-finished {
                background-color: var(--green-color-2);
              }
              .line-item {
                width: 8px;
                min-height: 32px;
                background-color: var(--primary-color-4);
              }
              .leaf-item {
                top: -24px;
                position: absolute;
                width: 473px;
                height: 104px;
                background-color: var(--neutral0);
                padding: 10px;
                .leaf-item-veins {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: space-between;
                }
                .leaf-item-veins-image {
                  width: 147px;
                  height: 84px;
                  position: relative;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                  }
                  .level {
                    position: absolute;
                    top: 0;
                    left: 0;
                    padding: 0 4px;
                    height: 22px;
                    border-radius: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--neutral8);
                    font-size: 12px;
                  }
                  .level-low {
                    background-color: var(--primary-color);
                  }
                  .level-middle {
                    background-color: var(--orange-color);
                  }
                  .level-hight {
                    background-color: var(--red-color);
                  }
                }
                .leaf-item-veins-message {
                  width: calc(100% - 160px);
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  .message-title {
                    font-size: 16px;
                    color: var(--neutral8);
                    font-weight: 600;
                    margin-bottom: 12px;
                    width: 80%;
                    @include ellipsis;
                  }
                  .message-content {
                    display: flex;
                    .message-content-lesson {
                      font-size: 12px;
                      color: var(--neutral7);
                      display: flex;
                      align-items: center;
                    }
                    .message-content-progress {
                      display: flex;
                      align-items: center;
                      font-size: 12px;
                      margin: 0 8px;
                      color: var(--neutral7);
                      .percent-bottom {
                        width: 60px;
                        height: 8px;
                        background-color: var(--neutral0);
                        position: relative;
                        border-radius: 4px;
                        margin: 0 4px;
                        .percent {
                          position: absolute;
                          left: 0;
                          top: 0;
                          height: 100%;
                          border-radius: 4px;
                          background-color: var(--primary-color);
                        }
                      }
                    }
                    .message-content-operate {
                      margin-left: 12px;
                      color: var(--primary-color);
                      font-size: 14px;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      > span {
                        margin-right: 4px;
                      }
                    }
                  }
                }
                .course-down-content {
                  position: absolute;
                  top: 94px;
                  left: -10px;
                  width: calc(100% + 20px);
                  height: auto;
                  background-color: var(--neutral0);
                  padding: 8px;
                  border-top: solid 1px var(--neutral0);
                  .course-down-item {
                    /* .chapter-content {
                      .chapter-name-wrapper {
                        display: flex;
                        font-size: 16px;
                        color: var(--neutral8);
                        align-items: center;
                        padding: 4px 12px;
                        margin-bottom: 4px;
                        border-radius: 4px;
                        background-color: var(--neutral0);
                        position: relative;
                        cursor: pointer;
                        .chapter-name {
                          margin-left: 8px;
                          font-weight: 600;
                        }
                        .captor-progress {
                          position: absolute;
                          top: 6px;
                          right: 12px;
                          font-size: 14px;
                          color: var(--neutral6);
                        }
                      }
                    } */
                  }
                }
              }
              .leaf-item-right {
                right: -485px;
              }
              .leaf-item-left {
                left: -485px;
              }
            }
            // 技能练习单独样式 start
            .node-line-leaf-content-small {
              .leaf-item-group {
                top: -24px;
                position: absolute;
                width: 473px;
                height: auto;
                .leaf-item {
                  position: relative;
                  top: 0;
                  width: 100%;
                  height: 104px;
                  background-color: var(--neutral0);
                  padding: 10px;
                  margin-bottom: 10px;
                  cursor: pointer;
                  .leaf-item-veins-message {
                    .message-content {
                      display: flex;
                      align-items: center;
                      span:last-child {
                        color: var(--neutral8);
                        margin-left: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        width: calc(100% - 75px);
                        @include ellipsis;
                      }
                    }
                    .message-type {
                      width: 64px;
                      height: 22px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 12px;
                      border-radius: 2px;
                    }
                    .message-type-single {
                      background-color: var(--green-color-2);
                      color: var(--green-color);
                    }
                    .message-type-team {
                      background-color: var(--primary-color-2);
                      color: var(--primary-color);
                    }
                    .message-type-red-blue {
                      background-color: var(--orange-color-2);
                      color: var(--orange-color);
                    }
                    .level-difficulty {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: var(--neutral8);
                      font-size: 12px;
                      width: 64px;
                      height: 22px;
                      border-radius: 2px;
                    }
                    .level-low {
                      background-color: var(--primary-color);
                    }
                    .level-middle {
                      background-color: var(--orange-color);
                    }
                    .level-hight {
                      background-color: var(--red-color);
                    }
                  }
                  .message-status {
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    font-size: 14px;
                  }
                  .message-status-not-started {
                    color: var(--green-color);
                  }
                  .message-status-running {
                    color: var(--red-color);
                  }
                  .message-status-finished {
                    color: var(--neutral5);
                  }
                  .message-status-pause {
                    color: var(--blue-color);
                  }
                }
                .leaf-item-no-data {
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                  color: var(--neutral8);
                  font-size: 14px;
                  cursor: default;
                  .task-name {
                    display: flex;
                    flex-direction: row;
                    font-size: 16px;
                    align-items: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    .name {
                      margin-left: 4px;
                      width: calc(100% - 30px);
                      @include ellipsis;
                    }
                  }
                  .no-train-des {
                    color: var(--neutral6);
                  }
                }
              }
            }
            // 技能训练-技能下拉 end
          }
        }
      }
    }
  }
}
</style>
