<template>
  <!-- 靶场内容 -->
  <cb-inner-page :background="false">
    <div class="referee-home page">
      <div class="header" v-if="false">
        <breadcrumb
          :breadcrumb="breadcrumbName"
          :breadcrumb-name="$t('m.redVsBlue')"
          :list-router="Router"
        />
      </div>
      <div class="content">
        <div class="top-nav">
          <div class="left-button-group">
            <cb-button-group>
              <cb-button @click="gotoDataVis" icon="icon-yanshi" hollow>
                {{ $t('m.dataVis') }}
              </cb-button>
              <cb-button @click="gotoDataScreen" icon="icon-tuopu" hollow>
                {{ $t('m.dtopology') }}
              </cb-button>
            </cb-button-group>
          </div>
          <cb-tabs v-model="tabActive" type="border-card" class="left-tabs">
            <cb-tab-pane name="靶场内容">
              <span slot="label" :title="$t('m.scenarioContent')">
                <span class="label-span">{{ $t('m.scenarioContent') }}</span>
              </span>
              <scenario-content
                v-if="tabActive === '靶场内容'"
                :cr-event-data="crEventData"
                :breadcrumb-name="breadcrumbName"
                @sendData="getData"
              />
            </cb-tab-pane>
            <cb-tab-pane name="探针管理">
              <span slot="label" :title="$t('m.probeManagement')">
                <span class="label-span">{{ $t('m.probeManagement') }}</span>
              </span>
              <!-- <probe-management
                v-if="tabActive === '探针管理'"
                :breadcrumb-name="breadcrumbName"
                :cr-event-data="crEventData"
              /> -->
              <probe-management
                v-if="tabActive === '探针管理'"
                :breadcrumb-name="breadcrumbName"
                :scene-id="sceneId"
              />
            </cb-tab-pane>
            <cb-tab-pane name="专家评估">
              <span slot="label" :title="$t('m.expertAssessment')">
                <span class="label-span">{{ $t('m.expertAssessment') }}</span>
              </span>
              <expert-assess
                v-if="tabActive === '专家评估'"
                :cr-event-data="crEventData"
              />
            </cb-tab-pane>
            <cb-tab-pane name="历史任务">
              <span slot="label" :title="$t('m.historyTask')">
                <span class="label-span">{{ $t('m.historyTask') }}</span>
              </span>
              <history-task
                v-if="tabActive === '历史任务'"
                :cr-event-data="crEventData"
              />
            </cb-tab-pane>
            <cb-tab-pane name="屏幕监控">
              <span slot="label" :title="$t('m.screenMonitoring')">
                <span class="label-span">{{ $t('m.screenMonitoring') }}</span>
              </span>
              <screen-monitor
                v-show="tabActive === '屏幕监控'"
                :cr-event-data="crEventData"
              />
            </cb-tab-pane>
            <cb-tab-pane name="主机信息">
              <span slot="label" :title="$t('m.hostInformation')">
                <span class="label-span">{{ $t('m.hostInformation') }}</span>
              </span>
              <host-info v-if="tabActive === '主机信息'" :scene-id="sceneId" />
            </cb-tab-pane>
            <cb-tab-pane name="人员评分">
              <span slot="label" :title="$t('red.staffScore')">
                <span class="label-span">{{ $t('red.staffScore') }}</span>
              </span>
              <staff-score
                v-if="tabActive === '人员评分'"
                :cr-event-data="crEventData"
              />
            </cb-tab-pane>
            <cb-tab-pane name="任务报告">
              <span slot="label" :title="$t('m.taskReport')">
                <span class="label-span">{{ $t('m.taskReport') }}</span>
              </span>
              <train-report
                v-if="tabActive === '任务报告'"
                :cr-event-data="crEventData"
              />
            </cb-tab-pane>
          </cb-tabs>
          <!-- <div class="right-btn cursor"> -->
          <!-- <div :class="[language === 'zh-CN' ? 'right-btn' : 'right-btn-en']">
            <cb-button @click="gotoDataVis" icon="icon-yanshi" type="text">
              {{ $t('m.dataVis') }}
            </cb-button>
          </div> -->
        </div>
      </div>
      <div class="char-box">
        <char-tool ref="charTool" />
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import ScenarioContent from '@/pages/web/RedVsBlue/Common/page/scenario_content.vue';
import ExpertAssess from '@/pages/web/RedVsBlue/Referee/expert_assess.vue';
import ProbeManagement from '@/pages/web/RangeTest/test-detail/test/host-collect.vue';
import HistoryTask from '@/pages/web/RedVsBlue/Referee/history_task.vue';
import ScreenMonitor from './screen_monitoring.vue';
import HostInfo from '@/pages/web/RangeTest/test-detail/test/host-info.vue';
import StaffScore from './staff-score.vue';
import TrainReport from './train-report.vue';
// import charTool from '@/components/ChatTools/index.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import { getLanguage, routerResolve } from '@cyber/helper';
export default {
  name: 'RefereeHome',
  components: {
    ScenarioContent,
    ExpertAssess,
    ProbeManagement,
    HistoryTask,
    ScreenMonitor,
    HostInfo,
    StaffScore,
    TrainReport,
    // charTool,
  },
  data() {
    return {
      language: getLanguage(),
      resource_id: this.$route.params && this.$route.params.resource_id,
      breadcrumbName: '',
      Router: '/red_vs_blue',
      crEventData: {},
      tabActive: '靶场内容',
      role_group: '',
      sceneId: '',
    };
  },
  watch: {
    tabActive: {
      handler: function (val, oldval) {
        if (val !== oldval) {
          if (val === '主机信息' || val === '探针管理') {
            /* 主机信息时需要场景id传给中台接口，TODO: 是否要区分角色，基线没有区分*/
            this.$request
              .get(
                '/cr/red_vs_blue/scene/',
                { room_id: this.resource_id },
                { baseURL: '/api/ojj' },
              )
              .then((res) => {
                // 场景id
                // 接口返回场景sceneId(mp_scene_id)
                this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
                //返回topo_id
                this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
                if (!res?.data?.data.scene_data) {
                  this.$message({
                    message: this.$t('m.instanceNotStarted'),
                    type: 'error',
                  });
                }
              });
          }
        }
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  mounted() {
    // 裁判角色登录查询单个
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    if (this.resource_id) {
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.screenName = res.data.data.name;
          this.crEventData = res.data;
          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);
          this.role_group = res.data.data.role_permission.role_group;
        });
    }
  },
  beforeDestroy() {
    this.$refs.charTool.setConfig(false);
  },
  methods: {
    // 获取sendData
    getData(data1, data2) {
      this.sceneId = data1;
      this.topo_id = data2;
    },

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
    // 裁判跳转3D态势
    gotoDataScreen() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      // window.open(path, '_blank');
      if (this.topo_id) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&topo_id=${this.topo_id}`,
          '_blank',
        );
      } else if (this.sceneId) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&scene_id=${this.sceneId}`,
          '_blank',
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.left-button-group {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  left: 300px;
  right: 2px;
  z-index: 1;
}
.referee-home {
  .header {
    width: 100%;
  }
  .content {
    width: 100%;
    height: 100%;
    .top-nav {
      width: 100%;
      height: 100%;
      position: relative;
      .left-tabs {
        width: 100%;
        height: 100%;
      }
      .right-btn {
        position: absolute;
        width: 120px;
        height: 24px;
        top: 2px;
        left: 1270px;

        .sky-blue {
          display: flex;
        }
      }
      .right-btn-en {
        position: absolute;
        width: 120px;
        height: 24px;
        top: 2px;
        left: 1290px;
      }
    }
    .content-main {
      width: 100%;
      border-radius: 0 2px 2px 2px;
    }
  }

  ::v-deep {
    .el-tabs {
      height: 100%;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 40px);
    }
    .el-tabs__item {
      min-width: 158px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      text-align: center;
    }
  }
}
</style>
