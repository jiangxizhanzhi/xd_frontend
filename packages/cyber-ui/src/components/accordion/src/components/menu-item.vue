<template>
  <div v-if="showInMenu">
    <cb-submenu :index="item.name" v-if="hasValidChildren">
      <template slot="title">
        <cb-iconfont class="cb-accordion__icon" :type="iconfont"></cb-iconfont>
        <span class="cb-accordion__title" :title="$t(item.meta.title)">{{
          $t(item.meta.title)
        }}</span>
      </template>
      <template v-for="sub in item.children">
        <cb-menu-item
          v-if="isValidMenu(sub) && !validChildren(sub)"
          :key="sub.name"
          :index="sub.name"
        >
          <template slot="title">
            <div
              class="cb-accordion__wrapper"
              @click="setSelect(sub.name, sub)"
              style="width: 100%"
            >
              <cb-iconfont
                class="cb-accordion__icon"
                :type="sub.meta.iconfont"
                color="var(--nav-left-text)"
              ></cb-iconfont>
              <span class="cb-accordion__title" :title="$t(sub.meta.title)">{{
                $t(sub.meta.title)
              }}</span>
            </div>
          </template>
        </cb-menu-item>
        <cb-sub-menu
          v-if="validChildren(sub)"
          :key="'sub-menu-' + sub.name"
          @set-select="setSelect"
          :item="sub"
        >
        </cb-sub-menu>
      </template>
    </cb-submenu>
    <cb-menu-item :index="item.name" v-else>
      <div
        v-show="collapse"
        class="cb-accordion__wrapper"
        @click="setSelect(computedItem.name, computedItem)"
      >
        <cb-iconfont class="cb-accordion__icon" :type="iconfont"></cb-iconfont>
      </div>

      <template slot="title">
        <span
          v-show="collapse"
          class="cb-accordion__title"
          :title="$t(itemTitle)"
          >{{ $t(itemTitle) }}</span
        >
      </template>
      <div
        v-if="!collapse"
        class="cb-accordion__wrapper"
        @click="setSelect(computedItem.name, computedItem)"
      >
        <cb-iconfont class="cb-accordion__icon" :type="iconfont"></cb-iconfont>
        <span class="cb-accordion__title" :title="$t(itemTitle)">{{
          $t(itemTitle)
        }}</span>
      </div>
    </cb-menu-item>
  </div>
</template>

<script>
import {
  getItemTitle,
  isShowInMenu,
  getComputedItem,
  hasValidChildren,
} from '../../../../utils/navi';
export default {
  name: 'CbSubMenu',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    collapse: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      curExpand: '',
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
    showInMenu() {
      return isShowInMenu(this.computedItem);
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
  },
  mounted() {},
  watch: {},
  methods: {
    isValidMenu(route) {
      let hide = _.get(route, 'meta.hideInMenu', false);
      let isChild = _.get(route, 'meta.breadcrumb.parentName', false);
      let title = _.get(route, 'meta.title', false);
      return title && !hide && !isChild;
    },
    setSelect(name, route) {
      this.$emit('set-select', name, route);
    },
    validChildren: hasValidChildren,
  },
};
</script>
<style lang="scss" scoped></style>
