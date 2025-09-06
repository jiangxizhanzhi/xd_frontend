<template>
  <div id="title">
    <!-- <i /> -->
    {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
#title {
  color: var(--neutral8);
  // i {
  //   background-color: var(--primary-color);
  // }
}
</style>
<style lang="scss" scoped>
#title {
  position: relative;
  padding: 16px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 600;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    margin-right: 8px;
    width: 6px;
    height: 8px;
    background: var(--primary-color);
  }
  // i {
  //   position: absolute;
  //   top: 16px;
  //   left: 0px;
  //   width: 6px;
  //   height: 8px;
  // }
}
</style>
