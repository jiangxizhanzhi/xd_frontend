<template>
  <div class="component">
    <div class="topTitle">{{ $t('careerSystem.NetworkSafeFramework') }}</div>
    <cb-scrollbar class="scrollbar" :style="{ height: treeHeight }">
      <cb-tree
        class="tree-content"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :indent="15"
        node-key="resource_id"
        :expand-on-click-node="false"
        @node-contextmenu="treeNodeRightClick"
      >
        <span class="slot-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </cb-tree>
    </cb-scrollbar>
    <div class="framework-button">
      <cb-button icon="icon-shuaxin" hollow @click="resetTree">
        {{ $t('careerSystem.reset') }}
      </cb-button>
      <cb-button icon="icon-shanchu" hollow @click="cleanAllTree">
        {{ $t('careerSystem.cleanAll') }}
      </cb-button>
    </div>

    <div v-show="menuVisible" class="operate-menu">
      <div id="operate-menu" class="tree-node-layout">
        <div @click="addNodeClick" v-show="!clickSecondNode">
          <cb-iconfont type="icon-xinzeng"></cb-iconfont>
          <span>{{ $t('careerSystem.addTheNextLevel') }}</span>
        </div>
        <div v-show="!clickNodeRoot" @click="editNodeClick">
          <cb-iconfont type="icon-bianji"></cb-iconfont>
          <span>{{ $t('careerSystem.edit') }}</span>
        </div>
        <div v-show="!clickNodeRoot" @click="deleteNodeClick">
          <cb-iconfont type="icon-shanchu"></cb-iconfont>
          <span>{{ $t('careerSystem.delete') }}</span>
        </div>
      </div>
    </div>
    <!--新增、编辑树节点弹窗-->
    <cb-dialog
      v-if="operateNodeDialog"
      :title="dialogTitle"
      :visible.sync="operateNodeDialog"
      width="600px"
    >
      <cb-form
        ref="operateNodeForm"
        label-width="auto"
        label-position="left"
        :model="nodeModel"
        :rules="nodeRules"
      >
        <cb-form-item :label="$t('careerSystem.name')" prop="nodeName">
          <cb-input
            v-model="nodeModel.nodeName"
            :placeholder="$t('careerSystem.enterName')"
          />
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button @click="createNode()">{{
              $t('careerSystem.save')
            }}</cb-button>
            <cb-button hollow @click="operateNodeDialog = false">{{
              $t('careerSystem.cancel')
            }}</cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </div>
</template>
<script>
import {
  frameworkList,
  getTreeData,
  addTreeNode,
  editTreeNode,
  deleteTreeNode,
  resetFrame,
  clearFrame,
} from '@/api/career-framework';
import Validate from '@/utils/validate.js';
export default {
  name: 'ProfessionalTree',
  components: {
    Validate,
  },
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
      // 标志是否点击了根节点
      clickNodeRoot: false,
      // 标志是否点击了二级框架
      clickSecondNode: false,
      framework_id: '',
      frameworkList: [],
      treeData: [],
      menuVisible: false,
      nodeMessage: {}, // 被右击的节点的信息
      operateNodeDialog: false,
      dialogTitle: '',
      nodeModel: {
        nodeName: '',
      },
      nodeRules: {
        nodeName: [
          {
            required: true,
            message: this.$t('careerSystem.enterName'),
            trigger: 'blur',
          },
          {
            validator: Validate.jobName,
            trigger: 'blur',
          },
        ],
      },
      addOperate: true,
    };
  },
  watch: {},
  mounted() {
    // this.getFrameworkList();
    this.framework_id = 'default';
    this.getTreeList(this.framework_id);
  },
  methods: {
    // 获取框架下拉列表
    getFrameworkList() {
      frameworkList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        const list = data.map((item) => {
          return {
            label: item.name,
            value: item.resource_id,
          };
        });
        this.frameworkList = [...list];
        if (this.frameworkList[0]) {
          this.framework_id = this.frameworkList[0].value;
          this.getTreeList(this.framework_id);
        }
      });
    },

    selectChange(value) {
      this.framework_id = value;
      this.getTreeList(this.framework_id);
    },

    // 获取框架树节点数据
    getTreeList(id) {
      this.$store.commit({
        type: 'careerFramework/setFrameworkId',
        framework_id: id,
      });
      getTreeData(this.url, id).then((res) => {
        if (res && res.data && res.data.data) {
          this.treeData = [res.data.data];
        }
      });
      this.$emit('tableUpdate', id);
    },

    // 树节点右击
    treeNodeRightClick(event, object, node, item) {
      let menu = null;
      this.menuVisible = true;
      // 是否点击了名称
      if (object.resource_id === 'default') {
        this.clickNodeRoot = true;
      } else {
        this.clickNodeRoot = false;
      }
      // 说明点击了第二层框架
      if (node.level === 3) {
        this.clickSecondNode = true;
      } else {
        this.clickSecondNode = false;
      }
      const { resource_id, name } = object;
      this.nodeMessage = {
        resource_id,
        name,
      };
      document.addEventListener('click', (e) => {
        this.menuVisible = false;
      });
      menu = document.querySelector('#operate-menu');
      menu.style.left = event.clientX + 'px';
      let restHeight = document.body.offsetHeight - event.clientY;
      if (restHeight >= 105) {
        menu.style.top = event.clientY + 'px';
      } else {
        menu.style.top = event.clientY - (105 - restHeight) + 'px';
      }
      menu.style.position = 'fixed';
      menu.style.width = 140 + 'px';
    },

    addNodeClick() {
      this.addOperate = true;
      this.dialogTitle = this.$t('careerSystem.addFrameworkNode');
      this.operateNodeDialog = true;
      this.nodeModel.nodeName = '';
    },

    editNodeClick() {
      this.addOperate = false;
      this.dialogTitle = this.$t('careerSystem.editFrameworkNode');
      this.operateNodeDialog = true;
      this.nodeModel.nodeName = this.nodeMessage.name;
    },

    // 删除节点
    deleteNodeClick() {
      const { resource_id, name } = this.nodeMessage;
      let ids = [resource_id];
      this.$confirm(this.$t('careerSystem.sureDelete'), '', {
        confirmButtonText: this.$t('careerSystem.confirm'),
        cancelButtonText: this.$t('careerSystem.cancel'),
        type: 'warning',
      }).then(() => {
        deleteTreeNode({ ids })
          .then((_) => {
            this.$message({
              type: 'success',
              message: this.$t('careerSystem.deleteSuccessfully'),
            });
            this.$refs.tree.remove(resource_id);
            //  刷新岗位表格
            this.$emit('tableUpdateRefresh');
          })
          .catch((res) => {
            /* if (res.data.code == '100001') {
              this.$message({
                type: 'warning',
                message: this.$t('careerSystem.jobHasRoleWarning'),
              });
            } */
          });
      });
    },

    createNode() {
      let name = this.nodeModel.nodeName,
        params = {
          name,
          parent: this.nodeMessage.resource_id,
          description: null,
        };
      this.$refs['operateNodeForm'].validate((valid) => {
        if (valid) {
          if (this.addOperate) {
            // 新增
            addTreeNode(params)
              .then((_) => {
                /*  this.$message({
                type: 'success',
                message: '新增成功',
              }); */
                this.getTreeList(this.framework_id);
                this.operateNodeDialog = false;
                this.nodeMessage.resource_id = null;
              })
              .catch((res) => {
                if (res.data.code == '100002') {
                  this.$message({
                    type: 'warning',
                    message: this.$t('careerSystem.jobHasRoleDelWarning'),
                  });
                  this.operateNodeDialog = false;
                  this.nodeMessage.resource_id = null;
                }
              });
          } else {
            // 编辑
            const { resource_id } = this.nodeMessage;
            let params = {
              parent: null,
              name,
              resource_id,
              description: null,
            };
            editTreeNode(params).then((_) => {
              /* this.$message({
                type: 'success',
                message: '编辑成功',
              }); */
              /* 更新树 */
              this.getTreeList(this.framework_id);
              this.operateNodeDialog = false;
              this.nodeMessage.resource_id = null;
              //  刷新岗位表格
              this.$emit('tableUpdateRefresh');
            });
          }
        } else {
          return;
        }
      });
    },
    // 重置树框架
    resetTree() {
      this.$confirm(this.$t('careerSystem.confirmReset'), '', {
        confirmButtonText: this.$t('careerSystem.confirm'),
        cancelButtonText: this.$t('careerSystem.cancel'),
        type: 'warning',
      }).then(() => {
        resetFrame().then((res) => {
          // 重新熏染框架
          this.getTreeList(this.framework_id);
          //  刷新岗位表格
          this.$emit('tableUpdateRefresh');
        });
      });
    },
    cleanAllTree() {
      this.$confirm(this.$t('careerSystem.confirmClear'), '', {
        confirmButtonText: this.$t('careerSystem.confirm'),
        cancelButtonText: this.$t('careerSystem.cancel'),
        type: 'warning',
      }).then(() => {
        clearFrame().then((res) => {
          // 清空后熏染框架
          this.getTreeList(this.framework_id);
          //  刷新岗位表格
          this.$emit('tableUpdateRefresh');
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.component {
  height: 100%;
  margin-right: 16px;
  .topTitle {
    height: 36px;
    line-height: 36px;
    width: 100%;
    background-color: var(--bg-color-2);
    margin-bottom: 10px;
    padding-left: 15px;
    box-sizing: border-box;
    color: var(--neutral8);
    font-size: 14px;
  }
  .select {
    margin-bottom: 10px;
  }
  ::v-deep .el-scrollbar__view {
    height: 100%;
  }
  .scrollbar {
    background-color: var(--bg-color-2);
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
  .framework-button {
    padding: 15px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--bg-color-2);
    margin-top: 10px;
  }
  .tree-node-layout {
    background-color: var(--bg-color-3);
    z-index: 998;
    border-radius: 4px;
    border: 1px solid rgba($color: var(--primary-color-4), $alpha: 0.2);

    .cb-iconfont {
      color: var(--neutral8);
    }
  }
  .tree-node-layout > div {
    height: 40px;
    line-height: 40px;
    color: var(--neutral8);
    cursor: pointer;
    padding: 0 8px;
    span {
      font-size: 14px;
    }
  }
}
.theme-light {
  .tree-node-layout {
    position: relative;
  }
}
</style>
