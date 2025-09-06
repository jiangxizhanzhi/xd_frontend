<template>
  <div class="tabs-boxs">
    <div
      class="com-box"
      :class="currentTab === 'practice' ? '' : 'no-current'"
      @click="currentTabsChange('practice')"
    >
      {{ $t('practice.freeExercise') }}
      <div class="line"></div>
    </div>
    <div
      class="com-box"
      :class="currentTab === 'testPaper' ? '' : 'no-current'"
      @click="currentTabsChange('testPaper')"
    >
      {{ $t('practice.freeGroupVolume') }}
      <div class="line"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentTab: {
      type: String,
      default: 'practice',
    },
  },
  data() {
    return {};
  },
  methods: {
    currentTabsChange(val) {
      this.$emit('update:currentTab', val);
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-boxs {
  display: flex;
  justify-content: center;
  align-items: center;
  .com-box {
    height: 48px;
    display: flex;
    align-items: center;
    width: auto;
    margin: 0 20px;
    position: relative;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    .line {
      width: 24px;
      height: 2px;
      background: var(--primary-color);
      margin-top: 10px;
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .no-current {
    color: var(--neutral8);
    .line {
      display: none;
    }
  }
}
</style>
