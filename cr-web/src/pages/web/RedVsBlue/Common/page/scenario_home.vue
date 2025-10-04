<template>
  <cb-inner-page :background="false">
    <div class="scenario-home page">
      <div class="content">
        <div class="header clearfix">
          <cb-button
            v-if="showEdit"
            @click="editInstance"
            button-type="edit"
            icon="icon-edit"
            hollow
            style="margin-right: 4px"
          >
            {{ $t('m.editCyber') }}
          </cb-button>
          <cb-button
            button-type="delete"
            icon="icon-shanchu"
            @click="deleteCrEvent($event)"
            hollow
          >
            {{ $t('m.deleteCyber') }}
          </cb-button>
        </div>
        <cb-tabs v-model="tabActive" type="border-card">
          <cb-tab-pane name="拓扑监控">
            <span slot="label" :title="$t('m.topologyMonitoring')">
              <span>{{ $t('m.topologyMonitoring') }}</span>
            </span>
            <scenario-content
              v-if="tabActive === '拓扑监控'"
              :cr-event-data="crEventData"
              :breadcrumb-name="breadcrumbName"
            />
          </cb-tab-pane>
        </cb-tabs>
      </div>
      <div class="char-box">
        <ChatTool ref="charTool" />
      </div>
      <cb-dialog
        width="68.13%"
        height="500px"
        style="padding: 0 50px"
        :title="$t('m.editCyber')"
        :visible.sync="dialogEditVisible"
        append-to-body
      >
        <edit-content
          ref="editContent"
          :cr-event-data="crEventData"
          @closed="closed"
          @sendVal="getChildComVal"
          @sendVals="getChildComVals"
          @checkValue="getNewCheckValue"
          @checksValue="getNewChecksValue"
        />
        <span slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" mr @click="saveUpdate()">{{
            $t('m.ensure')
          }}</cb-button>
          <cb-button button-type="cancel" @click="dialogEditVisible = false">{{
            $t('m.cancel')
          }}</cb-button>
        </span>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>
<script>
import ScenarioContent from '@/pages/web/RedVsBlue/Common/page/scenario_content.vue';
import EditContent from '@/pages/web/RedVsBlue/Common/activitylist/edit.vue';
// import ChatTool from '@/components/ChatTools/index.vue';
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';

export default {
  components: {
    // ChatTool,
    ScenarioContent,
    EditContent,
  },
  data() {
    return {
      isCheck: '',
      isCheckValue: '',
      isChecks: '',
      isChecksValue: '',
      resource_id: '',
      breadcrumbName: '',
      crEventData: {},
      dialogEditVisible: false,
      tabActive: '拓扑监控',
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
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    //红蓝对抗查询单个
    if (this.resource_id) {
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventData = res.data;
          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);
        });
    }
  },
  beforeDestroy() {
    // this.$refs.charTool.setConfig(false);
  },
  methods: {
    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComVals(val) {
      this.isChecks = val;
    },
    getNewCheckValue(val) {
      this.isCheckValue = val;
    },
    getNewChecksValue(val) {
      this.isChecksValue = val;
    },
    closed() {
      this.dialogEditVisible = false;
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
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
      // this.dialogEditVisible = true;
    },
    deleteCrEvent(done) {
      // 红蓝管理员删除靶场
      const resource_id = this.$route.params.resource_id;
      this.$request
        .delete(
          '/cr/red_vs_blue/red_vs_blue/',
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          done();
          this.$router.push('/red_vs_blue');
        })
        .catch((res) => {
          done(false);
        });
      // .finally(done);
    },
    saveUpdate() {
      if (!this.isCheck || !this.isChecks) {
        if (this.isCheckValue) {
          return this.$message.error(this.isCheckValue);
        } else {
          return this.$message.error(this.isChecksValue);
        }
      }
      this.$refs.editContent.submitForm();
    },
  },
};
</script>
<style lang="scss" scoped>
.scenario-home {
  height: inherit;
  ::v-deep .elc-scene-loader-container {
    border-radius: 2px !important;
    .mask {
      border-radius: 2px !important;
    }
  }
  .header {
    height: 40px;
    margin-bottom: 10px;
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    right: 0px;
    left: 100px;
    z-index: 1;

    .btn,
    .btn2 {
      cursor: pointer;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin-right: 4px;
      }
    }
    .btn2 {
      right: 100px;
    }
    .btn-en {
      right: 130px;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
  }
}
.edit-dialog {
  ::v-deep .el-dialog {
    margin: 0 auto !important;
    margin-top: 70px !important;
  }
}
::v-deep {
  .el-tab-pane,
  .el-tabs,
  .cb-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 39px);
  }
}
</style>
