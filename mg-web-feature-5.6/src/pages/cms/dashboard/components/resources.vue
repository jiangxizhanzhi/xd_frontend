<template>
  <div class="resources">
    <!-- 用户总数管理 -->
    <div class="piediv">
      <userStatisticsChart
        v-if="readyUser"
        :list="newList"
      ></userStatisticsChart>
    </div>
    <!-- Target type statistics 靶标类型统计 -->
    <div class="piediv">
      <target-summary
        v-if="ready"
        :targetSummary="target_summary"
      ></target-summary>
    </div>
    <!-- Scene statistics 场景统计 -->
    <div class="piediv">
      <resources-scene
        v-if="ready"
        :sceneSummary="scene_summary"
      ></resources-scene>
    </div>
  </div>
</template>

<script>
import ResourcesScene from './resources-scene.vue';
import TargetSummary from './target-summary.vue';
// import VirtualTargetSummary from './virtual-target-summary.vue';
// import PhysicalTarget from './physical-target.vue';
import userStatisticsChart from './user-statistics-chart.vue';

export default {
  name: 'line2',
  data() {
    return {
      ready: false,
      readyUser: false,
      scene_summary: {},
      target_summary: {},
      virtual_target_summary: {},
      physical_target: {},
      newList: [],
    };
  },
  created() {
    this.$request
      .get('/agg/dashboard/resource_statistics', null, {
        baseURL: '/api/mp',
      })
      .then((res) => {
        const allData = res.data.data || {};
        this.scene_summary = allData.scene_statics;
        this.target_summary = allData.target_statics
          ? allData.target_statics.all
          : [];
        this.virtual_target_summary = allData.target_statics
          ? allData.target_statics.virtual
          : [];
        this.physical_target = allData.target_statics
          ? allData.target_statics.entity
          : [];
        this.ready = true;
      });
    this.getUserRolesStatistics();
  },
  methods: {
    // 获取数据
    getUserRolesStatistics() {
      this.$request
        .get('/auth/user_roles/statistics', undefined, { baseURL: '/api/mp' })
        .then((res) => {
          const list = res.data.data.list;
          let listTopFive = [];
          let sixAfterTotal = 0;
          if (Array.isArray(list) && list.length > 4) {
            list.forEach((element, index) => {
              if (index < 3) {
                listTopFive.push({
                  name: element.role_name,
                  value: Number(element.user_cnt),
                });
              } else {
                sixAfterTotal = sixAfterTotal + element.user_cnt;
              }
            });
            listTopFive.push({
              name: this.$t('dashboard.otherUser'),
              value: sixAfterTotal,
            });
          } else {
            listTopFive = list.map((item) => {
              return {
                name: item.role_name,
                value: Number(item.user_cnt),
              };
            });
          }
          this.newList = listTopFive;
          this.readyUser = true;
        });
    },
  },
  components: {
    ResourcesScene,
    TargetSummary,
    userStatisticsChart,
  },
};
</script>
<style lang="scss" scoped>
.resources {
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  .piediv {
    flex: 1;
  }
}
</style>
