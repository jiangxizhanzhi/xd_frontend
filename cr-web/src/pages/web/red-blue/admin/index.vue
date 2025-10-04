<template>
  <div class="admin-home lay-com">
    <div class="header">
      <train-top-title
        :detail-title="detailTitle"
        @back="backHome"
        :isEnd="isEnd"
      ></train-top-title>
      <div class="header-right">
        <cb-button
          v-if="showEdit"
          @click="editInstance"
          button-type="edit"
          icon="icon-edit"
          hollow
          style="margin-right: 4px"
        >
          {{ $t('admin.editTraining') }}
        </cb-button>
        <cb-button icon="icon-shanchu" @click="deleteCrEvent($event)" hollow>
          {{ $t('admin.deleteTraining') }}
        </cb-button>
      </div>
    </div>
    <div class="content">
      <div class="nav-wrap">
        <cb-radio-group v-model="tabActive" class="radio-btn" size="small">
          <cb-radio-button
            :label="$t('m.topologyMonitoring')"
          ></cb-radio-button>
          <cb-radio-button :label="$t('m.screenMonitoring')"></cb-radio-button>
        </cb-radio-group>
      </div>
      <div class="train-wrap el-tabs__content">
        <topology-monitor
          v-if="tabActive === $t('m.topologyMonitoring')"
          :cr-event-data="crEventData"
          :breadcrumb-name="breadcrumbName"
        >
        </topology-monitor>
        <screen-monitor
          v-show="tabActive === $t('m.screenMonitoring')"
        ></screen-monitor>
      </div>
    </div>
    <div class="char-box">
      <ChatTool ref="charTool" />
    </div>
    <Notice
      ref="noticeRef"
      type="red"
      :resourceId="resource_id"
      :role="roleGroup"
    />
  </div>
</template>

<script>
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import { getEditBack, deleteTraining } from '@/api/web/red-blue';
import topologyMonitor from '@/pages/web/red-blue/admin/components/topology-monitor.vue';
import screenMonitor from '@/pages/web/red-blue/admin/components/screen-monitor.vue';
import EditContent from '@/pages/web/RedVsBlue/Common/activitylist/edit.vue';
// import ChatTool from '@/components/ChatTools/index.vue';
import Notice from '@/pages/web/notice/index.vue';
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
import { getSysSettings } from '@cyber/helper';
import { getCurrentModuleByRouterName } from '../../../../utils';

export default {
  components: {
    // ChatTool,
    topologyMonitor,
    screenMonitor,
    EditContent,
    TrainTopTitle,
    Notice,
  },
  data() {
    return {
      isEnd: false, //已结束展示结束标记
      resource_id: '',
      breadcrumbName: '',
      crEventData: {},
      tabActive: this.$t('m.topologyMonitoring'),
      // tabActive: this.$t('m.screenMonitoring'),
      detailTitle: '',
    };
  },
  computed: {
    showEdit() {
      const runningStatus = _.get(this, 'crEventData.data.training_status');
      if (runningStatus === 4) {
        return true;
      }
      return false;
    },
    roleGroup() {
      return _.get(this.crEventData, 'data.role_permission.role_group');
    },
  },
  async created() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    //红蓝对抗查询单个
    if (this.resource_id) {
      getEditBack({ resource_id: this.resource_id }).then(async (res) => {
        this.crEventData = res.data;
        if (this.crEventData.data.training_status === 0) {
          this.isEnd = true;
        }
        this.breadcrumbName = res.data.data.name;
        setBreadcrumbTitle(this.breadcrumbName);
        this.detailTitle =
          (await getCurrentModuleByRouterName('red-vs-blue')) +
          '-' +
          this.breadcrumbName;
      });
    }
  },
  beforeDestroy() {
    // this.$refs.charTool.setConfig(false);
  },
  methods: {
    backHome() {
      this.$router.go(-1);
    },
    closed() {
      getEditBack({ resource_id: this.resource_id }).then((res) => {
        this.crEventData = res.data;
        this.breadcrumbName = res.data.data.name;
      });
    },
    editInstance() {
      this.$router.push({
        name: 'red-blue-edit',
        params: {
          id: this.resource_id,
        },
      });
    },
    deleteCrEvent(done) {
      // 红蓝管理员删除靶场
      const resource_id = this.$route.params.resource_id;
      this.$confirm(this.$t('common.confirmDelete') + '?').then(() => {
        deleteTraining({ room_id: this.resource_id })
          .then((res) => {
            done();
            this.backHome();
            // this.$router.push('/red_vs_blue');
          })
          .catch((res) => {
            done(false);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-home {
  width: 100%;
  height: 100vh;
  position: relative;
  .header {
    height: 56px;
    line-height: 56px;
    position: relative;
    .header-right {
      position: absolute;
      right: 16px;
      top: 0px;
      z-index: 2;
    }
  }
  .content {
    height: calc(100% - 56px);
    padding: 0 40px 16px 40px;
    .nav-wrap {
      height: 56px;
      line-height: 56px;
      text-align: center;
      ::v-deep .radio-btn {
        .el-radio-button {
          .el-radio-button__inner {
            &:hover {
              color: var(--primary-color);
            }
          }
        }
      }
    }
    .train-wrap {
      height: calc(100% - 56px);
    }
  }
  .fix-box {
    position: fixed;
    right: 0;
    background: red;
    width: 40px;
    height: 200px;
  }
}
</style>
