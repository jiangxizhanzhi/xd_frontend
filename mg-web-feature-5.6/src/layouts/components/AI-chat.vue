<template>
  <div class="AI-chat-box">
    <div
      class="fixed-btn"
      id="AI-fixed-btn"
      v-drag
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <div class="AI-icon">
        <cb-tooltip
          effect="dark"
          :content="$t('intelligence.chatWithMe')"
          placement="left"
          popper-class="instance-tooltip"
        >
          <div>
            <cb-iconfont type="icon-AI" size="24"></cb-iconfont>
          </div>
        </cb-tooltip>
      </div>
    </div>
    <cb-dialog
      width="60%"
      height="500px"
      :visible.sync="visibleValue"
      append-to-body
      custom-class="AI-chat-dialog"
      destroy-on-close
    >
      <template slot="title">
        <div class="title-wrap">
          <span class="logo-wrap">
            <img :src="currentModel.icon" alt="" />
          </span>
          <cb-dropdown class="dropdown-box" append trigger="hover">
            <span class="title-txt">
              {{ currentModel.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <cb-dropdown-menu slot="dropdown">
              <template v-for="item in intelligenceList">
                <cb-dropdown-item
                  :disabled="
                    item.knowledge_base_name ===
                    currentModel.knowledge_base_name
                  "
                  @click.native="handleAddIntelligence(item)"
                >
                  {{ item.name }}
                </cb-dropdown-item>
              </template>
            </cb-dropdown-menu>
          </cb-dropdown>
        </div>
      </template>
      <div class="dialog-content">
        <div
          v-if="!isEmpty"
          class="message-group"
          ref="chatRef"
          v-chat-scroll="{ smooth: true, scrollonremoved: true }"
        >
          <div
            class="message"
            v-for="(message, index) in chatData"
            :key="index"
          >
            <template v-if="message.role === 'user'">
              <div class="user-info">
                <span class="avatar"
                  ><img :src="userAvatarBase64" alt=""
                /></span>
                <span class="user-bubble">{{ message.content }}</span>
              </div>
            </template>
            <template v-else>
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
                      deepThinkingStatus === 1 && index === chatData.length - 1
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
                        class="thinking-content"
                        v-model="message.thinking"
                        type="viewer"
                      ></cb-markdown>
                    </cb-collapse-item>
                  </cb-collapse>
                  <cb-markdown
                    v-model="message.content || message.answer"
                    type="viewer"
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
            </template>
          </div>
        </div>
        <!--引导语-->
        <div
          v-if="isEmpty"
          class="message-group empty-message-group introductory"
        >
          <div v-show="currentData.knowledge_base_name" class="assistant-info">
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
      <template slot="footer">
        <div class="input-bottom-box">
          <div
            :class="{ 'clear-box': true, disable: isEmpty || disableSend }"
            @click="clearChatContent"
          >
            <cb-iconfont
              color="var(--neutral8)"
              type="icon-brush"
              :size="16"
            ></cb-iconfont>
            <div class="text">
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
          <cb-input
            :placeholder="$t('intelligence.pleaseInput')"
            v-model="userQuestion"
            @keydown.native="handleKeyCode($event)"
            type="textarea"
          >
          </cb-input>
          <div class="send-icon">
            <cb-button @click="sendChatContent" :disabled="disableSend">{{
              $t('intelligence.send')
            }}</cb-button>
          </div>
        </div>
      </template>
      <report-drawer
        :visible="drawerVisible"
        :id="currentReportId"
        @close="handleClose"
        append-to-body
      ></report-drawer>
    </cb-dialog>
  </div>
</template>

<script>
import { mixins } from '@/mixin';
import ReportDrawer from '../../pages/web/intelligence-center/components/report-drawer';

export default {
  mixins: [mixins],
  components: {
    ReportDrawer,
  },
  props: {},
  directives: {
    drag(el) {
      let oDiv = el;
      // 在拖动我的场景的图标过程中禁止选择网页上的文字
      // document.onselectstart = function () {
      //   return false;
      // };
      oDiv.onmousedown = function (e) {
        this.dragging = true;
        let disX = e.clientX - oDiv.offsetLeft;
        let disY = e.clientY - oDiv.offsetTop;
        document.onmousemove = function (e) {
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          oDiv.style.left = left + 'px';
          oDiv.style.top = top + 'px';
        };
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        // 解决鼠标黏着问题
        return false;
      };
    },
  },
  data() {
    return {
      drawerVisible: false,
      currentReportId: '', // 报告id
      dragging: false,
      visibleValue: false,
      timer: null, // 用于区分单击还是拖拽事件
      startX: null,
      startY: null,
    };
  },
  computed: {},
  methods: {
    viewDetail(data) {
      this.drawerVisible = true;
      this.currentReportId = data.report_id;
    },
    handleClose() {
      this.drawerVisible = false;
    },
    // 添加对话
    addConversation(data) {
      this.userQuestion = data;
      this.sendChatContent();
    },

    dragStart() {
      this.dragging = true;
    },
    handleMouseDown(event) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    handleMouseUp(event) {
      // 判断是否为单击事件
      const endX = event.clientX;
      const endY = event.clientY;
      const distance = Math.sqrt(
        Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2),
      );
      if (distance < 5) {
        // 执行单击事件处理程序
        this.visibleValue = true;
        this.getUserAvatar();
        this.initAI();
      }
      this.startX = null;
      this.startY = null;
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.AI-chat-box {
  .fixed-btn {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
.dialog-content {
  position: relative;
  width: 95%;
  //min-width: 960px;
  margin: 0 auto;
  //padding-bottom: 20px;
  .message-group {
    height: 490px !important;
    overflow-y: auto;
    user-select: text;
    position: relative;
    &.introductory {
      padding-top: 16px;
    }
    .message {
      user-select: text;
    }
    .user-info {
      user-select: text;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-right: 10px;
      margin: 20px 0;
      .avatar {
        margin-right: 16px;
      }
    }
    .assistant-info {
      user-select: text;
      display: flex;
      justify-content: start;
      margin: 20px 0;
      width: 100%;
      .avatar {
        margin-left: 0;
        margin-right: 16px;
        align-self: flex-start;
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
          color: var(--neutral6);
          border-bottom: 0;
          padding-left: 16px;
          background-color: var(--neutral0);
        }
        .el-collapse-item__wrap {
          color: var(--neutral6);
          background-color: var(--neutral0);
          border-bottom: 0;
          .el-collapse-item__content {
            color: var(--neutral6) !important;
            padding: 0;
          }
        }
      }
    }
    .bubble {
      width: 100%;
      display: inline-block;
      background-color: var(--bg-color-3);
      color: var(--neutral8);
      width: fit-content; /* 根据内容调整宽度 */
      border-radius: 4px;
      user-select: text !important;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      &.default-info {
        padding: 24px;
      }
      .default-info-header {
        font-size: 16px;
        font-weight: 600;
      }
      .default-info-desc {
        font-size: 13px;
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
            background-color: var(--bg-color-4);
            padding: 16px;
            margin: 8px 0;
            cursor: pointer;
            border-radius: 2px;
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
    .user-bubble {
      padding: 9px 9px 9px 9px;
      display: inline-block;
      // background-color: var(--neutral0);
      width: fit-content; /* 根据内容调整宽度 */
      border-radius: 3px;
      user-select: text !important;
      font-size: 15px;
      white-space: pre-line;
      &.default-info {
        padding: 10px;
      }
    }
    .avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 5px;
      //overflow: hidden;
      img {
        width: 100%;
        height: 40px;
        object-fit: cover;
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
.input-bottom-box {
  position: relative;
  width: 95%;
  //min-width: 960px;
  margin: 0 auto;

  ::v-deep .el-input .el-input__inner {
    height: 40px !important;
    padding-right: 50px !important;
  }
  ::v-deep .el-dialog__footer {
    border: 0 !important;
  }
  ::v-deep .el-textarea__inner {
    &::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
      background-color: rgba(0, 0, 0, 0) !important;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--scrollbar-color) !important;
    }
  }
  .clear-box,
  .stop-box {
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 104px;
    height: 32px;
    border-radius: 16px;
    background: var(--neutral1);
    cursor: pointer;
    .cb-iconfont {
      color: var(--neutral8);
    }
    .text {
      margin-left: 8px;
      font-size: 12px;
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
    position: absolute;
    right: 0;
    bottom: 91px;
    margin: 0;
    font-size: 12px;
    color: var(--primary-color);
    background-color: var(--primary-color-2);
    div {
      margin-left: 8px;
    }
    &:hover {
      background-color: var(--primary-color-4);
    }
  }
  .send-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
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
  line-height: 36px;
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
    margin: 0 8px 0 16px;
  }
}
</style>
<style lang="scss">
.AI-chat-dialog {
  .el-scrollbar__bar.is-horizontal {
    display: none !important;
  }
  .el-scrollbar__bar.is-vertical {
    display: none !important;
  }
  .el-dialog__body {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
  .el-dialog__footer {
    border: 0 !important;
  }

  .el-textarea__inner {
    resize: none;
  }

  .dialog-content {
    position: relative;
  }
  .title-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    .logo-wrap {
      width: 32px;
      height: 32px;
      display: inline-block;
      margin-right: 12px;
      background-color: var(--neutral1);
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .title-txt {
    font-size: 16px;
    color: var(--neutral8);
    cursor: pointer;
  }
}
.cb-markdown .markdown-body {
  padding: 2px 16px !important;
  //ol {
  //margin: 10px;
  //}
  //font-size: 15px;
  //line-height: 24px;
}
.cb-markdown .markdown-body pre,
.cb-markdown .markdown-body pre code {
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
  word-wrap: break-word;
  padding: 2px 16px !important;
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
</style>
