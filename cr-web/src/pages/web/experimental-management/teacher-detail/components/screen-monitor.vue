<template>
  <!-- 团队训练教员屏幕监控 -->
  <div class="screen-monitor">
    <div class="screen-item" :key="index" v-for="(item, index) in screenList">
      <div
        class="add-screen"
        v-if="!item.screen_data.link"
        @click="showDialog(index)"
      >
        <div class="icon-wrap">
          <cb-iconfont :size="16" type="icon-xinzeng"></cb-iconfont>
        </div>
        <div class="add-tip">{{ $t('admin.addScreen') }}</div>
      </div>
      <div v-else class="screen-wrap">
        <div class="left-wrap">
          <iframe :src="item.screen_data.link" class="link" />
        </div>
        <div class="right-wrap">
          <!-- 用户信息 -->
          <div class="user-info">
            <span class="logo-wrap">
              <img :src="item.userimg" />
            </span>
            <span class="user-name" :title="item.username">{{
              item.username
            }}</span>
          </div>
          <!-- IP信息 -->
          <div class="ip-info">
            <div class="ip-name">{{ $t('admin.ip') }}</div>
            <div class="ip-value">{{ item.server_ip }}</div>
          </div>
          <!-- 机器名称 -->
          <div class="device-info">
            <div class="device-tip">{{ $t('admin.hostName') }}</div>
            <div class="device-name">{{ item.machine_name }}</div>
          </div>
          <!-- CPU使用率 -->
          <div class="cpu-info">
            <div class="cpu-tip">{{ $t('admin.cpu') }}</div>
            <div class="cpu-value">
              {{ item.cpu_percent ? item.cpu_percent + '%' : '-' }}
            </div>
          </div>
          <!-- 内存使用率 -->
          <div class="ram-info">
            <div class="ram-tip">{{ $t('admin.ram') }}</div>
            <div class="ram-value">
              {{ item.memory_percent ? item.memory_percent + '%' : '-' }}
            </div>
          </div>
          <div class="btn-wrap">
            <div class="btn-item" @click="screen_enlarge(item, index)">
              <span>
                <cb-iconfont :size="14" type="icon-a-fangda2"></cb-iconfont>
              </span>
              <span>{{ $t('admin.fullScreen') }}</span>
            </div>
            <div class="btn-item" @click="showDialog(index)">
              <span>
                <cb-iconfont :size="14" type="icon-genghuan"></cb-iconfont>
              </span>
              <span>{{ $t('admin.replace') }}</span>
            </div>
            <div class="btn-item" @click="screen_delete(item, index)">
              <span>
                <cb-iconfont :size="14" type="icon-guanbi"></cb-iconfont>
              </span>
              <span>{{ $t('admin.close') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- "选择靶机"弹框 -->
    <cb-dialog
      :visible.sync="centerDialogVisible"
      v-if="centerDialogVisible"
      :title="$t('m.selectHost')"
      class="addMachine"
      width="500px"
      center
    >
      <div style="height: 382px; overflow: auto" class="cyber-scroll-bar">
        <ul>
          <li
            v-for="(item, index) in machinelists"
            :key="index"
            @click="getMachineIndex(index)"
          >
            <div
              class="item-list"
              :class="activeindex === index ? 'item-hover' : ''"
            >
              <div class="img-box fl">
                <img :src="item.avatar || defaultLogo" alt />
              </div>
              <div class="text-box fl">
                <cb-row>
                  <cb-col :span="8">
                    <div
                      class="grid-content color-gray bg-purple one-overflow"
                      style="white-space: nowrap"
                      :title="$t('m.machineName')"
                    >
                      {{ $t('m.machineName') + ':' }}
                    </div>
                  </cb-col>
                  <cb-col :span="16">
                    <div
                      class="grid-content bg-purple-light color-sky-blue one-overflow"
                      :title="item.node_name || ''"
                    >
                      {{ item.node_name || '' }}
                    </div>
                  </cb-col>
                </cb-row>
                <cb-row>
                  <cb-col :span="8">
                    <div class="grid-content color-gray bg-purple">IP:</div>
                  </cb-col>
                  <cb-col :span="16">
                    <div
                      class="grid-content color-white bg-purple-light one-overflow"
                      :title="item.ip"
                    >
                      {{ item.ip }}
                    </div>
                  </cb-col>
                </cb-row>
                <cb-row style="display: none">
                  <cb-col :span="8">
                    <div class="grid-content color-gray bg-purple">OS:</div>
                  </cb-col>
                  <cb-col :span="16">
                    <div
                      class="grid-content color-white bg-purple-light one-overflow"
                      :title="''"
                    >
                      <!-- TODO -->
                      <!-- item.data.server -->
                      {{ '' }}
                    </div>
                  </cb-col>
                </cb-row>
                <cb-row>
                  <cb-col :span="8">
                    <div class="grid-content color-gray bg-purple">
                      {{ $t('m.visitor') }}:
                    </div>
                  </cb-col>
                  <cb-col :span="16">
                    <div
                      class="grid-content color-white bg-purple-light one-overflow"
                    >
                      <span
                        v-text="
                          item.username ? item.username : $t('common.NoBody')
                        "
                      />
                    </div>
                  </cb-col>
                </cb-row>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" mr @click="addMachine"></cb-button>
        <cb-button button-type="cancel" @click="resetDialog"></cb-button>
      </span>
    </cb-dialog>
    <!-- 放大弹框-->
    <cb-dialog
      :visible.sync="dialogTableVisible"
      append-to-body
      :modal-append-to-body="false"
      width="100%"
      class="fullscreen-dialog"
      :fitWidth="true"
    >
      <div v-if="enlarge_info" class="screen-data-info">
        <iframe :src="enlarge_info.screen_data.link" />
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import defaultLogo from '@/assets/img/addhost.png';
import { getMachineListApi } from '@/api/web/team-training';
export default {
  components: {},
  props: {},
  data() {
    return {
      id: '',
      defaultLogo,
      screenList: [
        {
          protocol: '',
          machine_name: '',
          machine_id: '',
          username: '',
          userimg: '',
          server_ip: '',
          screen_data: {
            link: null,
          },
        },
        {
          protocol: '',
          machine_name: '',
          machine_id: '',
          username: '',
          userimg: '',
          server_ip: '',
          screen_data: {
            link: null,
          },
        },
        {
          protocol: '',
          machine_name: '',
          machine_id: '',
          username: '',
          userimg: '',
          server_ip: '',
          screen_data: {
            link: null,
          },
        },
        {
          protocol: '',
          machine_name: null,
          machine_id: '',
          username: '',
          userimg: '',
          server_ip: '',
          screen_data: {
            link: null,
          },
        },
      ],
      getMachineInfo: null,
      activeindex: 0,
      clickIndex: null,
      enlarge_info: null,
      centerDialogVisible: false,
      dialogTableVisible: false,
      machinelists: [],
    };
  },
  watch: {},
  computed: {},
  created() {
    this.id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.initMachineList();
  },
  methods: {
    // 点击添加屏幕获取靶机列表
    initMachineList(callback) {
      getMachineListApi({ room_id: this.id }).then((res) => {
        this.machinelists = res.data.data;
        if (callback) {
          callback();
        }
      });
    },
    // 点击"+"或者替换按钮, 显示"选择靶机" 弹框
    showDialog(index) {
      this.initMachineList((res) => {
        if (this.machinelists.length !== 0) {
          this.centerDialogVisible = true;
        } else {
          this.$message({
            message: this.$t('m.noData'),
            type: 'warning',
          });
        }
        // 记录点击哪个"+"
        this.clickIndex = index;
        if (this.machinelists.length > 0) {
          this.getMachineInfo = this.machinelists[0];
        }
      });
    },
    // "选择靶机"弹框中 选中某一个靶机
    getMachineIndex(index) {
      this.getMachineInfo = this.machinelists[index];
      this.activeindex = index;
    },
    addMachine() {
      //用户名，协议，节点id相同为同一监控，清除老监控
      const arrayIndex = _.findIndex(this.screenList, {
        username: this.getMachineInfo.username,
        machine_id: this.getMachineInfo.node_id,
        protocol: this.getMachineInfo.protocol,
      });
      if (arrayIndex !== -1) {
        this.resetScreen(arrayIndex);
      }
      /* 给被点击的screen赋值 */
      this.screenList[this.clickIndex].screen_data.link =
        this.getMachineInfo.monitor_url;
      this.screenList[this.clickIndex].userimg = this.getMachineInfo.avatar;
      this.screenList[this.clickIndex].username = this.getMachineInfo.username;
      this.screenList[this.clickIndex].type = this.getMachineInfo.type;
      this.screenList[this.clickIndex].server_ip = this.getMachineInfo.ip;
      this.screenList[this.clickIndex].machine_id = this.getMachineInfo.node_id;
      this.screenList[this.clickIndex].machine_name =
        this.getMachineInfo.node_name;
      this.screenList[this.clickIndex].cpu_percent =
        this.getMachineInfo.cpu_percent;
      this.screenList[this.clickIndex].memory_percent =
        this.getMachineInfo.memory_percent;
      this.screenList[this.clickIndex].protocol = this.getMachineInfo.protocol;
      this.resetInfo();
    },
    // 关闭”选择靶机“弹框，重置一些变量
    resetInfo() {
      this.centerDialogVisible = false;
      this.clickIndex = null;
      this.getMachineInfo = null;
      this.activeindex = 0;
    },
    resetDialog() {
      this.centerDialogVisible = false;
    },
    // 清除监控的弹框
    screen_delete(item, index) {
      this.resetScreen(index, () => {
        this.$message({
          message: this.$t('m.successful'),
          type: 'success',
        });
      });
    },
    // 放大监控的弹框
    screen_enlarge(item, index) {
      this.dialogTableVisible = true;
      this.enlarge_info = item;
    },

    // 重置相应的screen
    resetScreen(index) {
      this.screenList[index].screen_data.link = '';
      this.screenList[index].userimg = '';
      this.screenList[index].username = '';
      this.screenList[index].type = '';
      this.screenList[index].server_ip = '';
      this.screenList[index].machine_id = '';
      this.screenList[index].machine_name = '';
      this.screenList[index].protocol = '';
      this.screenList[index].cpu_percent = '';
      this.screenList[index].memory_percent = '';
    },
  },
};
</script>
<style lang="scss" scoped>
.screen-monitor {
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
  display: flex;
  flex-wrap: wrap;
  padding: 16px 16px 16px 16px;
  .screen-item {
    margin-right: 16px;
    margin-bottom: 16px;
    height: calc(50% - 8px);
    width: calc(50% - 8px);
    background-color: var(--bg-color-3);
    background-size: cover;
    position: relative;
    &::before {
      height: 100%;
      width: 100%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: url('~@/assets/img/redVsBlue/manager/screen-bg.jpg') center
        no-repeat;
      background-size: cover;
      opacity: 0.2;
    }

    &:nth-child(even) {
      margin-right: 0;
    }
    // 添加屏幕点击样式
    .add-screen {
      width: 160px;
      height: 90px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: var(--primary-color);
      border: 1px dotted var(--primary-color);
      cursor: pointer;
    }
    .screen-wrap {
      border-radius: 2px;
      display: flex;
      height: 100%;
      justify-content: flex-end;
      position: relative;
      .left-wrap {
        flex: 1;
        background: var(--bg-color-1);
        .link {
          width: 100%;
          height: 100%;
        }
      }
      .right-wrap {
        background: var(--bg-color-3);
        width: 208px;
        padding: 12px 12px 16px 16px;
        .user-info {
          display: flex;
          align-items: center;
          .logo-wrap {
            outline: 1px solid var(--neutral1);
            display: inline-block;
            min-width: 32px;
            min-height: 32px;
            max-width: 32px;
            max-height: 32px;
            width: 32px;
            height: 32px;
            margin-right: 8px;
            border-radius: 50%;
            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
          .user-name {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral8);
            margin-right: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .user-type {
            display: inline-block;
            min-width: 40px;
            min-height: 22px;
            max-width: 40px;
            max-height: 22px;
            line-height: 22px;
            border-radius: 2px;
            text-align: center;
            font-size: 12px;
          }
          .blue {
            background: var(--blue-color-2);
            color: var(--blue-color);
          }
          .red {
            background: var(--red-color-2);
            color: var(--red-color);
          }
        }
        .ip-info {
          margin-top: 12px;
          height: 12%;
          .ip-name {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral5);
          }
          .ip-value {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral8);
          }
        }
        .device-info {
          height: 15%;
          margin-top: 12px;
          .device-tip {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral5);
          }
          .device-name {
            font-size: 14px;
            color: var(--neutral8);
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            // 数字换行
            word-break: break-all;
          }
        }
        .cpu-info {
          height: 12%;
          margin-top: 12px;
          .cpu-tip {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral5);
          }
          .cpu-value {
            font-size: 14px;
            color: var(--neutral8);
          }
        }
        .ram-info {
          height: 12%;
          margin-top: 12px;
          .ram-tip {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral5);
          }
          .ram-value {
            font-size: 14px;
            color: var(--neutral8);
          }
        }
        .btn-wrap {
          position: absolute;
          bottom: 16px;
          display: flex;
          font-size: 14px;
          color: var(--primary-color);
          cursor: pointer;
          .btn-item {
            margin-right: 16px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  // 添加靶机弹窗样式
  .addMachine {
    height: 600px;
    ul {
      padding: 0;
    }
    .item-list {
      cursor: pointer;
      width: 440px;
      height: 106px;
      margin: 10px auto;
      display: flex;
      align-items: center;
      border: 1px solid transparent;
      border-radius: 2px;
      background: var(--bg-color-3);
      padding-left: 24px;
      border-radius: 2px;
    }
    .item-list:hover {
      background: var(--neutral0);
    }
    .item-hover {
      border: 1px solid var(--primary-color) !important;
    }
    .img-box {
      min-width: 64px;
      max-width: 64px;
      min-height: 64px;
      max-height: 64px;
      width: 64px;
      height: 64px;
      background: var(--bg-color-2);
      border-radius: 50%;
      border: 1px solid var(--neutral1);
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
    .text-box {
      padding: 16px;
      height: 100%;
      width: 84%;
      ::v-deep.el-row {
        margin-bottom: 8px;
        .bg-purple-light {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.width-fit-content {
  .el-dialog {
    margin: 0 !important;
    height: 100%;
    width: 100%;
    background: #000;
    .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: var(--white-color);
    }
  }
}
.width-fit-content {
  .cb-dialog-body,
  .el-dialog__body {
    height: calc(100% - 35px);
  }
  .screen-data-info {
    height: calc(100% - 55px);
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
