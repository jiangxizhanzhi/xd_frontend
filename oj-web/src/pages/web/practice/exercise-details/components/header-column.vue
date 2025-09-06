<template>
  <div class="header-right flex-center">
    <div class="collection">
      <span @click="collection()">
        <cb-iconfont
          :type="isCollection ? 'icon-yishoucang' : 'icon-weishoucang'"
          themedColor="orange-color"
        />
      </span>
      <span>{{ isCollection ? $t('m.collected') : $t('m.collect') }}</span>
    </div>
    <span
      class="header-line"
      v-if="currentIndex != null && isTheoryBase"
    ></span>
    <div class="previous-step mgl20" v-if="isTheoryBase">
      <cb-button
        :disabled="isFirst"
        hollow="hollow"
        icon="icon-arrow_left"
        @click="prev()"
      >
        {{ $t('m.exercise.previousQuestion') }}
      </cb-button>
    </div>
    <div class="next-step mgl20" v-if="isTheoryBase">
      <cb-button
        :disabled="isLast"
        hollow="hollow"
        icon="icon-arrow_right"
        @click="next()"
      >
        {{ $t('m.exercise.nextQuestion') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
import gradientRadius from '@/components/button/gradient-radius.vue';
import { TYPE } from './../../constant';
export default {
  name: '',
  components: { gradientRadius },
  props: {
    isProfile: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: null,
    },
    totalIndex: {
      type: Number,
      default: null,
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return { TYPE };
  },
  computed: {
    isFirst() {
      return this.currentIndex === null || this.currentIndex === 1;
    },
    isLast() {
      return this.currentIndex === null || this.currentIndex >= this.totalIndex;
    },
    isTheoryBase() {
      return this.type === this.TYPE.Rationale || this.isProfile;
    },
  },

  methods: {
    collection() {
      this.$emit('collection-change', this.isCollection);
    },
    prev() {
      this.$emit('prev-change');
    },
    next() {
      this.$emit('next-change');
    },
  },
};
</script>
<style lang="scss" scoped>
.header-right {
  height: 36px;
  .header-line {
    width: 1px;
    height: 20px;
    background: var(--neutral1);
  }
  .mgl20 {
    margin-left: 20px;
  }
  .collection {
    display: flex;
    align-items: center;
    i {
      color: var(--orange-color);
    }
    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: var(--neutral8);
      margin: 0 20px 0 10px;
    }
  }
}
</style>
