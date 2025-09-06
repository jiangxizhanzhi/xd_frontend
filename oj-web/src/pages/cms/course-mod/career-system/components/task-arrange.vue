<template>
  <cb-dialog
    width="600px"
    height="500px"
    :title="$t('careerSystem.taskArrange')"
    center
    :visible.sync="arrangeDialogTrigger"
    @close="courseTreeData = []"
  >
    <cb-tree
      class="course-tree"
      :data="courseTreeData"
      node-key="resource_id"
      :props="defaultCourseProps"
      default-expand-all
      draggable
      :allow-drop="allowDrop"
    >
      <span class="node-customized" slot-scope="{ node }">
        <cb-iconfont
          v-if="node.level === 1"
          themedColor="font-color-primary"
          type="icon-wenjianjia"
        ></cb-iconfont>
        <cb-iconfont
          v-if="node.level === 2"
          themedColor="font-color-primary"
          type="icon-kecheng"
        ></cb-iconfont>
        <span :title="node.label">{{ node.label }}</span>
      </span>
    </cb-tree>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button button-type="confirm" @click="saveCourseTree()">{{
          $t('careerSystem.save')
        }}</cb-button>
        <cb-button
          button-type="cancel"
          @click="
            courseTreeData = [];
            arrangeDialogTrigger = false;
          "
        ></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import { getTaskList, arrangeTask } from '@/api/career-framework';
import _ from 'lodash';
export default {
  name: 'CourseArrange',
  props: {
    jobData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      arrangeDialogTrigger: false,
      courseTreeData: [],
      defaultCourseProps: {
        children: 'children',
        label: 'name',
      },
      type: 1,
      resource_id: '',
      field: '',
      jobItemData: this.jobData,
      title: '',
    };
  },
  watch: {
    jobData: {
      handler(val) {
        if (val) {
          this.jobDataDetail(val);
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    // 获取任务信息
    jobDataDetail(data) {
      const { resource_id, name, type } = data;
      this.type = type;
      this.resource_id = resource_id;
      getTaskList({ resource_id }).then((res) => {
        this.courseTreeData = [];
        let data = _.get(res, 'data.data', []);
        _.forEach(data, (item) => {
          this.$set(item, 'name', item.title);
        });
        let treeObj = {
          resource_id,
          name,
          children: [...data],
        };
        this.courseTreeData.push(treeObj);
      });
    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.level === 1) {
        return false;
      } else if (dropNode.level === 2) {
        return type !== 'inner';
      } else {
        return true;
      }
    },

    saveCourseTree() {
      let childrenList = this.courseTreeData[0]
          ? this.courseTreeData[0].children
          : [],
        mission_ids = [];
      childrenList.forEach((item) => {
        mission_ids.push(item.resource_id);
      });
      const params = {
        mission_ids,
        role_id: this.resource_id,
      };
      arrangeTask(params).then((res) => {
        this.courseTreeData = [];
        this.arrangeDialogTrigger = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.course-tree {
  ::v-deep .el-tree-node__content {
    height: 32px;
  }
}
</style>
