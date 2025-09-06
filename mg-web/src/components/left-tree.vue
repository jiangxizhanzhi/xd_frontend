<template>
  <!-- 表格左侧的选择树 -->
  <div class="tree-comp" :style="leftTreeStyle">
    <div class="left-input-box">
      <cb-input
        v-model="filterText"
        :placeholder="$t('systemManagement.userManage.inputOrgnization')"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </cb-input>
    </div>
    <div class="tree-box cyber-scroll-bar-small" :style="scrollbarStyle">
      <cb-tree
        class="tree-content"
        :style="treeStyle"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :indent="15"
        node-key="id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="treeLeftClick"
        @node-contextmenu="treeRightClick"
      >
        <span class="node-customized" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </cb-tree>
    </div>

    <div v-show="menuVisible" class="rightClickMenu">
      <div id="rightClickMenu" class="tree-node-layout-right-menu">
        <cb-button
          v-show="notlastNode"
          @click="addBtnClick"
          :disabled="notAdminDisabled"
          hollow
          ><i class="el-icon-plus" />
          <span>{{ $t('systemManagement.userManage.addTreeNode') }}</span>
        </cb-button>

        <cb-button hollow @click="editBtnClick" :disabled="notAdminDisabled">
          <i class="el-icon-edit" />
          <span>{{ $t('systemManagement.userManage.edit') }}</span>
        </cb-button>
        <cb-button hollow @click="deleteNode" :disabled="notAdminDisabled">
          <i class="el-icon-delete" />
          <span>{{ $t('systemManagement.userManage.delete') }}</span>
        </cb-button>
      </div>
    </div>
    <!--新增、编辑树节点弹窗-->
    <cb-dialog
      v-if="addNodeDialog"
      :title="
        addEdit === 1
          ? $t('systemManagement.userManage.addOrganization')
          : $t('systemManagement.userManage.editOrganization')
      "
      :visible.sync="addNodeDialog"
      :width="language === 'en-US' ? '700px' : '600px'"
      top="15%"
    >
      <cb-form
        ref="addNode"
        label-width="auto"
        label-position="left"
        :model="addNode"
        :rules="nodeRules"
      >
        <cb-form-item
          :label="$t('systemManagement.userManage.organization')"
          prop="nodeName"
        >
          <cb-input
            v-model="addNode.nodeName"
            :placeholder="
              $t('systemManagement.userManage.enterOrganizationName')
            "
          />
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button buttonType="confirm" @click="createNode()">{{
              $t('systemManagement.userManage.save')
            }}</cb-button>
            <cb-button buttonType="cancel" @click="addNodeDialog = false">{{
              $t('systemManagement.userManage.cancel')
            }}</cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </div>
</template>
<script>
import {
  getTreeData,
  addTreeNode,
  editTreeNode,
  deleteTreeNode,
} from '@/api/left-tree';
import { getLanguage } from '@cyber/helper';
export default {
  name: 'LeftTree',
  props: {
    leftTreeStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
    treeStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
    scrollbarStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
    url: {
      type: String,
      default: '',
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
    /**
     * 节点的新增、编辑、删除是否显示
     */
    nodeActionShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateLength = (str) => {
      let sum = 0;
      const value = str.trim();
      const cn_re = /[\u4e00-\u9fa5]/;
      const re = /^[_a-zA-Z0-9\s]/;
      for (let s = 0; s < value.length; s++) {
        if (re.test(value[s]) || value[s] === '-') {
          sum = sum + 1;
        } else if (cn_re.test(value[s])) {
          sum = sum + 2;
        } else {
          return false;
        }
      }
      return sum;
    };
    /* 验证新增编辑节点的长度(包含'_','-') ，不超过40个字符*/
    const validateNameLength = (rule, value, callback) => {
      const sum = validateLength(value);
      if (!sum) {
        callback(new Error(this.$t('systemManagement.userManage.errorInput')));
      } else if (sum < 4 || sum > 40) {
        callback(
          new Error(this.$t('systemManagement.userManage.organizationLength')),
        );
      } else {
        callback();
      }
    };
    return {
      language: getLanguage(),
      id: '',
      filterText: '',
      treeData: [],
      notlastNode: true,
      menuVisible: false,
      nodeMessage: {
        name: '',
        parent: '',
      },
      addNodeDialog: false,
      addNode: {
        nodeName: '',
      },
      addEdit: 1,
      nodeRules: {
        nodeName: [
          {
            required: true,
            message: this.$t(
              'systemManagement.userManage.enterOrganizationName',
            ),
            trigger: 'blur',
          },
          { validator: validateNameLength, trigger: 'blur' },
        ],
      },
      depth: 0,
      notAdminDisabled: false,
    };
  },
  watch: {
    /* 用户组织搜索 */
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // 普通用户没有新增下一级、编辑、删除操作
    let is_admin = _.get(this.$store.state.user, 'is_admin', 1),
      is_super_user = _.get(this.$store.state.user, 'is_super_user', 1);
    if (is_admin === 0 && is_super_user === 0) {
      this.$nextTick(() => {
        this.notAdminDisabled = true;
      });
    }
    this.getUserTreeData();
  },
  methods: {
    /* 获取用户组织数据 */
    getUserTreeData() {
      getTreeData(this.url).then((res) => {
        if (res && res.data && res.data.data) {
          this.treeData = [...res.data.data];
        }
        /* 若无组织，后端接口已默认创建一个一级组织 */
      });
    },
    /* 用户组织搜索 */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    /* left-tree右击事件，显示定位菜单 */
    treeRightClick(event, object, node, item) {
      if (!this.nodeActionShow) return;
      let menu = null;
      /* 前三级组织菜单,拥有‘新增下一级’功能 */
      if (node.level < 4) {
        this.notlastNode = true;
      } else {
        /* 最后一级菜单，没有‘新增下一级’功能 */
        this.notlastNode = false;
      }
      this.menuVisible = true;
      const { id, name } = object;
      this.nodeMessage = {
        parent: id,
        name,
      };
      /* 点击事件，关闭菜单 */
      document.addEventListener('click', (e) => {
        this.menuVisible = false;
      });

      menu = document.querySelector('#rightClickMenu');
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 'px';
      let restHeight = document.body.offsetHeight - event.clientY;
      if (restHeight >= 139) {
        menu.style.top = event.clientY + 'px';
      } else {
        // 高度差小于弹框的高度
        menu.style.top = event.clientY - (139 - restHeight) + 'px';
      }
      menu.style.position = 'fixed';
      menu.style.width = 150 + 'px';
    },
    /* left-tree左击事件，获取当前组织与子组织所有用户列表 */
    treeLeftClick(data) {
      this.$emit('getResourceId', data.id);
      this.menuVisible = false;
    },
    /* 新增按钮点击 */
    addBtnClick() {
      this.addEdit = 1;
      this.addNodeDialog = true;
      this.addNode.nodeName = '';
    },
    /* 编辑按钮点击 */
    editBtnClick() {
      this.addEdit = 0;
      this.addNodeDialog = true;
      this.addNode.nodeName = this.nodeMessage.name;
    },
    /* 新增、编辑节点 */
    createNode() {
      let name = this.addNode.nodeName.trim(),
        params = {
          ...this.nodeMessage,
          name,
        };
      this.$refs['addNode'].validate((valid) => {
        if (valid) {
          if (this.addEdit) {
            /* 新增 */
            addTreeNode(params).then((_) => {
              this.$message({
                type: 'success',
                message:
                  this.$t('systemManagement.userManage.organization') +
                  '"' +
                  name +
                  '"' +
                  this.$t('systemManagement.userManage.createSuccessfully'),
              });
              /* 更新树 */
              this.getUserTreeData();
              this.addNodeDialog = false;
              /* 展开相应节点 */
              /* this.$refs.tree.store.nodesMap[id].expanded = true; */
              this.nodeMessage.parent = null;
              /*  this.$refs.addNode.resetFields() */ // 重置表单项
            });
          } else {
            /* 编辑 */
            const { parent } = this.nodeMessage;
            let params = {
              id: parent,
              name,
            };
            editTreeNode(parent, params) // 此处的parent 就相当于当前节点的id值
              .then((_) => {
                this.$message({
                  type: 'success',
                  message:
                    this.$t('systemManagement.userManage.organization') +
                    '"' +
                    name +
                    '"' +
                    this.$t('systemManagement.userManage.editSuccessfully'),
                });
                /* 更新树 */
                this.getUserTreeData();
                this.addNodeDialog = false;
                /* 展开相应节点 */
                /* this.$refs.tree.store.nodesMap[id].expanded = true; */
                this.nodeMessage.parent = null;
              });
          }
        } else {
          return;
        }
      });
    },
    /* 删除树节点 */
    deleteNode() {
      const { parent, name } = this.nodeMessage; // 此处的parent 就相当于当前节点的id值
      let id = parent;
      this.$confirm(this.$t('systemManagement.userManage.confirmDelete'), '', {
        confirmButtonText: this.$t('systemManagement.userManage.confirm'),
        cancelButtonText: this.$t('systemManagement.userManage.cancel'),
        type: 'warning',
      }).then(() => {
        deleteTreeNode(id).then((_) => {
          this.$message({
            type: 'success',
            message:
              this.$t('systemManagement.userManage.organization') +
              '"' +
              name +
              '"' +
              this.$t('systemManagement.userManage.deleteSuccessfully'),
          });
          this.$refs.tree.remove(id);
        });
      });
    },
  },
};
</script>
<style scoped>
::v-deep .el-tree-node__content {
  height: 40px;
}
::v-deep .el-tree-node__expand-icon {
  font-size: 14px;
}
</style>
<style lang="scss">
.tree-node-layout-right-menu {
  .cb-button.cb-button-default .el-button:not(.el-button--text) {
    border: none !important;
    color: var(--primary-color) !important;
  }
  .cb-button.cb-button-default.hollow
    .el-button:not(.el-button--text):hover:not(.is-disabled) {
    background: transparent;
  }
}
.left-input-box {
  .el-input__icon {
    line-height: 32px;
  }
}
</style>
<style scoped lang="scss">
.left-input-box {
  background: var(--bg-color-2);
  padding: 16px;
}
.tree-box {
  overflow: hidden auto;
  background: var(--bg-color-2);
}
.tree-comp {
  height: 100%;
  ::v-deep .el-scrollbar__view {
    height: 100%;
  }
}
.tree-content {
  ::v-deep .el-tree-node__label {
    width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.tree-node-layout-right-menu {
  background-color: var(--bg-color-3);
  z-index: 998;
  border-radius: 4px;
  padding: 8px;
}
.tree-node-layout-right-menu > div {
  margin-bottom: 5px;
  color: var(--primary-color);
  cursor: pointer;
  span {
    font-size: 14px;
  }
}
.node-customized {
  font-size: 14px;
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
