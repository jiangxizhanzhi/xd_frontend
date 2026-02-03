<template>
  <div
    class="drawer-container"
    v-if="status.drawer"
    v-click-out-side="onClickOutSide"
  >
    <component
      ref="pages"
      v-bind="$attrs"
      :is="isWho"
      :visible.sync="visible"
      :show-title="showTitle"
      :open-layer="openLayer"
      :role-show-config="roleShowConfig"
      @assetAllocation="assetAllocation"
      @quitEditStatus="quitEditStatus"
      :menuIndex="menuIndex"
    ></component>
  </div>
</template>

<script>
import DrawerDevice from './target-list';
import DrawerRole from './role-asset';
import DrawerWar from './fog-of-war';
import DrawerShortcut from './shortcut';
import PageStatus from '../../store/page-status.ts';
import clickOutSide from '../directives/clickoutside';
import DrawerTemplate from './template';
import DrawerCloudVirtualMachine from './cloud-virtual-machine';

export default {
  name: '',
  components: {
    DrawerRole,
    DrawerWar,
    DrawerDevice,
    DrawerTemplate,
    DrawerShortcut,
    DrawerCloudVirtualMachine,
  },
  directives: {
    clickOutSide,
  },
  props: {
    menuIndex: {
      type: Number,
      default: null,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    openLayer: {
      type: Boolean,
      default: false,
    },
    // 展示红队还是蓝队
    roleShowConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      isWho: 'DrawerRole',
      visible: false,
      status: PageStatus.state,
      isRole: false,
    };
  },
  watch: {
    menuIndex: {
      handler(val) {
        this.changeComponent(val);
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * 切换页面
     * @param index
     */
    changeComponent(index) {
      switch (index) {
        case 3:
          this.isWho = 'DrawerRole';
          break;
        case 4:
          this.isWho = 'DrawerWar';
          this.isRole = false;
          break;
        case 5:
          this.isWho = 'DrawerTemplate';
          this.isRole = false;
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          this.isWho = 'DrawerDevice';
          this.isRole = false;
          break;
        case 15:
          this.isWho = 'DrawerShortcut';
          this.isRole = false;
          break;
        case 21:
          this.isWho = 'DrawerCloudVirtualMachine';
          this.isRole = false;
          break;
      }
    },
    /**
     * 点击外层关闭
     */
    onClickOutSide(e) {
      if (
        !this.isRole &&
        e.target.tagName.toLowerCase() === 'svg' &&
        PageStatus.state.drawer &&
        e.target.localName !== 'span' &&
        !e.target._prevClass?.includes('cb-iconfont')
      ) {
        PageStatus.setDrawer(false);
        this.visible = false;
        this.$emit('close', e);
      }
    },

    /**
     * 角色资产功能组
     */
    ...{
      /**
       * 缩小之后的取消按钮
       */
      quitEditStatus() {
        this.isRole = false;
        this.$emit('quitEditStatus', true);
      },
      /**
       * 角色资产配置
       * @param config
       */
      assetAllocation(config, type) {
        this.$emit('assetAllocation', config, type);
        this.isRole = true;
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
