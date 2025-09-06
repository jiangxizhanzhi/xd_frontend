<template>
  <div class="char-page" />
</template>
<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { layim } from './im/layim.js';
export default {
  data() {
    return {
      connection: null,
      userId: '',
      resource_id: '',
      curMessage: null,
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params.lessonId;
    this.cookie = utils.getCookie('cr_jwttoken');
  },
  mounted() {
    this.setConnection();
    this.setConfig(true);
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.close();
      this.setConfig(false); // 关闭聊天窗口
    }
  },
  methods: {
    setConnection() {
      // 聊天ws
      this.connection = wsutil.bind(
        `/ojj/ws/oj/classroom/chat?business_id=${this.resource_id}&token=${this.cookie}&business_type=1`,
        (data) => {},
      );
    },
    setConfig(params) {
      const _this = this;
      if (!params) {
        const nodes = document.querySelectorAll(
          '.layui-layer, .layui-layer-move',
        );
        for (const key in nodes) {
          if (typeof nodes[key] === 'object') {
            nodes[key].remove();
          }
        }
      } else {
        // 获取控制面板信息,好友信息

        layim.config({
          init: {
            url:
              process.env.VUE_JAVA_APP_BASE_API +
              '/oj/course/class/room/chat/users',
            data: { room_id: _this.resource_id },
          },
          // 查看群员接口
          members: {
            url:
              process.env.VUE_JAVA_APP_BASE_API +
              '/oj/course/class/room/chat/members_info',
            data: { room_id: _this.resource_id },
          },
          // 获取当前服务器时间
          timeinit: {
            url: process.env.VUE_JAVA_APP_BASE_API + '/cr/common/current_time',
            data: {},
          },
          min: true,
        });
        if (!_this.connection) {
          _this.setConnection();
        }
        // 监听发送消息
        layim.on('sendMessage', function (data) {
          _this.connection.send(
            JSON.stringify({
              type: 'chatMessage', // 随便定义，用于在服务端区分消息类型
              data: data,
            }),
          );
        });
        // 监听收到的聊天消息
        _this.connection.onmessage = function (evt) {
          // 接受返回的数据
          const data = JSON.parse(evt.data);
          layim.getMessage({
            name: data.name,
            username: data.username,
            avatar: data.avatar,
            id: data.id,
            type: data.type,
            time: data.time,
            content: data.content,
            role: data.role,
          });
        };
        // 监听在线状态的切换事件
        // layim.on('online', function(data) {
        // })
        // layim建立就绪
        layim.on('ready', function (res) {});
        // 监听查看群员
        layim.on('members', function (data) {});
        // 监听聊天窗口的切换
        layim.on('chatChange', function (data) {});
      }
    },
  },
};
</script>
<style lang="scss">
.layim-chat-text {
  word-wrap: break-word;
  max-width: 462px;
}
.layim-chat-textarea textarea {
  display: block;
  width: 100%;
  padding: 5px 0 0 0;
  height: 68px;
  line-height: 20px;
  border: none;
  overflow: auto;
  resize: none;
  background: none;
  border: none !important;
}
.layim-chat-list li span,
.layui-layim-min .layui-layer-content span {
  width: auto;
  padding-left: 10px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  color: var(--neutral8);
  text-overflow: ellipsis;
}

.layui-layim-min,
.layui-layim-close {
  // transform: translateX(80%);
  animation: none !important;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateX(0);
  }
}
.layui-layer-setwin a {
  vertical-align: middle;
}
</style>
