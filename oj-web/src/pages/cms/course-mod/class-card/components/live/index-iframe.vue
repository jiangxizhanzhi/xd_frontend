<template>
  <div class="content">
    <div v-show="pc" class="video-wrapper">
      <video autoplay playsinline id="deskVideo"></video>
      <cb-button
        hollow
        buttonType="confirm"
        @click="stopLive(true)"
        class="stop-live-btn"
        >{{ $t('live.stopLive') }}</cb-button
      >
    </div>
    <div v-show="!pc" class="live-wrapper">
      <div
        class="default-bg"
        :style="{ backgroundImage: 'url(' + deskBg + ')' }"
      ></div>
      <cb-button class="live-btn" @click="startLive">{{
        $t('live.startLive')
      }}</cb-button>
    </div>
    <cb-dialog
      :title="$t('live.securityPolicies')"
      v-if="visible"
      :visible.sync="visible"
      width="1000px"
      top="30px"
    >
      <div class="dialog-content cyber-scroll-bar-small">
        <div class="process">
          <p>
            {{ $t('live.firstTip')
            }}<span @click="goto"
              >chrome://flags/#unsafely-treat-insecure-origin-as-secure</span
            >
          </p>
        </div>
        <div class="process">
          <p>{{ $t('live.secondTip') }}</p>
          <div class="img-wrap">
            <img :src="secondImg" alt="" />
          </div>
        </div>
        <div class="process">
          <p>{{ $t('live.thirdTip') }}</p>
          <div class="img-wrap">
            <img :src="thirdImg" alt="" />
          </div>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
import { postPublishUrl } from '../../../../../../api/course';
import deskBg from '@/assets/img/course/desk-bg.png';
import secondImg from '@/assets/img/course/second-process.png';
import thirdImg from '@/assets/img/course/third-process.png';

export default {
  name: 'index',
  components: {},
  props: {},
  data() {
    return {
      language: getLanguage(),
      pc: null,
      tracks: null,
      publishUrl: '',
      deskBg: deskBg,
      secondImg: secondImg,
      thirdImg: thirdImg,
      visible: false,
    };
  },
  created() {},
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    goto() {
      window.open(
        'chrome://flags/#unsafely-treat-insecure-origin-as-secure',
        '_blank',
      );
    },
    getPublishUrl() {
      return new Promise((resolve, reject) => {
        if (this.$route.params?.lessonId) {
          postPublishUrl({ room_id: this.$route.params.lessonId })
            .then((res) => {
              this.publishUrl =
                window.location.protocol + '//' + res?.data?.data || '';
              resolve();
            })
            .catch((err) => {
              if (err.data.code == 'OJ-100063') {
                this.$message.error(err.data.message);
              }
              reject();
            });
        } else {
          reject();
        }
      });
    },
    httpApi(httpURL, sdp) {
      let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.readyState !== xhr.DONE) return;
          if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
          const data = xhr.responseText;
          // console.log("Got answer: ", data);
          return data.code ? reject(xhr) : resolve(data);
        };
        xhr.open('POST', httpURL, true);
        xhr.setRequestHeader('Content-type', 'application/sdp');
        xhr.send(sdp);
      });
      return promise;
    },
    startLive() {
      let protocol = window.location.protocol; // 获取当前网站的协议
      console.log(protocol);
      this.getPublishUrl().then(() => {
        this.publish();
      });
    },
    async publish() {
      if (this.pc !== null && this.pc !== undefined) {
        console.log('已开始推流, 推流地址是：', this.publishUrl);
        return;
      }
      let httpURL = this.publishUrl;
      if (!httpURL) return;
      let constraints = {
        audio: {
          echoCancellation: true, // 回声消除
          noiseSuppression: true, // 降噪
          autoGainControl: true, // 自动增益
        },
        video: {
          frameRate: 30, // 最小帧率
          width: 1920, // 宽度
          height: 1080, // 高度
          // aspectRadio : 16/9                        // 宽高比
        },
      };
      // 通过摄像头、麦克风获取音视频流
      try {
        let videoStream = await navigator.mediaDevices.getDisplayMedia(
          constraints,
        );
        // try{
        //     let userAudio = await navigator.mediaDevices.getUserMedia({audio:true});
        // }
        let deskVideo = document.querySelector('#deskVideo');
        // 创建RTC连接对象
        this.pc = new RTCPeerConnection();
        // RTCPeerConnection方法addTransceiver()创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection关联的收发器集中。
        // 每个收发器代表一个双向流，RTCRtpSender和RTCRtpReceiver都与之相关联。
        // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
        // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
        this.pc.addTransceiver('audio', { direction: 'sendonly' });
        this.pc.addTransceiver('video', { direction: 'sendonly' });
        // 遍历getUserMedia（）获取到的流数据，拿到其中的音频轨道和视频轨道，加入到RTCPeerConnection连接的音频轨道和视频轨道中
        this.tracks = videoStream.getTracks();
        this.tracks?.forEach((track) => {
          this.pc.addTrack(track);
        });
        // 监听用户结束共享（浏览器底部漂浮栏）
        this.tracks[0].onended = () => {
          this.stopLive();
        };
        // 创建本端offer
        let offer = await this.pc.createOffer();
        // 设置本端
        await this.pc.setLocalDescription(offer);
        // SDP交换，请求SRS自带的信令服务器
        this.httpApi(httpURL, offer.sdp).then(async (answer) => {
          // console.log("answer",answer);
          // 设置远端描述，开始连接
          await this.pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: answer }),
          );
        });
        // 得到桌面数据流并播放
        deskVideo.srcObject = videoStream;
      } catch (err) {
        console.log(err);
        if (
          err.message ==
          "Cannot read properties of undefined (reading 'getDisplayMedia')"
        ) {
          this.visible = true;
        }
      }
    },
    // 结束直播
    stopLive(confirm) {
      if (confirm) {
        this.$confirm(this.$t('live.confirmStop'), '', {
          confirmButtonText: this.$t('careerSystem.confirm'),
          cancelButtonText: this.$t('careerSystem.cancel'),
          type: 'warning',
        }).then(() => {
          this.tracks?.forEach((track) => {
            track.stop();
          });
          if (this.pc) {
            this.pc.close();
            this.pc = null;
          }
        });
      } else {
        this.tracks?.forEach((track) => {
          track.stop();
        });
        if (this.pc) {
          this.pc.close();
          this.pc = null;
        }
      }
    },
    handleBeforeUnload(event) {
      this.stopLive();
    },
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.stopLive();
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 670px;
  .live-wrapper {
    width: 100%;
    height: 100%;
    background-color: var(--mask-color);
    .default-bg {
      width: 100%;
      height: 100%;
      //background-image: url('@/assets/img/course/desk-bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      opacity: 0.1;
    }
    .live-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .video-wrapper {
    text-align: center;
    width: 100%;
    height: 100%;
    #deskVideo {
      width: 100%;
      height: 100%;
      border: 1px solid var(--primary-color);
      //padding: 10px 0;
    }
    .stop-live-btn {
      position: absolute;
      left: 30px;
      bottom: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  height: 760px;
  overflow-y: auto;
  overflow-x: hidden;
  .process {
    margin-bottom: 16px;
    .img-wrap {
      width: 100%;
      margin-top: 12px;
      img {
        width: 100%;
      }
    }
    span {
      // cursor: pointer;
      // color: var(--primary-color);
    }
  }
}
</style>
