<template>
  <div class="custom-btn">
    <cb-button
      v-if="config.includes('close')"
      icon="icon-guanbi"
      @click="handleClosed"
      hollow
      mr
      >{{ $tt('stage.closeScene') }}
    </cb-button>
    <cb-button
      v-if="config.includes('actualSize')"
      icon="icon-shijidaxiao"
      @click="handleActualSize"
      hollow
      mr
      >{{ $tt('stage.actualSize') }}
    </cb-button>
    <cb-button
      v-if="config.includes('recover')"
      :icon="status ? 'icon-guaqi' : 'icon-huifu'"
      :color-type="status ? 'yellow' : ''"
      @click="handleRecover"
      hollow
      mr
      :disabled="disabled"
      >{{ status ? $tt('stage.pauseScene') : $tt('stage.restoreScene') }}
    </cb-button>
    <cb-button
      v-if="config.includes('update-topology') && status && !(event == 2 && event_status == 5)"
      button-type="edit"
      @click="handleUpdate"
      hollow
      mr
    >{{ $tt('stage.updateTopology') }}
    </cb-button>
  </div>
</template>

<script>
import t from '../../../utils/i18n';

export default {
  name: 'CustomBtn',
  props: {
    config: {
      type: Array,
      default: () => {
        return [];
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    event: {
      type: String | Number,
      default: '',
    },
    event_status: {
      type: String | Number,
      default: '',
    },
  },
  data() {
    return {};
  },
  methods: {
    $tt: t,
    /**
     * 关闭按钮
     */
    handleClosed() {
      this.$emit('close');
    },
    /**
     * 挂起靶场、恢复靶场
     */
    handleRecover() {
      this.$emit('recover', this.status);
      // this.$emit('changeStatus', !this.status);
    },
    /**
     * 实际大小
     */
    handleActualSize() {
      this.$emit('on-actual-size');
    },
    /**
     * 更新拓扑
     */
    handleUpdate() {
      this.$emit('on-update-topology');
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-btn {
}
</style>
