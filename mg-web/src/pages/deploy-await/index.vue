<template>
  <!-- <cb-inner-page :background="false"> -->
  <div class="deploy-await-box">
    <div class="await-wrapper">
      <cb-iconfont type="icon-xitongguanli" size="100" class="operation-icon" />
      <div class="mt10 ft16">
        {{ $t('configuration.deployAwait') }}
      </div>
      <div class="mt10 ft16">{{ fullIp }}</div>
    </div>
  </div>
  <!-- </cb-inner-page> -->
</template>
<script>
export default {
  data() {
    return {
      fullIp: '',
    };
  },
  created() {
    const ip = this.$route.query.ip;
    const proto = window.location.protocol;
    this.fullIp = proto + '//' + ip;
  },
};
</script>
<style lang="scss" scoped>
.deploy-await-box {
  width: 100%;
  height: 100%;
  position: relative;
  // height: inherit;
  // box-sizing: border-box;
  // position: relative;
}
.await-wrapper {
  text-align: center;
  color: var(--neutral8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
  width: inherit;
}
</style>
