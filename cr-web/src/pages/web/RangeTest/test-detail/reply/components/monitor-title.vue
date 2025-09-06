<template>
  <div
    class="monitor-small-title dark-bg"
    :class="theme === 'theme-dark' ? 'dark-bg' : 'light-bg'"
  >
    <div>
      {{ name }} <span v-if="number != null" class="circle"></span>
      <span>{{ number }}</span>
    </div>
  </div>
</template>
<script>
import { getTheme } from '@cyber/helper';
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
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: getTheme() ? getTheme() : 'theme-dark',
    };
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，切换背景
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'theme-dark';
      } else {
        this.theme = 'theme-light';
      }
    },
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
    color: var(--white-color);
    font-size: 16px;
    font-weight: bold;
    span {
      color: var(--white-color);
      font-size: 16px;
      font-weight: bold;
    }
    .circle {
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 3px;
      background: var(--white-color);
      margin: 0px 3px;
      position: relative;
      top: -3px;
    }
  }
}
.dark-bg {
  background: url('../assets/img/currency-title.png') 50% no-repeat;
}
.light-bg {
  background: url('../assets/img/currency-title-light.png') 50% no-repeat;
}
</style>
