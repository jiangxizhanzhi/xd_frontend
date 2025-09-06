<template>
  <div class="job-way">
    <div class="job-way-title">
      {{
        type === 'course'
          ? $t('course.recommendLearningPath')
          : $t('course.recommendTrainPath')
      }}
    </div>
    <div
      class="job-line-contain"
      id="swiperScroll"
      ref="swiperScroll"
      :class="[showRightIcon ? '' : 'algin-center']"
    >
      <div
        class="left-arrow"
        :class="[!statusLeftIcon ? 'com-arrow-disabled' : 'com-arrow']"
        v-show="showLeftIcon"
        @click="handleLeftClick"
      >
        <cb-iconfont type="icon-xiangyou" themedColor="neutral8" />
      </div>
      <div
        ref="swiperScrollContent"
        id="swiperScrollContent"
        class="job-way-icon-line"
      >
        <template v-if="courseList.length > 0">
          <div
            class="course-item"
            v-for="(item, index) in courseList"
            :key="item.resource_id"
          >
            <cb-tooltip
              :content="type === 'course' ? item.name : item.title"
              placement="top"
            >
              <div
                class="course-circle"
                :class="getCircleCOlor(item, index)"
                @click="changeCourse(item, index)"
              >
                <cb-iconfont
                  :type="statusIcon(item)"
                  themedColor="neutral8"
                  :size="10"
                ></cb-iconfont>
              </div>
            </cb-tooltip>
            <div class="course-line" :class="getLineColor(item)"></div>
          </div>
          <div class="thropy">
            <img :src="trophy" alt="" />
          </div>
        </template>
        <template v-else>
          <div class="course-item">
            <div class="course-line bgcGrey"></div>
          </div>
          <div class="thropy">
            <img :src="trophyGrey" alt="" />
          </div>
        </template>
      </div>
      <div
        class="right-arrow cursor"
        :class="[!statusRightIcon ? 'com-arrow-disabled' : 'com-arrow']"
        v-show="showRightIcon"
        @click="handleRightClick"
      >
        <cb-iconfont type="icon-xiangzuo" themedColor="neutral8" />
      </div>
    </div>
    <div
      v-if="type === 'skill' && courseList.length > 0"
      class="task-related-scene"
    >
      <div
        v-if="totalTaskLength > 1"
        class="left-arrow-related"
        :class="[
          !statusLeftIconRelated
            ? 'com-arrow-disabled-related'
            : 'com-arrow-related',
        ]"
        v-show="showLeftIconRelated"
        @click="handleLeftClickRelated"
      >
        <cb-iconfont type="icon-xiangyou" themedColor="neutral8" />
      </div>
      <div v-if="ActiveCourse" class="task-related-span">
        {{ $t('course.taskRelatedScene') }}
        {{ currentTaskClick }}/{{ totalTaskLength }}
      </div>
      <div
        v-if="totalTaskLength > 1"
        class="right-arrow-related cursor"
        :class="[
          !statusRightIconRelated
            ? 'com-arrow-disabled-related'
            : 'com-arrow-related',
        ]"
        v-show="showRightIconRelated"
        @click="handleRightClickRelated"
      >
        <cb-iconfont type="icon-xiangzuo" themedColor="neutral8" />
      </div>
    </div>
    <div class="course-detail">
      <div class="overlay-box">
        <template v-if="courseList.length > 0">
          <div
            v-if="ActiveCourse"
            class="course-wrapper"
            @click="goToCourse(ActiveCourse)"
          >
            <div class="imgdiv">
              <img :src="ActiveCourse.logo || defaultLogo" alt="" />
              <div class="level-box" :class="levelClass">
                <div class="level-span">
                  {{ levelText }}
                </div>
              </div>
            </div>
            <div class="studyway_right">
              <div class="course-detail-name">
                <div
                  class="course-detail-name-left one-overflow"
                  :title="ActiveCourse.name || ActiveCourse.mission_title"
                >
                  {{ ActiveCourse.name || ActiveCourse.mission_title }}
                </div>
                <div v-if="type === 'course'" class="course-progress-right">
                  <cb-progress
                    stroke-linecap="round"
                    :stroke-width="10"
                    strokeLinecap="round"
                    color="#52C41A"
                    style="flex: 1"
                    :percentage="ActiveCourse.process"
                  >
                    <template v-slot:line-right>
                      <span class="processText">
                        {{ $t('course.study') }}{{ ActiveCourse.process }}%
                      </span>
                    </template>
                  </cb-progress>
                </div>
                <div v-else-if="type === 'skill'" class="skill-status-right">
                  <span
                    :class="[
                      ActiveCourse.training_status === TRARN_STATUE.NOT_START
                        ? 'color-green'
                        : '',
                      ActiveCourse.training_status === TRARN_STATUE.RUNNING ||
                      ActiveCourse.training_status === TRARN_STATUE.RECOVERY
                        ? 'color-blue'
                        : '',
                      ActiveCourse.training_status === TRARN_STATUE.END
                        ? 'color-gray'
                        : '',
                      ActiveCourse.training_status === TRARN_STATUE.PAUSE
                        ? 'color-red'
                        : '',
                    ]"
                    >{{ getTrainStatus() }}</span
                  >
                </div>
              </div>
              <div
                v-if="type === 'course'"
                class="course-detail-des"
                :title="ActiveCourse.description"
              >
                {{
                  ActiveCourse.description != ''
                    ? ActiveCourse.description
                    : $t('course.noIntroduction')
                }}
              </div>
              <div v-else-if="type === 'skill'" class="train-model">
                <!-- 有关训练 -->
                <div class="associated-tasks com-box">
                  <div
                    :class="language === 'en-US' ? 'com-label-en' : 'com-label'"
                  >
                    {{ $t('course.belongScene') }}：
                  </div>
                  <div class="">
                    <span class="train-name">
                      {{ ActiveCourse.training_name }}
                    </span>
                    <div
                      v-if="type === 'skill'"
                      class="ml5"
                      :class="[
                        ActiveCourse.training_type === TRAIN_TYPE.SINGLE
                          ? 'green-box'
                          : '',
                        ActiveCourse.training_type === TRAIN_TYPE.TEAM
                          ? 'blue-box'
                          : '',
                        ActiveCourse.training_type === TRAIN_TYPE.RED
                          ? 'orange-box'
                          : '',
                      ]"
                    >
                      {{ getTrainType(ActiveCourse) }}
                    </div>
                  </div>
                </div>
                <div class="train-time mt8">
                  <div class="com-box">
                    <div
                      :class="
                        language === 'en-US' ? 'com-label-en' : 'com-label'
                      "
                    >
                      {{ $t('course.trainTime') }}：
                    </div>
                    <span class="duration-time">
                      {{ ActiveCourse.duration_time }}{{ $t('course.hour') }}
                    </span>
                  </div>
                </div>
                <div class="pre-skill mt8 com-box">
                  <div
                    :class="language === 'en-US' ? 'com-label-en' : 'com-label'"
                  >
                    {{ $t('course.frontSkills') }}：
                  </div>
                  <div class="com-desc one-overflow" :title="preSkill">
                    {{ preSkill }}
                  </div>
                </div>
                <div class="train-skill mt8 com-box">
                  <div
                    :class="language === 'en-US' ? 'com-label-en' : 'com-label'"
                  >
                    {{ $t('course.trainingSkills') }}：
                  </div>
                  <div class="com-desc one-overflow" :title="trainSkill">
                    {{ trainSkill }}
                  </div>
                </div>
              </div>
              <div class="course-detail-footer">
                <div class="knowledge" :title="knowledge">
                  <template v-if="type === 'course'">
                    {{ $t('m.exercise.knowledgePoint') }}：{{ knowledge }}
                  </template>
                  <template v-else-if="type === 'skill'">
                    {{ $t('m.exercise.skillPoint') }}：{{ skillPoint }}
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="noPathwarn">
            {{ $t('course.noTrainableScenarioInstanceWasGenerated') }}
          </div>
        </template>
        <template v-else>
          <div class="noPathwarn">
            {{
              type === 'course'
                ? $t('course.noLearnPath')
                : $t('course.noTrainPath')
            }}
          </div>
        </template>
      </div>
    </div>
    <!-- <empty v-else></empty> -->
  </div>
</template>

<script>
import Default from '@/assets/img/course/logo.jpg';
import trophy from '@/assets/img/course/trophy.png';
import trophyGrey from '@/assets/img/course/trophy-grey.png';
import Empty from '@/components/empty/index.vue';
import { getLanguage } from '@cyber/helper';
import {
  TRARN_STATUE,
  DIFFICULTY,
  TRARN_DIFFICULTY,
  REDVSBLUE,
  TRAIN_TYPE,
} from '../constant.js';
export default {
  name: 'Index',
  components: {
    Empty,
  },
  props: {
    type: {
      type: String,
      default: 'course',
    },
    courseList: {
      type: Array,
      default: () => [],
    },
    trainTypeList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    courseList: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        // 需要在此处判断训练选中的是哪个
        if (this.type === 'course') {
          let activeitem = this.courseList.find((item, index) => {
            this.ActiveIndex = index;
            return item.process != 100;
          });
          //有未完成的课程时
          if (activeitem) {
            this.ActiveCourse = activeitem;
          } else {
            this.ActiveCourse = this.courseList[0];
            this.ActiveIndex = 0;
          }
        } else {
          let activeitem = this.courseList.find((item, index) => {
            this.ActiveIndex = index;
            return item.completion_status !== true && item.available === true;
          });
          //有未完成的课程时
          if (activeitem) {
            // 有已生成实例的情况（任务未完成）
            this.ActiveCourse = activeitem.related_trainings[0];
            this.totalTaskLength = activeitem.related_trainings.length;
          } else {
            // 有已生成实例的情况   任务全都已完成
            let activeitemAll = this.courseList.find((item, index) => {
              this.ActiveIndex = index;
              return item.completion_status === true && item.available === true;
            });
            if (activeitemAll) {
              this.ActiveCourse = activeitemAll.related_trainings[0];
              this.totalTaskLength = activeitemAll.related_trainings.length;
            } else {
              // 所有的任务全都未生成实例
              this.ActiveIndex = null;
              this.ActiveCourse = undefined;
            }
          }

          this.currentTaskClick = 1;
        }
        this.getArrowStatus();
      },
    },
  },
  data() {
    return {
      language: getLanguage(),
      TRARN_STATUE,
      DIFFICULTY,
      TRARN_DIFFICULTY,
      REDVSBLUE,
      TRAIN_TYPE,
      trophy,
      trophyGrey,
      defaultLogo: Default,
      ActiveCourse: {
        name: '',
        logo: '',
        description: '',
        difficulty: '',
        pre_skill: [],
        train_skill: [],
      },
      ActiveIndex: 0,
      // 用于左右箭头
      showLeftIcon: false,
      showRightIcon: false, // 是否显示右箭头
      statusRightIcon: false, // 右箭头是否禁止点击
      swiperScrollWidth: 0, // 盒子的宽度
      swiperScrollContentWidth: 0, // 内容的宽度
      maxClickNum: 0, // 最大点击次数
      lastLeft: 0, // 上次滑动距离
      clickNum: 0, // 点击次数
      childrenList: [], // 传进来的子元素
      // 任务关联多个场景时的箭头
      clickNumRelated: 0, // 点击次数
      showLeftIconRelated: true,
      showRightIconRelated: true, // 是否显示右箭头
      totalTaskLength: 0, // 任务关联场景总长度
      currentTaskClick: 1, // 当前场景位置
    };
  },
  computed: {
    levelClass(list) {
      let lang = this.$store.state.app.language;
      const con =
        this.type === 'course' ? this.DIFFICULTY : this.TRARN_DIFFICULTY;
      if (this.ActiveCourse.difficulty === con.ADVANCED) {
        if (lang == 'en-US') {
          return 'level-high level-en-width';
        } else {
          return 'level-high';
        }
      } else if (this.ActiveCourse.difficulty === con.MEDIUM) {
        if (lang == 'en-US') {
          return 'level-middle level-en-width';
        } else {
          return 'level-middle';
        }
      } else if (this.ActiveCourse.difficulty === con.PRIMARY) {
        if (lang == 'en-US') {
          return 'level-low level-en-width';
        } else {
          return 'level-low';
        }
      }
    },
    levelText() {
      if (this.levelClass.includes('level-high')) {
        return this.$t('m.highLevel');
      } else if (this.levelClass.includes('level-middle')) {
        return this.$t('m.middleLevel');
      } else if (this.levelClass.includes('level-low')) {
        return this.$t('m.lowLevel');
      }
    },
    statusIcon() {
      return function (item) {
        if (item.process === 100) {
          return 'icon-gou';
        } else {
          return 'icon-xiangzuo';
        }
      };
    },
    knowledge() {
      let knowledge = '';
      if (this.ActiveCourse.knowledges) {
        this.ActiveCourse.knowledges.forEach((item, index) => {
          if (item.content != null) {
            knowledge += item.related_id + ' ' + item.content;
            if (index + 1 != this.ActiveCourse.knowledges.length) {
              knowledge += '/';
            }
          }
        });
      }
      return knowledge;
    },
    preSkill() {
      let preSkill = this.ActiveCourse.pre_skill.join('/');
      return preSkill;
    },
    trainSkill() {
      let trainSkill = this.ActiveCourse.train_skill.join('/');
      return trainSkill;
    },
    skillPoint() {
      let skillPoint = '';
      if (this.ActiveCourse.skills) {
        this.ActiveCourse.skills.forEach((item, index) => {
          if (item.content != null) {
            skillPoint += item.resource_id + ' ' + item.content;
            if (index + 1 != this.ActiveCourse.skills.length) {
              skillPoint += '/';
            }
          }
        });
      }
      return skillPoint;
    },
    // 左箭头是否禁止点击
    statusLeftIcon() {
      return this.clickNum > 0;
    },
    statusLeftIconRelated() {
      return this.currentTaskClick > 1;
    },
    statusRightIconRelated() {
      return this.currentTaskClick < this.totalTaskLength;
    },
  },
  created() {},
  mounted() {},
  methods: {
    getLineColor(item) {
      const colorObj = {};
      if (this.type === 'course') {
        if (item.process == 100) {
          colorObj['bgcGreen'] = true;
        } else {
          colorObj['bgOpacityLine'] = true;
        }
      } else {
        if (item.completion_status) {
          colorObj['bgcGreen'] = true;
        } else {
          colorObj['bgOpacityLine'] = true;
        }
      }
      return colorObj;
    },
    getCircleCOlor(item, index) {
      const colorObj = {};
      if (this.type === 'course') {
        if (item.process == 100) {
          colorObj['bgcGreen'] = true;
          colorObj['circleSizeGreen'] = true;
        } else {
          colorObj['bgcOpacity'] = true;
          colorObj['circleSizeBlue'] = true;
        }
        if (this.ActiveIndex === index) {
          colorObj['activeCircleGreen'] = true;
        }
        if (this.ActiveIndex === index && item.process == 100) {
          colorObj['bgGreen'] = true;
        }
        if (this.ActiveIndex === index && item.process < 100) {
          colorObj['bgOpacity'] = true;
        }
      } else {
        if (item.completion_status) {
          colorObj['bgcGreen'] = true;
          colorObj['circleSizeGreen'] = true;
        } else {
          colorObj['bgcOpacity'] = true;
          colorObj['circleSizeBlue'] = true;
        }
        if (this.ActiveIndex === index) {
          colorObj['activeCircleGreen'] = true;
        }
        if (this.ActiveIndex === index && item.completion_status) {
          colorObj['bgGreen'] = true;
        }
        if (this.ActiveIndex === index && !item.completion_status) {
          colorObj['bgOpacity'] = true;
        }
      }
      return colorObj;
    },
    getTrainType() {
      const filterData = _.filter(this.trainTypeList, (item) => {
        return item.code === this.ActiveCourse.training_type;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
    },
    getTrainStatus() {
      if (this.ActiveCourse.training_status === TRARN_STATUE.NOT_START) {
        return this.$t('course.nostart');
      } else if (
        this.ActiveCourse.training_status === TRARN_STATUE.RUNNING ||
        this.ActiveCourse.training_status === TRARN_STATUE.RECOVERY
      ) {
        return this.$t('course.running');
      } else if (this.ActiveCourse.training_status === TRARN_STATUE.END) {
        return this.$t('course.hasEnded');
      } else if (this.ActiveCourse.training_status === TRARN_STATUE.PAUSE) {
        return this.$t('course.pause');
      }
    },
    getArrowStatus() {
      this.$nextTick(() => {
        // 获取 HTMLCollection 转为 数组
        this.childrenList = [...this.$refs.swiperScrollContent.children];
        // 盒子的宽度
        this.swiperScrollWidth =
          this.$refs.swiperScroll.getBoundingClientRect().width;
        // 内容的宽度
        this.swiperScrollContentWidth =
          this.$refs.swiperScrollContent.getBoundingClientRect().width + 32;
        // 比较盒子的宽度,跟内容的宽度：判断是否需要展示右边的按钮
        if (this.swiperScrollWidth < this.swiperScrollContentWidth) {
          this.showRightIcon = true;
          this.showLeftIcon = true;
          this.statusRightIcon = true;
        } else {
          this.showRightIcon = false;
          this.showLeftIcon = false;
          this.statusRightIcon = false;
        }
      });
    },
    // 点击右箭头（左侧滚动）
    handleRightClick() {
      // 如果点击次数小于数组长度-1时，执行左滑动效果。
      if (this.clickNum < this.childrenList.length - 1) {
        // 获取当前元素宽度
        let width =
          this.childrenList[this.clickNum].getBoundingClientRect().width;

        // 获取最后一个元素距离左侧的距离
        let lastItemOffsetLeft =
          this.childrenList[this.childrenList.length - 1].offsetLeft;
        // 获取最后一个元素宽度
        let lastWidth =
          this.childrenList[
            this.childrenList.length - 1
          ].getBoundingClientRect().width;
        // 获取可视区域宽度
        const lookWidth = this.$refs.swiperScroll.clientWidth;
        // 如果最后一个元素距离左侧的距离+自身的宽度大于可视距离，表示最后一个元素没有出现，执行滚动效果
        if (lastItemOffsetLeft + lastWidth > lookWidth) {
          // 滚动距离（元素的magin-left值） = 负的它自己的长度 + 上一次滑动的距离
          this.$refs.swiperScrollContent.style.marginLeft = `${
            -width + this.lastLeft
          }px`;
          this.lastLeft = -width + this.lastLeft;
          // 点击次数+1
          this.clickNum++;
          // 记录到最后一个元素出现在可视区域时，点击次数的最大值。用于后面点击左侧箭头时判断右侧箭头的显示
          this.maxClickNum = this.clickNum;
        }
        // 如果最后一个元素距离左侧的距离小于于可视距离，需要隐藏右侧箭头
        let timer = setTimeout(() => {
          // 重新：获取最后一个元素距离左侧的距离
          let lastItemOffsetLeft2 =
            this.childrenList[this.childrenList.length - 1].offsetLeft;
          if (lastItemOffsetLeft2 + lastWidth <= lookWidth) {
            // this.showRightIcon = false;
            this.statusRightIcon = false;
          }
          clearTimeout(timer);
        }, 200);
      }
    },
    // 点击左箭头（右侧滚动）
    handleLeftClick() {
      // 当点击次数大于0时才触发，这样当点击次数clickNum等于1的到时候，clickNum--等于0.根据计算属性的判断会隐藏掉左箭头
      if (this.clickNum > 0) {
        // 获取当前元素宽度
        let width =
          this.childrenList[this.clickNum - 1].getBoundingClientRect().width;
        // 公示：滚动距离（元素的magin-left值） = 它自己的长度 + 上一次滑动的距离
        this.$refs.swiperScrollContent.style.marginLeft = `${
          this.lastLeft + width
        }px`;
        this.lastLeft = width + this.lastLeft;
        // 点击次数-1
        this.clickNum--;
        // 如果点击次数小于最大点击次数，说明最后一个元素已经不在可是区域内了，显示右箭头
        if (this.clickNum < this.maxClickNum) {
          // this.showRightIcon = true;
          this.statusRightIcon = true;
        }
      }
    },
    // 任务关联场景点击   左箭头
    handleLeftClickRelated() {
      if (this.currentTaskClick > 1) {
        this.currentTaskClick -= 1;
        this.ActiveCourse =
          this.courseList[this.ActiveIndex].related_trainings[
            this.currentTaskClick - 1
          ];
      }
    },
    // 任务关联场景点击    右箭头
    handleRightClickRelated() {
      if (this.currentTaskClick < this.totalTaskLength) {
        this.currentTaskClick += 1;
        this.ActiveCourse =
          this.courseList[this.ActiveIndex].related_trainings[
            this.currentTaskClick - 1
          ];
      }
    },
    goToCourse(active) {
      if (this.type === 'course') {
        if (active.interview == false || active.lesson_count == 0) {
          if (active.interview == false) {
            this.$message.error({
              message: this.$t('course.authWarn'),
            });
          } else {
            this.$message.error({
              message: this.$t('course.noCourses'),
            });
          }
        } else {
          this.$router.push({
            path: `/oj/course/detail/${this.ActiveCourse.resource_id}/`,
          });
        }
      } else {
        const host = window.location.host;
        const protocol = window.location.protocol;
        let joinUrl = '';
        if (active.training_type === this.TRAIN_TYPE.SINGLE) {
          // 单兵训练
          joinUrl = `${protocol}//${host}/page/mg/cr/single_train/${active.training_id}/`;
        } else if (active.training_type === this.TRAIN_TYPE.TEAM) {
          // 团队训练
          if (active.role_group === 2) {
            joinUrl = `${protocol}//${host}/page/mg/cr/student_combat/${active.training_id}`;
          } else {
            joinUrl = `${protocol}//${host}/page/mg/cr/train-detail-home/${active.training_id}`;
          }
        } else if (active.training_type === this.TRAIN_TYPE.RED) {
          // 红蓝对抗
          if (active.role_group === this.REDVSBLUE.ADMIN) {
            joinUrl = `${protocol}//${host}/page/mg/cr/manage-home/${active.training_id}`;
          } else if (active.role_group === this.REDVSBLUE.DIRECTOR) {
            joinUrl = `${protocol}//${host}/page/mg/cr/director-home/${active.training_id}`;
          } else if (active.role_group === this.REDVSBLUE.REFEREE) {
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
                  return;
                }
              });
          }
        }
        window.open(joinUrl, '_self');
      }
    },
    changeCourse(item, index) {
      if (this.type === 'course') {
        this.ActiveCourse = _.cloneDeep(item);
        this.ActiveIndex = index;
      } else {
        if (item.available === false) {
          this.$message.error(
            this.$t('course.noTrainableScenarioInstanceWasGenerated'),
          );
        } else {
          this.ActiveIndex = index;
          this.ActiveCourse =
            this.courseList[this.ActiveIndex].related_trainings[0];
          this.currentTaskClick = 1;
          this.totalTaskLength =
            this.courseList[this.ActiveIndex].related_trainings.length;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bgGreen {
  background: var(--green-color);
}
.bgOpacity {
  background: var(--primary-color) !important;
  border: 1px solid var(--primary-color) !important;
}
.activeCircleGreen {
  width: 22px !important;
  height: 22px !important;
  position: relative;
  &::after,
  &::before {
    position: absolute;
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: var(--primary-color-2) 10px solid;
    z-index: -1;
  }
  &::after {
    animation: wave 3s infinite ease-out;
  }
  &::before {
    animation: waveReverse 3s 3s infinite ease-out;
  }
  svg {
    color: var(--white-color) !important;
  }
  &:hover {
    transform: none !important;
  }
}
@keyframes wave {
  0% {
    transform: scale(0.5);
    transform-origin: center;
  }
  100% {
    transform: scale(1.2);
    transform-origin: center;
  }
}
@keyframes waveReverse {
  0% {
    transform: scale(1.2);
    transform-origin: center;
  }
  100% {
    transform: scale(0.5);
    transform-origin: center;
  }
}
.noPathwarn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--neutral8);
  min-height: 162px;
}
.bgcGreen {
  background: var(--green-color) !important;
  svg {
    color: var(--white-color) !important;
  }
}
// 带边框
.bgcOpacity {
  // background: var(--neutral1);
  border: 1px solid var(--neutral7);
}
// 不带边框
.bgOpacityLine {
  background: var(--neutral7) !important;
}
.bgcGrey {
  background: var(--neutral8);
  opacity: 0.7;
}
.circleSizeGreen {
  width: 17px;
  height: 17px;
  &:hover {
    transform: scale(1.294);
  }
}
.circleSizeBlue {
  width: 17px;
  height: 17px;
  &:hover {
    transform: scale(1.294);
  }
}
.bgcBlue {
  background: var(--primary-color);
}
.job-way {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 5;
  .job-way-title {
    text-align: left;
    font-size: 14px;
    color: var(--neutral8);
  }
  .algin-center {
    text-align: center;
  }
  .job-line-contain {
    height: 60px;
    margin: 0 16px;
    position: relative;
    width: calc(100% - 32px);
    overflow: hidden;
    .job-way-icon-line {
      display: inline-flex;
      height: 60px;
      padding-left: 24px;

      .course-item {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 2;
        .course-circle {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          background: var(--bg-color-2);
        }
        :not(.activeCircle).course-circle:hover {
          // transform: scale(1.5);
          cursor: pointer;
        }
        .course-line {
          height: 1px;
          width: 60px;
          z-index: -2;
          margin-left: 17px;
        }
      }
      .thropy {
        display: flex;
        align-items: center;
        img {
          margin-left: -14px;
        }
      }
    }
    .com-arrow {
      width: 16px;
      height: 32px;
      cursor: pointer;
      background: var(--bg-color-3);
      &:hover {
        background: var(--bg-color-4);
      }
    }
    .com-arrow-disabled {
      width: 16px;
      height: 32px;
      background: var(--bg-color-2);
      cursor: not-allowed;
    }
    .left-arrow {
      position: absolute;
      z-index: 5;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .right-arrow {
      position: absolute;
      z-index: 5;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .left-arrow,
    .right-arrow {
      svg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .task-related-scene {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    .task-related-span {
      font-size: 14px;
      display: inline-block;
      padding: 4px 8px;
      position: relative;
      background: var(--bg-color-4);
      color: var(--neutral7);
    }
    .com-arrow-related {
      width: 16px;
      height: 27px;
      cursor: pointer;
    }
    .com-arrow-disabled-related {
      width: 16px;
      height: 27px;
      cursor: not-allowed;
    }
    .left-arrow-related {
      margin-right: 10px;
      position: relative;
    }
    .right-arrow-related {
      margin-left: 10px;
      position: relative;
    }
    .left-arrow-related,
    .right-arrow-related {
      svg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .course-detail {
    min-height: 162px;

    cursor: pointer;
    background-color: var(--bg-color-3);
    .overlay-box {
      padding: 8px;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      min-height: 162px;
      box-sizing: content-box;
      &:hover {
        background-color: var(--neutral0);
      }
    }
    .course-wrapper {
      display: flex;
      flex: 1;
    }
    img {
      width: 219px;
      height: 146px;
    }
    .studyway_right {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 9px 8px 0 16px;
      width: calc(100% - 235px);
      .course-detail-name {
        display: flex;
        .course-detail-name-left {
          font-size: 14px;
          flex: 1;
          width: 0;
          color: var(--neutral8);
        }
        .course-progress-right {
          width: 140px;
          .processText {
            color: var(--neutral5);
          }
        }
        .skill-status-right {
          width: auto;
          font-size: 14px;
        }
      }
      .course-detail-des {
        margin-top: 16px;
        font-size: 14px;
        height: calc(100% - 75px);
        line-height: 20px;
        max-height: 40px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 这里是超出几行省略 */
        overflow: hidden;
        // opacity: 0.65;
        color: var(--neutral7);
      }
      .train-model {
        margin-top: 8px;
        font-size: 14px;
        color: var(--font-color-regular);
        .com-box {
          display: flex;
        }
        .com-label {
          width: 70px;
        }
        .com-label-en {
          width: 103px;
        }
        .com-desc {
          flex: 1;
          width: 0;
        }
        .train-time {
          display: flex;
        }
        .com-label,
        .com-desc,
        .train-name,
        .duration-time {
          color: var(--neutral7);
        }
      }

      .course-detail-footer {
        display: flex;
        font-size: 14px;
        height: 36px;
        width: 100%;
        margin-top: auto;
        .knowledge {
          line-height: 36px;
          width: 80px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // opacity: 0.45;
          color: var(--neutral5);
        }
      }
    }
  }
}
.mt8 {
  margin-top: 8px;
}
.task-gray-box {
  font-size: 12px;
  display: inline-block;
  padding: 1px 8px;
  position: relative;
  color: var(--neutral8);
}
.task-gray-box::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background: var(--neutral7);
}
.imgdiv {
  color: var(--white-color);
  position: relative;
  .level-low {
    background: var(--primary-color);
  }
  .level-middle {
    background: var(--orange-color);
  }
  .level-high {
    background: var(--red-color);
  }
  .level-en-width {
    width: 90px !important;
  }
  .level-box {
    width: 56px;
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px 0px 4px 0px;
    .level-span {
      font-size: 14px;
    }
  }
}
</style>
