import IndexDB from '../utils/indexDB';
import _ from 'lodash';
import logoIcon from '@/assets/icon/chat-ai.png';
import { getImagePromise, isJSON } from '@cyber/scene/src/utils/common/index';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getKnapsackData } from '../api/intelligence';
import { getToken } from '@cyber/helper';
import { v4 as uuidv4 } from 'uuid';
import { jsonSafeParse } from '../utils';

export const mixins = {
  data() {
    return {
      eventSource: null, // 聊天连接
      controller: null,

      logoIcon: logoIcon,
      userAvatarBase64: '', // 用户头像 base64

      chatData: [],

      // 数据库存储
      storeName: 'cyberpeace-ai',
      tableName: 'chat',

      isAnswering: false,

      currentModel: {}, // 当前选择的智能体
      // 智能体列表
      modelList: [],

      intelligenceList: [], // 智能体模块列表
      intelligenceListComputed: [], // 智能体去掉默认
      disableSend: false, // 是否允许发送
      showStopBtn: false, // 是否展示停止回答按钮
      isShowConversation: true, // 是否展示聊天内容

      userQuestion: '',
      tempAssistantAnswer: '', // 临时存储模型回答，实现打字机效果
      tempAssistantThinking: '', // 临时存储模型思考过程

      isIntelligenceHello: false, // 是否展示智能体模块列表
      hoverData: '', // 鼠左侧标悬浮的智能体
      activeCollapse: [], // 折叠面板展开序号
      deepThinkingStatus: null, // 深度思考状态， 1： 进行中， 0：已结束
      deepThinkingTime: 0, // 思考时长
      deepThinkingTimeInterval: null, // 时长计时器
      wheelHandler: null, // 鼠标滚轮监听器
      manualScrollEnabled: false, // 是否展示滚动到底部的按钮
      isMouseScrolling: false, // 鼠标是否正在滚动
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
    // 是否是首次会话
    isEmpty() {
      return this.chatData?.length == 0;
    },
    currentData() {
      return {
        header: this.$t('intelligence.helloTxt', {
          name: this.currentModel.name,
        }),
        desc: this.currentModel.description,
        statements: this.currentModel.sample_queries,
        knowledge_base_name: this.currentModel.knowledge_base_name,
      };
    },
    // 左侧选到的智能体，做排序，默认排在第一位
    modelListComputed() {
      let copyModelList = _.cloneDeep(this.modelList);
      if (copyModelList?.length > 1) {
        let defaultIndex = copyModelList?.findIndex(
          (item) => item.knowledge_base_name === 'cyberpeace',
        );
        if (defaultIndex >= 0) {
          let data = _.cloneDeep(copyModelList[defaultIndex]);
          copyModelList.splice(defaultIndex, 1);
          return _.uniq([data, ...copyModelList]);
        }
      }
      return copyModelList;
    },
  },
  created() {},
  watch: {
    isMouseScrolling: {
      handler(val, oldVal) {
        if (oldVal === false && val === true) {
          let timer = setTimeout(() => {
            this.isMouseScrolling = false;
            clearTimeout(timer);
          }, 800);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.wheelHandler = _.debounce(() => {
      this.isMouseScrolling = true;
      // this.$nextTick(() => {
      if (this.$refs?.intelligenceRef) {
        const {
          scrollTop = 0,
          scrollHeight = 0,
          clientHeight = 0,
        } = this.$refs?.intelligenceRef;
        const newDistance = scrollHeight - (scrollTop + clientHeight);
        this.manualScrollEnabled = newDistance > 200; // 距离底部自动滚动的阈值（像素）
      }
      if (this.$refs?.chatRef) {
        const {
          scrollTop = 0,
          scrollHeight = 0,
          clientHeight = 0,
        } = this.$refs?.chatRef;
        const newDistance = scrollHeight - (scrollTop + clientHeight);
        this.manualScrollEnabled = newDistance > 50; // 距离底部自动滚动的阈值（像素）
      }
    });
    // }, 200);
    // 根据滚动动画时间重置标记
    window.addEventListener('wheel', this.wheelHandler);
  },
  methods: {
    /**
     * 数据库相关的增删改查操作
     * @param type
     * @param DATA
     * @returns {Promise<void>}
     */
    async handleIndexDBChatData(type, DATA) {
      let _data = await IndexDB.dbOperationAI(
        this.storeName,
        this.tableName,
        'find',
        null,
        `${this.userInfo.id}_${
          DATA?.knowledge_base_name || this.currentModel.knowledge_base_name
        }`,
      );
      if (type === 'get') {
        return _data?.data || [];
      }
      if (type === 'delete') {
        await IndexDB.dbOperationAI(
          this.storeName,
          this.tableName,
          'delete',
          null,
          `${this.userInfo.id}_${DATA?.knowledge_base_name}`,
        );
        return;
      }
      if (type === 'init') {
        if (!_data) {
          await this.initChatInfo();
          return;
        }
        this.chatData = _data.data;
        return;
      }
      if (type === 'put' || 'put-not-update-chat') {
        if (
          DATA.id?.indexOf('undefined') < 0 &&
          DATA.id?.indexOf(this.userInfo.id) >= 0
        ) {
          let newData = DATA?.data;
          if (!_.isEmpty(_data?.data)) {
            newData = [...(_data.data || []), ...(DATA?.data || [])];
          }
          let saveData = {
            ...DATA,
            data: newData,
          };
          if (type === 'put') {
            this.chatData = newData;
          }
          await IndexDB.dbOperationAI(
            this.storeName,
            this.tableName,
            'put',
            saveData,
          );
        }
        return;
      }
    },
    /**
     * 初始化欢迎语数据
     */
    async initChatInfo() {
      let data = {
        id: `${this.userInfo.id}_${this.currentModel.knowledge_base_name}`,
        data: [],
        ...this.currentModel,
      };
      this.chatData = data.data;
      await IndexDB.dbOperationAI(this.storeName, this.tableName, 'put', data);
    },
    // 存储用户头像
    getUserAvatar() {
      if (!this.userAvatarBase64) {
        getImagePromise(this.$store.state.user.avatar).then((res) => {
          this.userAvatarBase64 = res;
        });
      }
    },
    // 清空当前智能体的对话数据
    async clearChatContent() {
      this.isShowConversation = false;
      await this.initChatInfo();
    },
    // 智能体选择事件处理
    async handleAddIntelligence(data) {
      this.currentModel = data;
      if (
        !this.modelList?.some(
          (item) => item.knowledge_base_name === data.knowledge_base_name,
        )
      ) {
        this.modelList.push({
          id: `${this.userInfo.id}_${this.currentModel.knowledge_base_name}`,
          ...data,
        });
        let saveData = {
          id: `${this.userInfo.id}_${this.currentModel.knowledge_base_name}`,
          data: [],
          ...this.currentModel,
        };
        await this.handleIndexDBChatData('put', saveData);
        this.isIntelligenceHello = false;
      } else {
        // this.currentModel = data;
        await this.setIntelligence(data);
      }
    },
    // 获取智能体列表
    getKnapsackDataFunc(isInit) {
      return new Promise((resolve) => {
        getKnapsackData(undefined).then((res) => {
          if (isInit) {
            if (!this.modelList?.length) {
              this.modelList =
                [
                  {
                    ...res?.data?.data[0],
                    id: `${this.userInfo.id}_${this.currentModel.knowledge_base_name}`,
                  },
                ] || [];
              this.currentModel = res?.data?.data[0];
            }
          }
          this.intelligenceList = res?.data?.data || [];
          this.intelligenceListComputed = this.intelligenceList?.filter(
            (item) => item.knowledge_base_name != 'cyberpeace',
          );
          resolve();
        });
      });
    },
    // 切换智能体
    async setIntelligence(data) {
      this.closeConnection();
      this.currentModel = {
        ...data,
        sample_queries:
          this.intelligenceList?.find(
            (intelligence) =>
              intelligence.knowledge_base_name === data.knowledge_base_name,
          )?.sample_queries || data.sample_queries,
        // model_name:
        //   this.intelligenceList?.find(
        //     (intelligence) =>
        //       intelligence.knowledge_base_name === data.knowledge_base_name,
        //   )?.model_name || data.model_name,
      };
      this.isShowConversation = true;
      this.isIntelligenceHello = false;
      this.hoverData = '';
      this.isAnswering = false;
      this.disableSend = false;
      this.showStopBtn = false;
      this.activeCollapse = [];
      let history = await this.handleIndexDBChatData('get', null);
      if (history?.length) {
        this.chatData = history;
      } else {
        this.chatData = history;
      }
      this.scrollToBottom();
    },
    async initAI() {
      let currentData = await IndexDB.dbOperationAI(
        this.storeName,
        this.tableName,
        'getAll',
      );
      if (!this.intelligenceList?.length) {
        await this.getKnapsackDataFunc();
      }
      if (
        currentData?.length &&
        currentData.some((item) => item.id.indexOf(this.userInfo.id) >= 0)
      ) {
        // 如果有数据库记录则直接取
        this.modelList = _.compact(
          currentData?.map((item) => {
            let { data, ...params } = item;
            if (
              params.id.indexOf('undefined') < 0 &&
              params.id.indexOf(this.userInfo.id) >= 0
            ) {
              return {
                ...params,
              };
            }
          }),
        );
        // 默认选中第一条智能体数据
        await this.setIntelligence(this.modelListComputed[0]);
      } else {
        // 调用智能体列表 并将第一条数据作为默认智能体 初始化数据库
        this.getKnapsackDataFunc(true).then(async () => {
          // 创建数据库存储聊天记录
          await IndexDB.dbInitAI(this.storeName, this.tableName);
          // 初始化数据库聊天记录
          await this.handleIndexDBChatData('init', null);
        });
      }
    },
    // 发送聊天
    async sendChatContent() {
      this.controller = new AbortController();
      this.disableSend = true;
      this.isShowConversation = true;
      const _currentModel = _.cloneDeep(this.currentModel);
      if (
        !this.userQuestion ||
        !this.userQuestion.trim() ||
        this.deepThinkingStatus ||
        this.isAnswering
      )
        return;
      const that = this;
      this.isAnswering = true;
      // 本地存储聊天记录 id 存储了智能体名称，智能体之间的聊天记录分割
      await this.handleIndexDBChatData('put', {
        id: `${this.userInfo.id}_${_currentModel.knowledge_base_name}`,
        data: [
          {
            role: 'user',
            content: this.userQuestion,
          },
        ],
        ..._currentModel,
      });
      let history = await that.handleIndexDBChatData('get', null);
      // 处理历史记录，只保留user和content两个属性
      let messages = JSON.parse(JSON.stringify(history?.slice(-6)))?.map(
        (item) => ({
          role: item.role,
          content: item.content,
        }),
      );
      let params = {
        messages: messages,
        stream: true,
        token: getToken(),
        agent: _currentModel.knowledge_base_name,
        conversation_id: uuidv4(),
      };
      this.chatData.push({
        role: 'assistant',
        content: '',
        thinking: '', //思考过程
        deepThinkingTime: 0,
      });
      this.scrollToBottom(true);
      this.tempAssistantAnswer = '';
      this.tempAssistantThinking = '';
      this.userQuestion = '';
      this.deepThinkingTime = 0; // 重置思考时长
      // 计算思考时长
      this.deepThinkingTimeInterval = setInterval(() => {
        this.deepThinkingTime += 1;
      }, 1000);
      let chartUrl =
        _currentModel.knowledge_base_name === 'report'
          ? '/knapsack/info/v1/chat/generate_talent_report'
          : '/knapsack/info/v1/chat/completions';
      // 如果是人才画像，使用这个接口：'/knapsack/info/v1/chat/generate_talent_report'
      this.eventSource = await fetchEventSource(chartUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: that.controller.signal,
        openWhenHidden: true,
        /**
             *在onopen阶段处理
             第一步：判断resp.headers.get('content-type')，如果不包含text/event-stream，
             则代表非流式
             第二步：需要在onopen阶段处理非流式返回，即json返回,读取json返回并渲染，注意异常也要处理
           */
        async onopen(resp) {
          const contentType = resp.headers.get('content-type') || '';
          if (resp.ok && !contentType.includes('text/event-stream')) {
            // 读取json数据
            const responseData = await resp.json();
            that.tempAssistantAnswer =
              responseData.message || that.$t('intelligence.profileAnswer');
            that.chatData[that.chatData.length - 1].content =
              that.tempAssistantAnswer;
            that.chatData[that.chatData.length - 1].report_id =
              responseData.data?.report_id;
            that.chatData[that.chatData.length - 1].report_name =
              responseData.data?.report_name;
            that.closeConnection();
            if (!that.isMouseScrolling && !that.manualScrollEnabled) {
              that.chatScrollBottom();
            }
          }
        },
        onmessage(ev) {
          that.showStopBtn = true;
          // 最后一项即为正在回答的项
          if (
            !that.activeCollapse?.some(
              (item) => item === 'thinking-' + (that.chatData.length - 1),
            )
          ) {
            that.activeCollapse.push('thinking-' + (that.chatData.length - 1));
          }
          if (ev?.data) {
            // 跳过 SSE 心跳消息（以冒号开头）
            if (ev?.data.startsWith(':')) {
              return; // 跳过处理
            }
            try {
              if (isJSON(ev.data)) {
                let data = jsonSafeParse.parse(ev.data);
                // 获取标记 is_final_answer ， bool型，false表示为思考过程
                let answer = data?.choices[0]?.delta?.content || '';
                let result = '';
                // that.tempAssistantAnswer += answer || '';
                result = that.handleReplyData(
                  answer,
                  false,
                  data?.is_final_answer,
                );
                that.chatData[that.chatData.length - 1].thinking =
                  result?.thinking;
                that.chatData[that.chatData.length - 1].content =
                  result?.content;
                that.chatData[that.chatData.length - 1].deepThinkingTime =
                  that.deepThinkingTime;
                if (!that.isMouseScrolling && !that.manualScrollEnabled) {
                  that.chatScrollBottom();
                }
              }
            } catch (err) {
              // console.error('解析失败的非 JSON 数据:', ev.data);
            }
          }
        },
        onerror(err) {
          that.closeConnection();
          if (err) {
            console.log('err', err);
            throw err;
          }
        },
      }).catch((err) => {});
      this.isAnswering = false;
      this.disableSend = false;
      this.showStopBtn = false;
      let data = {
        id: `${this.userInfo.id}_${_currentModel.knowledge_base_name}`,
        data: [
          {
            role: 'assistant',
            content:
              that.tempAssistantAnswer || this.$t('intelligence.errorTxt'),
            thinking: that.tempAssistantThinking,
            deepThinkingTime: this.deepThinkingTime || 0,
            report_id: that.chatData[that.chatData.length - 1].report_id,
            report_name: that.chatData[that.chatData.length - 1].report_name,
          },
        ],
        ..._currentModel,
      };
      await this.handleIndexDBChatData('put-not-update-chat', data);
      that.tempAssistantAnswer = '';
      that.tempAssistantThinking = '';
    },
    closeConnection() {
      this.controller?.abort();
      this.eventSource?.close();
      this.eventSource = null;
      this.isAnswering = false;
      this.showStopBtn = false;
      if (this.deepThinkingStatus) {
        this.resetDeepThinkStatus();
      }
    },
    resetDeepThinkStatus() {
      clearInterval(this.deepThinkingTimeInterval);
      this.deepThinkingTimeInterval = null;
      this.deepThinkingStatus = 0;
      if (this.activeCollapse.length) {
        // 移除activeCollapse最后一项
        let lastIndex = this.activeCollapse?.findIndex(
          (item) => item === 'thinking-' + (this.chatData.length - 1),
        );
        if (lastIndex >= 0) {
          this.activeCollapse.splice(lastIndex, 1);
        }
      }
    },
    stopConnection() {
      this.closeConnection();
    },
    scrollToBottom(smooth) {
      this.manualScrollEnabled = false;
      if (smooth) {
        this.$nextTick(() => {
          this.$refs.chatRef?.scrollTo({
            top: this.$refs?.chatRef?.scrollHeight,
            behavior: 'smooth',
          });
          this.$refs.intelligenceRef?.scrollTo({
            top: this.$refs?.intelligenceRef?.scrollHeight,
            behavior: 'smooth',
          });
        });
      } else {
        if (this.$refs.leftWrapper?.clientHeight) {
          this.$nextTick(() => {
            this.messageHeight =
              this.$refs.leftWrapper?.clientHeight - 130 - 76 - 30 + 'px';
          });
        }
        this.$nextTick(() => {
          this.$refs.chatRef &&
            (this.$refs.chatRef.scrollTop = this.$refs?.chatRef?.scrollHeight);
        });
        this.$nextTick(() => {
          this.$refs.intelligenceRef &&
            (this.$refs.intelligenceRef.scrollTop =
              this.$refs?.intelligenceRef?.scrollHeight);
        });
      }
    },
    /**
     * 聊天记录滚到底部
     */
    chatScrollBottom() {
      this.manualScrollEnabled = false;
      this.$nextTick(() => {
        this.scrollToBottom(true);
      });
    },
    // 处理键盘输入
    handleKeyCode(event) {
      if (event.keyCode === 13) {
        if (!event.ctrlKey && !event.shiftKey) {
          event.preventDefault();
          this.sendChatContent();
        } else {
          this.userQuestion += '\n';
        }
      }
    },
    // 动态监听和修改回答内容
    handleReplyData(_str, completed, is_final_answer) {
      // let thinking = '';
      // let content = '';
      let str = _str;
      str = str.replaceAll('[[snlink]]', '<');
      str = str.replaceAll('[[/snlink]]', '>');
      // 替换 <think> 和 </think> 为 \n
      str = str.replace(/<think>|<\/think>/g, '\n');
      if (is_final_answer) {
        // 最终回答
        this.resetDeepThinkStatus();
        this.tempAssistantAnswer += str;
      } else {
        this.tempAssistantThinking += str;
        // 思考过程
        this.deepThinkingStatus = 1;
      }
      if (completed) {
        clearInterval(this.deepThinkingTimeInterval);
        this.deepThinkingTimeInterval = null;
      }
      return {
        // thinking: thinking?.trim()?.replace(/^\n+|\n+$/g, '') || '',
        thinking: this.tempAssistantThinking || '',
        content: this.tempAssistantAnswer || '',
        deepThinkingTimeInterval: this.deepThinkingTime,
      };
    },
    // 计算 思考中 状态是对应的index值
    computedLast() {
      if (this.activeCollapse.length) {
        return this.activeCollapse[0]?.replace(/[^\d]/g, ' ');
      } else {
        return '';
      }
    },
    // 思考时长秒数的格式化
    computedDeepThinkingTime(data) {
      if (data) {
        return (
          this.$t('intelligence.deepThinkCompleted') +
          '（ ' +
          data +
          this.$t('systemOperation.scene.second') +
          ' ）'
        );
      } else {
        return this.$t('intelligence.deepThinkCompleted');
      }
    },
  },
  beforeDestroy() {
    this.closeConnection();
    clearInterval(this.deepThinkingTimeInterval);
    this.deepThinkingTimeInterval = null;
    window.removeEventListener('wheel', this.wheelHandler);
  },
};
