<template>
  <div class="sub-bt">
    <cb-button class="cursor" :class="statusClass">
      <cb-iconfont :type="iconName" />
      <span> {{ btnName }}</span>
    </cb-button>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    btnName: {
      type: String,
      default: '',
    },
    statusClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss">
.orange-btn .el-button {
  background: var(--orange-color) !important;
  border-color: var(--orange-color) !important;
}
.green-btn .el-button {
  background: var(--green-color) !important;
  border-color: var(--green-color) !important;
}
</style>
