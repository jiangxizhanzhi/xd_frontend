<template>
  <div class="monitor-small-title">
    <div>
      {{ name }} <span v-if="number != null" class="circle"></span>
      <span>{{ number }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MonitorTitle',
  props: {
    name: {
      type: String,
      default: '',
    },
    number: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss" scoped>
.monitor-small-title {
  width: 100%;
  height: 32px;
  text-align: center;
  background: url('../assets/img/currency-title.png') 50% no-repeat;
  div {
    line-height: 32px;
    text-align: center;
    margin: auto;
    color: #0bdaff;
    font-size: 16px;
    font-weight: bold;
    span {
      color: #fff;
      font-size: 16px;
      text-shadow: 0 0 8px rgba(231, 239, 255, 0.2),
        0 0 8px rgba(231, 239, 255, 0.2), 0 0 8px rgba(231, 239, 255, 0.2),
        0 0 8px rgba(231, 239, 255, 0.2);
      background: linear-gradient(
        0deg,
        #bde1ff 0%,
        #ffffff 50.4150390625%,
        #e7efff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }
    .circle {
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 3px;
      background: #0bdaff;
      margin: 0px 3px;
      position: relative;
      top: -3px;
    }
  }
}
</style>
