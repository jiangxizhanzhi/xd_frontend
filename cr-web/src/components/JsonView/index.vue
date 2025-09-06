<template>
  <div id="jsonView">
    <json-viewer :value="jsonViewData" :expand-depth="expandDepth" />
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    jsonData: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      expandDepth: 0,
      jsonViewData: {},
    };
  },
  watch: {
    jsonData: {
      handler(val, oldval) {
        if (typeof val === 'string') {
          try {
            const obj = JSON.parse(val);
            if (typeof obj === 'object' && obj) {
              this.jsonViewData = JSON.parse(val);
              this.expandDepth = 10;
            } else {
              this.jsonViewData = val;
              this.expandDepth = 0;
            }
          } catch (error) {
            this.jsonViewData = val;
            this.expandDepth = 10;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
#jsonView {
  .jv-container.jv-light {
    background: transparent !important;
  }
  .jv-container.jv-light .jv-key {
    color: #0096ff !important;
  }
  .jv-container.jv-light .jv-item.jv-array,
  .jv-container.jv-light .jv-item.jv-object {
    color: #fff !important;
  }
  .jv-container.jv-light .jv-ellipsis {
    background-color: #252c46;
  }
}
</style>
