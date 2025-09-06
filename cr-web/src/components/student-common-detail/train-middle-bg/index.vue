<template>
  <div class="middle-block">
    <div style="" class="middle-block-1">
      <div class="middle-block-1-1" style="">
        <div
          class="middle-block-1-2"
          :style="{ backgroundImage: 'url(' + avatar + ')' }"
        ></div>
      </div>
    </div>
    <div style="" class="middle-block-2">
      <div class="middle-block-2-1" style="">
        <div
          class="middle-block-2-2"
          :class="[type === 'red' ? 'red-logo-border' : 'blue-logo-border']"
        ></div>
      </div>
    </div>
    <div class="middle-block-bg">
      <div class="middle-block-bg-header">
        <div
          class="middle-block-bg-header-1-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-1-border-red'
              : 'middle-block-bg-header-1-border-blue',
          ]"
        ></div>
        <div class="middle-block-bg-header-1">
          <div
            class="middle-block-bg-header-1-1"
            :class="[
              type === 'red'
                ? 'middle-block-bg-header-1-1-red'
                : 'middle-block-bg-header-1-1-blue',
            ]"
          ></div>
          <div
            class="middle-block-bg-header-1-2"
            :class="[
              type === 'red'
                ? 'middle-block-bg-header-1-2-red'
                : 'middle-block-bg-header-1-2-blue',
            ]"
          ></div>
        </div>
        <div
          class="middle-block-bg-header-2"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-2-red'
              : 'middle-block-bg-header-2-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-header-3"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-3-red'
              : 'middle-block-bg-header-3-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-header-3-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-3-border-red'
              : 'middle-block-bg-header-3-border-blue',
          ]"
        ></div>
        <div class="middle-block-bg-header-4"></div>
        <div
          class="middle-block-bg-header-5-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-5-border-red'
              : 'middle-block-bg-header-5-border-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-header-5"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-5-red'
              : 'middle-block-bg-header-5-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-header-2"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-2-red'
              : 'middle-block-bg-header-2-blue',
          ]"
        ></div>
        <div class="middle-block-bg-header-6">
          <div
            class="middle-block-bg-header-6-1"
            :class="[
              type === 'red'
                ? 'middle-block-bg-header-6-1-red'
                : 'middle-block-bg-header-6-1-blue',
            ]"
          ></div>
          <div
            class="middle-block-bg-header-6-2"
            :class="[
              type === 'red'
                ? 'middle-block-bg-header-6-2-red'
                : 'middle-block-bg-header-6-2-blue',
            ]"
          ></div>
        </div>
        <div
          class="middle-block-bg-header-6-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-header-6-border-red'
              : 'middle-block-bg-header-6-border-blue',
          ]"
        ></div>
      </div>
      <div
        class="middle-block-bg-middle"
        :class="[
          type === 'red'
            ? 'middle-block-bg-middle-red'
            : 'middle-block-bg-middle-blue',
        ]"
      ></div>
      <div
        class="middle-block-bg-next"
        :class="[
          type === 'red'
            ? 'middle-block-bg-next-red'
            : 'middle-block-bg-next-blue',
        ]"
      ></div>
      <div class="middle-block-bg-bottom">
        <div
          class="middle-block-bg-bottom-1-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-1-border-red'
              : 'middle-block-bg-bottom-1-border-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-1"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-1-red'
              : 'middle-block-bg-bottom-1-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-2"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-2-red'
              : 'middle-block-bg-bottom-2-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-3"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-3-red'
              : 'middle-block-bg-bottom-3-blue',
          ]"
        ></div>
        <div class="middle-block-bg-bottom-5">
          <div
            class="middle-block-bg-bottom-5-1"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-5-1-red'
                : 'middle-block-bg-bottom-5-1-blue',
            ]"
          ></div>
          <div
            class="middle-block-bg-bottom-5-2"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-5-2-red'
                : 'middle-block-bg-bottom-5-2-blue',
            ]"
          ></div>
        </div>
        <div class="middle-block-bg-bottom-6">
          <div
            class="middle-block-bg-bottom-6-1"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-6-1-red'
                : 'middle-block-bg-bottom-6-1-blue',
            ]"
          ></div>
          <div
            class="middle-block-bg-bottom-6-2"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-6-2-red'
                : 'middle-block-bg-bottom-6-2-blue',
            ]"
          ></div>
        </div>
        <div class="middle-block-bg-bottom-7">
          <div
            class="middle-block-bg-bottom-7-1"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-7-1-red'
                : 'middle-block-bg-bottom-7-1-blue',
            ]"
          ></div>
          <div
            class="middle-block-bg-bottom-7-2"
            :class="[
              type === 'red'
                ? 'middle-block-bg-bottom-7-2-red'
                : 'middle-block-bg-bottom-7-2-blue',
            ]"
          ></div>
        </div>
        <div
          class="middle-block-bg-bottom-3"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-3-red'
              : 'middle-block-bg-bottom-3-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-2"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-2-red'
              : 'middle-block-bg-bottom-2-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-8"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-8-red'
              : 'middle-block-bg-bottom-8-blue',
          ]"
        ></div>
        <div
          class="middle-block-bg-bottom-8-border"
          :class="[
            type === 'red'
              ? 'middle-block-bg-bottom-8-border-red'
              : 'middle-block-bg-bottom-8-border-blue',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/default-avatar.png';

export default {
  props: {
    avatar: {
      type: String,
      default: defaultAvatar,
    },
    type: {
      type: String,
      default: 'red',
    },
  },
};
</script>

<style lang="scss" scoped>
.middle-block {
  &-1 {
    width: 52px;
    height: 42px;
    transform: rotate(120deg);
    margin: 0 auto;
    visibility: hidden;
    overflow: hidden;
    position: relative;
    z-index: 2;
    &-1 {
      width: 100%;
      height: 100%;
      transform: rotate(-60deg);
      visibility: hidden;
      overflow: hidden;
    }
    &-2 {
      width: 100%;
      height: 100%;
      transform: rotate(-60deg);
      visibility: visible;
      overflow: hidden;
      background: no-repeat 50% center;
      background-size: 100% auto;
      background-color: var(--bg-color-2);
    }
  }
  &-2 {
    width: 56px;
    height: 46px;
    transform: rotate(120deg);
    margin: 0 auto;
    visibility: hidden;
    overflow: hidden;
    position: absolute;
    z-index: 1;
    top: -2px;
    left: 244px;
    &-1 {
      width: 100%;
      height: 100%;
      transform: rotate(-60deg);
      visibility: hidden;
      overflow: hidden;
    }
    &-2 {
      width: 100%;
      height: 100%;
      transform: rotate(-60deg);
      visibility: visible;
      overflow: hidden;
      background: no-repeat 50% center;
      background-size: 100% auto;
      // background-color: var(--primary-color);
    }
  }
  &-bg {
    position: relative;
    top: -22px;
    z-index: 0;
    &-header {
      display: flex;
      height: 14px;
      &-1-border {
        width: 1px;
        height: 4px;
        background: var(--primary-color-2);
        transform: skew(-45deg);
        position: relative;
        left: 4px;
        top: 2px;
        scale: 2;
      }
      &-3-border {
        width: 1px;
        height: 5px;
        background: var(--primary-color-2);
        transform: skew(45deg);
        position: relative;
        right: 8px;
        top: 5px;
        scale: 3;
      }
      &-5-border {
        width: 1px;
        height: 5px;
        background: var(--primary-color-2);
        transform: skew(-45deg);
        position: relative;
        left: 7px;
        top: 5px;
        scale: 3;
      }
      &-6-border {
        width: 1px;
        height: 4px;
        background: var(--primary-color-2);
        transform: skew(45deg);
        position: relative;
        right: 4px;
        top: 2px;
        scale: 2;
      }
      &-1 {
        &-1 {
          width: 0;
          height: 0;
          border-color: transparent var(--bg-color-2);
          border-width: 8px 8px 0 0;
          border-style: solid;
        }
        &-2 {
          width: 9px;
          height: 8px;
          margin-left: -1px;
          background: var(--bg-color-2);
        }
      }
      &-2 {
        width: 300px;
        background: var(--bg-color-2);
        border-top: 2px solid var(--primary-color-2);
      }
      &-3 {
        width: 0;
        height: 0;
        border-color: transparent var(--bg-color-2);
        border-width: 15px 0 0 15px;
        border-style: solid;
      }
      &-4 {
        width: 52px;
        height: 15px;
        border-bottom: 2px solid var(--primary-color-2);
      }
      &-5 {
        width: 0;
        height: 0;
        border-color: transparent var(--bg-color-2);
        border-width: 15px 15px 0 0;
        border-style: solid;
      }
      &-6 {
        &-1 {
          width: 0;
          height: 0;
          border-color: transparent var(--bg-color-2);
          border-width: 8px 0 0 8px;
          border-style: solid;
        }
        &-2 {
          width: 9px;
          height: 8px;
          margin-right: -1px;
          background: var(--bg-color-2);
        }
      }
    }
    &-middle {
      width: 100%;
      height: 26px;
      background: var(--bg-color-2);
    }
    &-next {
      width: 100%;
      height: 15px;
      background: var(--bg-color-2);
      border-left: 2px solid var(--primary-color-2);
      border-right: 2px solid var(--primary-color-2);
    }
    &-bottom {
      display: flex;
      &-1-border {
        width: 1px;
        height: 5px;
        background: var(--primary-color-2);
        transform: skew(45deg);
        position: relative;
        left: 8px;
        top: 5px;
        scale: 3;
      }
      &-1 {
        width: 0;
        height: 0;
        border-color: transparent var(--bg-color-2);
        border-width: 0 15px 15px 0;
        border-style: solid;
      }
      &-2 {
        width: 15px;
        height: 15px;
        background: var(--bg-color-2);
        border-bottom: 2px solid var(--primary-color-2);
      }
      &-3 {
        width: 220px;
        height: 15px;
        background: var(--bg-color-2);
      }
      &-5 {
        &-1 {
          width: 4px;
          height: 11px;
          background: var(--bg-color-2);
        }
        &-2 {
          width: 0;
          height: 0;
          border-color: var(--bg-color-2) var(--primary-color-2);
          border-width: 4px 4px 0 0;
          border-style: solid;
        }
      }
      &-6 {
        &-1 {
          width: 46px;
          height: 11px;
          background: var(--bg-color-2);
        }
        &-2 {
          width: 46px;
          height: 4px;
          background: var(--primary-color-2);
        }
      }
      &-7 {
        &-1 {
          width: 4px;
          height: 11px;
          background: var(--bg-color-2);
        }
        &-2 {
          width: 0;
          height: 0;
          border-color: var(--bg-color-2) var(--primary-color-2);
          border-width: 4px 0 0 4px;
          border-style: solid;
        }
      }
      &-8 {
        width: 0;
        height: 0;
        border-color: transparent var(--bg-color-2);
        border-width: 0 0 15px 15px;
        border-style: solid;
      }
      &-8-border {
        width: 1px;
        height: 5px;
        background: var(--primary-color-2);
        transform: skew(-45deg);
        position: relative;
        right: 8px;
        top: 5px;
        scale: 3;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.red-logo-border {
  background-color: var(--red-color);
}
.blue-logo-border {
  background-color: var(--blue-color);
}
.middle-block-bg-header-1-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-header-1-border-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-header-1-1-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-header-1-1-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-header-1-2-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-header-1-2-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-header-2-red {
  background-color: var(--red-color-2);
  border-color: var(--red-color-4);
}
.middle-block-bg-header-2-blue {
  background-color: var(--blue-color-2);
  border-color: var(--blue-color-4);
}
.middle-block-bg-header-3-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-header-3-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-header-3-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-header-3-border-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-header-5-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-header-5-border-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-header-5-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-header-5-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-header-2-red {
  background-color: var(--red-color-2);
  border-color: var(--red-color-4);
}
.middle-block-bg-header-2-blue {
  background-color: var(--blue-color-2);
  border-color: var(--blue-color-4);
}
.middle-block-bg-header-6-1-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-header-6-1-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-header-6-2-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-header-6-2-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-header-6-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-header-6-border-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-middle-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-middle-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-next-red {
  background-color: var(--red-color-2);
  border-color: var(--red-color-4);
}
.middle-block-bg-next-blue {
  background-color: var(--blue-color-2);
  border-color: var(--blue-color-4);
}
.middle-block-bg-bottom-1-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-bottom-1-border-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-bottom-1-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-bottom-1-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-bottom-2-red {
  background-color: var(--red-color-2);
  border-color: var(--red-color-4);
}
.middle-block-bg-bottom-2-blue {
  background-color: var(--blue-color-2);
  border-color: var(--blue-color-4);
}
.middle-block-bg-bottom-3-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-bottom-3-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-bottom-5-1-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-bottom-5-1-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-bottom-5-2-red {
  border-color: var(--red-color-2) var(--red-color-4);
}
.middle-block-bg-bottom-5-2-blue {
  border-color: var(--blue-color-2) var(--blue-color-4);
}
.middle-block-bg-bottom-6-1-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-bottom-6-1-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-bottom-6-2-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-bottom-6-2-blue {
  background-color: var(--blue-color-4);
}
.middle-block-bg-bottom-7-1-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-bottom-7-1-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-bottom-7-2-red {
  border-color: var(--red-color-2) var(--red-color-4);
}
.middle-block-bg-bottom-7-2-blue {
  border-color: var(--blue-color-2) var(--blue-color-4);
}
.middle-block-bg-bottom-3-red {
  background-color: var(--red-color-2);
}
.middle-block-bg-bottom-3-blue {
  background-color: var(--blue-color-2);
}
.middle-block-bg-bottom-2-red {
  background-color: var(--red-color-2);
  border-color: var(--red-color-4);
}
.middle-block-bg-bottom-2-blue {
  background-color: var(--blue-color-2);
  border-color: var(--blue-color-4);
}
.middle-block-bg-bottom-8-red {
  border-color: transparent var(--red-color-2);
}
.middle-block-bg-bottom-8-blue {
  border-color: transparent var(--blue-color-2);
}
.middle-block-bg-bottom-8-border-red {
  background-color: var(--red-color-4);
}
.middle-block-bg-bottom-8-border-blue {
  background-color: var(--blue-color-4);
}
</style>
