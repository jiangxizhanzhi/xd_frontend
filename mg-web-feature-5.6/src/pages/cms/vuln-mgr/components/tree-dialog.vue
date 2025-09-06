<template>
  <cb-dialog
    v-if="showTreeDialog"
    :title="$t('common.weaknessList')"
    :visible.sync="showTreeDialog"
    width="720px"
    @close="closeTreeDialog"
    class="tree-dialog"
  >
    <div class="selected">
      <span
        >{{ $t('vulnList.currentlySelected') + $t('common.colon')
        }}{{ selectedName }}</span
      >
    </div>
    <cb-search-input
      v-model="searchKey"
      :placeholder="$t('vulnList.pleaseEnter')"
      class="search-input"
    />
    <div class="tree-container ct-g-scrollbar">
      <cb-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        @node-click="departmentClicked"
        :filter-node-method="treeFilter"
        node-key="id"
        icon-class="icon-tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <cb-iconfont
              v-if="data.children && data.children.length > 0"
              :type="node.expanded ? 'icon-quanbushouqi' : 'icon-quanbuzhankai'"
              class="node-icon"
            ></cb-iconfont>
            <span>{{ node.label }}</span>
          </span>
        </span>
      </cb-tree>
    </div>
    <template slot="footer">
      <cb-button button-type="confirm" mr @click="submitTreeNode"></cb-button>
      <cb-button button-type="cancel" @click="cancelTreeNode"></cb-button>
    </template>
  </cb-dialog>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      showTreeDialog: false,
      searchKey: '',
      selectedNode: '',
      selectedName: '',
      defaultProps: {
        label: 'name',
        value: 'id',
      },
    };
  },
  watch: {
    searchKey(v) {
      this.$refs.treeRef.filter(v);
    },
  },
  methods: {
    departmentClicked(data, node) {
      this.selectedNode = data.id;
      this.selectedName = data.name;
    },
    treeFilter(value, data) {
      if (!value) {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    },
    submitTreeNode() {
      this.$emit('fill-input', this.selectedNode, this.selectedName);
      this.showTreeDialog = false;
      this.searchKey = '';
      this.selectedName = '';
    },
    cancelTreeNode() {
      this.showTreeDialog = false;
      this.searchKey = '';
      this.selectedName = '';
    },
    closeTreeDialog() {
      this.searchKey = '';
      this.selectedName = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  margin: 16px 0;
}
.tree-container {
  width: 670px;
  height: 300px;
  overflow: auto;
}
</style>

<style lang="scss">
.tree-dialog {
  .el-tree {
    display: inline-block;
    min-width: 100%;
    background: none;
    background: transparent !important;
    .el-tree-node {
      position: relative;
      padding-left: 0 !important;
    }
    .el-tree-node__content {
      padding-left: 6px !important;
      height: 30px;
      line-height: 30px;
      color: var(--neutral8);
      font-size: 14px;
      .custom-tree-node {
        width: 100%;
        span {
          margin-left: 9px;
        }
      }
      .is-leaf {
        width: 6px;
        overflow: hidden;
      }
    }
    .el-tree-node {
      margin-top: 0 !important;
    }
    .el-tree-node__content:hover {
      width: 100%;
      line-height: 30px;
      background: var(--neutral0);
      border-radius: 2px;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }
    .el-tree-node :last-child:before {
      height: 30px;
    }
    .el-tree-node:before {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
    .el-tree-node:after {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
    .el-tree-node:before {
      border-left: 1px dashed #a9b7d6;
      bottom: 0;
      height: 100%;
      top: -16px;
      width: 1px;
    }
    .el-tree-node:after {
      border-top: 1px dashed #a9b7d6;
      height: 20px;
      top: 14px;
      width: 16px;
    }
  }
  .el-tree-node__children {
    padding-left: 22px;
    background: var(--bg-color-2) !important;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:focus > .el-tree-node__content {
    color: var(--primary-color-8);
  }
  .icon-tree {
    display: none;
  }
}
</style>
