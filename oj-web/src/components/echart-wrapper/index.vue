<template>
  <echart-wrapper-inner
    v-if="ready"
    :opt="opt"
    :showXLabel="showXLabel"
  ></echart-wrapper-inner>
  <div class="preparing" v-else><span>加载中...</span></div>
</template>
<script>
import EchartWrapperInner from './echart-wrapper-inner.vue';

export default {
  name: 'EchartWrapper',
  components: { EchartWrapperInner },
  props: {
    opt: {
      type: null,
      default: () => {
        return false;
      },
    },
    showXLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    ready() {
      const { loaded } = this;
      return loaded;
    },
  },
  mounted() {
    this.checkReady();
  },
  methods: {
    checkReady() {
      const that = this;
      that.loaded = true;
      that.$emit('ready');
    },
  },
};
</script>

<style scoped lang="scss">
.preparing {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--font-color-regular);
  background-color: var(--bg-color-fifth);
}
</style>
