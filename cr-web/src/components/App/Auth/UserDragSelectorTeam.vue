<template>
  <div class="elc-user-drag-selector">
    <div class="filter-container">
      <div class="filter-group left">
        <cb-cascader
          :options="roleList"
          :props="optionProps"
          clearable
          :placeholder="$t('rbt.selectOrigin')"
          v-model="categorySet"
        ></cb-cascader>

        <cb-search-input
          v-model="search"
          :placeholder="$t('m.pleaseEnterAccountName')"
          class="filter-item elc-input"
          @keyup.enter.native="getSearchName"
        >
        </cb-search-input>
        <cb-button
          ml
          mr
          class="search"
          @click="handlerSearch"
        >搜索</cb-button>
        <cb-button
          hollow
          class="reset"
          @click="handlerReset"
        >重置</cb-button>
      </div>
    </div>
    <div ref="userList" class="user-list cyber-scroll-bar-small">
      <cb-checkbox v-model="checked">全选</cb-checkbox>
      <div
        v-for="user in tableData"
        :key="user.pk"
        :data-key="user.pk"
        :data-resource-id="user.resource_id"
        :class="{
          'elc-user-drag-selector-user-item user-item': true,
          active: activeComputed(user),
        }"
        @click="selectUserFunc(user)"
      >
        <div class="logo-wrap">
          <img
            :draggable="avatarDraggable(user)"
            :src="user.logo || helper.defaultLogo"
            class="user-logo"
            :class="avatarClass(user)"
          />
        </div>
        <div
          :class="textClass(user)"
          class="user-name one-overflow"
          :title="user.name || user.username"
        >
          {{ user.name || user.username }}
        </div>
      </div>
    </div>
    <!--    </cb-scrollbar>-->
  </div>
</template>

<script>
import _ from 'lodash';
import dragula from 'dragula';
import posUtil from '@/utils/mouse';
import defaultLogo from '@/assets/img/userhead.png';
import { getOrganizationApi } from '@/api/web/team-training';
export default {
  props: {
    disabledUserList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      formatter: {
        group: (row, column, cellValue, index) => {
          const group = cellValue || this.$CONSTANT.User.Group.ADMIN.value;
          if (this.$CONSTANT.DICT.User.Group[group] !== undefined) {
            return this.$CONSTANT.DICT.User.Group[group].toString();
          }
          return '';
        },
      },
      helper: {
        defaultLogo,
        drake: null,
      },
      requestapi: false,
      search: '',
      targetContainers: [],
      tipHover: false,
      tableData: [],
      roleList: [],
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      org: '',
      categorySet: [],
      selectUser: [],
      checked: false,
    };
  },
  watch: {
    targetContainers() {
      if (this.helper.drake) {
        this.helper.drake.destroy();
      }
      this.bindDrake();
    },
    checked: {
      handler(nv, ov) {
        if (nv) {
          this.selectUser = this.tableData?.filter((item) =>
            this.avatarDraggable(item),
          );
        } else {
          this.selectUser = [];
        }
        this.$emit('click-user', this.selectUser.length);
      },
    },
  },
  mounted() {
    this.getTableData();
    posUtil.startListen();
    this.bindDrake();
    this.getOrganization();
  },
  methods: {
    // 获取组织数据
    getOrganization() {
      getOrganizationApi().then((res) => {
        const data = _.get(res, 'data.data', []);
        this.roleList = data;
      });
    },
    roleChange(val) {
      if (val[val.length - 1]) {
        this.org = val[val.length - 1];
        this.getTableData();
      } else {
        this.org = '';
        this.getTableData();
      }
    },
    activeComputed(data) {
      return _.find(
        this.selectUser,
        (item) => item.resource_id === data.resource_id,
      );
    },
    selectUserFunc(data) {
      if (this.avatarDraggable(data)) {
        if (
          this.selectUser?.some((item) => item.resource_id === data.resource_id)
        ) {
          this.selectUser = this.selectUser.filter(
            (item) => item.resource_id !== data.resource_id,
          );
        } else {
          this.selectUser.push(data);
        }
      }
      this.$emit('click-user', this.selectUser.length);
    },
    clearSelect() {
      this.selectUser = [];
      this.checked = false;
      this.$emit('click-user', this.selectUser.length);
    },
    handlerSearch() {
      if (this.categorySet[this.categorySet.length - 1]) {
        this.org = this.categorySet[this.categorySet.length - 1];
      } else {
        this.org = '';
      }
      this.getTableData();
    },
    // 重置
    handlerReset() {
      this.search = '';
      this.org = '';
      this.categorySet = [];
      this.getTableData();
    },
    getTableData() {
      this.$request
        .get(
          '/auth/org_users/page/byorg/front',
          {
            username: this.search,
            per_page: 9999,
            is_enabled: 1,
            is_audited: 1,
            is_expired: 0,
            org: this.org,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((resp) => {
          _.forEach(resp.data.data.list, (item) => {
            this.$set(item, 'resource_id', item.id);
            this.$set(item, 'logo', item.avatar);
            this.$set(item, 'rep_name', item.username);
          });
          this.tableData = resp.data.data.list;
        });
    },
    // 搜索
    getSearchName() {
      this.getTableData();
    },
    avatarDraggable(user) {
      const { disabledUserList } = this;
      return !_.find(
        disabledUserList,
        (uid) => `${uid}` === `${user.resource_id}`,
      );
    },
    avatarClass(user) {
      const { disabledUserList } = this;
      const draggabeDisabled = !!_.find(
        disabledUserList,
        (uid) => `${uid}` === `${user.resource_id}`,
      );
      return {
        'draggable-disabled': draggabeDisabled,
      };
    },
    textClass(user) {
      const { disabledUserList } = this;
      const draggabeDisabled = !!_.find(
        disabledUserList,
        (uid) => `${uid}` === `${user.resource_id}`,
      );
      return {
        // 'white-color': !draggabeDisabled,
        'draggable-disabled': draggabeDisabled,
      };
    },
    addClassload() {
      this.tipHover = true;
    },
    removeClassload() {
      this.tipHover = false;
    },
    bindDrake() {
      const that = this;
      const drake = dragula([this.$refs.userList], {
        accepts(el, target, source, sibling) {
          // 不接受任何拖拽
          // return true 可以放在放在任何`container`中
          return false;
        },
        moves(el, source, handle, sibling) {
          const { disabledUserList } = that;
          const userId = el.getAttribute('data-resource-id');
          const found = _.find(
            disabledUserList,
            (uid) => `${uid}` === `${userId}`,
          );
          return !found; // 一直能拖动,拖动的时候触发
        },
        // return false 不会阻止任何拖动
        // return true  组织拖动
        invalid(el, handle) {
          if (!el.classList.contains('no-records')) {
            return false;
          }
          return true;
        },
      });
      drake.on('dragend', (el) => {
        if (_.isEmpty(this.targetContainers)) {
          return;
        }

        let pos;
        let targetContainer;
        _.forEach(this.targetContainers, (container) => {
          const position = posUtil.getRelativeMousePosition(container);
          if (position.onElement) {
            pos = position;
            targetContainer = container;
            return false;
          }
        });

        if (!targetContainer) {
          return;
        }

        const userId = parseInt(el.getAttribute('data-key'));
        let userData = {};
        const filterData = this.tableData.filter((item) => {
          return item.pk === userId;
        });
        if (filterData.length > 0) {
          userData = filterData[0];
        }
        this.$emit('select-user', userData, pos, targetContainer);
      });
    },
  },
};
</script>

<style src="dragula/dist/dragula.css"></style>
<style lang="scss">
.elc-user-drag-selector {
  $filter-container-height: 36px;
  height: 100%;
  .roles-tips {
    position: absolute;
    right: 0;
    top: 10px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding: 0 10px;
    .roles-tip-img {
      vertical-align: middle;
    }
    .tips-square {
      width: 4px;
      height: 4px;
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
    }
    .roles-tips-span {
      vertical-align: middle;
    }
  }
  .roles-tips-normal {
    background: none;
    box-shadow: none;
    span {
      display: none;
    }
    .roles-tip-img {
      vertical-align: middle;
    }
  }
  .el-scrollbar {
    height: 85% !important;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .d-none {
    display: none;
  }
  .filter-container {
    padding: 0;
    position: relative;
    &::after {
      display: block;
      clear: both;
      content: '';
    }
    .filter-group {
      &.left {
        float: left;
        margin: 10px 0 5px;
      }
      &.right {
        float: right;
      }
      .filter-item {
        vertical-align: initial;
        margin: 0;
        .el-input__inner {
          //padding-left: 40px !important;
          border-color: var(--neutral3) !important;
          &:focus {
            border-color: var(--primary-color) !important;
          }
        }
      }
      .el-input__inner,
      .el-input__inner:focus,
      .el-textarea__inner,
      .el-textarea__inner:focus {
        border-color: var(--neutral3) !important;
      }
    }
  }
  .user-list {
    height: 90%;
    margin-right: -12px;
    &::after {
      display: block;
      clear: both;
      content: '';
    }
    .user-item {
      float: left;
      margin: 10px 20px 10px 0;
      cursor: pointer;
      &.active {
        outline: 1px solid var(--primary-color) !important;
      }
    }
    .check-btn {
      position: absolute;
      top: 0;
    }
  }
  .pagination-container {
    padding: 0;
    margin: 0;
    .el-pagination {
      height: $filter-container-height;
      padding: 0;
      & > * {
        vertical-align: middle;
      }
      .el-pager li {
        vertical-align: middle;
      }
    }
  }
}
.elc-user-drag-selector-user-item {
  text-align: center;
  width: 70px;
  font-size: 12px;
  .logo-wrap {
    .user-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      background: var(--bg-color-3);
      outline: 1px solid var(--neutral1);
    }
    .user-logo.draggable-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .user-name {
    user-select: none;
    width: 100%;
    padding-left: 5%;
    display: block;
    line-height: 20px;
    height: 20px;
    white-space: nowrap;
    font-size: 14px;
  }
  .user-name.draggable-disabled {
    color: var(--neutral4);
  }
}
</style>
