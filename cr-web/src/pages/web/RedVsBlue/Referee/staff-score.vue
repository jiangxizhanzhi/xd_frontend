<template>
  <div class="staff-score">
    <cb-tabs v-model="active" class="special-tabs">
      <cb-tab-pane name="red" :label="$t('common.redUser')"> </cb-tab-pane>
      <cb-tab-pane name="blue" :label="$t('common.blueUser')"></cb-tab-pane>
    </cb-tabs>
    <div class="big-boxs">
      <single-person :userList="userList" />
    </div>
  </div>
</template>
<script>
import SinglePerson from './components/single-person.vue';
export default {
  components: {
    SinglePerson,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: 'red',
      userList: [],
      redList: [],
      blueList: [],
    };
  },
  watch: {
    crEventData: {
      handler(nv, ov) {
        if (!_.isEmpty(nv)) {
          this.userList = [];
          this.redList = [];
          this.blueList = [];
          const roleData = _.get(nv, 'data.roles_data');
          const redGroupList = _.filter(roleData, (item) => {
            return item.role_group === 4;
          })[0].children;
          const blueGroupList = _.filter(roleData, (item) => {
            return item.role_group === 5;
          })[0].children;
          _.forEach(redGroupList, (item) => {
            _.forEach(item.users_data, (user) => {
              this.redList.push(user);
            });
          });
          _.forEach(blueGroupList, (item) => {
            _.forEach(item.users_data, (user) => {
              this.blueList.push(user);
            });
          });
          this.userList = this.redList;
        }
      },
      deep: true,
      immediate: true,
    },
    active: {
      handler(nv, ov) {
        if (nv === 'red') {
          this.userList = this.redList;
        } else if (nv === 'blue') {
          this.userList = this.blueList;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.staff-score {
  padding-top: 10px;
  height: 100%;
  .big-boxs {
    height: calc(100% - 40px);
  }
  .special-tabs {
    ::v-deep.el-tabs {
      .el-tabs__header {
        background: transparent;
      }
      .el-tabs__item {
        background: transparent !important;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
  }
}
</style>
