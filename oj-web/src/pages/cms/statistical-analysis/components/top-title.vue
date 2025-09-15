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
  font-size: 16px;
  font-family: Microsoft YaHei;
  color: #000000;
  font-weight: bold;
  i {
    position: absolute;
    top: 13px;
    left: 0px;
    width: 4px;
    height: 16px;
  }
}
</style>
