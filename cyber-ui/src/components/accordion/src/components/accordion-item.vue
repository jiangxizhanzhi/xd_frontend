<template>
  <div
    v-if="showInMenu"
    class="cb-accordion-item"
    :class="{ collapse, expand: isExpand }"
    :style="{
      'padding-left': `${0 * level}px`,
    }"
  >
    <!-- <a-tooltip
      placement="right"
      :title="$t(itemTitle)"
      :auto-adjust-overflow="false"
    > -->
      <div
        class="cb-accordion-item__item"
        :class="{ 'active-item': itemClass }"
        @click="itemClick"
      >
        <div class="cb-accordion-item__icon">
          <template v-if="hasIcon && level === 0"
            ><cb-iconfont
              :type="iconfont"
              class="cb-accordion-item__icon-font"
            />
          </template>
        </div>

        <div v-show="!collapse" class="cb-accordion__item-title">
          <div class="cb-accordion-item-title-text">
            {{ $t(itemTitle) }}
          </div>
          <div
            v-if="hasValidChildren"
            class="children-state-mark"
            :style="childrenStateMarkStyle"
          >
            <i class="el-icon-arrow-down" />
          </div>
        </div>
      </div>
    <!-- </a-tooltip> -->
    <collapse-transition v-if="hasValidChildren">
      <div v-show="isExpand" class="cb-accordion-sub-items" :class="{'cb-accordion-sub-items-absolute':collapse}">
        <cb-accordion-item
          v-for="(sub, index) of item.children"
          :key="`acc-item-sub-${index}`"
          :collapse="collapse"
          :tooltip="tooltip"
          :active="active"
          :item="sub"
          :all-routes="allRoutes"
          :level="level + 1"
          :is-expand="sub.name === curExpand"
          @setSelect="setSelect"
          @setExpand="setExpand"
        />
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import _ from 'lodash';
import CbIconfont from '../../../iconfont';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import ATooltip from 'ant-design-vue/lib/tooltip';
import {
  isChildrenActive,
  getItemTitle,
  isShowInMenu,
  getComputedItem,
  hasValidChildren,
} from '../../../../utils/navi';

export default {
  name: 'CbAccordionItem',
  components: {
    CbIconfont,
    CollapseTransition,
    ATooltip,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    allRoutes: {
      type: Array,
      default() {
        return [];
      },
    },
    level: {
      type: Number,
      default: 0,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
    isExpand: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      curExpand: null,
    };
  },
  computed: {
    hasValidChildren() {
      return hasValidChildren(this.item);
    },
    computedItem() {
      return getComputedItem(this.item);
    },
    itemTitle() {
      return getItemTitle(this.computedItem);
    },
    childrenStateMarkStyle() {
      return {
        transform: `rotate(${this.isExpand ? 0 : -90}deg)`,
      };
    },
    hasIcon() {
      return _.get(this.item, 'meta.iconfont', false);
    },
    iconfont() {
      return this.hasIcon
        ? this.hasIcon
        : this.level === 0
        ? 'iconjihe'
        : 'iconother';
    },
    itemClass() {
      const name = _.get(this.computedItem, 'name');
      return name === this.active.name || this.childrenActive;
    },
    showInMenu() {
      return isShowInMenu(this.computedItem);
    },
    childrenActive() {
      return isChildrenActive(this.active, this.item, 'name', this.allRoutes);
    },
  },
  watch: {},
  mounted() {
    // 初始化的时候展开
    if (
      this.active &&
      this.hasValidChildren &&
      _.find(this.computedItem.children, { name: this.active.name })
    ) {
      this.$emit('setExpand', this.computedItem.name);
    }
  },
  methods: {
    itemClick() {
      if (this.hasValidChildren) {
        if (this.isExpand) {
          this.$emit('setExpand', null);
        } else {
          this.$emit('setExpand', this.computedItem.name);
        }
      } else {
        const name = _.get(this.computedItem, 'name');
        this.setSelect(name, this.computedItem);
      }
    },
    setExpand(val) {
      this.curExpand = val;
    },
    setSelect(name, item) {
      /**
       * 菜单激活回调
       *
       * @property {String} name 对应的name
       * @property {Object} item 当前的菜单项
       */
      if (item.path !== this.active.path || item.name !== this.active.name) {
        this.$emit('setSelect', name, item);
      }
    },
  },
};
</script>
