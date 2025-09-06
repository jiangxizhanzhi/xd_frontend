<template>
  <div class="course-card" :class="{ 'current-course': isCurrent }">
    <div class="imgbox" @click="goTo">
      <img :src="cardData.logo || defaultLogo" alt="" />
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
      <div class="text-box">
        <div class="text-box-common fl one-overflow">
          <cb-iconfont
            class="icontime"
            type="icon-keshi"
            themedColor="--orange-color"
          ></cb-iconfont>
          <template>
            <span style="margin-right: 4px">{{ cardData.lesson_count }}</span>
            <span>{{ $t('m.lessons') }}</span>
          </template>
        </div>
        <div class="text-box-common fl one-overflow">
          <cb-iconfont
            class="icontime"
            type="icon-keshishu"
            themedColor="--green-color"
          ></cb-iconfont>
          <span>{{ cardData.course_time_formate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Default from '@/assets/img/course/logo.jpg';
import { DIFFICULTY } from '@/pages/web/course/constant.js';
export default {
  name: 'Index',
  props: {
    cardData: {
      type: Object,
      default: () => {},
    },
    currentId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      DIFFICULTY,
      defaultLogo: Default,
    };
  },
  computed: {
    // levelClass() {
    //   const con = DIFFICULTY;
    //   if (this.cardData.difficulty === con.ADVANCED) {
    //     return 'level-high';
    //   } else if (this.cardData.difficulty === con.MEDIUM) {
    //     return 'level-middle';
    //   } else if (this.cardData.difficulty === con.PRIMARY) {
    //     return 'level-low';
    //   }
    // },
    // levelText() {
    //   if (this.levelClass === 'level-high') {
    //     return this.$t('m.highLevel');
    //   } else if (this.levelClass === 'level-middle') {
    //     return this.$t('m.middleLevel');
    //   } else if (this.levelClass === 'level-low') {
    //     return this.$t('m.lowLevel');
    //   }
    // },
    statusIcon() {
      if (this.cardData.status === 1) {
        return 'status-icon-passed';
      } else {
        return 'status-icon-unpassed';
      }
    },
    isCurrent() {
      return this.cardData?.resource_id === this.currentId;
    },
  },
  methods: {
    goTo() {
      this.$emit('goTo', this.cardData);
    },
  },
};
</script>
<style scoped lang="scss">
.course-card {
  width: 300px;
  height: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  border-radius: 4px;
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
    height: 100%;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    img {
      width: 100%;
      display: block;
      border-radius: 4px;
      height: 180px;
      transition: all 0.5s ease;
    }
  }
  .bottom-info {
    .name-box {
      width: 100%;
      padding: 10px 8px;
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
    text-align: center;
    display: flex;
    padding-bottom: 10px;
  }
  .text-box-common {
    font-size: 13px;
    padding-left: 10px;
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

  .icontime {
    position: relative;
    top: 2px;
    padding-right: 2px;
  }
}
</style>
<style scoped lang="scss">
.current-course {
  border: 1px solid var(--primary-color);
}
.course-card {
  background: var(--bg-color-2);
  .bottom-info {
    .text-box {
      .cb-iconfont {
        color: var(--neutral7) !important;
      }

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
  }
}
</style>
