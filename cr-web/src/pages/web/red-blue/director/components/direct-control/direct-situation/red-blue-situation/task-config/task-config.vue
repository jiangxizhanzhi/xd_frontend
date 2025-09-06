<template>
  <div class="team-info">
    <!-- 任务导调配置页面 -->
    <cb-tabs v-model="activeName">
      <!-- {{currentRoles}} -->
      <cb-tab-pane
        :key="item.role_name"
        v-for="item in currentRoles"
        :label="item.role_name"
        :name="item.role_name"
      >
        <!-- 角色资产任务方案数据 -->
        <config-details
          :assetData="item"
          @refreshList="refreshList"
          :controlSceneId="controlSceneId"
          :controlTopoId="controlTopoId"
          @taskType="taskType"
          @taskTop="taskTop"
          @taskTime="taskTime"
        ></config-details>
      </cb-tab-pane>
    </cb-tabs>
  </div>
</template>

<script>
import ConfigDetails from './config-details.vue';
import { getTaskListApi } from '@/api/web/team-training';

export default {
  props: {
    // 接收场景启动场景id
    controlSceneId: {
      type: String,
      default: '',
    },
    // 接收场景未启动拓扑id
    controlTopoId: {
      type: String,
      default: '',
    },
  },
  components: {
    ConfigDetails,
  },
  data() {
    return {
      activeName: '',
      currentRoles: [],
    };
  },
  created() {
    this.resource_id = this.$route.params.resource_id;
  },
  mounted() {
    this.getData(true);
  },
  methods: {
    // 获取任务导调配置列表
    getData(flag) {
      getTaskListApi({
        room_id: this.resource_id,
        business_type: 4, //红蓝
      }).then((res) => {
        this.currentRoles = res.data.data;
        if (flag) {
          this.activeName = this.currentRoles[0]?.role_name;
        }
      });
    },
    // 更新列表
    refreshList(data) {
      if (data) {
        this.getData(false);
      }
    },

    taskType(data) {
      if (data) {
        this.$emit('taskTypes', true);
      }
    },
    taskTop(data) {
      if (data) {
        this.$emit('TaskTops', true);
      }
    },
    taskTime(data) {
      if (data) {
        this.$emit('TaskTimes');
      }
    },
  },
  watch: {
    activeName: {
      handler(nv, ov) {
        this.activeName = nv;
      },
    },
  },
};
</script>

<style scoped lang="scss">
.team-info {
  width: 100%;
  height: 100%;
}
</style>
