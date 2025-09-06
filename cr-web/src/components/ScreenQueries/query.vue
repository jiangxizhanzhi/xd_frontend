<template>
  <div class="task-search-comp">
    <!-- 历史任务用户角色.. -->
    <div class="title fl color-gray">{{ labelText }} :</div>
    <div class="condition fl">
      <div class="fl condition-left">
        <div class="elc-user-drag-selector">
          <div class="user-list clearfix">
            <div
              v-for="(user, i) in userData"
              :key="user.id"
              :data-key="user.id"
              :title="user.rep_name"
              class="elc-user-drag-selector-user-item user-item fl"
            >
              <template>
                <cb-checkbox-group
                  v-show="checkBoxStatus"
                  v-model="checkList"
                  class="checkbox-group isShow fr"
                  @change="handleCheck(user, i)"
                >
                  <cb-checkbox class="query-checkbox" :label="i" />
                </cb-checkbox-group>
              </template>
              <div class="user-info" @click="flag && passRepName(user, i)">
                <img
                  v-show="showImg"
                  :src="user.logo || helper.defaultLogo"
                  class="user-logo"
                />
                <div class="user-name color-gray">{{ user.rep_name }}</div>
              </div>
            </div>
          </div>
          <div v-show="showMultiple" class="multiple clearfix">
            <div class="show-multiple clearfix">
              <span class="show-title fl color-gray"
                >{{ $t('m.selectedUsers') }}：</span
              >
              <div class="fl lineShow">
                <cb-checkbox-group v-model="checkedList" :disabled="true">
                  <cb-checkbox
                    v-for="user in checkedUserData"
                    :key="user.id"
                    :label="user.i"
                    class="query-checkbox"
                    >{{ user.rep_name }}</cb-checkbox
                  >
                </cb-checkbox-group>
              </div>
            </div>
            <div class="multiple-btn clearfix">
              <cb-button
                class="confirm-btn btn-left"
                size="mini"
                type="primary"
                @click="ensuer()"
                >{{ $t('m.ensure') }}</cb-button
              >

              <cb-button
                class="cancel-btn btn-right"
                size="mini"
                type="default"
                @click="cancel()"
                >{{ $t('common.cancel') }}</cb-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="fl condition-right clearfix">
        <!--多选-->
        <div class="fr item-btn cursor" @click="showUserSelected()">
          <cb-iconfont
            size="15"
            class="color-sky-blue"
            type="icon-duoxuan"
            style="margin-right: 5px"
          />
          <span class="left-desc color-sky-blue">{{ $t('m.multiple') }}</span>
        </div>
        <!--更多-->
        <div
          v-show="showMore"
          class="fr item-btn cursor"
          @click="addMore()"
          style="margin-right: 10px"
        >
          <cb-iconfont
            size="15"
            class="color-sky-blue"
            type="icon-xinzeng"
            style="margin-right: 5px"
          />
          <span class="left-desc color-sky-blue">{{ $t('m.more') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import defaultLogo from '@/assets/img/userhead.png';

export default {
  props: {
    initData: {
      type: Array,
      default: () => {},
    },
    label: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showImg: true,
      labelText: '',
      stateTag: '1',
      isShow: false,
      userData: [],
      userDataAll: [],
      formatter: {
        group: (row, column, cellValue, index) => {
          const group = cellValue || this.$CONSTANT.User.Group.ADMIN.value;
          return this.$CONSTANT.DICT.User.Group[group].toString();
        },
      },
      helper: {
        defaultLogo,
      },
      checkBoxStatus: false,
      showMultiple: false,
      checkList: [], // 上面的checkbox
      checkedList: [], // 下面每次默认已选的checkbox
      checkedUserData: [],
      flag: true,
      showMore: false,
    };
  },
  watch: {
    initData: {
      handler(val, oldval) {
        this.init();
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 一开始加载数据5条
    init() {
      this.labelText = this.label;
      this.stateTag = this.state;
      this.userDataAll = this.initData;
      const screenWidth = document.body.clientWidth;
      let limit = 10;
      if (screenWidth < 1366) {
        limit = 10;
      } else if (screenWidth < 1440 && screenWidth >= 1366) {
        limit = 10;
      } else if (screenWidth < 1680 && screenWidth >= 1440) {
        limit = 12;
      } else {
        limit = 15;
      }
      this.userData = _.slice(this.initData, 0, limit);
      if (this.initData.length <= limit) {
        this.showMore = false;
      } else {
        this.showMore = true;
      }
      if (this.state === '1') {
        this.showImg = true;
      } else {
        this.showImg = false;
      }
    },
    // +更多  事件,显示所有数据
    addMore() {
      this.userData = this.initData;
    },
    // 显示多选checkbox
    showUserSelected() {
      this.checkBoxStatus = true;
      this.showMultiple = true;
      this.flag = false;
    },
    // 多选，选中之后下面显示选中结果
    handleCheck(user, i) {
      if (
        _.findIndex(this.checkedUserData, {
          rep_name: user.rep_name,
          id: user.id,
          i: i,
        }) === -1
      ) {
        this.checkedUserData.push({
          rep_name: user.rep_name,
          id: user.id,
          i: i,
        });
        this.checkedList.push(i);
      } else {
        _.remove(this.checkedUserData, function (item) {
          return item.id === user.id;
        });
        this.checkedUserData.sort();
        _.remove(this.checkedList, function (item) {
          return item === user.i;
        });
      }
    },
    // 多选之后点击确定
    ensuer() {
      this.$emit('listenEnsure', this.checkedUserData, false);
    },
    // 多选之后点击取消
    cancel() {
      this.$emit('listenCancel', false);
    },
    // 点击头像单选
    passRepName(user, i) {
      this.$emit('listenSingle', user, i, false);
    },
  },
};
</script>
<style src="dragula/dist/dragula.css"></style>
<style lang="scss" scoped>
$titleColor: #c0cce7;
$ConditionBgColor: #5b709f;
$userName: #edf2ff;

.clearfix:after {
  content: '';
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.task-search-comp {
  width: 100%;
  overflow: hidden;
  display: flex;
  .title {
    min-width: 120px;
    height: 100%;
    // color: $titleColor;
    font-size: 14px;
    white-space: nowrap;
  }
  .condition {
    // background-color: rgba(91, 112, 159, 0.26); // TODO
    border-radius: 2px;
    width: calc(100% - 120px);
    padding: 0 15px 0 0;
    box-sizing: border-box;
    min-height: 50px;
    .condition-left {
      width: calc(100% - 120px);
    }
    .condition-right {
      width: 120px;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      position: relative;
      top: 8px;
      .item-btn {
        // width: 50%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .left-desc {
        // background-image: linear-gradient(left, #39EFFF, #3AA5FF);
        // background-clip:text;
        // -webkit-text-fill-color:transparent;
      }
      .con-mul {
        width: 14px;
        height: 14px;
      }
      .con-more {
        width: 16px;
        height: 16px;
      }
    }
  }
  .user-list {
    width: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    .user-item {
      padding: 0 20px 10px;
      // 显示角色信息
      .user-info {
        width: 100%;
        text-align: center;
        overflow: hidden;
      }
      .user-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .user-name {
        margin-right: 10px;
        width: 100%;
        font-size: 14px;
        // color: $userName;
        text-align: center;
        cursor: pointer;
        white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
  }
  .multiple {
    width: 100%;
    .show-multiple {
      width: 100%;
      line-height: 26px;
      .show-title {
        padding-left: 20px;
      }
      .lineShow {
        display: inline-block;
        // width: 95%;
        .cb-checkbox-group {
          display: flex;
        }
      }
    }
    .multiple-btn {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      .btn-left {
        margin-right: 20px;
        border-radius: 15px;
      }
      .confirm-btn {
        border: none;
      }
    }
  }
  .elc-user-drag-selector-user-item {
    width: 130px;
  }
}
</style>
<style lang="scss">
.task-search-comp {
  .elc-user-drag-selector-user-item {
    ::v-deep .el-checkbox__label {
      display: none;
    }
  }
  .user-item {
    .el-checkbox__input.is-checked + .el-checkbox__label,
    .el-checkbox__label {
      display: none !important;
    }
  }
}
</style>
