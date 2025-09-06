<template>
  <div class="header">
    <span> {{ name }} </span>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'Header',
  props: {
    name: String,
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.header {
  font-size: calc(100vw / 120);
  height: 5em;
  background-image: url(~@/assets/img/visual-screen/screen-2/bg_title@2x.png);
  background-position: 0 -3.75em;
  background-size: 100%;
  background-repeat: no-repeat;
  text-align: center;
  position: relative;

  span {
    font-size: 2.8125em;
    font-family: youshebiaotihei !important;
    color: #f78d20;
    line-height: 1.25em;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background: linear-gradient(180deg, #70f4ff 0%, #4491ff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
