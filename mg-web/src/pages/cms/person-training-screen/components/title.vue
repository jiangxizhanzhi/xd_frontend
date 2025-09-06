<template>
  <div class="page-title">
    <div class="text">{{ name }}</div>
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
};
</script>

<style lang="scss" scoped>
.page-title {
  width: 23.125em;
  height: 2.5em;
  line-height: 2.5em;
  background: url('@/assets/img/person-training/title_second.png') no-repeat;
  background-size: cover;
  text-align: left;
  text-indent: 2em;
  .text {
    font-family: youshebiaotihei !important;
    color: #ffffff;
    letter-spacing: -2px;
    font-size: 1.25em;
    text-shadow: 0px 2px 8px rgba(21, 65, 111, 0.4);
    background: linear-gradient(180deg, #ffffff 0%, #cce6ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
