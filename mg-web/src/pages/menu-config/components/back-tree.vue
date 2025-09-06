<template>
  <div>
    <cb-tree
      class="cb-arrage-tree"
      :data="treeData"
      :props="defaultProps"
      default-expand-all
      draggable="draggable"
      ref="backTree"
      node-key="id"
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @node-drop="nodeDrop"
    >
      <div
        class="treegroups"
        slot-scope="{ node, data }"
        @mouseenter="mouseenter(node, data)"
        @mouseleave="mouseleave(data)"
      >
        <div class="node custom-tree-node">
          <span>{{ data.name }}</span>

          <div class="tree-btn" v-show="data.btnShow">
            <!-- <cb-button type="text" @click="() => appendNode(node, data)"
              >新增</cb-button
            > -->
            <cb-button
              type="text"
              v-if="data.id !== 'back_all'"
              @click="() => renameNode(node, data)"
              >重命名</cb-button
            >
            <cb-button
              v-if="data.id !== 'back_all' && data.id !== 'index'"
              type="text"
              button-type="delete"
              @click="deleteNode(node, data, $event)"
              >删除</cb-button
            >
          </div>
        </div>
      </div>
    </cb-tree>
    <!-- 新增/重命名菜单 -->
    <cb-dialog
      v-if="typeVisible"
      :title="addFlag ? '新增' : '重命名'"
      :visible.sync="typeVisible"
      width="600px"
    >
      <cb-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <cb-form-item label="中文名称" prop="name">
          <cb-input v-model="formData.name"></cb-input>
          <cb-input style="display: none"></cb-input>
        </cb-form-item>
        <cb-form-item label="英文名称" prop="en_name">
          <cb-input v-model="formData.en_name"></cb-input>
          <cb-input style="display: none"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button class="mr" @click="addSubmit" v-if="addFlag">{{
              $t('确定')
            }}</cb-button>
            <cb-button class="mr" @click="editSubmit" v-if="editFlag">{{
              $t('确定')
            }}</cb-button>
            <cb-button @click="onCancel" button-type="cancel"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      addFlag: true,
      editFlag: false,
      typeVisible: false,
      treeAddNode: '',
      treeEditNode: '',
      formData: {
        name: '',
        en_name: '',
      },
      rules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入中文名称',
          },
        ],
        en_name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入英文名称',
          },
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  methods: {
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.level === 1) {
        return type === 'inner';
      } else if (dropNode.level === 2 && dropNode.isLeaf) {
        return type !== 'inner';
      } else if (dropNode.level === 3 && draggingNode.isLeaf) {
        return type !== 'inner';
      } else if (dropNode.level === 3 && !draggingNode.isLeaf) {
        return false;
      }
      {
        return true;
      }
    },
    // 拖拽成功完成时触发的事件
    nodeDrop() {
      this.filterTreeData(this.treeData[0].children);
    },
    filterTreeData(orgs) {
      const tagList = [];
      const matchData = (orgs) => {
        orgs.map((org) => {
          if (
            org.id.includes('folder') &&
            org.children.length === 0 &&
            (org.parent === 'front_all' || org.parent === 'back_all')
          ) {
            this.$message.warning(org.name + '是空框架,不能有空框架菜单');
            tagList.push(org.id);
          }
          if (org.children) {
            matchData(org.children);
          }
        });
        return tagList;
      };
      const data = matchData(orgs);
      return data;
    },
    mouseenter(node, data) {
      this.$set(data, 'btnShow', true);
    },
    mouseleave(data) {
      this.$set(data, 'btnShow', false);
    },
    // 添加
    appendNode(node, data) {
      this.typeVisible = true;
      this.editFlag = false;
      this.addFlag = true;
      this.treeAddNode = data;
    },
    // 重命名
    renameNode(node, data) {
      this.typeVisible = true;
      this.editFlag = true;
      this.addFlag = false;
      this.formData.name = data.name;
      this.formData.en_name = data.en_name;
      this.treeEditNode = data;
    },
    deleteNode(node, data, done) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      // console.log(parent, children);
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      this.saveTree();
      done(false);
    },
    addSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.newChild = {
            parent: this.treeAddNode.id,
            name: this.formData.name,
            en_name: this.formData.en_name,
          };
          if (!this.treeAddNode.children) {
            this.$set(this.treeAddNode, 'children', []);
          }
          this.treeAddNode.children.push(this.newChild);
          this.formData.name = '';
          this.formData.en_name = '';
          this.typeVisible = false;
          this.saveTree();
        } else {
          return false;
        }
      });
    },
    // 重命名
    editSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.typeVisible = false;
          this.treeEditNode.name = this.formData.name;
          this.treeEditNode.en_name = this.formData.en_name;
          this.formData.name = '';
          this.formData.en_name = '';
          this.saveTree();
        } else {
          return false;
        }
      });
    },
    saveTree() {
      // console.log(this.treeData, '后台菜单数据');
    },
    onCancel() {
      this.formData.name = '';
      this.formData.en_name = '';
      this.typeVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.treegroups {
  width: 100%;
}
.custom-tree-node {
  position: relative;
  .tree-btn {
    position: absolute;
    top: -6px;
    right: 20px;
  }
}
</style>
