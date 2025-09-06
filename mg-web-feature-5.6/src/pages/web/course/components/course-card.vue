<template>
  <div class="course-card-wrapper">
    <div class="course-card" @click="goToCourse">
      <div class="imgbox">
        <div class="overlay-box">
          <div class="img-wrap">
            <img :src="cardData.logo || defaultLogo" alt="" />
          </div>
          <div class="name-box one-overflow">
            <div
              class="left-name one-overflow"
              :title="
                cardData.name || cardData.course_name || cardData.training_name
              "
            >
              <span>{{
                cardData.name || cardData.course_name || cardData.training_name
              }}</span>
            </div>
            <div
              v-if="type === 'skill'"
              class="right-status one-overflow"
              :class="[
                cardData.training_status === TRARN_STATUE.NOT_START
                  ? 'color-green'
                  : '',
                cardData.training_status === TRARN_STATUE.RUNNING ||
                cardData.training_status === TRARN_STATUE.RECOVERY
                  ? 'color-blue'
                  : '',
                cardData.training_status === TRARN_STATUE.END
                  ? 'color-gray'
                  : '',
                cardData.training_status === TRARN_STATUE.PAUSE
                  ? 'color-red'
                  : '',
              ]"
            >
              {{ getTrainStatus() }}
            </div>
          </div>
          <div class="level-box" :class="levelClass">
            <div class="level-span">
              {{ levelText }}
            </div>
          </div>
          <div class="text-box">
            <template v-if="type === 'course'">
              <div class="course-count">
                <cb-iconfont
                  type="icon-kechengkeshi"
                  themedColor="font-color-secondary"
                  :size="20"
                ></cb-iconfont>
                <template>
                  <span class="num">{{ cardData.lesson_count }}</span>
                  <span>{{ $t('m.lesson') }}</span>
                </template>
              </div>

              <cb-progress
                stroke-linecap="round"
                :stroke-width="10"
                strokeLinecap="round"
                color="#52C41A"
                style="flex: 1"
                :percentage="cardData.process"
              >
                <template v-slot:line-right>
                  <span class="processText">
                    {{ $t('course.study') }}{{ cardData.process }}%
                  </span>
                </template>
              </cb-progress>
            </template>
            <template v-else>
              <!-- 训练 -->
              <div
                :class="[
                  cardData.training_type === TRAIN_TYPE.SINGLE
                    ? 'green-box'
                    : '',
                  cardData.training_type === TRAIN_TYPE.TEAM ? 'blue-box' : '',
                  cardData.training_type === TRAIN_TYPE.RED ? 'orange-box' : '',
                ]"
              >
                {{ getTrainType() }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Default from '@/assets/img/course/logo.jpg';
import {
  DIFFICULTY,
  TRARN_STATUE,
  TRARN_DIFFICULTY,
  TRAIN_TYPE,
  REDVSBLUE,
} from '@/pages/web/course/constant.js';

export default {
  name: 'Index',
  props: {
    type: {
      type: String,
      default: 'course',
    },
    commentType: {
      type: Number,
      default: null,
    },
    cardData: {
      type: Object,
      default: () => {},
    },
    trainTypeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultLogo: Default,
      TRARN_STATUE,
      DIFFICULTY,
      TRARN_DIFFICULTY,
      TRAIN_TYPE,
      REDVSBLUE,
    };
  },
  computed: {
    language() {
      return this.$store.state.app.language;
    },
    levelClass(list) {
      let lang = this.$store.state.app.language;

      const con =
        this.type === 'course' ? this.DIFFICULTY : this.TRARN_DIFFICULTY;
      if (this.cardData.difficulty === con.ADVANCED) {
        if (lang == 'en-US') {
          return 'level-high level-en-width';
        } else {
          return 'level-high';
        }
      } else if (this.cardData.difficulty === con.MEDIUM) {
        if (lang == 'en-US') {
          return 'level-middle level-en-width';
        } else {
          return 'level-middle';
        }
      } else if (this.cardData.difficulty === con.PRIMARY) {
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
      if (this.cardData.process === 100) {
        return 'status-icon-passed';
      } else {
        return 'status-icon-unpassed';
      }
    },
    skills() {
      let data = this.cardData.knowledges
        .filter((el) => el.content)
        .map((el) => el.content);

      let arr = [];
      data.forEach((el) => {
        arr.push(`<span title="${el}">${el}</span>`);
      });

      return arr.join(' / ');
    },
  },
  methods: {
    getTrainType() {
      const filterData = _.filter(this.trainTypeList, (item) => {
        return item.code === this.cardData.training_type;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
    },
    getTrainStatus() {
      if (this.cardData.training_status === TRARN_STATUE.NOT_START) {
        return this.$t('course.nostart');
      } else if (
        this.cardData.training_status === TRARN_STATUE.RUNNING ||
        this.cardData.training_status === TRARN_STATUE.RECOVERY
      ) {
        return this.$t('course.running');
      } else if (this.cardData.training_status === TRARN_STATUE.END) {
        return this.$t('course.hasEnded');
      } else if (this.cardData.training_status === TRARN_STATUE.PAUSE) {
        return this.$t('course.pause');
      }
    },
    goToCourse() {
      if (this.type === 'course') {
        if (
          this.cardData.interview == false ||
          this.cardData.lesson_count == 0
        ) {
          if (this.cardData.interview == false) {
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
            path: `/oj/course/detail/${this.cardData.resource_id}/`,
          });
        }
      } else {
        const host = window.location.host;
        const protocol = window.location.protocol;
        let joinUrl = '';
        if (this.cardData.training_type === this.TRAIN_TYPE.SINGLE) {
          // 单兵训练
          joinUrl = `${protocol}//${host}/page/mg/cr/single_train/${this.cardData.training_id}/`;
        } else if (this.cardData.training_type === this.TRAIN_TYPE.TEAM) {
          // 团队训练
          if (this.cardData.role_group === 2) {
            joinUrl = `${protocol}//${host}/page/mg/cr/student_combat/${this.cardData.training_id}`;
          } else {
            joinUrl = `${protocol}//${host}/page/mg/cr/train-detail-home/${this.cardData.training_id}`;
          }
        } else if (this.cardData.training_type === this.TRAIN_TYPE.RED) {
          // 红蓝对抗
          if (this.cardData.role_group === this.REDVSBLUE.ADMIN) {
            joinUrl = `${protocol}//${host}/page/mg/cr/manage-home/${this.cardData.training_id}`;
          } else if (this.cardData.role_group === this.REDVSBLUE.DIRECTOR) {
            joinUrl = `${protocol}//${host}/page/mg/cr/director-home/${this.cardData.training_id}`;
          } else if (this.cardData.role_group === this.REDVSBLUE.REFEREE) {
            joinUrl = `${protocol}//${host}/page/mg/cr/referee-home/${this.cardData.training_id}`;
          } else {
            this.$request
              .get(
                '/cr/red_vs_blue/user/get_running_status',
                { resource_id: this.cardData.training_id },
                { baseURL: '/api/ojj' },
              )
              .then((res) => {
                // 学员登录点击列表
                if (res.data.data.time_management_status !== 4) {
                  joinUrl = `${protocol}//${host}/page/mg/cr/access-center-member/${this.cardData.training_id}`;
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep .cb-progress-line-slot-right {
  margin-left: 16px;
}
.course-card-wrapper {
  height: 100%;
  width: 100%;
}
.processText {
  color: var(--neutral5);
}
.course-card {
  .imgbox {
    background-color: var(--bg-color-3);
    .overlay-box {
      overflow: hidden;
      &:hover {
        background-color: var(--neutral0);
        .left-name span {
          color: var(--primary-color);
        }
        img {
          transform: scale(1.1);
          transition: all 0.5s ease;
        }
      }
    }

    .text-box {
      .course-count {
        width: 110px;
        span {
          color: var(--neutral5);
        }
        span.num {
          margin-left: 4px;
        }
      }
    }
  }

  .name-box {
    display: flex;
    .left-name {
      color: var(--neutral8);
      flex: 1;
      width: 0;
    }
    .right-status {
      width: 45px;
      font-size: 14px;
    }
    span {
      color: var(--neutral8);
    }
  }

  .level-box {
    .level-span {
      color: var(--white-color);
    }
  }
}

.bold-text {
  color: var(--font-color-primary) !important;
}

.course-card {
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  .imgbox {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: column;
    .overlay-box {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .img-wrap {
      padding-bottom: 56%;
      width: 100%;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px 4px 0 0;
        transition: all 0.5s ease;
      }
    }
    // img {
    //   width: 100%;
    //   display: block;
    //   border-radius: 4px 4px 0 0;
    //   max-height: 200px;
    //   // min-height: 192px; // 5.3.3 UI 固定宽高比
    //   // flex: 1;
    // }
    .name-box {
      width: 100%;
      padding: 16px 16px 10px 16px;
      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
    }
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
  .text-box {
    padding: 0 16px 16px 16px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    font-size: 14px;
    overflow: hidden;
  }
}
</style>
