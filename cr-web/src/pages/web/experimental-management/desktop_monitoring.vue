<template>
  <div class="desktop-monitoring">
    <!-- TODO: 暂无角色 -->
    <cb-select
      v-if="usersMonitorList.length"
      v-model="screenLink"
      :options="usersMonitorList"
      titleField="node_name"
      valueField="monitor_url"
      style="margin-top: 1px"
    ></cb-select>
    <iframe id="cur_scene" v-if="screenLink" :src="screenLink" />
    <div v-if="!usersMonitorList.length && !loading" class="empty-comp">
      <empty-page ref="emptyComp" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
export default {
  name: 'DesktopMonitoring',
  components: {
    emptyPage,
  },
  props: {
    studentId: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      usersMonitorList: [],
      resource_id: this.$route.params.resource_id,
      screenLink: '',
      loading: false,
    };
  },
  watch: {
    studentId: {
      handler: function (val, oldval) {
        if (val !== oldval) {
          if (val) {
            this.getUsersMonitor(val);
          }
        }
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  mounted() {
    // this.getUsersMonitor()
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  methods: {
    getTitle(id, list) {
      let name = '';
      let nameArray = [];
      _.each(list, (item) => {
        nameArray = _.filter(item.data, function (ele) {
          return ele.monitor_url === id;
        });
      });
      nameArray.length > 0
        ? (name = `${nameArray[0].server} | ${nameArray[0].protocol}`)
        : (name = '');
      return name;
    },
    // 获取用户屏幕监控
    getUsersMonitor(val) {
      this.loading = true;
      const user_id = val;
      //综合演训桌面监控
      this.$request
        .get(
          '/cr/training_team/training_team_teacher/sessions',
          { room_id: this.resource_id, student_id: user_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          if (res.data.data.length) {
            this.usersMonitorList = res.data.data;
            this.screenLink = res.data.data[0].monitor_url;
          } else {
            this.usersMonitorList = [];
            this.screenLink = '';
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.desktop-monitoring {
  width: 100%;
  height: 100%;
  #cur_scene {
    width: 100%;
    height: calc(100% - 40px);
    box-sizing: border-box;
  }
  .empty-comp {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
