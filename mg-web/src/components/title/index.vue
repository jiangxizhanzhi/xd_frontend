<template>
  <div class="title-head">
    <span>{{ name }}</span>
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
<style lang="scss" scoped>
.title-head {
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 8px;
    background: var(--primary-color);
  }
  span {
    font-size: 16px;
    font-weight: bold;
    color: var(--neutral8);
    margin-left: 6px;
  }
}
</style>
