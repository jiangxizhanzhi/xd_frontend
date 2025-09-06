<template>
  <div class="environment-direct el-tabs__content">
    <keep-alive>
      <topology-monitor
        :cr-event-data="crEventData"
        :breadcrumb-name="breadcrumbName"
        @sendData="sendData"
      ></topology-monitor>
    </keep-alive>
  </div>
</template>

<script>
import { getEditBack } from '@/api/web/red-blue';
import topologyMonitor from '@/pages/web/red-blue/admin/components/topology-monitor.vue';
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
    if (this.resource_id) {
      this.getTrainDetail();
    }
  },
  mounted() {},
  methods: {
    getTrainDetail() {
      getEditBack({ resource_id: this.resource_id }).then((res) => {
        this.screenName = res.data.data.name;
        this.crEventData = res.data;
        this.breadcrumbName = res.data.data.name;
        this.role_group = res.data.data.role_permission.role_group;
      });
    },
    sendData(data1, data2, data3) {
      this.$emit('sendData', data1, data2, data3);
    },
  },
};
</script>
<style lang="scss" scoped>
.environment-direct {
  width: 100%;
  height: 100%;
}
</style>
