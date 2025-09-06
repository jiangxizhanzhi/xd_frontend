<template>
  <div class="course-card">
    <div class="imgbox">
      <img :src="cardData.logo || defaultLogo" alt="img" />
    </div>
    <div class="bottom-info">
      <div class="name-box one-overflow">
        <span :title="cardData.name || cardData.course_name">
          {{ cardData.name || cardData.course_name }}
        </span>
      </div>
      <div
        class="level-box"
        :class="{
          'level-high':
            cardData.difficulty === DIFFICULTY.ADVANCED ||
            cardData.stage === DIFFICULTY.ADVANCED,
          'level-middle':
            cardData.difficulty === DIFFICULTY.MEDIUM ||
            cardData.stage === DIFFICULTY.MEDIUM,
          'level-low':
            cardData.difficulty === DIFFICULTY.PRIMARY ||
            cardData.stage === DIFFICULTY.PRIMARY,
          'level-en-width': lang == 'en-US',
        }"
      >
        <div class="level-span">
          <template
            v-if="
              cardData.difficulty === DIFFICULTY.ADVANCED ||
              cardData.stage === DIFFICULTY.ADVANCED
            "
            >{{ $t('m.highLevel') }}</template
          >
          <template
            v-if="
              cardData.difficulty === DIFFICULTY.MEDIUM ||
              cardData.stage === DIFFICULTY.MEDIUM
            "
            >{{ $t('m.middleLevel') }}</template
          >
          <template
            v-if="
              cardData.difficulty === DIFFICULTY.PRIMARY ||
              cardData.stage === DIFFICULTY.PRIMARY
            "
            >{{ $t('m.lowLevel') }}</template
          >
        </div>
      </div>
      <div class="text-box" v-if="detailShow">
        <div class="text-box-common fl one-overflow">
          <cb-iconfont
            class="icontime"
            type="icon-kechengkeshi"
            themedColor="neutral7"
            :size="16"
          ></cb-iconfont>
          <template v-if="commentType === COMMENT_TYPE.PRACTICE">
            <span style="margin-right: 4px">{{ cardData.practice_count }}</span>
            <span v-if="cardData.practice_count <= 1">{{
              $t('m.questionNum')
            }}</span>
            <span v-else>{{ $t('m.questionNums') }}</span>
          </template>
          <template v-else>
            <div class="number-progress">
              <span>{{ cardData.lesson_count }}</span>
              <span v-if="cardData.lesson_count <= 1">{{
                $t('m.lesson')
              }}</span>
              <span v-else>{{ $t('m.lessons') }}</span>
              <div class="finished">
                <span>{{ $t('m.completed') }}</span>
                <div class="progress">
                  <div
                    :style="{ width: cardData.process + '%' }"
                    class="percent"
                  ></div>
                </div>
                <span>{{ cardData.process + '%' }}</span>
              </div>
            </div>
          </template>
        </div>
        <div
          class="text-box-common fl one-overflow"
          v-if="commentType === COMMENT_TYPE.PRACTICE"
        >
          <cb-iconfont type="icon-zhanghao" size="14" themedColor="neutral7" />
          <span>{{ cardData.create_user_name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Default from '../../assets/img/course/logo.jpg';
import { DIFFICULTY, COMMENT_TYPE } from '@/pages/web/course/constant.js';

export default {
  name: 'Index',
  props: {
    commentType: {
      type: Number,
      default: null,
    },
    detailShow: {
      type: Boolean,
      default: true,
    },
    cardData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      DIFFICULTY,
      COMMENT_TYPE,
      defaultLogo: Default,
    };
  },
  computed: {
    lang() {
      return this.$store.state.app.language;
    },
  },
};
</script>
<style scoped lang="scss">
.level-en-width {
  width: 90px !important;
}
.course-card {
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  &:hover {
    img {
      transform: scale(1.1);
      transition: all 0.5s ease;
    }
    .bottom-info {
      background: var(--neutral0);
      .name-box span {
        color: var(--primary-color);
      }
    }
  }
  .imgbox {
    width: 100%;
    padding-bottom: 56%;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    img {
      width: 100%;
      // height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 4px 4px 0 0;
      transition: all 0.5s ease;
    }
  }
  .bottom-info {
    height: 80px;
    .name-box {
      width: 100%;
      padding: 16px 16px 10px 16px;
      span {
        font-size: 16px;
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
    .level-box {
      min-width: 56px;
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
    width: 100%;
    overflow: hidden;
    padding-bottom: 16px;
    text-align: center;
    display: flex;
  }
  .text-box-common {
    font-size: 13px;
    display: flex;
    align-items: center;
    padding-left: 16px;
    i,
    .icontime {
      margin-right: 5px;
      font-size: 16px;
    }
    i,
    span {
      vertical-align: middle;
    }
  }
}
</style>
<style lang="scss" scoped>
.icontime {
  padding-right: 2px;
}
.course-card {
  .bottom-info {
    .text-box {
      span {
        color: var(--neutral7);
      }
    }
  }
  .name-box {
    color: var(--neutral8);
    span {
      color: var(--neutral8);
    }
  }

  .level-box {
    .level-span {
      color: var(--white-color);
    }
  }
  .text-box-common {
    .time {
      background: var(--green-color);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .number-progress {
      display: flex;
      align-items: center;
      font-size: 12px;
      .finished {
        display: flex;
        align-items: center;
        color: var(--neutral7);
        margin-left: 16px;
        .progress {
          position: relative;
          width: 60px;
          height: 8px;
          border-radius: 4px;
          margin: 0 4px;
          background-color: var(--neutral1);
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
    }
  }
}
</style>
