<template>
  <div v-if="showMask">
    <!-- 除场景启动中和启动失败的事件 -->
    <div
      v-if="(!isStarting && !startError) || !useNewProgress"
      class="global-mask"
    >
      <!--按钮-->
      <div v-if="showMaskBtn" class="show-btn">
        <cb-button icon="icon-kaishi" @click="startScene"
          >{{ $tt('stage.startScene') }}
        </cb-button>
      </div>
      <!--进度条-->
      <div v-if="showProgress" class="mask-progress">
        <div class="progress-container">
          <cb-progress
            :status="progress.status"
            :percentage="progress.progressRate"
            strokeLinecap="round"
            :stroke-width="12"
            textInside
          ></cb-progress>
          <transition-group name="progress-info" tag="p">
            <div class="progress-info-item" key="progressInfo">
              {{ progress.progressInfo }}
            </div>
            <div
              class="progress-info-item"
              key="progressInfo2"
              :title="progressMessage"
              style="font-size: 14px"
            >
              {{ progressMessage }}
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <!-- 场景启动中的处理 -->
    <template v-if="(isStarting || startError) && useNewProgress">
      <div :class="{'global-starting-progress-mask': true, 'error-mask': startError }"></div>
      <div
        :class="{'starting-progress-wrapper': true, 'error-progress': startError }"
        :style="{
          width: progressLocalize.width,
          left: progressLocalize.left,
          bottom: `calc(118px + ${progressLocalize.bottom})`,
        }"
      >
        <div
          class="progress-desc"
          :style="{ bottom: startError ? '86px' : '40px' }"
        >
          <div class="left-box">
            <!-- 启动失败的按钮显示 -->
            <div class="btn-group-mask">
              <slot name="custom-btn" v-if="startError"></slot>
            </div>
            <span :class="{ 'progress-info': true, error: startError }">
              <cb-iconfont
                v-if="startError"
                type="icon-cuowu"
                color="var(--red-color)"
                class="progress-info-icon"
              ></cb-iconfont>
              <span>{{ stageProgress.stageName }}</span>

              <span :class="{ 'percentage-txt': true, error: startError }"
                >{{ stageProgress.stagePercentage || 0 }}%</span
              >
              <!-- 动态加载图标在启动过程中显示 -->
              <span class="loader" v-if="isStarting">
                <span
                  class="ball-pulse"
                  v-for="item in [1, 2, 3, 4, 5, 6]"
                  :key="item"
                ></span>
              </span>
            </span>
          </div>
          <div class="right-box">
            <span :class="{ error: startError }"
              >{{ progress.progressRate || 0 }}%</span
            >
          </div>
        </div>
        <div
          v-if="startError"
          :class="{ 'error-progress-message': true, error: startError }"
        >
          <div :title="progressMessage">{{ progressMessage }}</div>
        </div>
        <cb-progress
          class="top-progress-box"
          :percentage="progress.progressRate"
          :status="progress.status"
          strokeLinecap="square"
          :stroke-width="2"
          :show-text="false"
        ></cb-progress>
        <div class="starting-progress">
          <div
            v-for="item in stageProgress.stageList"
            :key="item.stage"
            class="progress-box"
          >
            <cb-iconfont
              :type="'icon-' + item.icon"
              :color="'var(--neutral8)'"
            ></cb-iconfont>
            <span class="text-box">{{ item.stage_name }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import t, { i18n } from '../../../utils/i18n';
import { PROGRESS_OPTIONS } from './constant';
export default {
  name: 'index',
  props: {
    /**
     * 是否显示遮罩
     */
    showMask: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示启动按钮
     */
    showMaskBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示进度条
     */
    showProgress: {
      type: Boolean,
      default: false,
    },
    /**
     * 进度条数据
     *  status: 进度条状态
     *  progressRate： 进度
     *  progressInfo： websocket推送的信息
     */
    progress: {
      type: Object,
      default: () => {
        return {
          status: undefined,
          progressRate: 0,
          progressInfo: '',
        };
      },
    },

    /* 5.4.1新增的阶段进度 */
    stageProgress: {
      type: Object,
      default: () => {
        return {
          stageList: [],
          stageName: '',
          stagePercentage: 0,
        };
      },
    },

    // 是否启用新的进度条
    useNewProgress: {
      type: Boolean,
      default: true,
    },
    /**
     * 场景启动进度条的位置和宽度定位
     */
    progressLocalize: {
      type: Object,
      default: () => {
        return {
          width: '100%',
          left: '0px',
          bottom: '0px',
        };
      },
    },
    /**
     * 进度信息
     */
    progressMessage: {
      type: String,
      default: '',
    },
    // 场景的事件判断
    event: {
      type: String | Number,
      default: '',
    },
    // 场景的事件判断
    event_status: {
      type: String | Number,
      default: '',
    },
  },
  data() {
    return {
      progressOptions: PROGRESS_OPTIONS,
    };
  },
  computed: {
    // 启动中
    isStarting: {
      get() {
        return this.event == 2 && this.event_status == 2;
      },
    },
    // 启动失败
    startError: {
      get() {
        return this.event == 2 && this.event_status == 5;
      },
    },
  },
  methods: {
    $tt: t,
    /**
     * 场景启动
     */
    startScene() {
      this.$confirm(this.$tt('stage.sureStartScene'))
        .then((res) => {
          this.$emit('onSceneStart');
          this.$emit('on-scene-start');
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
//  进度条的动画
.progress-info-item {
  margin: 12px auto;
  text-align: center;
  width: 50%;
  word-break: normal;
}

.progress-info-enter-active,
.progress-info-leave-active {
  transition: all 0.8s ease;
}

.progress-info-enter-from,
.progress-info-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

::v-deep .cb-progress-bar__innerText {
  font-size: 12px;
}

.global-mask {
  position: absolute;
  background-color: var(--mask-color);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: var(--white-color);

  .show-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mask-progress {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .progress-container {
      width: 50%;
    }
  }
}
.global-starting-progress-mask {
  position: absolute;
  background-color: transparent;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  &.error-mask {
    z-index: inherit;
    pointer-events: none;
  }
}

// 场景启动中进度条
.starting-progress-wrapper {
  position: relative;
  min-height: 118px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  &.error-progress {
    cursor: pointer;
    pointer-events: all;
  }
  @keyframes scale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    50% {
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      opacity: 0.7;
    }

    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
  $size: 1 2 3 4 5 6;
  .progress-desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 40px;
    color: var(--primary-color);
    font-size: 14px;
    width: 100%;
    padding: 0 14px;
    .left-box {
      .percentage-txt {
        margin: 0 4px;
      }
      .progress-info {
        display: block;
      }
      .btn-group-mask {
        pointer-events: all;
        margin-bottom: 16px;
      }
      .progress-info-icon {
        margin-right: 2px;
        vertical-align: bottom;
      }
    }
    .right-box {
      align-self: end;
      padding-left: 16px;
    }
    .error {
      color: var(--red-color);
    }
    .loader {
      position: relative;
      bottom: 3px;
      @each $i in $size {
        .ball-pulse:nth-child(#{$i}) {
          -webkit-animation: scale
            1.2s
            #{0.05 *
            $i}s
            infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          animation: scale
            1.2s
            #{0.05 *
            $i}s
            infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
      }
      .ball-pulse {
        background-color: var(--primary-color);
        width: 4px;
        height: 4px;
        margin: 0 2px;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
      }
    }
  }
  .error-progress-message {
    position: absolute;
    left: 16px;
    bottom: 42px;
    color: #ff6652;
    font-size: 14px;
    right: 0;
    height: 44px;
    display: flex;
    align-items: center;
    div {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .top-progress-box {
    position: absolute;
    bottom: 32px;
    width: 100%;
  }
  .starting-progress {
    position: absolute;
    bottom: 0;
    height: 33px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--neutral8);
    font-size: 14px;
    box-sizing: border-box;
    pointer-events: all;
    .progress-box {
      box-sizing: border-box;
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neutral2);
      line-height: 33px;
      height: 33px;
      .text-box {
        padding-left: 4px;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /*超出2行显示省略号*/
        overflow: hidden;
      }
    }
  }
  ::v-deep {
    .cb-progress-bar__inner::after {
      content: '';
      background-color: var(--primary-color-2);
      height: 31px;
      display: block;
      width: 100%;
      position: relative;
      top: 17px;
    }
    .is-exception .cb-progress-bar__inner::after {
      background-color: var(--red-color-2);
    }
    .cb-progress-line-slot-right {
      display: none;
    }
    .cb-progress-line-slot-left {
      display: none;
    }
    .cb-progress-bar {
      padding-right: initial;
      margin-right: initial;
    }
    .is-success .cb-progress-bar__inner {
      background-color: var(--primary-color);
    }
  }
}
</style>
