<!--
 * @Author: Fengxuyan
 * @Date: 2021-08-11 17:50:54
 * @LastEditTime: 2021-12-10 15:16:50
 * @LastEditors: Fengxuyan
 * @Description:
-->
<template>
  <div>
    <div
      :class="[
        'wrapper m-no-select ft14',
        { collapse: collapse.includes(active), 'en-layout': lang === 'en-US', 'hide-title': !showTitle },
      ]"
    >
      <template v-for="(item, index) in menuBarComputed">
        <div
          v-if="item.show && isShowItem(item.data, index)"
          :class="['wrapper-box triangle mb10', `wrapper-box-${index}`]"
          :key="index"
        >
          <div
            :class="['cursor item', { active: active == itm.index }]"
            v-for="itm in item.data"
            v-show="itm.show"
            :key="JSON.stringify(itm.name + itm.index)"
            @click="clickMenu(itm.name, itm.index)"
          >
            <cb-tooltip
              effect="dark"
              v-if="collapse.includes(active)"
              :content="itm.name"
              placement="right"
              :enterable="false"
              :disabled="shareState.isFullScreen"
            >
              <cb-iconfont :type="itm.icon"></cb-iconfont>
            </cb-tooltip>
            <cb-iconfont v-else :type="itm.icon"></cb-iconfont>
            <cb-tooltip
              effect="dark"
              :content="itm.name"
              placement="right"
              :enterable="false"
              :disabled="shareState.isFullScreen"
            >
              <span class="item-name">{{ itm.name }}</span>
            </cb-tooltip>
          </div>
        </div>
      </template>
      <div class="wrapper-box triangle cursor" style="margin-top: auto">
        <div
          v-for="menu in SYSTEM_FUN_computed"
          :key="JSON.stringify(menu.name + menu.index)"
          class="item"
          v-show="menu.show"
          @click="clickMenuBottom(menu.name, menu.index)"
        >
          <cb-tooltip
            effect="dark"
            v-if="collapse.includes(active)"
            :content="menu.name"
            placement="right"
            :enterable="false"
            :disabled="shareState.isFullScreen"
          >
            <cb-iconfont :type="menu.icon"></cb-iconfont>
          </cb-tooltip>
          <cb-iconfont v-else :type="menu.icon"></cb-iconfont>
          <cb-tooltip
            effect="dark"
            :content="menu.name"
            placement="right"
            :enterable="false"
            :disabled="shareState.isFullScreen"
          >
            <span class="item-name">{{ menu.name }}</span>
          </cb-tooltip>
        </div>
      </div>
    </div>
    <dialog-basic-config
      v-if="showConfig"
      :menubar="menubar"
      :visible="showConfig"
      @handleClose="handleClose"
    ></dialog-basic-config>
  </div>
</template>

<script>
import PageStatus from '../../../pages/store/page-status.ts';
import { MENU, SYSTEM_FUN } from './constant';
import _ from 'lodash';
import { inject, ref } from '@vue/composition-api';
import DialogBasicConfig from '../dialog/basic-config/dialog-basic-config';
import { getImageCategory } from "../../../api";
import { MENU_ENUM } from "../../../types/menu";

export default {
  name: 'menus',
  model: {
    prop: 'active',
    event: 'update',
  },
  setup() {
    const lang = inject('lang');
    let shareState = ref(PageStatus.state);
    let interfaceMenuData = ref([]);
    getImageCategory().then(res => {
      interfaceMenuData.value = res?.data?.data?.first_type_list || [];
    })
    return {
      lang,
      shareState,
      interfaceMenuData,
    };
  },
  props: {
    active: {
      type: Number,
      default: 0,
    },
    menubar: {
      type: Array,
      default: () => [],
    },
    toolMenuBar: {
      type: Array,
      default: () => [],
    },
    targetMenubar: {
      type: Array,
      default: () => [],
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      collapse: [
        MENU_ENUM['assets'],
        MENU_ENUM['war'],
        MENU_ENUM['sceneTemplate'],
        MENU_ENUM['operatingSystem'],
        MENU_ENUM['applicationSystem'],
        MENU_ENUM['networkEquipment'],
        MENU_ENUM['securityEquipment'],
        MENU_ENUM['shortcut'],
      ], // 需要折叠的菜单项序号
      showDevice: [
        MENU_ENUM['topology'],
        MENU_ENUM['sceneTemplate'],
        MENU_ENUM['operatingSystem'],
        MENU_ENUM['applicationSystem'],
        MENU_ENUM['networkEquipment'],
        MENU_ENUM['securityEquipment'],
        MENU_ENUM['shortcut'],
      ], // 展示靶标列表的序号
      showConfig: false,
      SYSTEM_FUN,
    };
  },
  computed: {
    menuBarComputed() {
      PageStatus.setCollapse(false);
      MENU.forEach((item, index) => {
        if (index === 1) {
          MENU[index].data = item.data?.map(data => {
            if (data.targetId && this.interfaceMenuData.length) {
              return {
                ...data,
                name: this.interfaceMenuData.find(interfaceData => interfaceData.id === data.targetId)?.name
              }
            } else {
              return data;
            }
          })
        }
      })
      let menu = _.cloneDeep(MENU);
      if (_.isEmpty(this.menubar)) {
        return this.showTargetMenubar(menu, this.targetMenubar, this.menubar);
      } else {
        this.isShowMenu(this.menubar, menu);
        return this.showTargetMenubar(menu, this.targetMenubar, this.menubar);
      }
      return menu;
    },
    SYSTEM_FUN_computed() {
      PageStatus.setCollapse(false);
      let menu = _.cloneDeep(SYSTEM_FUN);
      if (_.isEmpty(this.toolMenuBar)) {
        return menu;
      } else {
        this.isShowMenuFun(this.toolMenuBar, menu);
      }
      return menu;
    },
  },
  methods: {
    // 拓扑编排模式下配置子菜单项
    showTargetMenubar(menu, targetMenubar, menubar) {
      if (!_.isEmpty(targetMenubar)) {
        menu[1]?.data?.map((item, index) => {
          if (targetMenubar.includes(item.value)) {
            item.show = true;
          } else {
            item.show = false;
          }
          return item;
        });
      }
      return menu;
    },
    /**
     * 点击上面两组菜单
     */
    clickMenu(name, index) {
      this.menuBarComputed[1].show = this.showDevice.includes(index);
      let collapse = this.collapse.includes(index);
      let showDrawerList = [
        MENU_ENUM['assets'],
        MENU_ENUM['war'],
        MENU_ENUM['sceneTemplate'],
        MENU_ENUM['operatingSystem'],
        MENU_ENUM['applicationSystem'],
        MENU_ENUM['networkEquipment'],
        MENU_ENUM['securityEquipment'],
        MENU_ENUM['shortcut'],
      ]; // 展示drawer的序号(角色资产、战争迷雾、靶标)
      PageStatus.setCollapse(collapse);
      PageStatus.setDrawer(showDrawerList.includes(index));
      PageStatus.setDialog(![MENU_ENUM['assets'], MENU_ENUM['war'], MENU_ENUM['basicSetting']].includes(index));
      this.$emit('click', index);
      this.$emit('update', index);
      document
        .querySelectorAll('.el-tooltip__popper.is-dark')
        ?.forEach((item) => item.remove());
    },

    /**
     * 点击下面一组菜单
     */
    clickMenuBottom(name, index) {
      this.$emit('click', index);
      if (index === MENU_ENUM['basicSetting']) {
        this.showConfig = true;
      }
      document
        .querySelectorAll('.el-tooltip__popper.is-dark')
        ?.forEach((item) => item.remove());
    },

    handleClose() {
      this.showConfig = false;
    },

    /**
     * 判断显示哪些菜单
     */
    isShowMenu(data, menu) {
      menu?.forEach((item, index) => {
        if (index === 0) {
          item.data?.forEach((child) => {
            if (!data.includes(child.value)) {
              child.show = false;
            }
          });
        }
      });
    },
    /**
     * 判断显示哪些菜单
     */
    isShowMenuFun(data, menu) {
      menu?.forEach((item, index) => {
        if (!this.toolMenuBar.includes(item.value)) {
          item.show = false
        }
      });
    },

    /**
     * 判断菜单是否都隐藏
     */
    isShowItem(data, index) {
      if (!index) {
        return true;
      }
      let isShow = false;
      data.forEach((item) => {
        if (item.show) {
          isShow = true;
        }
      });
      return isShow;
    },
  },
  components: { DialogBasicConfig },
};
</script>

<style lang="scss" scoped>
@mixin transition-collapse($width, $time) {
  width: $width;
  transition: width $time;
  transition-timing-function: ease;
}
.scene-all {
  .wrapper {
    z-index: 1;
    position: absolute;
    left: 12px;
    top: 64px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 76px);
    overflow-y: scroll;
    @include transition-collapse(130px, 0.1s);
    pointer-events: none;

    &.en-layout {
      @include transition-collapse(150px, 0.1s);
    }
  &.hide-title {
    top: 12px;
    height: calc(100% - 24px);
  }

    .wrapper-box {
      position: relative;
      pointer-events: all;
      background: var(--bg-color-2);
      border: 1px solid var(--neutral3);

      .item {
        padding-left: 20px;
        height: 38px;
        line-height: 38px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &-name {
          padding-left: 4px;
        }

        &.active {
          .cb-iconfont {
            color: var(--primary-color) !important;
          }
        }
        &:hover {
          background-color: var(--neutral1);
        }
      }
    }

    &.collapse {
      @include transition-collapse(40px, 0.15s);

      .wrapper-box .item {
        padding: 0;
        text-align: center;

        .item-name {
          display: none;
        }

        &.active {
          .cb-iconfont {
            color: var(--primary-color) !important;
          }
        }
        &:hover {
          background-color: var(--neutral1);
        }
      }
    }
  }
}
</style>
