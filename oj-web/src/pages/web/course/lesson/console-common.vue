<template>
  <div
    class="console"
    :style="'height:' + iframeHeight + 'px;width:' + iframeWidth + 'px'"
    ref="nodeFrameDivRef"
  >
    <iframe
      ref="iframeConsole"
      :src="$route.query.url"
      scrolling="auto"
      width="100%"
      height="100%"
    />
    <div class="time-count" v-dragg>
      <cy-time-countdown
        v-if="sceneTime"
        :second="sceneTime"
        :status="sceneStatus"
        @countdownOver="countdownOver"
      ></cy-time-countdown>
    </div>
    <div class="countdown-box" v-if="startCountDown && times">
      <div class="time">{{ times }}</div>
      <div class="text">{{ $t('course.startHelp') }}</div>
    </div>
    <div class="help" v-if="allowHelp && roomId && image_type !== 'container'">
      <cb-button @click="needHelp" :disabled="!endhelp">{{
        $t('course.needHelp')
      }}</cb-button>
    </div>
    <div class="help-desc" v-if="helpStatus === HELP_STATUS.REQUESTING">
      {{ $t('course.receivingRemoteAssistance') }}
    </div>
    <div class="console-tool-box" v-if="userId">
      <console-tool
        ref="consoleTool"
        @changeTool="toolSwitch"
        :lesson-data="crEventData"
      ></console-tool>
    </div>
    <instruction-dialog
      ref="instructionDialog"
      @before-close="beforeClose"
    ></instruction-dialog>
    <scene-dialog
      ref="scene"
      :user-id="userId"
      :crEventDatas="crEventData"
      @before-close="beforeClose"
      @goIframe="gotoAccess"
    ></scene-dialog>
    <guide-dialog
      ref="guideDialog"
      :crEventDatas="crEventData"
      @before-close="beforeClose"
    ></guide-dialog>
    <my-notes-dialog
      ref="myNotes"
      @before-close="beforeClose"
    ></my-notes-dialog>
    <experiment-report
      ref="experimentReport"
      @before-close="beforeClose"
      @pos="getPos"
    ></experiment-report>
    <leave-message-dialog
      ref="leaveMessage"
      :comment-type-dialog="COMMENT_TYPE.LESSON"
      @before-close="beforeClose"
      :lessonName="lessonName"
      :coureName="coureName"
    ></leave-message-dialog>
    <!-- 顶部工具栏 -->
    <div
      v-if="showTool"
      class="top-tool-box"
      v-dragg
      v-resize="resize"
      ref="topToolRef"
    >
      <div class="top-tool-list">
        <div
          class="top-tool-list-item"
          @click="clickTool('clickScreen', $event)"
        >
          <cb-iconfont type="icon-jietu"></cb-iconfont> {{ $t('m.screenshot') }}
        </div>
        <div
          v-if="protocol !== 'console'"
          class="top-tool-list-item"
          @click="clickTool('clipboard', $event)"
        >
          <cb-iconfont type="icon-fuzhi"></cb-iconfont>
          {{ $t('course.clipboard') }}
        </div>
        <div
          v-if="protocol !== 'console'"
          class="top-tool-list-item"
          @click="clickTool('fileTransfer', $event)"
        >
          <cb-iconfont type="icon-chuanshu"></cb-iconfont>
          {{ $t('course.fileTransfer') }}
        </div>
        <div
          v-if="protocol !== 'ssh'"
          class="top-tool-list-item"
          @click="clickTool('ctrlAltDel', $event)"
        >
          <cb-iconfont type="icon-tuceng"></cb-iconfont>
          {{ $t('course.ctrlAltDel') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConsoleTool from './components/console-tool';
import Http from '@/utils/http.js';
import MyNotesDialog from './components/my-notes-dialog';
import ExperimentReport from './components/experiment-report';
import LeaveMessageDialog from './components/leave-message-dialog';
import SceneDialog from './components/scene-dialog';
import GuideDialog from './components/guide-dialog';
import InstructionDialog from './components/instruction-dialog';
import { triggerJmsEvent } from '@/api/remote/remote';
import { SHARE_MODEL, HELP_STATUS } from '@/pages/web/course/constant.js';
import utils from '@/utils/utils';
import wsutil from '@/utils/websocket';
import _ from 'lodash';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  COMMENT_TYPE,
} from '@/pages/web/course/constant.js';
export default {
  name: 'Console',
  components: {
    // TimeCountDown,
    ConsoleTool,
    MyNotesDialog,
    ExperimentReport,
    LeaveMessageDialog,
    SceneDialog,
    GuideDialog,
    InstructionDialog,
  },
  data() {
    return {
      passed: null,
      lessonReport: '',
      pos: {},
      text: '',
      HELP_STATUS,
      allowHelp: false,
      endhelp: true,
      timeOut: null,
      COMMENT_TYPE,
      frameUrl: '',
      lessonId: this.$route.params.lesson_id,
      courseId: this.$route.params.course_id,
      lessonName: this.$route.query.lessonName,
      coureName: this.$route.query.coureName,
      imgUrl: '',
      resetVal: '',
      iframeHeight: '',
      iframeWidth: '',
      crEventData: {},
      iframeImgUrl: '',
      sceneTime: 0,
      userId: this.$route.query.user_id,
      node_id: this.$route.query.nodeId,
      scene_id: this.$route.query.id,
      image_type: this.$route.query.image_type,
      protocol: this.$route.query.protocol || window.location.protocol,

      times: 3,
      timer: null,
      startCountDown: false,
      helpStatus: null,
      cookie: '',
      roomId: this.$route.query.roomId,
      group_id: this.$route.query.group_id,
      learnedType: '',
      disabledDrafts: false,
    };
  },
  directives: {
    dragg(el) {
      el.style.cursor = 'move';
      el.onmousedown = function (e) {
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false; // 解决快速频繁拖动滞后问题
        }
        document.onmousemove = function (e) {
          // 鼠标位置-鼠标相对元素位置=元素位置
          let left = e.clientX - disx;
          let top = e.clientY - disy;
          // 限制拖拽范围不超出可视区
          if (left <= 0) {
            left = 5; // 设置成5,离边缘不要太近
          } else if (
            left >
            document.documentElement.clientWidth - el.clientWidth
          ) {
            // document.documentElement.clientWidth屏幕可视区宽度
            left = document.documentElement.clientWidth - el.clientWidth - 5;
          }
          if (top <= 0) {
            top = 5;
          } else if (
            top >
            document.documentElement.clientHeight - el.clientHeight
          ) {
            top = document.documentElement.clientHeight - el.clientHeight - 5;
          }
          el.style.left = left + 'px';
          el.style.top = top + 'px';
        };
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        };
      };
    },

    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '',
          height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },
  },
  computed: {
    iframeContent() {
      return this.$refs.iframeConsole;
    },
    // 工具栏目前只能针对guacamole的ssh，rdp，console 可以实现
    // console是不支持文件传输的
    showTool() {
      if (
        this.image_type === 'vm' &&
        (this.protocol === 'ssh' ||
          this.protocol === 'rdp' ||
          this.protocol === 'console')
      ) {
        return true;
      }
      return false;
    },
  },
  created() {
    this.learnedType = this.$route.query.roomId ? 1 : 0;
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.$refs.iframeConsole.focus();
    this.getExport();
    this.iframeHeight = document.documentElement.clientHeight;
    this.iframeWidth = document.documentElement.clientWidth;
    this.getLessonInfo();
    this.setConnection();
    this.$nextTick(() => {
      this.$refs.iframeConsole.addEventListener('mouseover', (e) =>
        this.$refs.iframeConsole.focus(),
      );
    });
    if (this.$route.query.roomId) {
      window.addEventListener('beforeunload', (event) =>
        this.beforeunloadFn(event),
      );
    }
    // 添加监听浏览器窗口关闭的
    window.addEventListener('unload', (e) => this.unloadFn());
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.close();
      // this.setConfig(false); // 关闭聊天窗口
    }
    if (this.connection2) {
      this.connection2.close();
      this.connection2 = null;
    }
  },
  destroyed() {
    window.removeEventListener('unload', (e) => this.unloadFn());
    window.removeEventListener('beforeunload', (event) =>
      this.beforeunloadFn(),
    );
    clearTimeout(this.timeOut);
  },
  methods: {
    countdownOver() {
      if (!this.roomId) {
        this.$request
          .delete(
            '/oj/lesson/delete_scene',
            {
              resource_id: this.lessonId,
            },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.crEventData.scene_data = null;
            return false;
          });
      }
    },

    bindSceneWs() {
      let url = '';
      if (this.group_id != '') {
        if (this.roomId) {
          url = `/ojj/ws/oj/classroom/group/scene?group_id=${this.group_id}&token=${this.cookie}`;
        }
      } else {
        url = `/ojj/ws/course/lesson_scene?lesson_id=${this.lessonId}&shared=${
          this.crEventData.scene_share_mode != 1
        }&from_web=true&token=${this.cookie}`;
      }

      this.connection2 = wsutil.cbind(url, {
        1: (data) => {
          const scene = data.data.scene;
          if (data.type === 'scene') {
            if (scene.event === 6 || scene.event === 7) {
              if (scene.event_status === 4) {
                this.getSceneCommon();
              }
            }
          }
        },
        // 启动同步
        'OJ-1': (data) => {
          this.getSceneCommon();
        },
        // 删除同步
        'OJ-2': (data) => {
          this.getSceneCommon();
        },
        // 启动完成
        'OJ-3': (data) => {
          this.getSceneCommon();
        },
      });
    },
    getSceneCommon() {
      this.$request
        .get(
          'oj/lesson/scene_topo',
          {
            resource_id: this.lessonId,
            room_id: this.roomId || '',
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData = _.get(res, 'data.data');
          this.sceneTime =
            (this.crEventData.scene_data &&
              this.crEventData.scene_data.remaining_time) ||
            0;
          this.sceneStatus =
            this.crEventData.scene_data && this.crEventData.scene_data.status;
          //只有小组场景可以请求协助
          const shareMode =
            this.crEventData.scene_data &&
            this.crEventData.scene_data.scene_share_mode;
          if (shareMode && shareMode == SHARE_MODEL.GROUP) {
            this.allowHelp = true;
            this.getHelpStatus();
          }
        });
    },
    beforeunloadFn(event) {
      // 显示确认对话框
      if (this.helpStatus === this.HELP_STATUS.REQUESTING) {
        event.preventDefault();
        // 为了兼容处理，Chrome需要设置returnValue
        event.returnValue = '您确定要关闭窗口吗';
        return '您确定要关闭窗口吗';
      }
    },
    getHelpStatus() {
      this.$request
        .get(
          '/oj/course/class/room/help_status',
          {
            lesson_id: this.$route.params.lesson_id,
            node_id: this.$route.query.nodeId,
            room_id: this.roomId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.helpStatus = _.get(res, 'data.data.status');
        });
    },
    setConnection() {
      // 聊天ws
      // /ws/oj/classroom/help?classroom_id=&token
      this.connection = wsutil.bind(
        `/ojj/ws/oj/classroom/help?classroom_id=${this.roomId}&token=${this.cookie}`,
        (data) => {
          if (data.code === 'OJ-4') {
            this.startCountDown = true;
            this.times = 3;
            this.getTime();
          } else if (data.code === 'OJ-5') {
            this.getHelpStatus();
          }
        },
      );
    },
    gotoAccess(val, access_modes, nodeId) {
      this.$request
        .post(
          '/cscene/cscene_instances/get_connection',
          {
            access_mode_id: access_modes.id,
            context: {
              access_user_id: this.userId,
              pass_through: {},
            },
            id: this.$route.query.id,
            node_id: nodeId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const url = this.$router.resolve({
            name: 'ojweb-course-console',
            params: {
              id: this.$route.params.id,
              course_id: this.courseId,
              lesson_id: this.lessonId,
            },
            query: {
              type: 'web',
              url: _.get(res, 'data.data.connection_url'),
              nodeId: nodeId,
              conId: _.get(res, 'data.data.connection_id'),
              id: this.$route.query.id,
              roomId: this.roomId,
            },
          });

          window.open(url.href, '_blank');
        });
    },
    unloadFn() {
      this.$request
        .post(
          '/cscene/cscene_instances/disable_recording',
          {
            connection_id: this.$route.query.conId,
            context: {
              access_user_id: this.userId,
              pass_through: {},
            },
            id: this.$route.query.id,
            node_id: this.$route.query.nodeId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {});
    },
    //请求协助
    needHelp() {
      this.$request
        .patch(
          '/oj/course/class/room/need_help',
          {
            lesson_id: this.lessonId,
            node_id: this.$route.query.nodeId,
            room_id: this.roomId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.helpSuccess'));
          this.endhelp = false;
          this.timeOut = setTimeout(() => {
            this.endhelp = true;
          }, 300000);
        });
    },
    getTime() {
      this.timer = setInterval(() => {
        this.times--;
        if (this.times === 0) {
          this.startCountDown = false;
          clearInterval(this.timer);
          this.getHelpStatus();
        }
      }, 1000);
    },
    // 获取课时详情
    getLessonInfo() {
      this.$request
        .get(
          '/oj/lesson',
          {
            course_id: this.courseId,
            lesson_id: this.lessonId,
            room_id: this.roomId,
            learned_type: this.learnedType,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData = res.data.data;
          this.sceneTime = res.data.data.scene_data.remaining_time || 0;
          this.sceneStatus = res.data.data.scene_data.status;
          //只有小组场景可以请求协助
          const shareMode = res.data.data.scene_data.scene_share_mode;
          if (shareMode && shareMode == SHARE_MODEL.GROUP) {
            this.allowHelp = true;
            this.getHelpStatus();
          }
          this.bindSceneWs();
        });
    },
    // 工具栏切换
    toolSwitch(val) {
      this.$refs.instructionDialog.dialogInstruction = false;
      this.$refs.guideDialog.dialogGuide = false;
      this.$refs.scene.dialogScene = false;
      this.$refs.myNotes.dialogNotes = false;
      this.$refs.experimentReport.dialogReport = false;
      this.$refs.leaveMessage.dialogMessage = false;
      if (val === 'desc') {
        // 说明
        this.$refs.instructionDialog.dialogInstruction = true;
      } else if (val === 'help') {
        // 求助
        Http.patchAxios(
          '/course/lessons/' + this.lessonId + '/need_help/',
          {},
          {},
        )
          .then((res) => {
            this.$message({
              message: this.$t('m.helpSuccess'),
              type: 'success',
            });
          })
          .catch((res) => {});
      } else if (val === 'guide') {
        // 指导
        this.$refs.guideDialog.dialogGuide = true;
      } else if (val === 'scene') {
        // 场景
        this.$refs.scene.dialogScene = true;
      } else if (val === 'notes') {
        // 笔记
        this.$refs.myNotes.dialogNotes = true;
        this.$refs.myNotes.getLessonNotes();
      } else if (val === 'report') {
        // 实验报告
        this.$refs.experimentReport.dialogReport = true;
        this.$refs.experimentReport.getLessonReport();
      } else if (val === 'message') {
        // 留言
        this.$refs.leaveMessage.dialogMessage = true;
        this.$refs.leaveMessage.getLeaveMessage();
      } else if (val === 'screenshot') {
        // 截屏
        const that = this;
        let iframeUrl = '';
        iframeUrl = this.$route.query.url;
        this.getExport();
        this.webScreen(this.iframeContent, iframeUrl);
      }
    },
    webScreen(iframeContent, iframeUrl) {
      const that = this;
      triggerJmsEvent(
        iframeContent.contentWindow,
        iframeUrl,
        'captureScreen',
        null,
        (dataUrl) => {
          console.log('dataUrl', dataUrl);

          if (this.passed === false) {
            that.uploadImg(dataUrl);
          }
          if (this.passed === true) {
            this.$message.error(this.$t('m.screenErrorMessage'));
          }
        },
      );
    },
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    uploadImg(iframeImgUrl) {
      const that = this;
      const imgFile = that.dataURLtoFile(
        iframeImgUrl,
        `${this.$t('m.screenshot')}.png`,
      );

      var formdata = new FormData();
      formdata.append('file', imgFile);
      formdata.append(
        'scene_name',
        this.crEventData.scene_data.scene.topology.scene.name,
      );
      formdata.append('node_id', this.node_id);
      formdata.append('scene', this.scene_id);
      this.$request
        .post('/devops/cluster/screenshot/upload', formdata, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          that.iframeImgUrl = res.data.data.file;
          // 判断光标位置pos对象是否为空
          if (!_.isEmpty(this.pos)) {
            if (this.text) {
              const finalText = this.addStr(
                this.lessonReport,
                '\n![截图](' + this.iframeImgUrl + ')\n',
                this.text,
              );
              this.resetVal = finalText;
            } else {
              // 如果文本是空的,在某一行的首个字符
              const index = this.find(this.lessonReport, '\n', this.pos.line);
              const newText =
                this.lessonReport.slice(0, index) +
                '\n![截图](' +
                this.iframeImgUrl +
                ')\n' +
                this.lessonReport.slice(index);
              this.resetVal = newText;
            }
          } else {
            // 如果没有点击报告直接选择的截图，放在最后
            this.resetVal =
              this.lessonReport + '\n![截图](' + this.iframeImgUrl + ')\n';
          }
          this.submit(this.resetVal, this.iframeImgUrl);
        })
        .catch((res) => {});
    },
    // 获取实验报告
    getExport() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.lessonId,
            note_type: NOTE_TYPE.REPORT,
            resource_type: RESOURCE_TYPE.LESSON,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const lessonReport = res.data.data.content || '';
          this.lessonReport = lessonReport;
          this.passed = res.data.data.passed || false;
          // 判断存草稿是否可用
          this.disabledDrafts = _.get(res, 'data.data.is_submit', false);
        });
    },
    // 查找字符出现位置
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },

    addStr(oldStr, addItem, afterWhich) {
      // 在指定字符串后面添加指定字符串
      var strArr = oldStr.split('');
      strArr.splice(oldStr.indexOf(afterWhich) + afterWhich.length, 0, addItem);
      return strArr.join('');
    },
    // 提交实验报告
    submit(val, imgUrl) {
      this.$request
        .post(
          '/oj/note/report',
          {
            business_id: this.lessonId,
            content: val,
            operate: this.disabledDrafts ? true : false,
            scene_screenshot: imgUrl,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.saveSuccessful'));
        });
    },
    beforeClose(val) {
      this.$refs.iframeConsole.focus();
      this.$refs.consoleTool.dialogClose(val);
    },
    getPos(pos, text) {
      this.pos = pos;
      this.text = text;
    },

    // 顶部工具栏对应操作
    clickTool(type, e) {
      if (type === 'clickScreen') {
        this.clickScreen();
      } else if (type === 'clipboard') {
        this.clipboard();
      } else if (type === 'fileTransfer') {
        this.fileTransfer();
      } else if (type === 'ctrlAltDel') {
        this.ctrlAltDel();
      }
    },
    // 截屏
    clickScreen() {
      let iframeUrl = this.$route.query.url;
      this.getExport();
      this.webScreen(this.iframeContent, iframeUrl);
    },
    clipboard() {
      // 剪切板
      let iframeUrl = this.$route.query.url;
      triggerJmsEvent(
        this.iframeContent.contentWindow,
        iframeUrl,
        'clipBoard',
        null,
        () => {},
      );
    },
    fileTransfer() {
      // 文件传输
      let iframeUrl = this.$route.query.url;
      triggerJmsEvent(
        this.iframeContent.contentWindow,
        iframeUrl,
        'fileTransfer',
        null,
        () => {},
      );
    },
    ctrlAltDel() {
      // ctrlAltDel
      let iframeUrl = this.$route.query.url;
      triggerJmsEvent(
        this.iframeContent.contentWindow,
        iframeUrl,
        'ctrlAltDel',
        null,
        () => {},
      );
    },
    resize() {
      if (this.$refs.topToolRef && this.$refs.nodeFrameDivRef) {
        const topToolLeft = this.$refs.topToolRef.offsetLeft;
        const toolBarWidth = this.$refs.nodeFrameDivRef.offsetWidth;
        const topToolWidth2 = this.$refs.topToolRef.offsetWidth;
        if (toolBarWidth - topToolLeft <= topToolWidth2) {
          this.$refs.topToolRef.style.left = null;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.console {
  position: absolute;
  .time-count {
    position: fixed;
    top: 25px;
    left: 47%;
    // transform: translateX(-50%);
    z-index: 2000;
  }
  .countdown-box {
    width: 286px;
    height: 214px;
    background: var(--bg-color-2);
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--neutral8);
    .time {
      width: 72px;
      height: 72px;
      border: 4px solid var(--orange-color);
      border-radius: 36px;
      font-size: 32px;
      line-height: 60px;
      color: var(--orange-color);
      margin: 48px auto 24px;
    }
  }
  .help {
    position: fixed;
    top: 25px;
    left: 60%;
    z-index: 2000;
  }
  .help-desc {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 2000;
    padding: 3px 16px;
    color: var(--orange-color);
    display: inline-block;
  }

  //  .item-box {
  //         display: inline-block;
  //         padding: 2px 8px;
  //         margin: 0 8px 8px 0;
  //         position: relative;
  //       }
  //       .item-box::before {
  //         content: '';
  //         position: absolute;
  //         inset: 0;
  //         background: var(--bg-color-sixth);
  //         opacity: 0.2;
  //       }
  .console-tool-box {
    border-radius: 2px 0 0 2px;
    position: fixed;
    right: 0;
    top: 240px;
    z-index: 2000;
  }
  .top-tool-box {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 222;
    background: var(--bg-color-3);
    color: var(--neutral8);
    font-size: 14px;
    display: inline-flex;
    height: 32px;
    line-height: 32px;
    width: fit-content;
    .cb-iconfont {
      color: var(--neutral8);
    }
    .top-tool-list {
      transition: 2s;
      background: var(--bg-color-2);
      display: flex;
      .top-tool-list-item {
        margin: 0 4px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
      }
    }
  }
}
</style>
<style lang="scss">
.console-tool-box {
  background: var(--bg-color-2);
}
</style>
