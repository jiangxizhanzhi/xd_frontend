<template>
  <!-- 团队教员环境导调 -->
  <div class="environment-pilot">
    <div class="el-tabs__content">
      <keep-alive>
        <topology-monitor
          :cr-event-data="crEventData"
          :breadcrumb-name="breadcrumbName"
          @sceneId="sceneId"
          @topoId="topoId"
          @sendData="getData"
        ></topology-monitor>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import topologyMonitor from './topology-monitor.vue'; //中间拓扑
export default {
  components: {
    topologyMonitor,
  },
  props: {},
  data() {
    return {
      resource_id: '',
      breadcrumbName: '',
      crEventData: {},
      role_group: '',
    };
  },
  watch: {},
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {},
  methods: {
    sceneId(data) {
      this.$emit('sceneId', data);
    },
    topoId(data) {
      this.$emit('topoId', data);
    },
    getData(hasLayer) {},
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tab-pane,
  .el-tabs,
  .cb-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 50px);
  }
}
.environment-pilot {
  width: 100%;
  height: 100%;
}
</style>
