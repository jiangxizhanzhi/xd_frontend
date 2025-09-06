<template>
  <div class="list_roles_info">
    <div class="info">
      <div class="level top-level">
        <div class="level-left one-overflow span_gray">
          {{ $t('m.myRoles') }}
        </div>
        <div class="level-right">
          <span
            class="span-left one-overflow"
            :title="roles.name"
            :class="roles.role_color"
          >
            <div class="square-div" :class="roles.role_color" />
            {{ roles.name }}
          </span>
          <span
            style="display: none"
            class="span-right span_gray one-overflow"
            :title="roles.description"
            >{{ roles.description }}</span
          >
        </div>
      </div>
      <div class="level train_group">
        <div class="level-left one-overflow span_gray">
          {{ $t('m.participants') }}
        </div>
        <div class="level-right">
          <cb-scrollbar class="height:100%;">
            <div
              v-for="(role, index) in roles.role_data_list"
              :key="index"
              class="role_list span_gray"
            >
              <span
                class="span-left one-overflow"
                :title="role.role_name"
                :class="role.role_color"
              >
                <div class="square-div" :class="role.role_color" />
                {{ role.role_name }}
              </span>
              <span :title="role.role_user" class="span-right one-overflow">{{
                role.role_user
              }}</span>
            </div>
          </cb-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListRoles',
  props: {
    roles: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
//列表右侧 人员组
.list_roles_info {
  float: right;
  width: 30%;
  height: 100%;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .info {
    height: 100%;
    width: 100%;
    padding: 0 11%;
    box-sizing: border-box;
  }
  // .span_purple{
  //   color: #9478FD;
  // }
  // .span_gray{
  //   color: #C0CCE7;
  // }
  // .span_blue{
  //   color: #37BFFF;
  // }
  // .span_green{
  //   color: #50B497;
  // }
  // .span_yellow{
  //   color: #EBAF38;
  // }
  .top-level {
    .span-left {
      width: calc(100% - 18px) !important;
    }
    .span-right {
      display: none;
    }
  }
  .level {
    display: flex;
    margin: 0 0 20px 0;
    white-space: nowrap;
    width: 100%;
  }
  .level-left {
    white-space: nowrap;
    width: 24.77%;
    color: var(--neutral8);
  }
  .level-right {
    width: 75.23%;
    display: flex;
    .role_list,
    .span_gray {
      background: var(--bg-color-3);
    }
    .span-left {
      width: calc(39.83% - 18px);
      padding-left: 18px;
      .square-div {
        width: 4px;
        height: 4px;
        float: left;
        margin: 8px 7px 0 0;
      }
    }
    .span-right {
      width: 59.17%;
      display: block;
      color: var(--neutral7);
    }
  }
  .train_group {
    /* height: calc(100% - 70px); */
    height: 135px; // 临时
  }
  .cb-scrollbar {
    width: 100%;
  }
  .role_list {
    width: 100%;
    display: flex;
    // background:rgba(132,144,159,.15);
    border-radius: 2px;
    padding: 3px 0;
    margin-bottom: 10px;
  }
  .rolenmae {
    margin-left: 10px;
    color: #1ea3fe;
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
