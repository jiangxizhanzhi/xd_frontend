<template>
  <div class="header-decorate">
    <div class="img-wrap">
      <img
        :src="headerLogo"
        alt=""
      >
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>
<script>
import headerLogo from '@/assets/icon/header-logo.svg'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headerLogo,
    };
  },
};
</script>
<style lang="scss" scoped>
.header-decorate {
  height: 48px;
  display: flex;
  align-items: center;

  .img-wrap {
    width: 25px;
    height: 25px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    color: var(--primary-color);
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
