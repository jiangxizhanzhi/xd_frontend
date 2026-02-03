<template>
  <div class="cb-tabs">
    <Tabs
      v-bind="$attrs"
      v-on="$listeners"
      @tab-click="tabClick"
    >
      <slot></slot>
    </Tabs>
  </div>
</template>

<script>
import { Tabs } from 'element-ui';
import _ from 'lodash';
import Utils from '../../../utils/utils.js';
import { webTrack } from '../../../utils/track';
/**
 * @displayName cb-tabs 标签页
 * @classify View/视图
 */
export default {
  name: 'CbTabs',
  components: {
    Tabs,
  },
  props: {},
  data() {
    return {};
  },
  created() {
    this.$slots.default && this.$slots.default.map((vnode) => {
      _.set(vnode, 'componentOptions.Ctor.options.name', 'ElTabPane');
    });
  },
  methods: {
    tabClick(event) {
      // Utils.debounce(webTrack('tabs', event, 'click', this.$route), 50);
    }
  }
};
</script>
