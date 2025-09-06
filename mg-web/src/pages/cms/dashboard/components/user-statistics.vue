<template>
  <div style="width: 100%; height: 100%">
    <div class="top-content">
      <div class="user-style">
        <!-- 在线用户数 -->
        <div class="left-content">
          <div class="num">{{ userCount }}&nbsp;/&nbsp;{{ totalUser }}</div>
          <div class="title">
            {{ $t('dashboard.userOnLine') }}&nbsp;/&nbsp;{{
              $t('dashboard.totalUser')
            }}
          </div>
        </div>
        <div class="icon-style">
          <div class="icont-content">
            <cb-iconfont
              type="icon-zhanghao"
              themedColor="neutral8"
              :size="20"
            ></cb-iconfont>
          </div>
        </div>
      </div>
      <div class="user-style-right">
        <!-- 活动场景数 -->
        <div class="right-content">
          <div class="num">
            {{ sceneCount }}&nbsp;/&nbsp;{{ sceneConfigCount }}
          </div>
          <div class="title">
            {{ $t('dashboard.activityScene') }}&nbsp;/&nbsp;{{
              $t('dashboard.sceneTemplate')
            }}
          </div>
        </div>
        <div class="icon-style">
          <div class="icont-content">
            <cb-iconfont
              type="icon-rongqi-zhuangshi"
              themedColor="neutral8"
              :size="20"
            ></cb-iconfont>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <user-chart :data="newList"></user-chart>
    </div>
  </div>
</template>
<script>
import { getResponse } from '@cyber/helper';
import _ from 'lodash';
import UserChart from './user-chart.vue';
export default {
  components: {
    UserChart,
  },
  name: 'pie',
  props: {
    targetSummary: {
      Type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      newList: [],
      percentage: 0,
      userCount: 0,
      totalUser: 0,
      sceneCount: 0,
      percentageUser: 0,
      sceneConfigCount: 0,
    };
  },
  methods: {
    // 获取数据
    getUserRolesStatistics() {
      this.$request
        .get('/auth/user_roles/statistics', undefined, { baseURL: '/api/mp' })
        .then((res) => {
          const list = getResponse(res).list;
          let listTopFive = [];
          let sixAfterTotal = 0;
          if (Array.isArray(list) && list.length > 6) {
            list.forEach((element, index) => {
              if (index < 5) {
                listTopFive.push({
                  name: element.role_name,
                  value: Number(element.user_cnt),
                });
              } else {
                sixAfterTotal = sixAfterTotal + element.user_cnt;
              }
            });
            listTopFive.push({
              name: '其他',
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
        });
    },
    // 获取用户数
    getOnlineUserCount() {
      this.$request
        .get('/auth/users/olUserCnt', undefined, { baseURL: '/api/mp' })
        .then((res) => {
          const data = getResponse(res).data;
          this.userCount = _.get(data, 'online_user', 0);
          this.totalUser = _.get(data, 'total_user');
        });
    },
    // 获取场景数
    getSceneSummary() {
      this.$request
        .get('/agg/dashboard/user_summary', undefined, { baseURL: '/api/mp' })
        .then((res) => {
          const data = getResponse(res).data;
          // 活动场景数量
          this.sceneCount = _.get(data, 'running_scene_count', 0);
          // 场景模板数量
          this.sceneConfigCount = parseInt(
            _.get(data, 'scene_config_count', 0),
          );
        });
    },
  },
  created() {
    this.getUserRolesStatistics();
    this.getSceneSummary();
    this.getOnlineUserCount();
  },
};
</script>
<style lang="scss" scoped>
.top-content {
  width: 100%;
  display: flex;
  .user-style,
  .user-style-right {
    width: 49%;
    height: 74px;
    background: var(--neutral0);
    display: flex;
    justify-content: space-around;
    .left-content,
    .right-content {
      color: var(--neutral8);
      margin: 12px 0;
      padding: 4px 0;
      .num {
        font-size: 20px;
        font-weight: 600;
      }
      .title {
        font-size: 14px;
        color: var(--neutral7);
      }
    }
    .icon-style {
      padding-top: 16px;

      .icont-content {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--neutral8);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .user-style-right {
    background: var(--neutral0);
    margin-left: 16px;
  }
}
.bottom-content {
  margin: 16px 0;
}
</style>
