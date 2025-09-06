<template>
  <div class="my-practice">
    <div
      v-if="type === TYPE.Rationale"
      class="com-box"
      @click="goOther('mistake')"
    >
      <div class="top-img">
        <div class="error-img img-com"></div>
      </div>
      <div class="center-count">{{ errorCount }}</div>
      <div class="bottom-desc">{{ $t('practice.myMistake') }}</div>
    </div>
    <div class="com-box" @click="goOther('collection')">
      <div class="top-img">
        <div class="collect-img img-com"></div>
      </div>
      <div class="center-count">{{ collectionCount }}</div>
      <div class="bottom-desc">{{ $t('practice.myCollect') }}</div>
    </div>
    <div class="com-box" @click="goOther('note')">
      <div class="top-img">
        <div class="note-img img-com"></div>
      </div>
      <div class="center-count">{{ noteCount }}</div>
      <div class="bottom-desc">{{ $t('practice.myNote') }}</div>
    </div>
  </div>
</template>
<script>
import { TYPE } from '../constant';
export default {
  props: {
    type: {
      type: [String, Number],
      default: '',
    },
    errorCount: {
      type: [String, Number],
      default: 0,
    },
    collectionCount: {
      type: [String, Number],
      default: 0,
    },
    noteCount: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      TYPE,
    };
  },
  methods: {
    goOther(val) {
      this.$emit('go-other', val);
    },
  },
};
</script>
<style lang="scss" scoped>
.my-practice {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100% - 41px);
  .com-box {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .top-img {
      width: 48px;
      height: 48px;
      background: var(--neutral1);
      border-radius: 50%;
      &:hover {
        background: var(--neutral3);
      }
      .img-com {
        width: 100%;
        height: 100%;
      }
      .error-img {
        background: url('@/assets/img/practice/error.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      .collect-img {
        background: url('@/assets/img/practice/collect.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      .note-img {
        background: url('@/assets/img/practice/note.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .center-count {
      height: 28px;
      font-size: 20px;
      font-weight: 600;
      color: var(--neutral8);
      line-height: 28px;
      margin: 14px 0 5px;
    }
    .bottom-desc {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: var(--neutral6);
      line-height: 16px;
    }
  }
}
</style>
