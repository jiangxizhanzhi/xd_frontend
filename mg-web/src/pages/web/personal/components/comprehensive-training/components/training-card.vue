<template>
  <div class="card-thumb-wrapper">
    <div class="content-box-wrapper">
      <div class="content-box">
        <div
          class="name mr20"
          :title="'【' + tableData.app_name + '】' + tableData.name"
        >
          <div class="text one-overflow">
            【{{ tableData.app_name }}】{{ tableData.name }}
          </div>
          <!--  未开始 0  进行中 1   已结束 2  -->
          <div v-if="tableData.state == 1" class="on-going state">
            {{ $t('personal.ongoing') }}
          </div>
          <div v-else-if="tableData.state == 2" class="finish state">
            {{ $t('personal.finished') }}
          </div>
          <div v-else class="not-start state">
            {{ $t('personal.unstart') }}
          </div>
        </div>
        <div class="duration one-overflow">
          {{ $t('personal.taskTime') }}：{{ tableData.duration_time
          }}{{ $t('personal.hour') }}
        </div>
        <div class="time one-overflow">
          {{ tableData.start_time }}
        </div>
        <div class="detail">
          <cb-button
            :disabled="
              (tableData.role_group == 4 || tableData.role_group == 5) &&
              tableData.state == 0
            "
            hollow
            @click="toDetail(tableData)"
            >{{ $t('personal.goToTrain') }}</cb-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    toDetail(val) {
      if (val.app_id === 211) {
        // 1 单兵训练
        const url = this.$router.resolve({
          path: `/cr/single_train/${val.resource_id}/`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 221) {
        // 8 靶场测试
        this.$router.push({
          path: `/cr/software-test/detail/${val.resource_id}/`,
        });
      } else if (val.app_id === 213 && val.role_group === 1) {
        // 3 团队训练 role:1教员
        const url = this.$router.resolve({
          path: `/cr/train-detail-home/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 213 && val.role_group === 2) {
        // 3 团队训练 role:2学生
        const url = this.$router.resolve({
          path: `/cr/student_combat/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 214 && val.role_group === 1) {
        // 4 红蓝对抗 role:1 管理员
        const url = this.$router.resolve({
          path: `/cr/manage-home/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 214 && val.role_group === 2) {
        // 4 红蓝对抗 role:2 导演
        const url = this.$router.resolve({
          path: `/cr/director-home/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 214 && val.role_group === 3) {
        // 4 红蓝对抗 role:3 裁判
        const url = this.$router.resolve({
          path: `/cr/referee-home/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 214 && val.role_group === 4) {
        // 4 红蓝对抗 role:4 红方
        const url = this.$router.resolve({
          path: `/cr/access-center-member/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      } else if (val.app_id === 214 && val.role_group === 5) {
        // 4 红蓝对抗 role:5 蓝方

        const url = this.$router.resolve({
          path: `/cr/access-center-member/${val.resource_id}`,
        });
        window.open(url.href, '_self');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-thumb-wrapper {
  width: 100%;
  background: var(--bg-color-3);
  .content-box-wrapper {
    width: 100%;
    padding: 0 16px;
    &:hover {
      background: var(--neutral0);
    }
  }
  .content-box {
    min-width: 0;
    border-bottom: 1px solid var(--neutral0);
    display: flex;
    height: 60px;
    line-height: 60px;
    font-size: 14px;

    .name {
      width: 40%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 0 18px 0 0;
      .state {
        width: 52px;
        height: 20px;
        flex-shrink: 0;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        margin-left: 16px;
      }
      .on-going {
        color: var(--primary-color);
        background: var(--primary-color-2);
        border-radius: 2px;
      }
      .finish {
        color: var(--neutral8);
        background: var(--neutral0);
        border-radius: 2px;
      }
      .not-start {
        color: var(--green-color);
        background: var(--green-color-2);
        border-radius: 2px;
      }
    }
    .duration {
      width: 25%;
      box-sizing: border-box;
      padding: 0 18px;
      flex: 1;
    }
    .time {
      width: 25%;
      box-sizing: border-box;
      padding: 0 18px;
      flex: 1;
    }
    .detail {
      width: 10%;
      text-align: right;
      color: var(--primary-color);
      flex: 1;
    }
  }
}
</style>
