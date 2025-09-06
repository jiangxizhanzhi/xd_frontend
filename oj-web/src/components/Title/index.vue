<template>
  <div id="title">
    <i />
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
  i {
    background-color: var(--primary-color);
  }
}
</style>
<style lang="scss" scoped>
#title {
  position: relative;
  padding: 10px 0 10px 15px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 300;
  i {
    position: absolute;
    top: 15px;
    left: 0px;
    width: 6px;
    height: 8px;
  }
}
</style>
