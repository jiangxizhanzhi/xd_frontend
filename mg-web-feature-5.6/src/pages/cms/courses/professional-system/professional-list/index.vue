<template>
  <cb-inner-page :background="false">
    <div ref="page" class="page-content">
      <professional-tree
        :url="treeUrl"
        :tree-height="treeHeight"
        :default-props="defaultProps"
        :node-action-show="true"
        @getResourceId="getResourceId"
      ></professional-tree>
    </div>
  </cb-inner-page>
</template>

<script>
import ProfessionalTree from '../component/ProfessionalTree.vue';
export default {
  name: 'ProfessionalSystem',
  components: {
    ProfessionalTree,
  },
  data() {
    return {
      treeUrl: '/auth/orgs/tree',
      treeHeight: 'auto',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  mounted() {
    this.treeHeight = `${this.$refs.page.offsetHeight - 52}px`;
  },
  methods: {
    getResourceId(id) {},
  },
};
</script>

<style scoped lang="scss">
body {
  .page-content {
    display: flex;
    height: 100%;
  }
}
</style>
