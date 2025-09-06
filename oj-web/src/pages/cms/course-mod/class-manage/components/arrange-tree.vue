<template>
  <div>
    <cb-dialog
      :title="$t('m.choreography')"
      :visible.sync="courseVisible"
      width="50%"
      height="500px"
    >
      <cb-tree
        class="cb-arrage-tree"
        :data="treeData"
        default-expand-all="default-expand-all"
        draggable="draggable"
        ref="tree"
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
      >
        <div
          class="treegroups"
          slot-scope="{ node, data }"
          @mouseenter="mouseenter(node, data)"
          @mouseleave="mouseleave(data)"
        >
          <span class="node custom-tree-node"
            ><span v-if="!data.edit"
              ><span
                ><span
                  v-if="data.node_type === $CONSTANT.COURSES.TREE_NODE.COURSE"
                  ><i class="mr5 iconfont">&#xe68d;</i></span
                ><span
                  v-if="data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER"
                  ><i class="mr5 iconfont">&#xe68f;</i></span
                ><span
                  v-if="data.node_type === $CONSTANT.COURSES.TREE_NODE.CLASS"
                  ><i class="mr5 iconfont">&#xe60e;</i></span
                ><span
                  class="num"
                  v-if="
                    data.node_type === $CONSTANT.COURSES.TREE_NODE.COURSE &&
                    data.index === $CONSTANT.COURSES.TREE_NODE.COURSE
                  "
                  >{{ $t('m.course') }} </span
                ><span
                  class="num"
                  v-else-if="
                    data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER
                  "
                >
                  {{ sortChaptor(data.type_index) }}</span
                ><span class="num" v-else>
                  {{ $t('mess.lesson') }}
                  {{ data.type_index + ' ' }}</span
                ><span
                  class="nameStyle"
                  :style="{
                    width:
                      data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER ||
                      data.node_type === $CONSTANT.COURSES.TREE_NODE.COURSE
                        ? '290px'
                        : '650px',
                  }"
                  :title="data.name"
                  >{{ data.name }}</span
                ></span
              ></span
            >
            <cb-input v-if="data.edit"></cb-input>
            <div class="ml right-btn-groups" v-show="data.btnShow">
              <cb-button-group>
                <cb-button
                  button-type="add"
                  type="text"
                  v-if="
                    (data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER ||
                      data.node_type === $CONSTANT.COURSES.TREE_NODE.COURSE) &&
                    !(node.level === 5)
                  "
                  @click="() => appendNode(node, data)"
                  >{{ $t('m.add') }}</cb-button
                >
                <cb-button
                  type="text"
                  icon="icon-shuaxinzhongqihuifu"
                  v-if="data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER"
                  @click="() => renameNode(node, data)"
                  >{{ $t('m.rename') }}</cb-button
                >
                <cb-button
                  type="text"
                  button-type="delete"
                  v-if="data.node_type === $CONSTANT.COURSES.TREE_NODE.CHAPTER"
                  @click="deleteNode(node, data, $event)"
                ></cb-button>
              </cb-button-group>
            </div>
          </span>
        </div>
      </cb-tree>
      <template class="btn-groups center" slot="footer">
        <cb-button class="mr" @click="saveTree(1)">
          {{ $t('m.submit') }}
        </cb-button>
        <cb-button @click="cancelTree" button-type="cancel"></cb-button>
      </template>
    </cb-dialog>
    <cb-dialog
      v-if="typeVisible"
      :title="addFlag ? $t('m.add') : $t('m.rename')"
      :visible.sync="typeVisible"
      width="600px"
    >
      <cb-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <cb-form-item :label="$t('m.chineseName')" prop="name">
          <cb-input v-model="formData.name"></cb-input>
          <cb-input style="display: none"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button class="mr" @click="addSubmit" v-if="addFlag">{{
              $t('m.submit')
            }}</cb-button>
            <cb-button class="mr" @click="editSubmit" v-if="editFlag">{{
              $t('m.submit')
            }}</cb-button>
            <cb-button @click="onCancel" button-type="cancel"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import Constant from '../../course-constant.js';
import Validate from '@/utils/validate.js';
import CommonUtils from '@/utils/utils.js';
export default {
  props: {
    query: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {
      courseVisible: false,
      treeData: [],
      typeVisible: false,
      newChild: '',
      treeAddNode: '',
      treeEditNode: '',
      rules: {
        name: [
          {
            required: true,
            validator: Validate.name,
            trigger: ['blur', 'change'],
          },
        ],
      },
      formData: {
        name: '',
      },
      addFlag: true,
      editFlag: false,
      newFlag: true,
      backupName: '',
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
    sortChaptor() {
      return (index) => {
        return CommonUtils.formatString(this.$t('m.sortChapter'), index);
      };
    },
  },
  created() {},
  methods: {
    // 查询所有的编排节点
    getLessonConfig() {
      const resource_id = _.get(this, 'query.course_id');
      this.$request
        .get(
          '/oj/admin/lessonconfig',
          {
            course_id: resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.treeData = [res.data.data];
        });
    },

    appendNode(node, data) {
      // if (node.level > 4) {
      //   this.addFlag = false
      // } else {
      this.typeVisible = true;
      this.treeAddNode = data;
      this.addFlag = true;
      this.editFlag = false;
      // }
      //  this.newChild = { parent: data.resource_id, name: 'testtest' }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
    },
    addSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.newChild = {
            parent_id: this.treeAddNode.resource_id,
            chapter_name: this.formData.name,
            name: this.formData.name,
            node_type: 1,
            type_index: 0,
            course_id: _.get(this, 'query.course_id'),
          };
          if (!this.treeAddNode.children) {
            this.$set(this.treeAddNode, 'children', []);
          }
          this.treeAddNode.children.push(this.newChild);
          this.formData.name = '';
          this.typeVisible = false;
          this.saveTree();
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.formData.name = '';
      this.typeVisible = false;
    },
    renameNode(node, data) {
      this.typeVisible = true;
      this.treeEditNode = data;
      this.formData.name = data.name;
      this.backupName = data.name;
      this.addFlag = false;
      this.editFlag = true;
    },
    editSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.treeEditNode.chapter_name = this.formData.name;
          this.treeEditNode.name = this.formData.name;
          this.typeVisible = false;
          this.formData.name = '';
          this.saveTree();
        } else {
          return false;
        }
      });
    },
    deleteNode(node, data, done) {
      if (!node.isLeaf) {
        this.$message.error(this.$t('m.childNodeExistsAndCannotBeDeleted'));
        done(false);
        return false;
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(
        (d) => d.resource_id === data.resource_id,
      );
      children.splice(index, 1);
      this.saveTree();
      done(false);
    },
    saveTree(source) {
      // source 1 需要关掉编排弹窗
      const resource_id = _.get(this, 'query.course_id');
      this.$request
        .put(
          '/oj/admin/lessonconfig',
          { ...this.treeData[0], course_id: resource_id },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.$message({ type: 'success', message: this.$t('m.successful') });
          this.getLessonConfig();
          this.backupName = '';
          if (source === 1) {
            this.courseVisible = false;
          } else {
            this.courseVisible = true;
          }
        })
        .catch((error) => {
          if (this.backupName != '') {
            this.treeEditNode.chapter_name = this.backupName;
            this.treeEditNode.name = this.backupName;
          }
        });
    },
    close() {
      this.saveTree();
    },
    cancelTree() {
      this.courseVisible = false;
    },
    mouseenter(node, data) {
      this.$set(data, 'btnShow', true);
    },
    mouseleave(data) {
      this.$set(data, 'btnShow', false);
    },
    allowDrop(draggingNode, dropNode, type) {
      // return true;
      if (dropNode.data.node_type === this.$CONSTANT.COURSES.TREE_NODE.COURSE) {
        return type === 'inner';
      } else {
        return true;
      }
      // if (dropNode.data.node_type !== this.$CONSTANT.COURSES.TREE_NODE.CLASS) {
      //   // 不是 课时。是 章节或者 课程
      //   return type === 'inner';
      // } else if (
      //   dropNode.data.node_type === this.$CONSTANT.COURSES.TREE_NODE.CLASS
      // ) {
      //   // 课时
      //   return type !== 'inner';
      // }
    },
  },
};
</script>
<style scoped lang="scss">
.center {
  display: flex;
  justify-content: center;
}
::v-deep .el-input {
  width: 360px;
}
.treegroups {
  width: 100%;
}
</style>
<style scoped lang="scss">
.el-dialog {
  .dialog-table-grid {
    margin-top: 20px;
    .btn-groups {
      clear: both;
      text-align: center;
      margin-top: 10px;
      img {
        margin-right: 5px;
      }
    }
  }
}
.num {
  margin: 5px;
}
.nameStyle {
  display: inline-block;
  width: 290px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.ml {
  margin-left: 50px;
}
.mr5 {
  margin-right: 5px;
}
</style>
<style lang="scss">
.cb-arrage-tree .el-tree-node__content {
  position: relative;
  height: 40px;
  .right-btn-groups {
    position: absolute;
    left: 440px;
    top: -2px;
    line-height: 50px;
  }
}
</style>
