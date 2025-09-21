<template>
  <div class="step-two">
    <div class="header-content mb20">
      <span class="title">{{
        $t('systemManagement.roleManage.choosePermissions')
      }}</span>
      <div>
        <cb-button
          button-type="cancel"
          @click="setCheckedNodes(nodeChecked)"
          mr
          >{{ checkAct }}</cb-button
        >
        <cb-button button-type="cancel" @click="treeExpanded(showTree)">{{
          showAct
        }}</cb-button>
      </div>
    </div>
    <div class="tree-content">
      <cb-tree
        class="tree"
        :data="frontTreeData"
        ref="frontTree"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        highlight-current
        @check="handleCheckChange"
      >
      </cb-tree>
<!--      <cb-tree-->
<!--        class="tree"-->
<!--        :data="backTreeData"-->
<!--        ref="backTree"-->
<!--        :props="defaultProps"-->
<!--        default-expand-all-->
<!--        show-checkbox-->
<!--        node-key="id"-->
<!--        highlight-current-->
<!--        @check="handleCheckChangeBack"-->
<!--      >-->
<!--      </cb-tree>-->
    </div>
    <div class="btn-group mt20">
      <cb-button-group space="middle">
        <cb-button button-type="confirm" mr @click="back">{{
          $t('systemManagement.roleManage.backStep')
        }}</cb-button>
        <cb-button button-type="confirm" mr @click="next">{{
          $t('systemManagement.roleManage.nextStep')
        }}</cb-button>
        <cb-button button-type="cancel" @click="cancel">{{
          $t('systemManagement.roleManage.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { permissonList, editBack } from '@/api/role';
export default {
  name: 'TabPermission',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      frontTreeData: [],
      backTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      nodeChecked: false,
      showTree: false,
      frontChosenNodeList: [],
      backChosenNodeList: [],
      treeIdentify: ['frontTree', 'backTree'],
      // 默认的4个菜单
      defaultPersonalFolder: [
        {
          name: this.$t('routes.front_all'),
          id: 'front_all',
          path: 'front_all/*',
          per_status: 'R/W/X',
        },
        // {
        //   name: this.$t('routes.personal-center'),
        //   id: 'personal-center',
        //   path: 'front_all/personal-center',
        //   per_status: 'R/W/X',
        // },
        // {
        //   name: this.$t('routes.personal-folder'),
        //   id: 'personal-folder',
        //   path: 'front_all/personal-center/personal-folder',
        //   per_status: 'R/W/X',
        // },
      ],
    };
  },
  computed: {
    checkAct: function () {
      return !this.nodeChecked
        ? this.$t('systemManagement.roleManage.allSelected')
        : this.$t('systemManagement.roleManage.allEmpty');
    },
    showAct: function () {
      return this.showTree
        ? this.$t('systemManagement.roleManage.allShow')
        : this.$t('systemManagement.roleManage.allHide');
    },
    chosenNumber: function () {
      let number =
        this.frontChosenNodeList.length + this.backChosenNodeList.length;
      if (number > 100) {
        this.$message.warning(
          this.$t('systemManagement.roleManage.maxPermisson'),
        );
      }
      return number;
    },
  },
  mounted() {
    this.getTreeDataAndRoleMes();
  },
  activated() {},
  methods: {
    /* 编辑 */
    getRoleMessage(res) {
      const targets = _.get(res, 'data.data.targets', []);
      this.treeIdentify.forEach((item) => {
        targets.forEach((key) => {
          let node = this.$refs[item].getNode(key);
          if (node && node.childNodes.length === 0) {
            this.$refs[item].setChecked(key, true, false);
          }
        });
      });

      const list = this.nodeFilter(targets, 2);
      list.forEach((item) => {
        if (item.path.indexOf('front_all') >= 0) {
          this.frontChosenNodeList.push(item);
        } else {
          this.backChosenNodeList.push(item);
        }
      });
    },

    //权限管理添加权限国际化处理
    getAllPermissions(res) {
      let data = _.get(res, 'data.data', []);
      this.frontTreeData = data[0]
        ? [data[0]].map((org) => this.mapTree(org))
        : [];
      this.backTreeData = data[1]
        ? [data[1]].map((org) => this.mapTree(org))
        : [];
    },
    mapTree(org) {
      const haveChildren =
        Array.isArray(org.children) && org.children.length > 0;
      return {
        ...org,
        disabled: org.id === 'personal-folder',
        name: this.$t(`routes.${org.id}`),
        children: haveChildren ? org.children.map((i) => this.mapTree(i)) : [],
      };
    },

    /* 先获取树数据，再获取编辑数据 */
    async getTreeDataAndRoleMes() {
      let permissionData = await permissonList();
      this.getAllPermissions(permissionData);
      if (this.id) {
        let roleMessage = await editBack(this.id);
        this.getRoleMessage(roleMessage);
      }
    },

    /* 获取所有选中的节点 */
    handleCheckChange() {
      this.frontChosenNodeList = [];
      const list = this.$refs.frontTree.getCheckedNodes(false, true);
      this.frontChosenNodeList = this.nodeFilter(list);
    },
    handleCheckChangeBack() {
      this.backChosenNodeList = [];
      const list = this.$refs.backTree.getCheckedNodes(false, true);
      this.backChosenNodeList = this.nodeFilter(list);
    },
    nodeFilter(list) {
      const listTep = [];
      list.forEach((item) => {
        listTep.push({
          name: item.name,
          id: item.id,
          path: item.path,
          status: item.status,
          per_status: item.per_status ? item.per_status : 'R/W/X',
        });
      });
      return listTep;
    },
    /* 全部选中、不选中 */
    setCheckedNodes(v) {
      let f = [],
        b = [];
      this.nodeChecked = !v;
      if (!v) {
        f = _.cloneDeep(this.frontTreeData);
        b = _.cloneDeep(this.backTreeData);
      } else {
        f = [];
        b = [];
      }
      this.$refs.frontTree.setCheckedNodes([...f]);
      this.$refs.backTree.setCheckedNodes([...b]);

      const frontTreeCheckedNodes = this.$refs.frontTree.getCheckedNodes();
      let tempList = [];
      // frontTreeCheckedNodes中不包含disabled的节点，所以全选时合并
      if (!v) {
        tempList = [...this.defaultPersonalFolder, ...frontTreeCheckedNodes];
      }
      this.frontChosenNodeList = this.nodeFilter(tempList);
      this.backChosenNodeList = this.nodeFilter(
        this.$refs.backTree.getCheckedNodes(),
      );
    },
    /* 全部展开、全部收缩 */
    treeExpanded(v) {
      this.treeToggle(v);
      this.showTree = !v;
    },
    treeToggle(boolValue) {
      this.treeRecursion(this.frontTreeData, 'frontTree', boolValue);
      this.treeRecursion(this.backTreeData, 'backTree', boolValue);
    },
    treeRecursion(data, name, bool) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.treeRecursion(item.children, name, bool);
        }
        this.$refs[name].store.nodesMap[item.id].expanded = bool;
      });
    },
    /* 上一步 */
    back() {
      this.$store.commit({
        type: 'role/setCurrentTab',
        tabKey: 'message',
      });
    },
    /* 下一步 */
    next() {
      // 没有"点击"左侧菜单，左侧菜单默认4个菜单：前台、个人中心、个人中心/个人中心、个人中心/我的职业
      if (!this.frontChosenNodeList.length) {
        this.frontChosenNodeList = this.defaultPersonalFolder;
      }

      /* 存储选取的节点对应的权限 */
      this.$store.commit({
        type: 'role/setPermissonList',
        allPermissonList: [
          ...this.frontChosenNodeList,
          ...this.backChosenNodeList,
        ],
      });

      /* 跳到第三步 */
      this.$store.commit({
        type: 'role/setCurrentTab',
        tabKey: 'confirm',
      });
    },
    cancel() {
      this.$router.push({ path: '/admin/system-management/role-management' });
    },
  },
};
</script>
<style lang="scss" scoped>
.step-two {
  padding: 16px;
  background: var(--bg-color-2);
}
::v-deep .el-tree {
  background: var(--neutral0);
  color: var(--neutral8);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .title {
    color: var(--neutral8);
    font-size: 14px;
  }
}
.btn-group {
  display: flex;
  justify-content: center;
}
.tree-content {
  display: flex;
  margin-left: 70px;
  .tree {
    padding: 20px;
    height: 610px;
    //width: 400px;
    flex: 1;
    overflow-y: auto;
    margin-right: 20px;
    ::v-deep .el-tree-node__content {
      height: 40px;
    }
    ::v-deep .el-tree-node__content > label.el-checkbox {
      margin-right: 12px;
    }
    ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
      margin-right: 8px;
    }
    ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner:before {
      background-color: var(--bg-color-3);
      transform: scale(1);
      left: 1px !important;
      right: 1px !important;
      top: 4px;
      height: 4px;
    }
  }
  .tree ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background-color: transparent !important;
  }
  .tree::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .tree::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
  }
}
</style>
