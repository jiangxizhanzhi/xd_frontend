<template>
  <cb-dialog
    class="notice-dialog"
    :title="$t('message.lists')"
    :visible.sync="dialogNotice"
  >
    <div class="content-notice" v-if="pagination.total > 0">
      <div class="btn mb20">
        <cb-button class="sellect-all-btn mr10">
          <cb-checkbox
            class="all-select"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            {{ $t('message.selectAll') }}
          </cb-checkbox>
        </cb-button>
        <cb-button
          button-type="delete"
          hollow
          class="delete-button-special"
          :disabled="checkedMessage.length === 0"
          @click="deleteNotice(checkedMessage, $event)"
        ></cb-button>
      </div>
      <div class="content-main">
        <cb-scrollbar>
          <div class="tab-box">
            <cb-checkbox-group
              style="display: block"
              v-model="checkedMessage"
              @change="checkedMessageChange"
            >
              <div
                class="table-card"
                v-for="(item, index) in tableData"
                :key="item.id"
              >
                <div class="title-content flex-between">
                  <cb-checkbox
                    class="title-checkbox"
                    :label="item.id"
                    :key="item.id"
                  ></cb-checkbox>
                  <div
                    class="main flex-between"
                    @click="readMessage(item, index)"
                  >
                    <div class="main-content flex-between">
                      <div class="type-title">
                        <!--系统公告消息已读未读 -->
                        <span class="type-span ft14" :class="'notice-icon'">
                          <cb-iconfont
                            type="icon-xiaoxi"
                            themedColor="red-color"
                            v-if="!item.is_read"
                          ></cb-iconfont>
                        </span>
                        <span class="type-span ft14" :class="'notice-type'">
                          <span :title="getNoticeType(item.type)">{{
                            getNoticeType(item.type)
                          }}</span>
                        </span>
                        <span
                          class="one-overflow color2 ft14"
                          :class="'notice-title'"
                        >
                          <span :title="item.title">{{ item.title }}</span>
                        </span>
                      </div>
                      <div class="right-time flex-between">
                        <div
                          class="admin color2 one-overflow"
                          :title="item.create_user_name"
                        >
                          <cb-iconfont
                            class="mr5"
                            type="icon-zhanghao"
                            themedColor="primary-color"
                          >
                          </cb-iconfont>
                          <span class="ft14" :title="item.publisher_name">
                            {{ item.publisher_name }}
                          </span>
                        </div>
                        <div class="time">
                          <cb-iconfont
                            class="mr5"
                            type="icon-keshishu"
                            themedColor="primary-color"
                          >
                          </cb-iconfont>
                          <span
                            class="ft14 create-time-span"
                            :title="item.create_time"
                            >{{ item.create_time }}</span
                          >
                        </div>
                        <div
                          class="expand_merge"
                          :class="{ expand: item.expand_merge }"
                        >
                          <cb-iconfont
                            class="mr5"
                            type="iconnext"
                            themedColor="primary-color"
                          >
                          </cb-iconfont>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="transform-box" v-show="item.expand_merge">
                  <div
                    class="detail-content practice-mavon-title color3 transition-box"
                  >
                    <CbMarkdown v-model="item.content" type="viewer" />
                    <div class="button-group">
                      <cb-button
                        class="postpone-btn"
                        v-show="item.type == 5"
                        @click="handlePostponeNotice(0)"
                        >{{ $t('message.extensionReminder') }}</cb-button
                      >
                      <cb-button
                        v-show="item.type == 5"
                        class="stop"
                        @click="handlePostponeNotice(1)"
                        >{{ $t('message.noMoreReminder') }}</cb-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </cb-checkbox-group>
          </div>
        </cb-scrollbar>
      </div>
      <div class="pagination-content">
        <cb-pagination
          :total="pagination.total"
          :current-page.sync="pagination.current_page"
          :page-size.sync="pagination.per_page"
          @current-change="handleChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import {
  getNoticeApi,
  readNotice,
  deleteNoticeApi,
  postponeNotice,
} from '@/api/message.ts';
export default {
  data() {
    return {
      dialogNotice: false,
      checkedMessage: [],
      messageOptions: [],
      checkAll: false,
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      tableData: [],
      loading: true,
    };
  },
  methods: {
    getNoticeType(type) {
      if (type === 1 || type === 5) {
        return this.$t('message.noticeType.system');
      }
      if (type === 2) {
        return this.$t('message.noticeType.course');
      }
      if (type === 3) {
        return this.$t('message.noticeType.practice');
      }
      if (type === 4) {
        return this.$t('message.noticeType.exam');
      }
    },
    handleCheckAllChange(val) {
      const checkData = this.checkedMessage;
      if (val) {
        this.checkedMessage = Array.from(
          new Set(checkData.concat(this.messageOptions)),
        );
      } else {
        const c = [];
        checkData.forEach((v) => {
          if (this.messageOptions.indexOf(v) === -1) c.push(v);
        });
        this.checkedMessage = c;
      }
    },
    checkedMessageChange(value) {
      this.checkAll = this.isSame();
    },
    isSame() {
      let same = false;
      if (
        _.intersectionBy(this.messageOptions, this.checkedMessage).length ===
        this.messageOptions.length
      ) {
        same = true;
      }
      return same;
    },
    getNotice() {
      // 获取消息
      this.messageOptions = [];
      this.checkAll = false;
      const that = this;
      getNoticeApi({
        per_page: this.pagination.per_page,
        page: this.pagination.current_page,
      }).then((res) => {
        this.loading = false;
        const data = _.get(res, 'data.data.list', '') || [];
        this.pagination.total = res.data.data.total;
        this.tableData = [];
        const mapped = _.map(data, (row) => {
          this.tableData.push(Object.assign({}, row, { expand_merge: false }));
          const resource_id = _.get(row, 'id', '');
          return resource_id;
        });
        this.messageOptions = mapped || [];
        this.checkAll = this.isSame();
        this.$parent.systemNotices();
      });
    },
    readMessage(item, index) {
      // 读消息
      this.tableData[index].expand_merge = !item.expand_merge;
      if (!item.is_read) {
        readNotice(item.id)
          .then((res) => {
            this.$parent.systemNotices();
            this.tableData[index].is_read = true;
          })
          .catch((error) => {
            errorMessage(error, this);
          });
      }
    },
    deleteNotice(checkedMessage, done) {
      this.loading = true;
      const ids = checkedMessage;
      deleteNoticeApi([...ids])
        .then((res) => {
          done();
          this.checkedMessage = [];
          this.getNotice();
        })
        .catch((error) => {
          done(false);
          errorMessage(error, this);
        });
    },
    handleChange(val) {
      this.loading = true;
      this.pagination.current_page = val;
      this.getNotice();
    },
    handleSizeChange(val) {
      this.loading = true;
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getNotice();
    },
    // listen到期警告 消息的type值固定为5 delay_type 0 延期7天 1 不再提醒
    handlePostponeNotice(delay_type) {
      const query = {
        delay_type: delay_type,
      };
      postponeNotice(query).then((res) => {
        if (delay_type === 0) {
          this.$message.success(this.$t('message.setRemindAgainSuccess'));
        } else if (delay_type === 1) {
          this.$message.success(this.$t('message.setNoMoreSuccess'));
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.practice-mavon-title {
  ::v-deep .v-show-content {
    background-color: transparent !important;
    padding: 0px !important;
  }
}

.content-main {
  height: calc(100% - 110px);
  background: var(--bg-color-3);
}
.notice-dialog {
  ::v-deep .el-dialog {
    width: 960px;
    .el-dialog__body {
      padding: 0 0px 30px 0px;
      height: 500px;
      .cb-dialog-body {
        height: 100%;
      }
      .content-notice {
        width: 100%;
        height: 100%;
        .btn {
          display: flex;
          .all-select {
            height: 100%;
          }
        }
      }
      .tab-box {
        padding: 0 40px;
      }
      .title-checkbox {
        width: 20px;
        height: 24px;
        display: flex;
        align-items: center;
        overflow: hidden;
        ::v-deep .el-checkbox__input {
          line-height: 0;
        }
      }
      .table-card {
        width: 100%;
        margin: 0;
        padding: 20px 0px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--neutral1);
        .el-checkbox {
          margin: 0 !important;
        }
        .title-content {
          width: 100%;
          height: 24px;
          line-height: 24px;
          .main {
            width: calc(100% - 28px);
            margin-left: 8px;
            align-items: center;
            .readTrue {
              width: 8px;
              height: 8px;
              margin-right: 8px;
              border-radius: 50%;
            }
            .main-content {
              width: calc(100% - 18px);
              cursor: pointer;
            }
          }
          .type-title {
            width: calc(100% - 360px);
            margin-right: 30px;
            display: flex;
            align-items: center;
            .notice-icon {
              width: 24px;
              height: 24px;
              line-height: 24px;
              text-align: center;
              margin-left: 14px;
              position: relative;
              top: 1px;
            }
            .notice-type {
              width: 90px;
              height: 24px;
              line-height: 24px;
              text-align: center;
              margin-right: 9px;
            }
            .notice-type-en {
              width: 160px;
              height: 24px;
              line-height: 24px;
              text-align: center;
              border-radius: 12px;
              margin-right: 9px;
            }
            .notice-title {
              height: 24px;
              line-height: 24px;
              width: calc(100% - 100px);
            }
            .notice-title-en {
              height: 24px;
              line-height: 24px;
              width: calc(100% - 170px);
            }
          }
          .right-time {
            display: flex;
            align-items: center;
            height: 24px;
            width: 330px;
            .time {
              width: 175px;
              display: flex;
              align-items: center;
            }
            .admin,
            .time {
              height: 24px;
              i {
                margin-right: 10px;
              }
            }
            .admin {
              width: calc(100% - 227px);
              margin-right: 20px;
            }
            .expand_merge {
              height: 24px;
              line-height: 24px;
              margin-left: 20px;
              transition-duration: 0.3s;
              transition-timing-function: ease;
              display: flex;
              align-items: center;
              i {
                font-size: 10px;
              }
            }
            .expand {
              transform: rotate(90deg);
            }
          }
        }
        .detail-content {
          width: 100%;
          padding: 20px 0 0 48px;
          box-sizing: border-box;
          span {
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            line-height: 26px;
          }
        }
      }
      .pagination-content {
        padding-top: 12px;
      }
    }
  }
}
.button-group {
  margin-top: 6px;
  padding-left: 4%;
  .postpone-btn {
    margin-right: 6px;
  }
}
</style>
<style lang="scss">
.notice-dialog {
  .sellect-all-btn {
    span:first-child {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .delete-button-special {
    .cb-iconfont {
      display: none;
    }
  }
}
</style>
<style lang="scss">
.content-notice {
  .tab-box {
    .el-checkbox__label {
      display: none;
    }
  }
  .all-select {
    position: relative;
    .el-checkbox__input {
      opacity: 0;
      position: absolute;
      top: -1px;
      left: -29px;
    }
    .el-checkbox__label {
      padding-left: 3px;
    }
  }
}
</style>
