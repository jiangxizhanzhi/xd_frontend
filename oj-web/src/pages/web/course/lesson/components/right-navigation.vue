<template>
  <div
    class="navigation-box"
    :class="$store.state.app.language === 'en' ? 'navigation-box-en' : ''"
  >
    <div
      class="common-span"
      v-if="isDesc"
      :class="getActive('desc')"
      @click="gotoNav('desc')"
    >
      <cb-iconfont type="icon-lilunkeshi" size="16" />
      <span class="txt">{{ $t('m.courseDesc') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isScene"
      :class="getActive('scene')"
      @click="gotoNav('scene')"
    >
      <cb-iconfont type="icon-shiyankeshi" size="16" />
      <span class="txt">{{ $t('m.scene') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isGuide"
      :class="getActive('guide')"
      @click="gotoNav('guide')"
    >
      <cb-iconfont type="icon-jiangyi" size="16" />
      <span v-if="lessonData.type === LESSON_TYPE.EXPERIMENT" class="txt">{{
        $t('m.guide')
      }}</span
      ><span v-else class="txt">{{ $t('m.lecture') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isVideo"
      :class="getActive('video')"
      @click="gotoNav('video')"
    >
      <cb-iconfont type="icon-lupingchakan" size="16" />
      <span class="txt">{{ $t('m.video') }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('notes')"
      @click="gotoNav('notes')"
    >
      <cb-iconfont type="icon-jianda2" size="16" />
      <span class="txt">{{ $t('m.notes') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isReport"
      :class="getActive('report')"
      @click="gotoNav('report')"
    >
      <cb-iconfont type="icon-shiyanbaogaoceshi" size="16" />
      <span class="txt">{{ $t('m.report') }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('message')"
      @click="gotoNav('message')"
    >
      <cb-iconfont type="icon-comment" size="16" />
      <span class="txt">{{ $t('m.message') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isExercise && room_id"
      :class="getActive('exercise')"
      @click="gotoNav('exercise')"
    >
      <cb-iconfont type="icon-lianxidefen" size="16" />
      <span class="txt">{{ $t('layout.navi.practice') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isFile"
      :class="getActive('annex')"
      @click="gotoNav('annex')"
    >
      <cb-iconfont type="icon-lianjie1" size="16" />
      <span class="txt">{{ $t('m.annex') }}</span>
    </div>
    <div
      :class="{ 'common-span': true, 'active-span': livingStatus }"
      v-if="isLiving"
      @click="gotoNav('live')"
    >
      <living-icon></living-icon>
      <span class="txt">{{ $t('course.studentLive') }}</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { LESSON_TYPE } from '@/pages/web/course/constant.js';
import LivingIcon from './live/living-icon';
export default {
  name: 'RightNavigation',
  components: { LivingIcon },
  props: {
    singleStatus: {
      type: Boolean,
      default: null,
    },
    lessonData: {
      type: Object,
      default: () => {},
    },
    isLiving: {
      type: Boolean,
      default: null,
    },
    livingStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      LESSON_TYPE,
      activeName: [],
      // activeName: ['guide'],
      doubleName: ['guide', 'scene', 'video'],
      dialogName: ['notes', 'report', 'message', 'annex'],
      room_id: '',
    };
  },
  created() {
    this.room_id = this.$route.query && this.$route.query.room_id;
  },
  computed: {
    allStatus() {
      // 用于单屏状态时，看工具栏高亮哪个，左侧内容定位到相应区域
      const allStatus = {
        isScene: this.isScene,
        isGuide: this.isGuide,
        isVideo: this.isVideo,
        isMessage: true,
      };
      return allStatus;
    },
    isDesc() {
      // 只要是实验课，就显示说明弹窗
      if (this.lessonData.type === LESSON_TYPE.EXPERIMENT) {
        return true;
      }
      return false;
    },
    isScene() {
      if (
        this.lessonData.type === LESSON_TYPE.EXPERIMENT &&
        (this.lessonData.scene_data || this.lessonData.scene_config_data)
      ) {
        return true;
      }
      return false;
    },
    isGuide() {
      // if (
      //   this.lessonData.pdf ||
      //   this.lessonData.html ||
      //   this.lessonData.markdown
      // ) {
      //   return true;
      // }
      if (this.lessonData.handout_url) {
        return true;
      }
      return false;
    },
    isVideo() {
      if (this.lessonData.video_url) {
        return true;
      }
      return false;
    },
    isFile() {
      if (
        this.lessonData.lesson_file &&
        this.lessonData.lesson_file.length != 0
      ) {
        return true;
      }
      return false;
    },
    isReport() {
      if (this.lessonData.type === LESSON_TYPE.EXPERIMENT) {
        return true;
      }
      return false;
    },
    isExercise() {
      if (
        this.lessonData.paper_id &&
        this.lessonData.paper_public &&
        this.lessonData.practice_count !== 0
      ) {
        return true;
      }
      return false;
    },
    singleLesson() {
      const { singleStatus, lessonData, livingStatus } = this;
      return {
        singleStatus,
        lessonData,
        livingStatus,
      };
    },
  },
  watch: {
    singleLesson: {
      handler(nv, ov) {
        // 单屏切换双屏时，清下工具栏的选中
        this.activeName = [];
        const showGuide = this.lessonData.handout_url;
        const showScene =
          this.lessonData.scene_config_data || this.lessonData.scene_data;
        const showVideo = this.lessonData.video_url;
        // 单屏状态显示
        if (this.singleStatus) {
          if (showGuide) {
            this.activeName = ['guide'];
            return;
          } else if (showScene) {
            if (this.lessonData.type === LESSON_TYPE.EXPERIMENT) {
              this.activeName = ['scene'];
              return;
            }
          } else if (showVideo) {
            this.activeName = ['video'];
            return;
          }
          // 单屏状态下，若课程无 指导、场景、视频，则把message置为高亮
          this.activeName = ['message'];
          return;
        } else {
          if (showGuide && showScene) {
            this.activeName = ['guide', 'scene'];
            return;
          } else if (showGuide && showVideo) {
            this.activeName = ['guide', 'video'];
            return;
          } else if (showScene && showVideo) {
            this.activeName = ['scene', 'video'];
            return;
          } else if (showGuide) {
            this.activeName = ['guide'];
            return;
          } else if (showScene) {
            this.activeName = ['scene'];
            return;
          } else if (showVideo) {
            this.activeName = ['video'];
            return;
          }
        }
      },
    },
  },
  methods: {
    getActive(val) {
      const activeClass = {};
      if (this.activeName.indexOf(val) > -1) {
        activeClass['active-span'] = true;
      }
      return activeClass;
    },
    gotoNav(val) {
      if (val === 'exercise') {
        if (this.$route.path.indexOf('all-course') != -1) {
          this.$router.push({
            path: `/all-course/lesson/${this.$route.params.resource_id}/${this.lessonData.resource_id}/${this.lessonData.paper_id}`,
            query: {
              room_id: `${this.room_id}`,
            },
          });
        } else if (this.$route.path.indexOf('knowledge-course') != -1) {
          this.$router.push({
            path: `/knowledge-course/lesson/${this.$route.params.resource_id}/${this.lessonData.resource_id}/${this.lessonData.test_paper}`,
          });
        } else {
          this.$router.push({
            path: `/course/lesson/${this.$route.params.resource_id}/${this.lessonData.resource_id}/${this.lessonData.paper_id}`,
          });
        }
        // this.$router.push({
        //   name: 'course-exercises',
        //   params: {
        //     resource_id: this.$route.params.resource_id,
        //     lesson_id: this.lessonData.resource_id,
        //     exercise_id: this.lessonData.test_paper,
        //   },
        // });
        return;
      }
      if (!this.singleStatus) {
        // 双屏时
        const _this = this;
        _.forEach(this.dialogName, (item) => {
          if (_this.activeName.indexOf(item) > -1) {
            _this.activeName.splice(_this.activeName.indexOf(item), 1);
          }
        });
        if (val === 'scene' || val === 'guide' || val === 'video') {
          const res1 = this.doubleName.filter((x) => {
            return this.activeName.includes(x);
          });
          if (!(res1.length === 1 && res1[0] === val)) {
            if (this.activeName.indexOf(val) > -1) {
              this.activeName.splice(this.activeName.indexOf(val), 1);
            } else {
              if (res1.length >= 2) {
                const res2 = this.activeName.find((item) =>
                  this.doubleName.includes(item),
                );
                this.activeName.splice(this.activeName.indexOf(res2), 1);
              }

              this.activeName.push(val);
            }
          }
        }
        if (
          val === 'notes' ||
          val === 'report' ||
          val === 'message' ||
          val === 'annex' ||
          val === 'desc' ||
          val === 'live'
        ) {
          this.activeName.push(val);
        }
        this.$emit('change-nav', this.activeName);
      } else {
        // 单屏时
        this.activeName = [];
        this.activeName.push(val);
        this.$emit('single-change-nav', this.activeName);
      }
    },
    dialogClose(val) {
      if (this.activeName.indexOf(val) > -1) {
        this.activeName.splice(this.activeName.indexOf(val), 1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.navigation-box {
  min-width: 60px;
  min-height: 100px;
  border-radius: 0;
  .common-span {
    height: 60px;
    line-height: 59px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    span {
      width: calc(100% - 20px);
      text-align: left;
    }
    .cb-iconfont {
      margin-right: 5px;
      margin-left: 5px;
      font-size: 16px;
      position: relative;
      top: 1px;
    }
  }
}
.navigation-box-en {
  padding: 0 5px;
}
</style>

<style lang="scss">
.navigation-box,
.console-tool {
  background: var(--bg-color-2);
  color: var(--neutral8);
  .common-span {
    .cb-iconfont {
      color: var(--neutral8);
    }
  }
  .active-span,
  .common-span:hover {
    color: var(--primary-color);
    .cb-iconfont {
      color: var(--primary-color);
    }
    .bar {
      background-color: var(--primary-color);
    }
  }
  .txt {
    margin-top: 2px;
  }
  .living {
    &:hover {
      .bar {
        background-color: var(--primary-color);
      }
    }
  }
}
</style>
