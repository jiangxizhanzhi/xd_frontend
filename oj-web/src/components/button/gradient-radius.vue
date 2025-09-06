<template>
  <div class="btn_once cursor fl" @click="goto()">
    <div class="btn_radius">
      <cb-iconfont :type="iconName" />
      <span>{{ btnName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradientRadius',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    btnName: {
      type: String,
      default: '',
    },
  },
  methods: {
    goto() {
      this.$emit('btn-click');
    },
  },
};
</script>

<style scoped lang="scss">
.btn_once {
  min-width: 120px;
  height: 36px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 1px;
  border-radius: 2px;
  .btn_radius {
    padding: 0 9px;
    height: 100%;
    border-radius: 2px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    font-family: Microsoft YaHei;
  }
}
</style>
<style lang="scss">
.btn_once {
  border: 1px solid var(--primary-color) !important;
  .btn_radius {
    color: var(--primary-color);
  }
}
</style>
