<template>
  <div class="video-wrapper">
    <video
      v-show="isLiving"
      controls
      autoplay
      playsinline
      id="deskVideo"
      disablePictureInPicture
    ></video>
    <div v-show="!isLiving" class="empty-wrapper">
      <div class="empty-txt">
        <cb-iconfont type="icon-zanwuziyuan" size="60"></cb-iconfont>
        <div>{{ $t('course.notLive') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from '@vue/composition-api';

export default {
  name: 'web-rtc',
  components: {},
  props: {
    rtcUrl: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    let pc = ref(null);
    let isLiving = ref(false);
    let stream = ref(null);
    let tracks = ref(null);

    async function play() {
      if (pc.value !== null && pc.value !== undefined) {
        return;
      }
      pc.value = new RTCPeerConnection();
      stream.value = new MediaStream();
      // 获取播放流的容器video
      let deskVideo = document.querySelector('#deskVideo');

      // 监听流
      pc.value.ontrack = (event) => {
        // 监听到的流加入MediaStream对象中让video播放
        stream.value.addTrack(event.track);
        deskVideo.srcObject = stream.value;
        isLiving.value = Boolean(stream.value);
        // tracks.value = event.track;
        // tracks.value = event.streams[1]?.getVideoTracks();
      };

      pc.value.addTransceiver('audio', { direction: 'recvonly' });
      pc.value.addTransceiver('video', { direction: 'recvonly' });

      let offer = await pc.value.createOffer();
      await pc.value.setLocalDescription(offer);

      const answer = await new Promise(function (resolve, reject) {
        // console.log(`Generated offer: ${offer.sdp}`);
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.readyState !== xhr.DONE) return;
          if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
          const data = xhr.responseText;
          // console.log("Got answer: ", data);
          return data.code ? reject(xhr) : resolve(data);
        };
        xhr.open('POST', props.rtcUrl, true);
        xhr.setRequestHeader('Content-type', 'application/sdp');
        xhr.send(offer.sdp);
      });
      await pc.value.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answer }),
      );
    }
    onMounted(() => {
      watch(
        () => props.rtcUrl,
        () => {
          if (props.rtcUrl) {
            play();
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
    });

    onUnmounted(() => {
      pc.value?.close();
      pc.value = null;
    });
    return {
      pc,
      isLiving,
    };
  },
};
</script>

<style lang="scss" scoped>
.video-wrapper,
.empty-wrapper {
  text-align: center;
  width: 100%;
  height: 100%;
  #deskVideo {
    width: 100%;
    height: 100%;
    border: 1px solid var(--primary-color);
    //padding: 10px 0;
  }
}
.empty-wrapper {
  height: 534px;
  position: relative;
  .empty-txt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
  }
}
</style>
