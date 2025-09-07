<template>
  <div
    v-if="showInMenu"
    class="cb-navi-item"
    :class="{ expand: isExpand, disable: item.disable }"
    :style="naviItemStyle"
    @mouseenter="showSubMenu"
    @mouseleave="hideSubMenu"
  >
    <div
      :class="[subTitleType, 'navi-item__item', itemClass ? 'active-menu' : '']"
      @click="itemClick"
    >
      <div
        class="item-text-wrapper"
        :class="[
          {
            'active-item': itemClass,
          },
        ]"
      >
        <div class="navi-item__text">
          {{ $t(itemTitle) }}
        </div>
        <div v-if="level === 1" class="navi-item-hidden__text">
          {{ maxLengthTitle }}
        </div>
      </div>
    </div>
<!--    <collapse-transition v-if="hasValidChildren">-->
<!--      <div-->
<!--        v-show="isExpand || level > 0"-->
<!--        :class="[level > 0 ? 'list-items' : 'sub-items', fixedLength]"-->
<!--      >-->
<!--        <div v-if="level > 0" class="list-items-border"></div>-->
<!--        <navi-item-->
<!--          :class="isExpand || level > 0 ? '' : 'navi-sub-collapse'"-->
<!--          v-for="(sub, index) of item.children"-->
<!--          :key="`navi-${level}-item-${index}`"-->
<!--          :active="active"-->
<!--          :item="sub"-->
<!--          :all-routes="allRoutes"-->
<!--          :max-length-title="calcMaxLenTitle(item)"-->
<!--          :level="level + 1"-->
<!--          :is-expand="sub[nameField] === curExpand"-->
<!--          @setSelect="setSelect"-->
<!--          @setExpand="setExpand"-->
<!--        />-->
<!--      </div>-->
<!--    </collapse-transition>-->
  </div>
</template>

<script>
import _ from 'lodash';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import {
  isChildrenActive,
  getItemTitle,
  isShowInMenu,
  getComputedItem,
  hasValidChildren,
} from '../../../../utils/navi';
export default {
  name: 'NaviItem',
  components: {
    CollapseTransition,
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
    nameField: {
      type: String,
      default: 'name',
    },
    maxLengthTitle: {
      type: String,
      default: '',
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
    itemClass() {
      const name = _.get(this.computedItem, this.nameField);
      return name === this.active[this.nameField] || this.childrenActive;
    },
    subTitleType() {
      return this.level === 0
        ? 'navi-item-main-menu'
        : this.hasValidChildren
        ? 'navi-item-sub-title'
        : 'navi-item-sub-menu';
    },
    naviItemStyle() {
      const height = this.level === 0 ? '100%' : 'auto';
      return { height };
    },
    showInMenu() {
      return isShowInMenu(this.computedItem);
    },
    childrenActive() {
      return isChildrenActive(
        this.active,
        this.item,
        this.nameField,
        this.allRoutes,
      );
    },
    fixedLength() {
      return this.item.children.length >= 4 && this.level > 0
        ? 'fixed-length'
        : '';
    },
  },
  methods: {
    showSubMenu() {
      if (this.hasValidChildren) {
        this.$emit('setExpand', this.item[this.nameField]);
      } else if (this.level === 0) {
        this.hideSubMenu();
      }
    },
    hideSubMenu() {
      this.$emit('hideSubMenu');
    },
    itemClick() {
      // if (this.hasValidChildren || this.item.disable) {
      //   return;
      // }
      const name = _.get(this.computedItem, this.nameField);
      this.$emit('setSelect', name, this.computedItem, this.item.children);
    },
    setExpand(val) {
      this.curExpand = val;
    },
    setSelect(name, item) {
      this.$emit('setSelect', name, item);
    },
    calcMaxLenTitle(list) {
      let len = 0;
      let maxLenTitle = '';
      const children = _.get(list, 'children', []);
      children.map((i) => {
        const title = this.$t(_.get(i, 'meta.title', i.title));
        const titleLen = this.getStrByte(title);
        if (titleLen > len) {
          len = titleLen;
          maxLenTitle = title;
        }
      });
      return maxLenTitle;
    },
    getStrByte(str) {
      return str.replace(/[^x00-xFF]/g, '**').length;
    },
  },
};
</script>
