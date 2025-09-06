<template>
  <div class="console-tool">
    <div
      class="common-span"
      :class="getActive('desc')"
      @click="gotoNav('desc')"
    >
      <cb-iconfont type="icon-lilunkeshi" size="16" />
      <span>{{ $t('m.courseDesc') }}</span>
    </div>
    <div
      class="common-span"
      v-if="isGuide"
      :class="getActive('guide')"
      @click="gotoNav('guide')"
    >
      <cb-iconfont type="icon-jiangyi" size="16" />
      <span>{{ $t('m.guide') }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('scene')"
      @click="gotoNav('scene')"
    >
      <cb-iconfont type="icon-shiyankeshi" size="16" /><span>{{
        $t('m.scene')
      }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('notes')"
      @click="gotoNav('notes')"
    >
      <cb-iconfont type="icon-jianda2" size="16" /><span>{{
        $t('m.notes')
      }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('report')"
      @click="gotoNav('report')"
    >
      <cb-iconfont type="icon-shiyanbaogaoceshi" size="16" /><span>{{
        $t('m.report')
      }}</span>
    </div>
    <div
      class="common-span"
      :class="getActive('message')"
      @click="gotoNav('message')"
    >
      <cb-iconfont type="icon-comment" size="16" /><span>{{
        $t('m.message')
      }}</span>
    </div>
    <!-- <div
      class="common-span"
      :class="getActive('screenshot')"
      @click="gotoNav('screenshot')"
    >
      <cb-iconfont type="icon-jietu" size="16" />
      <span>{{ $t('m.screenshot') }}</span>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'ConsoleTool',
  props: {
    lessonData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: '',
    };
  },
  computed: {
    isGuide() {
      if (this.lessonData.handout_url) {
        return true;
      }
      return false;
    },
  },
  methods: {
    getActive(val) {
      const activeClass = {};
      if (this.activeName === val) {
        activeClass['active-span'] = true;
      }
      return activeClass;
    },
    gotoNav(val) {
      this.activeName = val;
      this.$emit('changeTool', val);
    },
    dialogClose(val) {
      this.activeName = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.console-tool {
  min-width: 60px;
  min-height: 300px;
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
  }
}
</style>
