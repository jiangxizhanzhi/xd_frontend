<template>
  <cb-inner-page :background="false">
    <div class="toolMagazineDetails page">
      <div class="content second-background">
        <div class="content-top">
          <div class="detail-img fl">
            <img
              class="detailImgScreen"
              :src="detailData.cover_url || toolDivBg"
            />
          </div>
          <div class="detail-info fl">
            <div class="detail-title-div">
              <span class="detail-title">{{ detailData.name }}</span>
            </div>
            <div class="info-bottom">
              <div class="detail-information fl">
                <div class="info-div fl left-info">
                  <cb-row>
                    <cb-col
                      :span="6"
                      class="one-overflow common-label left-label"
                      >{{ $t('m.versions') }}</cb-col
                    >
                    <cb-col :span="2" class="common-label">:</cb-col>
                    <cb-col
                      :span="12"
                      class="one-overflow common-label"
                      :title="detailData.version || '-'"
                      >{{ detailData.version || '-' }}</cb-col
                    >
                  </cb-row>
                  <cb-row>
                    <cb-col
                      :span="6"
                      class="one-overflow common-label left-label"
                      >{{ $t('m.isAuthorization') }}</cb-col
                    >
                    <cb-col :span="2" class="common-label">:</cb-col>
                    <cb-col
                      :span="12"
                      class="one-overflow common-label"
                      :title="
                        detailData.cracked ? $t('m.yes') : $t('m.noCrack')
                      "
                      >{{
                        detailData.cracked ? $t('m.yes') : $t('m.noCrack')
                      }}</cb-col
                    >
                  </cb-row>
                </div>
                <div class="right-border fl" />
                <div class="info-div fl right-info">
                  <cb-row>
                    <cb-col
                      :span="6"
                      :offset="4"
                      class="one-overflow common-label left-label"
                      >{{ $t('m.classify') }}</cb-col
                    >
                    <cb-col :span="2" class="common-label">:</cb-col>
                    <cb-col
                      :span="12"
                      class="one-overflow common-label"
                      :title="detailData.category_i18n_name || '-'"
                      >{{ detailData.category_i18n_name || '-' }}</cb-col
                    >
                  </cb-row>
                  <cb-row>
                    <cb-col
                      :span="6"
                      :offset="4"
                      class="one-overflow common-label left-label"
                      >{{ $t('m.platform') }}</cb-col
                    >
                    <cb-col :span="2" class="common-label">:</cb-col>
                    <cb-col
                      :span="12"
                      class="one-overflow common-label"
                      :title="detailData.platforms || '-'"
                      >{{ detailData.platforms || '-' }}</cb-col
                    >
                  </cb-row>
                </div>
                <div class="right-border fr" />
              </div>
              <div class="rightOperation fl">
                <div v-if="showType === 1" class="btnDiv">
                  <cb-button @click="downloadFile(versionData.file)" hollow>
                    {{ $t('m.download') }}
                  </cb-button>
                </div>
                <div v-if="showType === 3" class="btnDiv">
                  <cb-button
                    icon="icon-kaishi"
                    :loading="showLoading"
                    @click="openImg()"
                    hollow
                  >
                    {{
                      showLoading ? this.$t('m.starting') : this.$t('m.startUp')
                    }}
                  </cb-button>
                </div>
                <div v-if="showType === 4" class="downVersion">
                  <div
                    v-for="(item, index) in detailData.tool_files"
                    :key="index"
                    class="mgrB15"
                  >
                    <cb-button
                      icon="icon-xiazai"
                      @click="downloadFile(item)"
                      hollow
                    >
                      {{ item.file_name }}
                    </cb-button>
                  </div>
                </div>
                <div v-if="showType === 5" class="btnDiv btnBox">
                  <div class="btnList one-overflow" style="display: none">
                    <span class="launch-over" style="ont-size: 13px"
                      >启动结束</span
                    >
                  </div>
                  <!--console登陆-->
                  <div v-show="showConsole" class="btnList">
                    <cb-button
                      icon="icon-danxuankuang"
                      :loading="openLoad"
                      @click="consoleLogin()"
                      hollow
                    >
                      console
                    </cb-button>
                  </div>
                  <!--进入-->
                  <div
                    v-for="(item, index) in assessList"
                    v-show="!startError"
                    :key="index"
                    class="btnList"
                  >
                    <template
                      v-if="
                        item.protocol === 'https' || item.protocol === 'http'
                      "
                    >
                      <cb-button
                        icon="icon-danxuankuang"
                        :loading="!item.available"
                        @click="openPreDeal(item, 1)"
                      >
                        {{ $t('m.enter') }}
                      </cb-button>
                      <cb-button type="text" @click="openPreDeal(item, 2)">
                        {{ item.protocol }}://{{ accessIp }}:{{ item.port }}
                      </cb-button>
                    </template>
                    <template v-else>
                      <cb-button
                        icon="icon-danxuankuang"
                        :loading="!item.available || !item.connection_url"
                        @click="openPreDeal(item, 3)"
                        hollow
                      >
                        {{ $t('m.enter') }}
                      </cb-button>
                      <span class="font13 mgrR5" style="margin-left: 10px">{{
                        item.protocol
                      }}</span>
                      <span class="font13 mgrR5">{{ accessIp }}</span>
                      <span class="font13 mgrR5">{{ item.port }}</span>
                    </template>
                    <cb-tooltip
                      v-if="item.username || item.password"
                      class="item"
                      effect="dark"
                      placement="bottom"
                    >
                      <div slot="content">
                        {{ $t('m.username') }}：{{ item.username }}<br />{{
                          $t('m.password')
                        }}：{{ item.password }}
                      </div>
                      <cb-iconfont
                        size="14"
                        type="icon-danxuankuang"
                        class="color-yellow tipsIcon"
                      ></cb-iconfont>
                    </cb-tooltip>
                  </div>
                  <div
                    v-show="startError"
                    style="width: 100%"
                    class="btnList one-overflow"
                  >
                    <span
                      v-for="(item, index) in errorLog"
                      :key="index"
                      :title="item"
                      class="launch-over"
                      style="font-size: 13px"
                      >{{ item }}</span
                    >
                  </div>
                  <!--重启-->
                  <div class="btnList">
                    <cb-button
                      icon="icon-shuaxinzhongqihuifu"
                      @click="restartTool()"
                      hollow
                      color-type="red"
                    >
                      {{ $t('m.restart') }}
                    </cb-button>
                  </div>
                  <!--删除-->
                  <div v-if="isAuthorizationOnline" class="btnList">
                    <cb-button button-type="delete" @click="deleteTool" hollow>
                      {{ $t('m.delete') }}
                    </cb-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-center">
          <i></i>
          <span class="color-white">
            {{ detailData.name }}
          </span>
        </div>
        <div class="content-bottom">
          <cb-scrollbar>
            <div style="padding: 10px 0 10px 2.79%">
              <div class="bottom-content markDownCommon">
                <CbMarkdown v-model="detailData.introduction" type="viewer" />
              </div>
            </div>
          </cb-scrollbar>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
import {
  getToolImage,
  createToolImage,
  restartTool,
  deleteTool,
} from '@/api/web/tool_magazine.js';
import 'mavon-editor/dist/css/index.css';

const TOOLTYPE = {
  OFFLINE: 0, // 离线
  ONLINE: 1, // 在线
};
const PANELTYPE = {
  DOWNLOAD: 1, // 下载按钮
  STARTING: 3, // 启动
  VERSION: 4, // 展示版本
  OPERATION: 5, // 登陆操作页面
};
// 0 开始  event_status
// 1 进行中
// 2 结束
// 3 异常
export default {
  components: {},
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
      toolDivBg: require('@/assets/img/toolHomePage/magazine_default.png')
        .default,
      toolMagazine: '',
      resource_id: null,
      toolMagazineDetails: '',
      previous: this.$t('m.previous'),
      next: this.$t('m.next'),
      detailData: {},
      introduction: '',
      showType: null,
      showLoading: false,
      showConsole: false,
      consoleUrl: null,
      openLoad: true,
      enterLoad: true,
      accessMethod: '',
      accessIp: '',
      accessPort: '',
      hoverData: {
        name: '',
        password: '',
      },
      assessList: [],
      versionData: {},
      isAuthorizationOnline: true,
      startError: false,
      errorLog: [],
      startOver: false,
      serveId: '',
      id: '',
    };
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
  },
  mounted() {
    this.getToolMagazine();
  },
  methods: {
    getToolMagazine() {
      this.$request
        .get(
          '/cr/tools',
          {
            resource_id: this.id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.detailData = res.data.data;
          if (res.data.data.tool_type === TOOLTYPE.OFFLINE) {
            this.showType = PANELTYPE.VERSION;
          }
          this.detailData.platforms = this.detailData.platforms.join();
          setBreadcrumbTitle(this.detailData.name);
        });
    },
    getToolCommon() {
      getToolImage(this.id).then((res) => {
        if (res.data.scene) {
          this.showType = PANELTYPE.OPERATION;
          if (res.data.scene._instance) {
            if (res.data.scene._instance.event_status === 3) {
              this.startError = true;
              this.startOver = false;
              this.errorLog = res.data.scene._instance.errors;
            } else {
              if (res.data.scene._instance.event_status === 2) {
                this.startOver = true;
              } else {
                this.startOver = false;
              }
              this.startError = false;
              _.forEach(res.data.nodes, (nodeItem) => {
                if (
                  nodeItem.data.data._meta.category &&
                  nodeItem.data.data._meta.category === 'server'
                ) {
                  this.serveId = nodeItem.data.id;
                  const accessModes = nodeItem.data.data._instance.access_modes;
                  if (accessModes) {
                    this.accessIp = nodeItem.data.data._instance.networks[0].ip;
                    if (_.findIndex(accessModes, ['protocol', 'console']) < 0) {
                      this.showConsole = false;
                    } else {
                      this.showConsole = true;
                    }
                    const _this = this;
                    for (var i = 0; i < accessModes.length; i++) {
                      if (accessModes[i].protocol === 'console') {
                        // console登录
                        if (accessModes[i].available) {
                          _this.openLoad = false;
                        } else {
                          _this.openLoad = true;
                        }
                      } else {
                        _this.assessList.push(accessModes[i]);
                      }
                    }
                  }
                }
              });
            }
          }
        } else {
          this.showType = PANELTYPE.STARTING;
          this.showLoading = false;
        }
      });
    },
    openImg() {
      // 点击启动时
      this.showLoading = true;
      createToolImage(this.id)
        .then((res) => {
          this.showLoading = false;
          this.showType = PANELTYPE.OPERATION;
          // this.$message({
          //   type: 'success',
          //   message: this.$t('m.start_success'),
          // })
          this.getToolCommon();
        })
        .catch((error) => {
          this.showLoading = true;
          if (error.response.data) {
          }
        });
    },
    consoleLogin() {
      // console登录
      if (!this.openLoad) {
        localStorage.setItem('serveId', this.serveId);
        const routeData = this.$router.resolve({
          path: `/tool_console/${this.id}/`,
        });
        window.open(routeData.href, '_blank');
      }
    },
    restartTool() {
      // 重启
      this.startOver = false;
      this.startError = true;
      this.errorLog = [];
      restartTool(this.id, { id: this.serveId })
        .then((res) => {
          _.forEach(this.assessList, (item) => {
            item.available = false;
          });
        })
        .catch((error) => {
          if (error.response.data) {
          }
        });
    },
    deleteTool(done) {
      // 删除
      deleteTool(this.id)
        .then((res) => {
          this.startOver = false;
          this.startError = true;
          this.errorLog = [];
          done();
          this.assessList = [];
          this.showType = PANELTYPE.STARTING;
          this.showLoading = false;
        })
        .catch((error) => {
          if (error.response.data) {
            done(false);
          }
        });
    },
    downloadFile(file) {
      let a = document.createElement('a');
      a.href = location.origin + file.file_url;
      a.download = file.file_name; //文件名
      a.target = '_blank';
      a.click();
    },
    openPreDeal(data, type) {
      let url, target;
      if (type === 1) {
        url = data.available
          ? data.protocol + '://' + accessIp + ':' + data.port
          : '#';
        target = data.available ? '_blank' : '';
      } else if (type === 2) {
        url = data.protocol + '://' + accessIp + ':' + data.port;
        target = '_blank';
      } else if (type === 3) {
        url = data.available ? data.connection_url : '#';
        target = data.available ? '_blank' : '';
      }
      this.openNewPage(url, target);
    },
    openNewPage(url, target) {
      window.open(url, target);
    },
  },
};
</script>

<style lang="scss" scoped>
.toolMagazineDetails {
  .mgrB15 {
    margin-bottom: 15px;
  }
  .font13 {
    font-size: 14px;
    color: var(--neutral8);
  }
  .mgrR5 {
    margin-right: 5px;
  }
  .fontXSmall {
    font-size: x-small;
  }
  .right-btn {
    width: 300px;
  }
  .content {
    box-sizing: border-box;
    height: 100%;
    border-radius: 2px;
    .content-top {
      width: 100%;
      height: 285px;
      box-sizing: border-box;
      .detail-img {
        width: 300px;
        height: 100%;
        text-align: left;
        .detailImgScreen {
          width: 280px;
          height: 220px;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 10px;
        }
      }
      .detail-info {
        width: calc(100% - 310px);
        height: 100%;
        box-sizing: border-box;
        margin-left: 10px;
      }
      .detail-title-div {
        width: 100%;
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
      }
      .detail-title {
        font-size: 24px;
      }
      .detail-information {
        width: 41.32%;
        font-size: 14px;
        .el-row {
          margin: 10px 0;
        }
      }
      .info-div {
        width: calc(50% - 2px);
        height: 100%;
      }
      .right-border {
        width: 1px;
        height: 80px;
      }
      .left-label {
        text-align: justify;
        text-align-last: justify;
      }
      .el-scrollbar {
        border: 0 solid transparent !important;
      }
      .el-scrollbar__view {
        height: 100%;
      }
      .common-label {
        font-size: 14px;
      }
      .downVersion {
        margin-left: 11%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        ::v-deep .elc-btn-gradient {
          max-width: 100%;
        }
        ::v-deep .elc-btn-gradient-inner {
          width: calc(100% - 20px) !important;
          padding: 0 10px !important;
        }
      }
      .info-bottom {
        clear: both;
        width: 100%;
        height: calc(100% - 80px);
      }
      .rightOperation {
        width: 58.68%;
        height: 100%;
        .start {
          border-radius: 18px;
        }
        .btnList {
          margin-top: 10px;
          &:nth-of-type(1) {
            margin-top: 0;
          }
          .tipsIcon {
            margin-top: 11px;
            margin-left: 5px;
          }
        }
        .startDiv {
          text-align: center;
          position: relative;
          top: 50%;
          transform: translate(0, -50%);
        }
        .startBtn {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
        .btnDiv {
          padding-left: 11%;
          ::v-deep .elc-btn-gradient {
            height: 25px !important;
            line-height: 25px !important;
            min-width: 110px !important;
          }
        }
        .btnBox {
          display: flex;
          flex-wrap: wrap;
          padding-right: 8%;
          .btnList {
            width: 50%;
            margin-bottom: 10px;
            line-height: 36px;
            display: flex;
            flex-wrap: wrap;
          }
        }
      }
    }
    .launch-over {
      color: var(--red-color);
    }
    .content-center {
      position: relative;
      margin-top: 10px;
      i {
        position: absolute;
        top: 13px;
        left: 30px;
        display: inline-block;
        width: 6px;
        height: 8px;
        background: var(--blue-color);
      }
      span {
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding-left: 2.79%;
        color: var(--neutral8);
      }
    }
    .content-bottom {
      width: 100%;
      height: calc(100% - 339px);
      .bottom-title {
        font-size: 22px;
        padding: 10px 0 10px;
      }

      .bottom-content {
        padding-top: 10px;
        line-height: 25px;
        font-size: 15px;
        ::v-deep .v-show-content {
          padding: 0 25px 15px 0 !important;
        }
        em {
          font-style: italic;
        }
        strong {
          font-weight: 900;
        }
        ol > li {
          list-style: decimal;
        }
        ul > li {
          list-style: disc;
        }
        sup {
          top: -0.5em;
        }
        sub {
          bottom: -0.25em;
        }
        sub,
        sup {
          font-size: 75%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
      }
    }
  }
}
</style>
