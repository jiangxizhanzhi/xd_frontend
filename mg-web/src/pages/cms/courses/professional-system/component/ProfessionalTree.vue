<template>
  <div class="component">
    <cb-input
      class="search"
      v-model="filterText"
      :placeholder="$t('professionalSystem.professionalSystem.enterType')"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </cb-input>
    <cb-scrollbar class="scrollbar" :style="{ height: treeHeight }">
      <cb-tree
        class="tree-content"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :indent="15"
        node-key="id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="treeNodeClick"
      >
        <span class="slot-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </cb-tree>
    </cb-scrollbar>
  </div>
</template>
<script>
import { getTreeData } from '@/api/left-tree';
export default {
  name: 'ProfessionalTree',
  props: {
    url: {
      type: String,
      default: '',
    },
    treeHeight: {
      type: String,
      default: 'auto',
    },
    defaultProps: {
      type: Object,
      default: function () {
        return {
          children: 'children',
          label: 'label',
        };
      },
    },
  },
  data() {
    return {
      filterText: '',
      treeData: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      getTreeData(this.url).then((res) => {
        if (res && res.data && res.data.data) {
          this.treeData = [...res.data.data];
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    treeNodeClick(data) {
      this.$emit('getResourceId', data.id);
    },
  },
};
</script>
<style scoped lang="scss">
.component {
  height: 100%;
  margin-right: 20px;
  .search {
    margin-bottom: 16px;
  }
  ::v-deep .el-scrollbar__view {
    height: 100%;
  }
  .scrollbar {
    background-color: var(--bg-color-third);
  }
  .tree-content {
    width: 200px;
    height: 100%;
    ::v-deep .el-tree-node__content {
      height: 40px;
    }
    ::v-deep .el-tree-node__expand-icon {
      font-size: 14px;
    }
    ::v-deep .el-tree-node__label {
      width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .slot-node {
      font-size: 14px;
      width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
