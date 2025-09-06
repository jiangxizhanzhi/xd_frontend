<template>
  <div class="screen-monitoring">
    <!-- 屏幕监控 -->
    <div class="content">
      <cb-row :gutter="30">
        <cb-col v-for="(item, index) in screen_list" :key="index" :span="12">
          <div class="screen_wrap">
            <!-- 放大弹框-->
            <cb-dialog
              :visible.sync="dialogTableVisible"
              append-to-body
              :modal-append-to-body="false"
              width="100%"
              class="fullscreen-dialog"
              :fitWidth="true"
              title=""
            >
              <div v-if="enlarge_info" class="screen-data-info">
                <iframe :src="enlarge_info.screen_data.link" />
              </div>
            </cb-dialog>
            <!-- 屏幕监控显示 -->
            <div class="screen-item">
              <div v-if="item.screen_data.link" class="screen">
                <iframe :src="item.screen_data.link" class="link" />
                <div class="screen-info">
                  <img
                    class="img"
                    :src="item.userimg || helper.defaultLogo"
                    alt=""
                  />
                  <div class="name">{{ item.username }}</div>
                  <div class="addr">{{ item.server_ip }}</div>
                  <p class="server color-sky-blue">
                    {{ item.machine_name }}
                  </p>
                  <div class="opration">
                    <span class="cursor mr10" @click="showDialog(index)">
                      <!-- 刷新图标 -->
                      <cb-iconfont
                        type="icon-shuaxin"
                        themedColor="--primary-color"
                        :title="$t('m.replace')"
                      />
                    </span>
                    <span class="cursor" @click="screen_enlarge(item, index)">
                      <!-- 放大图标 -->
                      <cb-iconfont
                        type="icon-fangda"
                        themedColor="--primary-color"
                        :title="$t('m.fullScreen')"
                      />
                    </span>
                  </div>
                  <div class="close-screen">
                    <span class="cursor" @click="screen_delete(item, index)">
                      <!-- 删除图标 -->
                      <cb-iconfont
                        type="icon-guanbi"
                        themedColor="--font-color-regular"
                        :title="$t('m.delete')"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="wrapper">
                <span class="cursor" @click="showDialog(index)">
                  <!-- 加号图标 -->
                  <cb-iconfont
                    type="icon-xinzeng"
                    themedColor="--font-color-regular"
                    size="50"
                    class="color-gray"
                  />
                </span>
              </div>
            </div>
          </div>
        </cb-col>
      </cb-row>
    </div>
    <!-- "选择靶机"弹框 -->
    <cb-dialog
      :visible.sync="centerDialogVisible"
      v-if="centerDialogVisible"
      :title="$t('m.selectHost')"
      class="addMachine"
      width="620px"
      center
    >
      <div style="height: 550px; overflow: auto" class="cyber-scroll-bar">
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
                <img :src="item.avatar || helper.defaultLogo" alt />
              </div>
              <div class="text-box fl">
                <cb-row>
                  <cb-col :span="8">
                    <div
                      class="grid-content color-gray bg-purple one-overflow"
                      style="white-space: nowrap"
                      :title="$t('m.machineName')"
                    >
                      {{ $t('m.machineName') }}
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
        <cb-button button-type="cancel" @click="resetDialog()"></cb-button>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import defaultLogo from '@/assets/img/addhost.png';
export default {
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeindex: 0,
      id: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      screenMonitoring: this.$t('m.screenMonitoring'),
      centerDialogVisible: false,
      clickIndex: null,
      getMachineInfo: null,
      enlarge_info: null,
      helper: {
        defaultLogo,
      },
      screen_list: [
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
      machinelists: [],
    };
  },
  created() {
    this.id = this.$route.params && this.$route.params.resource_id;
    this.resetInfo();
  },
  mounted() {
    if (this.crEventData?.data?.scene_data) {
      this.initMachineList();
    }
  },
  methods: {
    // 清除被监控的screen
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

    // "选择靶机"弹框 点击确定按钮
    addMachine() {
      //用户名，协议，节点id相同为同一监控，清除老监控
      const arrayIndex = _.findIndex(this.screen_list, {
        username: this.getMachineInfo.username,
        machine_id: this.getMachineInfo.node_id,
        protocol: this.getMachineInfo.protocol,
      });

      if (arrayIndex !== -1) {
        this.resetScreen(arrayIndex);
      }
      /* 给被点击的screen赋值 */
      this.screen_list[this.clickIndex].screen_data.link =
        this.getMachineInfo.monitor_url;
      this.screen_list[this.clickIndex].machine_name =
        this.getMachineInfo.node_name;
      this.screen_list[this.clickIndex].server_ip = this.getMachineInfo.ip;
      this.screen_list[this.clickIndex].machine_id =
        this.getMachineInfo.node_id;
      this.screen_list[this.clickIndex].username = this.getMachineInfo.username;
      this.screen_list[this.clickIndex].userimg =
        this.getMachineInfo.avatar || this.helper.defaultLogo;
      this.screen_list[this.clickIndex].protocol = this.getMachineInfo.protocol;

      this.resetInfo();
    },

    // "选择靶机"弹框中 选中某一个靶机
    getMachineIndex(index) {
      this.getMachineInfo = this.machinelists[index];
      this.activeindex = index;
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
        if (
          this.machinelists.length > 0 &&
          this.$_.isEmpty(this.getMachineInfo)
        ) {
          this.getMachineInfo = this.machinelists[0];
        }
      });
    },

    // 关闭”选择靶机“弹框
    resetDialog() {
      this.centerDialogVisible = false;
    },

    // 关闭”选择靶机“弹框，重置一些变量
    resetInfo() {
      this.centerDialogVisible = false;
      this.clickIndex = null;
      this.getMachineInfo = null;
      this.activeindex = 0;
    },

    // 重置相应的screen
    resetScreen(index, callback) {
      if (!this.screen_list[index].machine_name) {
        return;
      }
      this.screen_list[index].machine_name = null;
      this.screen_list[index].machine_id = null;
      this.screen_list[index].screen_data.link = null;
      if (callback) {
        callback();
      }
    },

    // 请求靶机信息
    // 红蓝裁判屏幕监控
    initMachineList(callback) {
      this.$request
        .get(
          '/cr/red_vs_blue/referee/sessions',
          { room_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.machinelists = res.data.data;
          if (callback) {
            callback();
          }
        });
    },
  },
};
</script>
<style lang="scss">
.screen-monitoring {
  width: 100%;
  height: 98%;
  border-radius: 0px 2px 2px 2px;
  padding: 25px;
  .content {
    width: 100%;
    height: 100%;
    .el-row {
      height: 100%;
    }
    .el-col {
      height: 51%;
    }
    .screen_wrap {
      width: 100%;
      height: 96%;
      padding-right: 15px;
      margin-bottom: 2%;
      border-radius: 2px;
      box-sizing: border-box;
      .title {
        font-size: 16px;
        i {
          color: #0096ff;
          margin-right: 10px;
        }
        span {
          color: #8493a8;
        }
      }
      .operation {
        margin: 10px 15px 0 15px;
        i {
          margin-right: 15px;
          color: #8087a4;
          font-size: 20px;
          display: block;
          margin-bottom: 10px;
        }
        .el-button {
          margin-top: -5px;
        }

        .el-dialog {
          height: 100%;
          margin-top: 0 !important;
          background-color: #252c46;
          .el-dialog__body {
            height: 86%;
          }
          .i_am_screen {
            height: 100%;
            margin-left: 20px;
            div {
              height: 100%;
              iframe {
                display: inline-block;
                height: 100%;
              }
            }
          }
        }
      }
      .screen-item {
        width: 100%;
        height: 100%;
        .screen {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 20px 20px;
          box-sizing: border-box;
          .link {
            width: calc(100% - 140px);
            height: 100%;
          }
          .screen-info {
            width: 140px;
            height: 100%;
            text-align: center;
            // color: #E5EBFF;
            font-size: 14px;
            padding-top: 30px;
            position: relative;
            .img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
            .name {
              font-size: 18px;
              font-weight: bold;
              padding-top: 10px;
            }
            .addr {
              padding-top: 10px;
            }
            .server {
              // background-image: linear-gradient(left, #39EFFF, #3AA5FF);
              // background-clip:text;
              // -webkit-text-fill-color:transparent;
              padding: 10px 0 30px 0;
              word-wrap: break-word;
            }
            .opration {
              .current {
                margin-left: 20px;
                font-weight: bolder;
                font-size: 16px;
                // background-image: linear-gradient(left, #39EFFF, #3AA5FF);
                // background-clip:text;
                // -webkit-text-fill-color:transparent;
              }
            }
            .close-screen {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 10px;
              font-weight: 300;
              color: #666;
            }
          }
        }
        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .current {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 102px;
            color: #5a627e;
          }
        }
      }
    }
  }
  .choose-machine {
    .el-dialog {
      background: -webkit-gradient(
        linear,
        left bottom,
        left top,
        from(#1f2736),
        to(#2e3951)
      );
      box-shadow: -4px 0 10px 0 rgba(20, 29, 40, 0.4),
        -10px 0 26px 4px rgba(16, 24, 33, 0.5);
      border-radius: 2px;
    }
  }

  .addMachine {
    height: 600px;
    ul {
      padding: 0;
    }
    .item-list {
      cursor: pointer;
      width: 520px;
      height: 162px;
      margin: 10px auto;
      display: flex;
      align-items: center;

      border: 1px solid transparent;
      border-radius: 10px;
    }
    .img-box {
      width: 10%;
      padding: 40px;
      margin-top: -10px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .text-box {
      width: 62%;
      margin-left: 80px;
      ::v-deep.el-row {
        margin: 15px;
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
    height: 100%;
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
