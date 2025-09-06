<!--
 * @Author: wangzhongjie
 * @Date: 2021-09-23 15:30:45
 * @LastEditors: wangzhongjie
 * @LastEditTime: 2021-09-28 17:21:52
 * @Description: 
 * @Email: UvDream@163.com
-->
<template>
  <div class="score" :class="className">
    <div class="score-left">
      <div class="score-left-side__1"></div>
      <div class="score-left-side__2"></div>
      <div class="score-left-side__3"></div>
      <div class="score-left-side__4"></div>
      <div class="score-left-side__5"></div>

      <div class="score-left-icon">
        <cb-iconfont :type="icon" color="#fff" size="40"></cb-iconfont>
      </div>
    </div>
    <div class="score-right">
      <div class="score-right-content">
        攻击得分
        <span>
          <cb-count-up color="rgb(255, 80, 89)" ref="cbCount">{{
            count
          }}</cb-count-up>
        </span>
        分
      </div>
      <div class="score-right-top__line">
        <div></div>
      </div>
      <div class="score-right-bottom__left">
        <div class="left"></div>
        <div class="right"></div>
      </div>
      <div class="score-right-bottom__right">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, nextTick } from '@vue/composition-api';
export default {
  props: {
    count: {
      type: Number,
      default: 100,
    },
    type: {
      type: String,
      default: 'red',
    },
    icon: {
      type: String,
      default: 'icon-gongji',
    },
  },
  data() {
    return {};
  },
  setup(props, context) {
    let className = computed(() => {
      return 'score__' + props.type;
    });
    watch(props, (val, oldval) => {
      nextTick(() => {
        context.refs['cbCount'].update();
      });
    });
    return { className };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>
<style lang="scss" scoped>
.score {
  --left-icon-height: 70px;
  display: flex;
  width: 70%;
  margin: 0 auto;

  ::v-deep .cb-count-up {
    display: inline-block;
    color: #ff5059;
    span {
      font-size: var(--font-size-24);
    }
  }
  &-left {
    flex-basis: var(--left-icon-height);
    flex-shrink: 0;
    width: var(--left-icon-height);
    height: var(--left-icon-height);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    &-side {
      &__1,
      &__2,
      &__3,
      &__4,
      &__5 {
        position: absolute;
        background-color: #f15e5f;

        &::after {
          content: '';
          display: block;
          inset: 0;
          box-shadow: 0 0 12px 4px #f15e5e;
          width: 100%;
          height: 100%;
        }
      }
      &__1 {
        width: 4px;
        height: 100%;
        left: 0;
        padding: 3px 0;
      }
      &__2 {
        height: 4px;
        width: 100%;
        top: 0;
        padding: 0 3px;
      }
      &__3 {
        height: 4px;
        width: 100%;
        bottom: 0;
        padding: 0 3px;
      }
      &__4 {
        width: 4px;
        height: calc(var(--left-icon-height) / 6);
        right: 0;
        top: 0;
        padding: 3px 0;
      }
      &__5 {
        width: 4px;
        height: calc(var(--left-icon-height) / 6);
        right: 0;
        bottom: 0;
        padding: 3px 0;
      }
    }
    &-icon {
      width: 70%;
      height: 70%;
      background-color: #f15e5f;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__red {
    .after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      background-color: #f15e5f;
    }
  }
  &__blue {
    .after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      background-color: #31b3f7;
    }
    .cb-count-up {
      color: #31b3f7;
    }
    .score-left-icon {
      background-color: #31b3f7;
    }
    .score-right-top__line {
      background-color: #31b3f7;
    }
    .score-right-content {
      span {
        color: #31b3f7;
      }
    }
    .score-right-bottom__left {
      .left {
        border-bottom: 1px solid #31b3f7;
        border-right: 1px solid #31b3f7;
      }
      .right {
        border-top: 1px solid #31b3f7;
      }
    }
    .score-right-bottom__right {
      .bottom {
        border-bottom: 1px solid #31b3f7;
        border-right: 1px solid #31b3f7;
      }
    }
    .score-left-side {
      &__1,
      &__2,
      &__3,
      &__4,
      &__5 {
        background-color: #31b3f7;
        &::after {
          box-shadow: 0 0 12px 4px #31b3f7;
        }
      }
    }
  }

  &-right {
    display: inline-block;
    height: calc(var(--left-icon-height) / 3 * 2);
    margin-top: calc(var(--left-icon-height) / 6);
    width: 100%;
    position: relative;
    margin-left: 4px;
    flex-grow: 1;
    &-content {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-65%);
      font-size: var(--font-size-14);
      font-weight: bold;
      text-align: center;
      span {
        font-size: var(--font-size-24);
        margin-left: 10px;
        margin-right: 5px;
        color: #f15e5f;
      }
    }
    &-top__line {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 1px;
      background-color: #f15e5f;
      &::after {
        @extend .after;
        top: -1px;
        right: 0;
      }
    }
    &-bottom {
      &__left {
        position: absolute;
        width: 40%;
        bottom: 0;
        height: 10px;
        .left {
          width: 50%;
          height: 100%;
          border-bottom: 1px solid #f15e5f;
          border-right: 1px solid #f15e5f;
          transform: skew(-50deg, 0);
          margin-left: 5px;
        }
        .right {
          position: absolute;
          width: 50%;
          height: 10px;
          top: 0;
          right: -10px;
          border-top: 1px solid #f15e5f;
          &:after {
            @extend .after;
            right: 0;
            top: -2px;
          }
        }
      }
      &__right {
        position: absolute;
        right: 0;
        bottom: 10px;
        width: 50%;
        height: 50%;
        .top {
          height: 50%;
          width: 100%;
          position: relative;
          &:after {
            @extend .after;
            top: 6px;
            right: 8px;
          }
          &:before {
            position: absolute;
            right: 3px;
            content: '';
            bottom: 0;
            width: 50%;
            height: 40%;
            border-right: 1px solid #f15e5f;
            transform: skew(50deg, 0);
          }
        }
        .bottom {
          height: 50%;
          border-bottom: 1px solid #f15e5f;
          border-right: 1px solid #f15e5f;
          &::before {
            @extend .after;
            right: 0;
            bottom: -2px;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
