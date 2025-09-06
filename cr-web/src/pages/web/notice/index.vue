<template>
  <div class="notice-wrapper">
    <cb-tooltip
      class="item"
      effect="dark"
      :content="$t('notice.notice')"
      placement="left-start"
    >
      <div class="notice-box" @click="showNotice">
        <cb-iconfont type="icon-gonggao" size="28" />
        <div v-if="showRedCircle" class="small-red-circle"></div>
      </div>
    </cb-tooltip>

    <cb-dialog
      :title="$t('notice.notice')"
      center
      :visible.sync="noticeDialog"
      width="720px"
    >
      <div class="notice-lists-box">
        <div v-if="showOperationBtn" class="add-box">
          <cb-button icon="icon-xinzeng" hollow @click="addNotice">
            {{ $t('common.add') }}
          </cb-button>
        </div>
        <div
          v-loading="loadingList"
          :class="showOperationBtn ? 'notice-list' : 'notice-list-no-add'"
        >
          <div
            v-if="noticeLists.length > 0"
            class="cyber-scroll-bar-small"
            style="height: 100%; overflow: auto"
          >
            <!-- 公告内容 -->
            <div
              v-for="(item, index) in noticeLists"
              :key="index"
              class="notice-single"
            >
              <div v-if="showOperationBtn" class="top-box">
                <cb-iconfont
                  type="icon-xitonggonggao"
                  class="notice-icon"
                  size="16"
                />
                {{ getTo(item) }}
              </div>
              <div class="content-box">
                <Content
                  :ref="`wrap${index}`"
                  :text="item.context"
                  :top="item.is_top"
                />
              </div>
              <div class="bottom-box">
                <div class="user-info-box">
                  <img
                    class="user-img"
                    :src="
                      (item.user_data && item.user_data.logo) || defaultLogo
                    "
                  />
                  <span class="user-name">
                    {{ item.user_data && item.user_data.rep_name }}
                  </span>
                  <span class="user-time">{{ item.create_time }}</span>
                </div>
                <div v-if="showOperationBtn" class="btn-box">
                  <cb-button type="text" @click="setTop(item)">
                    <template v-if="item.is_top === 1">
                      {{ $t('notice.untop') }}
                    </template>
                    <template v-else>{{ $t('notice.setTop') }}</template>
                  </cb-button>
                  <cb-button
                    type="text"
                    class="delete-btn"
                    @click="deleteItem(item)"
                  >
                    {{ $t('common.delete') }}
                  </cb-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else style="height: 400px">
            <emptyPage ref="emptyComp" />
          </div>
        </div>
      </div>
      <div v-if="haveNewNotice" class="have-new-box" @click="refreshData">
        <cb-iconfont type="icon-xitonggonggao" size="18" />
        <span>{{ $t('notice.haveNewNotice') }}</span>
      </div>
    </cb-dialog>
    <cb-dialog
      :title="$t('notice.addNotice')"
      center
      :visible.sync="addNoticeDialog"
      width="700px"
      :before-close="dialogAddCancel"
    >
      <div class="add-form-box">
        <cb-form
          ref="addNoticeFormRef"
          :model="noticeForm"
          :rules="rules"
          url="/cr/notice"
          baseURL="/api/ojj"
          :label-width="language === 'en-US' ? '180px' : '86px'"
          label-position="right"
          json
        >
          <cb-form-item :label="$t('notice.announcementObject')">
            <cb-select
              v-model="noticeForm.role"
              :options="options"
              :disabled="type === 'team'"
            ></cb-select>
          </cb-form-item>
          <cb-form-item
            :label="$t('notice.announcementContent')"
            prop="context"
          >
            <cb-input
              v-model="noticeForm.context"
              type="textarea"
              :rows="4"
              :placeholder="$t('common.pleaseInput')"
            />
          </cb-form-item>
          <cb-form-item :label="$t('notice.top')">
            <cb-switch
              v-model="noticeForm.is_top"
              :active-value="1"
              :inactive-value="0"
            >
            </cb-switch>
          </cb-form-item>
        </cb-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button button-type="confirm" @click="submit($event)"></cb-button>
          <cb-button
            button-type="cancel"
            @click="dialogAddCancel()"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
  </div>
</template>
<script>
import Content from './content.vue';
import emptyPage from '@/pages/web/Empty';
import defaultLogo from '@/assets/img/userhead.png';
import Validate from '@/utils/validate.js';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import {
  redBlueSearchNoticeApi,
  teamSearchNoticeApi,
  noticeTopApi,
  deleteNoticeApi,
  checkNewNoticeApi,
} from '@/api/web/notice.js';
import { getLanguage } from '@cyber/helper';
export default {
  name: 'Notice',
  components: {
    Content,
    emptyPage,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    resourceId: {
      type: [String, Number],
      default: '',
    },
    role: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      language: getLanguage(),
      defaultLogo,
      noticeDialog: false,
      addNoticeDialog: false,
      noticeLists: [],
      noticeForm: {
        role: 1,
        context: '',
        is_top: 0,
        room_id: this.resourceId,
      },
      rules: {
        context: [
          {
            required: true,
            message: this.$t('notice.plzEnterAnnouncementContent'),
            trigger: ['blur', 'change'],
          },
          {
            validator: Validate.noticeContent2048,
            trigger: ['blur', 'change'],
          },
        ],
      },
      options: [],
      loadingList: false,
      showRedCircle: false,
      haveNewNotice: false,
      socket: null,
    };
  },
  computed: {
    showOperationBtn() {
      if (
        this.type === 'red' &&
        (this.role === this.$CONSTANT.Role.RedVsBlue.ADMIN.value ||
          this.role === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value ||
          this.role === this.$CONSTANT.Role.RedVsBlue.REFEREE.value)
      ) {
        return true;
      } else if (this.type === 'team' && this.role !== 2) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {},
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    if (this.type === 'red') {
      this.options = [
        {
          label: this.$t('notice.all'),
          value: 1,
        },
        {
          label: this.$t('list.red'),
          value: 2,
        },
        {
          label: this.$t('list.blue'),
          value: 3,
        },
      ];
    } else {
      this.options = [
        {
          label: this.$t('notice.all'),
          value: 1,
        },
      ];
    }
    // this.searchData();
    this.connectionWs();
    this.socket.addEventListener('open', () => {
      this.checkNewNotice();
    });
  },
  methods: {
    checkNewNotice() {
      checkNewNoticeApi({
        resource_id: this.resourceId,
        is_rb:
          this.type === 'red' || this.type === 'red-blue-student'
            ? true
            : false,
      }).then((res) => {
        const showNew = _.get(res, 'data.data', false);
        if (!this.noticeDialog) {
          this.showRedCircle = showNew;
        } else {
          this.haveNewNotice = showNew;
        }
      });
    },
    connectionWs() {
      this.socket = wsutil.cbind(
        `/ojj/ws/cr/ce_base/notice?business_id=${this.resourceId}&token=${this.cookie}`,
        {
          4: () => {
            this.checkNewNotice();
            // if (!this.noticeDialog) {
            //   this.showRedCircle = true;
            // } else {
            //   this.haveNewNotice = true;
            // }
          },
        },
      );
    },
    refreshData() {
      this.searchData();
      this.haveNewNotice = false;
    },
    searchData() {
      this.loadingList = true;
      this.noticeLists = [];
      if (this.type === 'red-blue-student' || this.type === 'red') {
        // 红蓝查询公告
        redBlueSearchNoticeApi({
          resource_id: this.resourceId,
        }).then((res) => {
          this.loadingList = false;
          const data = _.get(res, 'data.data', []);
          this.noticeLists = data;
        });
      } else {
        teamSearchNoticeApi({
          resource_id: this.resourceId,
        }).then((res) => {
          this.loadingList = false;
          const data = _.get(res, 'data.data', []);
          this.noticeLists = data;
        });
      }
    },
    getTo(val) {
      const filterData = _.filter(this.options, (item) => {
        return item.value === val.role;
      });
      return filterData[0]?.label;
    },
    showNotice() {
      this.searchData();
      this.noticeDialog = true;
      if (this.showRedCircle) {
        this.showRedCircle = false;
      }
      if (this.haveNewNotice) {
        this.haveNewNotice = false;
      }
    },
    addNotice() {
      this.addNoticeDialog = true;
    },
    dialogAddCancel() {
      this.addNoticeDialog = false;
      this.clearForm();
    },
    setTop(item) {
      // 取消或设为置顶
      noticeTopApi({
        resource_id: item.resource_id,
        is_top: item.is_top === 1 ? 0 : 1,
      }).then((res) => {
        this.searchData();
      });
    },
    deleteItem(item) {
      // 删除公告
      deleteNoticeApi({
        resource_id: item.resource_id,
      }).then((res) => {
        this.searchData();
      });
    },

    submit(done) {
      this.$refs.addNoticeFormRef
        .submit({
          ...this.noticeForm,
          is_rb: this.type === 'red' ? true : false,
        })
        .then((res) => {
          this.searchData();
          this.addNoticeDialog = false;
          this.clearForm();
          done();
        });
    },
    clearForm() {
      this.$refs.addNoticeFormRef.resetFields();
      this.noticeForm.role = 1;
      this.noticeForm.is_top = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.notice-wrapper {
  .notice-box {
    position: fixed;
    right: 16px;
    bottom: 112px;
    z-index: 222;
    width: 40px;
    height: 40px;
    background: var(--bg-color-3);
    border-radius: 50%;
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: var(--primary-color-2);
    }
    .small-red-circle {
      position: absolute;
      top: 7px;
      right: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--red-color);
      border: 1px solid var(--neutral9);
    }
  }
  .notice-lists-box {
    height: 540px;
    .add-box {
      margin-bottom: 16px;
      height: 32px;
    }
    .notice-list {
      height: 492px;
      overflow: hidden;
    }
    .notice-list-no-add {
      height: 100%;
      overflow: hidden;
    }
  }
  .notice-single {
    background: var(--bg-color-3);
    border-radius: 2px;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    .top-box {
      padding: 10px 16px;
      border-bottom: 1px solid var(--neutral0);
      color: var(--neutral7);
      .notice-icon {
        color: var(--neutral6);
      }
    }
    .content-box {
      padding: 12px 16px;
    }
    .bottom-box {
      padding: 0 16px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user-info-box {
        display: flex;
        align-items: center;
        .user-img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .user-name {
          font-size: 14px;
          color: var(--neutral7);
          line-height: 24px;
          margin-left: 8px;
        }
        .user-time {
          margin-left: 16px;
          font-size: 12px;
          color: var(--neutral5);
          line-height: 24px;
        }
      }
      .btn-box {
        display: flex;
        .delete-btn {
          margin-left: 14px;
        }
      }
    }
  }
  .have-new-box {
    padding: 5px 12px;
    background: var(--bg-color-2);
    border-radius: 2px;
    border: 1px solid var(--neutral1);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 24px;
    color: var(--primary-color);
    line-height: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
<style lang="scss">
.notice-wrapper {
  .add-form-box {
    .el-form {
      padding: 0;
      padding-right: 0;
    }
  }
}
</style>
