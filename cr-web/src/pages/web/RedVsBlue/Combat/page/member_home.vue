<template>
  <cb-inner-page :background="false">
    <div class="member-home page">
      <div class="content">
        <!-- <div class="content-main"> -->
        <cb-tabs v-model="tabActive" type="border-card">
          <cb-tab-pane name="拓扑监控">
            <span slot="label" :title="$t('m.topologyMonitoring')">
              <span>{{ $t('m.topologyMonitoring') }}</span>
            </span>
            <access-center-member
              v-if="tabActive === '拓扑监控'"
              :runningStatus="runningStatus"
              :cr-event-data="crEventData"
              :breadcrumbName="breadcrumbName"
            />
          </cb-tab-pane>
        </cb-tabs>
        <div class="right-btn">
          <cb-button @click="gotoDataVis" icon="icon-yanshi" type="text">
            {{ $t('m.dataVis') }}
          </cb-button>
        </div>
        <!-- </div> -->
      </div>
      <div class="char-box">
        <char-tool ref="charTool" />
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import AccessCenterMember from '@/pages/web/RedVsBlue/Combat/page/access_center_member.vue';
// import charTool from '@/components/ChatTools/index.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import { routerResolve } from '@cyber/helper';
export default {
  name: 'MemberHome',
  components: {
    AccessCenterMember,
    // charTool,
  },
  data() {
    return {
      resource_id: '',
      breadcrumbName: '',
      Router: '/red_vs_blue',
      crEventData: {},
      tabActive: '学员对抗',
      role_group: '',
      runningStatus: undefined, //
      tabActive: '拓扑监控',
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    if (this.resource_id) {
      //学员登录的单个查询
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventData = res.data;
          this.runningStatus = res.data.data.training_status;
          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);
          this.role_group = res.data.data.role_permission.role_group;
        });
    }
  },
  mounted() {},
  beforeDestroy() {
    this.$refs.charTool.setConfig(false);
  },
  methods: {
    gotoDataVis() {
      let toPath = '';
      if (parseInt(this.role_group) === 2 || parseInt(this.role_group) === 3) {
        toPath =
          '/data-display/battle/' + this.resource_id + '/' + this.role_group;
      }

      if (parseInt(this.role_group) === 4) {
        toPath =
          '/data-display/red-grade/' + this.resource_id + '/' + this.role_group;
      }

      if (parseInt(this.role_group) === 5) {
        toPath =
          '/data-display/blue-grade/' +
          this.resource_id +
          '/' +
          this.role_group;
      }
      const { href } = routerResolve({
        path: toPath,
      });
      window.open(href, '_blank');

      // const routeData = this.$router.resolve({
      //   path: toPath,
      // });
      // window.open(routeData.href, '_blank');
    },
  },
};
</script>

<style scoped lang="scss">
.member-home {
  ::v-deep {
    .el-tab-pane,
    .el-tabs,
    .cb-tabs {
      height: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 40px);
    }
  }
  .header {
    width: 100%;
    position: relative;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .content {
    width: 100%;
    height: calc(100% - 20px);
    position: relative;

    .right-btn {
      position: absolute;
      left: 110px;
      top: 2px;
    }
    .content-main {
      width: 100%;
      height: calc(100% - 20px);
      border-radius: 2px;
    }
  }
}
</style>
