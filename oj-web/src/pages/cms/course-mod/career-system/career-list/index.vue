<template>
  <cb-inner-page :background="false">
    <div ref="page" class="page-content">
      <career-tree
        :url="treeUrl"
        :tree-height="treeHeight"
        :default-props="defaultProps"
        @tableUpdate="tableUpdate"
        @tableUpdateRefresh="tableUpdateRefresh"
      ></career-tree>
      <cb-search-table
        :scroll="{ y: 560 }"
        :cols="cols"
        :selector="selector"
        :selection.sync="selection"
        :url="roleUrl"
        :baseURL="baseURL"
        :data.sync="model"
        ref="tableRef"
        :searchBarBg="true"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="add"></cb-button>
          <cb-button
            button-type="delete"
            hollow
            @click="deleteSelected(selection, $event)"
            :disabled="selection.length === 0"
          ></cb-button>
        </template>
        <template v-slot:knowledge_course_count="scope">
          <span class="course-link" @click="courseArrange(scope.data, 1)">
            <cb-iconfont type="icon-lianjie"></cb-iconfont>
            <span>{{ scope.data.knowledge_course_count }}</span>
          </span>
        </template>
        <template v-slot:skill_task_count="scope">
          <span class="course-link" @click="taskArrange(scope.data, 1)">
            <cb-iconfont type="icon-lianjie"></cb-iconfont>
            <span>{{ scope.data.skill_mission_count }}</span>
          </span>
        </template>

        <template v-slot:searchRightArea>
          <cb-button
            icon="icon-gangweizhizeku"
            color-type="hollow"
            link-name="job-database-list"
            >{{ $t('careerSystem.jobResponsibilityLibrary') }}</cb-button
          >
          <cb-button
            icon="icon-zhishidianku"
            color-type="hollow"
            link-name="knowledge-database-list"
            >{{ $t('careerSystem.knowledgeLibrary') }}</cb-button
          >
          <cb-button
            icon="icon-jineng"
            color-type="hollow"
            link-name="skill-database-list"
            >{{ $t('careerSystem.skillLibrary') }}</cb-button
          >
        </template>
        <template v-slot:filter>
          <cb-search-input
            v-model="model.keyword"
            :placeholder="$t('careerSystem.enterJobName')"
          ></cb-search-input>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            @click="editRow(scope.data)"
            type="text"
            button-type="edit"
            mr
          ></cb-button>
        </template>
      </cb-search-table>
    </div>
    <course-arrange :job-data="jobData" ref="courseArrange"></course-arrange>
    <task-arrange :job-data="taskData" ref="taskArrange"></task-arrange>
  </cb-inner-page>
</template>

<script>
import CareerTree from '../components/CareerTree.vue';
import CourseArrange from '../components/CourseArrange.vue';
import TaskArrange from '../components/task-arrange.vue';
import { deleteCareerSystemData } from '@/api/career-framework';
export default {
  name: 'ProfessionSystem',
  components: {
    CareerTree,
    CourseArrange,
    TaskArrange,
  },
  data() {
    return {
      roleUrl: '',
      baseURL: '/api/ojj',
      treeUrl: '/rtks/frame/tree',
      treeHeight: 'auto',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      model: {
        keyword: '',
        frameId: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('careerSystem.jobName'),
          prop: 'name',
        },
        {
          label: this.$t('careerSystem.positionHierarchy'),
          prop: 'level_name',
          width: 350,
        },
        {
          label: this.$t('careerSystem.jobResponsibilities'),
          prop: 'task_count',
        },
        {
          label: this.$t('careerSystem.knowledgePoints'),
          prop: 'knowledge_count',
        },

        {
          label: this.$t('careerSystem.basicCourses'),
          slot: 'knowledge_course_count',
        },
        {
          label: this.$t('careerSystem.skills'),
          prop: 'skill_count',
        },
        {
          label: this.$t('careerSystem.tasks'),
          slot: 'skill_task_count',
        },
        {
          label: this.$t('careerSystem.operate'),
          slot: 'operate',
          width: 100,
        },
      ],
      jobData: {},
      taskData: {},
    };
  },
  mounted() {
    this.treeHeight = `${this.$refs.page.offsetHeight - 122}px`;
  },
  methods: {
    // 刷新图表
    tableUpdateRefresh() {
      this.selection = [];
      this.$refs.tableRef.reload();
    },
    // 删除
    deleteSelected(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      deleteCareerSystemData({ ids })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.tableRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },

    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        path: '/admin/course-mod/career-system/career-edit',
        query: {
          id: resource_id,
          frameWorkId: this.model.frameId,
        },
      });
    },
    add() {
      this.$router.push({
        path: '/admin/course-mod/career-system/career-add',
        query: {
          frameWorkId: this.model.frameId,
        },
      });
    },

    // 课程列点击
    courseArrange(rowData, type) {
      const { resource_id, name } = rowData;
      let passedData = {
        resource_id,
        name,
        type,
      };
      this.jobData = passedData;
      this.$refs.courseArrange.arrangeDialogTrigger = true;
    },
    // 任务数列点击
    taskArrange(rowData, type) {
      const { resource_id, name } = rowData;
      let passedData = {
        resource_id,
        name,
        type,
      };
      this.taskData = passedData;
      this.$refs.taskArrange.arrangeDialogTrigger = true;
    },

    // 岗位列表刷新
    tableUpdate(value) {
      this.roleUrl = '/rtks/role/list';
      this.model.frameId = value;
    },
  },
};
</script>

<style scoped lang="scss">
.page-content {
  display: flex;
  height: 100%;
}
.course-link {
  cursor: pointer;

  span {
    color: var(--font-color-fourth);
  }
}
</style>
