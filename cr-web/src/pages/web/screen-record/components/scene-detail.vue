<template>
  <cb-dialog
    :title="$t('m.TopologyDetails')"
    :visible="visible"
    class="scene-dialog"
    :before-close="beforeClose"
    :close-on-press-escape="false"
  >
    <div class="scene-dialog-content">
      <scene-all :resource-id="resourceId" />
    </div>
  </cb-dialog>
</template>

<script>
import SceneAll from './scene-all.vue';
export default {
  components: {
    SceneAll,
  },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'topo');
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.scene-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    height: 500px;
  }
}
</style>
