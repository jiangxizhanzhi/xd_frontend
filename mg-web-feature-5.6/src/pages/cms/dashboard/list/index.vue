<template>
  <cb-inner-page :background="false">
    <div class="dashboard-wrapper">
      <div class="wrapper">
        <div class="top-wrapper">
          <div class="top-wrapper-left">
            <div class="resources-wrapper">
              <Block :title="$t('dashboard.resourceStatistics')">
                <resources></resources>
              </Block>
            </div>
            <div class="daily-user">
              <Block :mb="false" :title="$t('dashboard.activeDataChart')">
                <daily-user-activity></daily-user-activity>
              </Block>
            </div>
          </div>
          <div class="top-wrapper-right div-margin-left">
            <Block :title="$t('dashboard.dynamic')" :mb="false">
              <dynamic-news></dynamic-news>
            </Block>
          </div>
        </div>
        <div class="middle-wrapper">
          <Block :title="$t('dashboard.userOnlineHistory')">
            <online-user-monitor></online-user-monitor>
          </Block>
        </div>
        <div class="middle-bottom-wrapper">
          <div class="contain-recent-news">
            <div class="recent-news">
              <system-application></system-application>
            </div>
            <div class="recent-news-bottom">
              <Block :title="$t('dashboard.clusterOperationDiagram')">
                <system-line-chart></system-line-chart>
              </Block>
            </div>
          </div>
        </div>
        <div class="wrapper-bottom">
          <Block :title="$t('dashboard.title')">
            <slot slot="little-title">{{ $t('dashboard.onlyResource') }}</slot>
            <node-management></node-management>
          </Block>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Block from '@/components/block';
import SystemLineChart from '../components/system-line-chart.vue';
import DynamicNews from '../components/dynamic-news.vue';
import OnlineUserMonitor from '../components/online-user-monitor.vue';
import NodeManagement from '../components/node-management.vue';
import Resources from '../components/resources.vue';
import UserStatistics from '../components/user-statistics.vue';
import SystemApplication from '../components/system-application.vue';
import DailyUserActivity from '../components/daily-user-activity.vue';
export default {
  components: {
    Block,
    SystemLineChart,
    DynamicNews,
    OnlineUserMonitor,
    NodeManagement,
    Resources,
    UserStatistics,
    SystemApplication,
    DailyUserActivity,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import '@/style/dashboard/list/index.scss';
.dashboard-wrapper {
  display: flex;
  .div-margin-left {
    padding: 16px;
    height: 100%;
  }
  .wrapper {
    width: calc(100% - 16px);
    margin-right: 16px;
    .top-wrapper {
      height: 552px;
      margin-bottom: 16px;
      display: flex;
      .top-wrapper-left {
        width: 73%;
        height: 100%;
        margin-right: 16px;
        .resources-wrapper {
          padding: 16px;
          height: 240px;
          box-sizing: border-box;
          margin-bottom: 16px;
        }
        .daily-user {
          padding: 16px;
          height: 296px;
          box-sizing: border-box;
        }
      }
      .top-wrapper-right {
        width: calc(27% - 16px);
      }
    }
    .middle-wrapper {
      margin-top: 16px;
      margin-bottom: 16px;
      padding: 16px;
    }
    .wrapper-bottom {
      margin-top: 16px;
      padding: 16px;
    }
    .left-bottom-wrapper {
      height: 325px;
      display: flex;
      .recent-news {
        width: 70%;
        margin-right: 16px;
        padding: 16px;
      }
      .content-tab {
        flex: 1;
        width: calc(30% - 16px);
      }
    }
    .middle-bottom-wrapper {
      height: 297px;
      display: flex;
      .contain-recent-news {
        height: 100%;
        width: 100%;
        display: flex;
      }
      .recent-news {
        height: 100%;
        padding: 16px;
        margin-right: 16px;
        width: calc(50% - 8px);
      }
      .recent-news-bottom {
        height: 100%;
        width: calc(50% - 8px);
        // margin-top: 16px;
        padding: 15px 0 0 20px;
        ::v-deep .cb-block {
          .cb-block-title-container {
            margin-bottom: 0 !important;
          }
        }
      }
      .content-tab {
        flex: 1;
        width: calc(30% - 19px);
      }
    }
  }
  .left-wrapper {
    width: 67%;
    margin-right: 22px;
    .left-top-wrapper {
      height: 606px;
      margin-bottom: 20px;
      padding: 15px 20px;
    }
    .left-bottom-wrapper {
      height: 356px;
      display: flex;
      .recent-news {
        height: 100%;
        width: 40%;
        margin-right: 19px;
        padding: 15px 20px;
      }
      .content-tab {
        flex: 1;
      }
    }
  }
}
.dashboard-wrapper {
  .cb-block {
    height: 100%;
  }
}
</style>
