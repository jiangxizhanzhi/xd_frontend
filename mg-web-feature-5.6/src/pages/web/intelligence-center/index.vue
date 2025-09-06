<template>
  <cb-inner-page :background="false">
    <div class="intelligence-center-wrapper">
      <div class="left-wrapper" ref="leftWrapper">
        <div class="list-item cyber-scroll-bar-small">
          <div
            v-for="(item, index) in modelListComputed"
            :key="index"
            :class="{
              'knowledge-box': true,
              active:
                currentModel.knowledge_base_name === item.knowledge_base_name,
            }"
            @mouseenter="handleShowDeleteBtn(true, item)"
            @mouseleave="handleShowDeleteBtn(false, '')"
            @click="setIntelligence(item)"
          >
            <img
              :src="item.icon"
              :class="{
                'icon-box': true,
                'default-icon': item.knowledge_base_name === 'cyberpeace',
              }"
              alt=""
            />
            <span>{{ item.name }}</span>
            <span
              v-if="
                showDeleteBtn &&
                item.knowledge_base_name !== 'cyberpeace' &&
                item.knowledge_base_name === hoverData.knowledge_base_name
              "
              class="delete-btn"
              @click.stop="deleteThisIntelligence(item, index)"
            >
              <cb-iconfont
                color="var(--neutral7)"
                type="icon-shanchu"
              ></cb-iconfont>
            </span>
          </div>
        </div>
        <div :class="{ 'bottom-center': true }" @click="selectIntelligence">
          <cb-iconfont
            size="20"
            type="icon-fenlei"
            color="var(--primary-color)"
          ></cb-iconfont>
          <span class="txt">{{ $t('intelligence.intelligence') }}</span>
        </div>
      </div>
      <div class="right-wrapper">
        <div class="header">
          {{
            !isIntelligenceHello
              ? currentModel.name
              : $t('intelligence.intelligence')
          }}
        </div>
        <div
          v-show="!isIntelligenceHello"
          class="dialog-content"
          v-cloak
          ref="dialogContentRef"
          id="dialog-content"
        >
          <div
            v-show="!isEmpty && isShowConversation"
            class="message-group"
            ref="intelligenceRef"
            :style="{ height: messageHeight }"
          >
            <div
              class="message"
              v-for="(message, index) in chatData"
              :key="index + 'chat'"
            >
              <div v-show="message.role === 'user'">
                <div class="user-info">
                  <span class="avatar"
                    ><img :src="userAvatarBase64" alt=""
                  /></span>
                  <span class="bubble" v-text="message.content"></span>
                </div>
              </div>
              <div v-show="message.role === 'assistant'">
                <div class="assistant-info">
                  <span class="avatar"><img :src="logoIcon" alt="" /></span>
                  <span
                    v-show="!message.content && !message.thinking"
                    class="loader"
                  >
                    <span
                      class="ball-pulse"
                      v-for="item in [1, 2, 3]"
                      :key="item"
                    ></span>
                  </span>
                  <div
                    v-show="message.content || message.thinking"
                    class="bubble"
                  >
                    <cb-collapse
                      v-model="activeCollapse"
                      v-if="message.thinking"
                      :disabled="
                        deepThinkingStatus === 1 &&
                        index === chatData.length - 1
                      "
                    >
                      <cb-collapse-item :name="'thinking-' + index">
                        <template slot="title">
                          <cb-iconfont
                            type="icon-shendusikao"
                            themedColor="neutral7"
                            :size="15"
                            class="deep-icon"
                          ></cb-iconfont>
                          <span
                            :class="{
                              'thinking-txt': true,
                              'deep-thinking':
                                deepThinkingStatus === 1 &&
                                index === chatData.length - 1,
                            }"
                          >
                            {{
                              deepThinkingStatus === 1 &&
                              index === chatData.length - 1
                                ? $t('intelligence.deepThinking')
                                : message.deepThinkingTime
                                ? $t('intelligence.deepThinkCompleted') +
                                  ' ( ' +
                                  $t('intelligence.duration') +
                                  message.deepThinkingTime +
                                  $t('systemOperation.scene.second') +
                                  ' ) '
                                : $t('intelligence.deepThinkCompleted')
                            }}
                          </span>
                        </template>
                        <cb-markdown
                          class="thinking-content cyber-scroll-bar-small"
                          v-model="message.thinking"
                          type="viewer"
                        ></cb-markdown>
                      </cb-collapse-item>
                    </cb-collapse>
                    <cb-markdown
                      v-model="message.content || message.answer"
                      type="viewer"
                      class="cyber-scroll-bar-small"
                    />
                    <template v-if="message.report_id">
                      <div class="report-info-box" @click="viewDetail(message)">
                        <cb-iconfont
                          type="icon-jianda"
                          color="var(--neutral8)"
                          size="18"
                        ></cb-iconfont>
                        <span class="name">{{ message.report_name }}</span>
                      </div>
                    </template>
                    <span v-show="!message.content" class="loader content">
                      <span
                        class="ball-pulse"
                        v-for="item in [1, 2, 3]"
                        :key="item"
                      ></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--引导语-->
          <div
            v-show="isEmpty && !isIntelligenceHello"
            class="message-group empty-message-group introductory"
          >
            <div
              class="assistant-info"
              v-show="currentData.knowledge_base_name"
            >
              <span class="avatar"><img :src="logoIcon" alt="" /></span>
              <div class="bubble default-info">
                <div class="default-info-header">
                  {{ currentData.header || '' }}
                </div>
                <div class="default-info-desc">{{ currentData.desc }}</div>
                <template
                  v-if="currentData.statements && currentData.statements.length"
                >
                  <div class="default-info-desc try-ask-txt">
                    {{ $t('intelligence.tryAsk') }}
                  </div>
                  <div class="default-info-intelligence">
                    <div
                      v-for="(item, idx) in currentData.statements"
                      :key="idx"
                      class="default-info-intelligence-item"
                      @click="addConversation(item)"
                    >
                      <div class="default-item">
                        {{ item }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div
            v-if="manualScrollEnabled"
            @click="scrollToBottom"
            class="to-bottom-btn"
          >
            <cb-iconfont
              type="icon-xiala"
              color="var(--neutral8)"
              :size="14"
            ></cb-iconfont>
          </div>
        </div>
        <!--智能体模块列表-->
        <div
          v-show="isIntelligenceHello"
          class="intelligence-selection-wrapper"
        >
          <div
            v-for="(item, index) in intelligenceListComputed"
            :key="index"
            class="intelligence-box"
            @click="handleAddIntelligence(item)"
          >
            <div class="intelligence-item">
              <div class="left-box">
                <div class="logo">
                  <img :src="item.icon" alt="" />
                </div>
              </div>
              <div class="right-box">
                <span>{{ item.name }}</span>
                <span class="desc">{{ item.description }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--底部发送-->
        <div v-if="!isIntelligenceHello" class="send-wrapper">
          <div class="send-box">
            <div class="btn-wrapper">
              <div
                :class="{ 'clear-box': true, disable: isEmpty || disableSend }"
                @click="clearChatContent"
              >
                <cb-iconfont
                  color="var(--neutral8)"
                  type="icon-brush"
                ></cb-iconfont>
                <div>
                  {{ $t('intelligence.clear') }}
                </div>
              </div>
              <div
                v-show="showStopBtn && deepThinkingStatus === 0"
                :class="{ 'stop-box': true }"
                @click="stopConnection"
              >
                <cb-iconfont
                  color="var(--primary-color)"
                  type="icon-jieshu"
                ></cb-iconfont>
                <div>
                  {{ $t('intelligence.stop') }}
                </div>
              </div>
            </div>
            <cb-input
              type="textarea"
              :placeholder="$t('intelligence.pleaseInput')"
              resize=""
              v-model="userQuestion"
              @keydown.native="handleKeyCode($event)"
            >
            </cb-input>
            <div class="input-bottom-box">
              <cb-button @click="sendChatContent" :disabled="disableSend">{{
                $t('intelligence.send')
              }}</cb-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <report-drawer
      :visible="drawerVisible"
      :id="currentReportId"
      @close="handleClose"
    ></report-drawer>
  </cb-inner-page>
</template>

<script>
import { mixins } from '@/mixin';
import _ from 'lodash';
import ReportDrawer from './components/report-drawer';

export default {
  mixins: [mixins],
  components: {
    ReportDrawer,
  },
  props: {},
  data() {
    return {
      drawerVisible: false,
      showDeleteBtn: false, // 是否展示左侧智能体列表的删除按钮，鼠标悬浮展示
      messageHeight: '620px', // 对话框内容高度
      resizeHandler: '',
      currentReportId: '', // 报告id
    };
  },
  computed: {},
  created() {
    this.initAI();
    this.getUserAvatar();
  },
  mounted() {
    this.messageHeight =
      this.$refs.leftWrapper.clientHeight - 130 - 76 - 30 + 'px';
    this.resizeHandler = _.debounce(() => {
      if (this.$refs.leftWrapper?.clientHeight) {
        this.$nextTick(() => {
          this.messageHeight =
            this.$refs.leftWrapper?.clientHeight - 130 - 76 - 30 + 'px';
        });
      }
    }, 500);
    window.addEventListener('resize', this.resizeHandler);
  },
  methods: {
    // 选择智能体类型
    selectIntelligence() {
      this.closeConnection();
      this.isIntelligenceHello = true;
      this.isShowConversation = false;
      if (!this.intelligenceList?.length) {
        this.getKnapsackDataFunc();
      }
    },

    handleShowDeleteBtn(status, data) {
      this.showDeleteBtn = status;
      this.hoverData = data;
    },

    // 左侧删除智能体对话
    async deleteThisIntelligence(data, index) {
      let modelListIndex = this.modelList?.findIndex(
        (item) => item.knowledge_base_name === data.knowledge_base_name,
      );
      if (modelListIndex >= 0) {
        this.modelList.splice(modelListIndex, 1);
      }
      if (data.knowledge_base_name === this.currentModel.knowledge_base_name) {
        this.setIntelligence(this.modelListComputed[0]);
      }
      await this.handleIndexDBChatData('delete', data);
    },
    // 添加对话
    addConversation(data) {
      this.userQuestion = data;
      this.isIntelligenceHello = false;
      this.sendChatContent();
    },
    viewDetail(data) {
      this.drawerVisible = true;
      this.currentReportId = data.report_id;
    },
    handleClose() {
      this.drawerVisible = false;
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.debounceId);
  },
};
</script>

<style scoped lang="scss">
.intelligence-center-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-3);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: stretch;
  .left-wrapper {
    width: 264px;
    background-color: var(--bg-color-2);
    padding: 16px 8px;
    position: relative;
    font-size: 14px;
    color: var(--neutral8);
    flex-shrink: 0;
    overflow: hidden;
    .list-item {
      height: calc(100% - 50px);
      overflow-y: auto;
    }
    .bottom-center {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      position: absolute;
      bottom: 0;
      width: calc(100% - 16px);
      border-top: 0.5px solid var(--neutral1);
      line-height: 56px;
      cursor: pointer;
      color: var(--neutral8);
      &:hover {
        background-color: var(--primary-color-2);
      }
      &.disable {
        opacity: 0.5;
        &:hover {
          background-color: var(--bg-color-2);
        }
      }
      .txt {
        margin-left: 8px;
      }
    }
    .knowledge-box {
      height: 56px;
      line-height: 56px;
      text-align: left;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px 0;
      &.active,
      &:hover {
        background-color: var(--primary-color-2);
      }
      .icon-box {
        display: inline-block;
        min-width: 40px;
        height: 40px;
        min-height: 40px;
        vertical-align: middle;
        border-radius: 50%;
        margin: 0 8px 0 7px;
        background-color: var(--neutral1);
        &.default-icon {
          width: 43px;
          background-color: transparent;
        }
      }
      .delete-btn {
        float: right;
        margin-right: 16px;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
  .right-wrapper {
    flex: 1 1;
    padding: 24px 0 0 0;
    color: var(--primary-color);
    position: relative;
    width: 0;
    .header {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      font-family: PingFangSC, PingFang SC;
      font-style: normal;
      height: 60px;
    }
    .dialog-content {
      position: relative;
      width: 64%;
      min-width: 960px;
      margin: 0 auto;
      height: calc(100% - 75px - 60px - 65px);
      //overflow: hidden;
      .message-group {
        //height: 620px !important;
        overflow-y: auto;
        user-select: text;
        position: relative;
        //margin-top: 16px;
        &.empty-message-group {
          height: 636px !important;
        }
        .message {
          user-select: text;
        }
        .user-info,
        .assistant-info {
          user-select: text;
          display: flex;
          align-items: center;
          justify-content: start;

          //margin: 32px 0;
          margin-top: 32px;
          width: 100%;
          .avatar {
            align-self: flex-start;
            margin-left: 0;
            margin-right: 18px;
            width: 40px;
            height: 40px;
            img {
              width: 40px;
              height: 40px;
              object-fit: cover;
            }
          }
          //思考过程
          ::v-deep .el-collapse {
            margin: 16px 16px 0 16px;
            border: 0;
            border-radius: 2px;
            .cb-iconfont {
              height: 48px;
            }
            @keyframes leftToRightFlash {
              0% {
                background-position: 100%;
              }
              100% {
                background-position: -100%;
              }
            }
            .thinking-txt {
              margin-left: 8px;
              vertical-align: middle;
              color: var(--neutral7);
              &.deep-thinking {
                background: linear-gradient(
                  120deg,
                  rgba(0, 0, 0, 0) 40%,
                  #666666 50%,
                  rgba(0, 0, 0, 0) 60%
                );
                background-clip: text;
                background-size: 200% 100%;
                animation: leftToRightFlash 1.5s linear infinite;
              }
            }
            .el-collapse-item__header {
              color: var(--neutral7);
              border-bottom: 0;
              padding-left: 16px;
              background-color: var(--neutral0);
            }
            .el-collapse-item__wrap {
              color: var(--neutral7);
              background-color: var(--neutral0);
              border-bottom: 0;
              .el-collapse-item__content {
                color: var(--neutral7) !important;
                padding: 0;
              }
            }
          }
        }
        &.introductory {
          .bubble {
            padding: 24px;
          }
        }
        .bubble {
          max-width: calc(100% - 56px);
          display: inline-block;
          background-color: var(--bg-color-2);
          color: var(--neutral8);
          width: fit-content; /* 根据内容调整宽度 */
          border-radius: 4px;
          user-select: text !important;
          //padding: 24px;
          font-size: 15px;
          //&.default-info {
          //  color: var(--neutral8);
          //}
          overflow-wrap: anywhere;
          .default-info-header {
            font-size: 20px;
            font-weight: 600;
          }
          .default-info-desc {
            font-size: 14px;
            margin: 16px 0 0 0;
            &.try-ask-txt {
              margin-bottom: 8px;
            }
          }
          .default-info-intelligence {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            color: var(--neutral8);
            font-size: 16px;
            font-weight: 600;

            .default-info-intelligence-item {
              width: 50%;
              .default-item {
                padding: 16px;
                margin: 8px 0;
                cursor: pointer;
                border-radius: 2px;
                background-color: var(--bg-color-3);
                &:hover {
                  background-color: var(--primary-color-2);
                }
              }
            }
            .default-info-intelligence-item:nth-child(2n + 1) {
              .default-item {
                margin-right: 16px;
              }
            }
          }
        }
        .user-info {
          .bubble {
            font-size: 15px;
            //padding: 10px 0 10px 10px;
            background-color: transparent;
            white-space: pre-line;
          }
          .avatar {
            display: inline-block;
            border-radius: 5px;
            overflow: hidden;
          }
        }
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
          background-color: rgba(0, 0, 0, 0) !important;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--scrollbar-color) !important;
        }
      }
      .to-bottom-btn {
        display: flex;
        position: absolute;
        bottom: 16px;
        right: 0;
        background-color: var(--neutral1);
        text-align: center;
        color: var(--neutral8);
        border-radius: 50%;
        padding: 8px;
        cursor: pointer;
        &:hover {
          background-color: var(--neutral2);
        }
        .cb-iconfont {
          position: relative;
          top: 1px;
        }
      }
    }
    .intelligence-selection-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: 0 24px 40px 40px;
      .intelligence-box {
        width: 33.33%;
        .intelligence-item {
          margin-right: 16px;
          background-color: var(--bg-color-4);
          padding-right: 16px;
          height: 124px;
          color: var(--neutral8);
          font-weight: 600;
          font-size: 16px;
          display: flex;
          padding: 24px 24px 24px 16px;
          margin-bottom: 16px;
          cursor: pointer;
          &:hover {
            background-color: var(--primary-color-2);
          }
        }
        .left-box {
          flex: 1;
          //border: 1px solid red;
          display: flex;
          align-items: center;
          justify-content: center;
          .logo {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--neutral1);
            img {
              //width: 100%;
              height: 100%;
            }
          }
        }
        .right-box {
          flex: 5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 16px;
          color: var(--neutral8);
          padding-left: 8px;
          .desc {
            margin-top: 8px;
            font-size: 14px;
            color: var(--neutral7);
          }
        }
      }
    }
    .send-wrapper {
      position: absolute;
      bottom: 16px;
      width: 100%;
      margin: 0 auto;
      text-align: center;
      height: 130px;
      padding-top: 8px;
      background: var(--bg-color-3);
      .send-box {
        position: relative;
        width: 64%;
        min-width: 960px;
        margin: 0 auto;
        .btn-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .clear-box,
        .stop-box {
          bottom: 91px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 104px;
          height: 32px;
          border-radius: 16px;
          background-color: var(--neutral1);
          text-align: center;
          line-height: 32px;
          font-size: 12px;
          color: var(--neutral8);
          cursor: pointer;
          div {
            margin-left: 8px;
          }
          &:hover {
            background-color: var(--neutral2);
          }
          &.disable {
            cursor: not-allowed;
            background-color: var(--neutral1);
            opacity: 0.4;
            &:hover {
              background-color: var(--neutral1);
            }
          }
        }
        .stop-box {
          right: 0;
          color: var(--primary-color);
          background-color: var(--primary-color-2);
          &:hover {
            background-color: var(--primary-color-4);
          }
        }
        .input-bottom-box {
          position: absolute;
          right: 16px;
          bottom: 16px;
        }
      }
    }
  }
  $size: 1 2 3;
  @keyframes scale {
    0% {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }

    50% {
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      opacity: 0.7;
    }

    100% {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
      opacity: 1;
    }
  }
  .report-info-box {
    display: flex;
    align-items: center;
    margin: 12px 24px 24px 24px;
    border: 1px solid var(--neutral3);
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--neutral8);
    .name {
      font-weight: 600;
      font-size: 14px;
      margin-left: 8px;
    }
    &:hover {
      border: 1px solid var(--neutral4);
    }
  }
  .loader {
    position: relative;
    bottom: 3px;
    @each $i in $size {
      .ball-pulse:nth-child(#{$i}) {
        -webkit-animation: scale
          1.2s
          #{0.05 *
          $i}s
          infinite
          cubic-bezier(0.2, 0.68, 0.18, 1.08);
        animation: scale
          1.2s
          #{0.05 *
          $i}s
          infinite
          cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
    }
    .ball-pulse {
      background-color: var(--primary-color);
      width: 4px;
      height: 4px;
      margin: 0 2px;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      display: inline-block;
    }
    &.content {
      display: inline-block;
      margin: 8px 8px 8px 16px;
    }
  }
}
</style>
<style lang="scss">
.intelligence-center-wrapper {
  .el-textarea__inner {
    resize: none;
    &::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
      background-color: rgba(0, 0, 0, 0) !important;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--scrollbar-color) !important;
    }
  }
  .cb-markdown .markdown-body {
    //white-space: pre-wrap;
    word-wrap: break-word;
    //overflow-wrap: break-word;
    padding: 2px 16px !important;
    //ol {
    //margin: 10px;
    //}
    //font-size: 15px;
    //line-height: 24px;
  }
  .thinking-content.cb-markdown .markdown-body {
    color: var(--neutral7);
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    ul,
    ol,
    pre {
      color: var(--neutral7);
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .deep-icon {
    position: relative;
    top: -1px;
  }
}
</style>
