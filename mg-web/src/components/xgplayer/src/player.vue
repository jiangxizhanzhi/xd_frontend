<template>
  <div :id="id"></div>
</template>

<script>
import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import pip from 'xgplayer/dist/controls/pip';
import flex from 'xgplayer/dist/controls/flex';
import playbackRate from 'xgplayer/dist/controls/playbackRate';
import _ from 'lodash';
import { getLanguage } from '@cyber/helper';
export default {
  name: 'CbPlayer',
  data: function () {
    return {
      player: null,
      playerConfig: {},
    };
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    id: {
      type: String,
      default: 'cb-player-container',
    },
    url: {
      type: String,
      default: '',
    },
    resourceList: {
      type: Array,
      default() {
        return [];
      },
    },
    playerPromise: true,
  },
  watch: {
    config: {
      handler: function () {
        this.init();
      },
      deep: true,
    },
    url: {
      handler: function (val) {
        if (val) {
          this.init();
        }
      },
    },
  },
  mounted() {
    if (this.url) {
      this.init();
    }
  },
  beforeDestroy() {
    this.destroyPlayer();
  },
  methods: {
    destroyPlayer() {
      this.player &&
        typeof this.player.destroy === 'function' &&
        this.player.destroy();
    },
    init() {
      if (this.url || this.config.url) {
        const lanMap = {
          'zh-CN': 'zh-cn',
          'en-US': 'en',
        };
        const controlPlugins = [volume, pip, flex, playbackRate];
        this.playerConfig = {
          id: this.id,
          controlPlugins,
          videoInit: true,
          allowPlayAfterEnded: true,
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
        };
        this.playerConfig = _.merge(this.playerConfig, this.config, {
          url: this.url,
          lang: lanMap[getLanguage()],
        });
        this.destroyPlayer();
        this.player = new Player(this.playerConfig);
        if (!_.isEmpty(this.resourceList)) {
          this.player.emit('resourceReady', this.resourceList);
        }
        this.bindEvent();
        this.$emit('init', this.player);
      }
    },

    bindEvent() {
      const eventList = [
        'play', //播放
        'playing', //继续播放
        'pause', //暂停
        'ended', //结束
        'error', //错误	错误信息对象 {...}
        'seeking', //seek播放
        'seeked', //seek播放结束
        'timeupdate', //播放时间改变
        'waiting', //等待加载数据
        'canplay', //视频可以播放
        'canplaythrough', //视频可以流畅播放
        'durationchange', //时长发生变化
        'volumechange', //音量发生变化
        'bufferedChange', //缓冲发生变化	当前缓存片段数组 [ [0, 10], [25, 60] ]
        'definitionChange', //清晰度发生变化	切换前后清晰度 { from: '360p', to: '720p' }
        'playbackrateChange', //	切换前后速度 { from: 1, to: 2 }
        'requestFullscreen', //进入全屏
        'exitFullscreen', //退出全屏
        'requestCssFullscreen', //进入样式全屏
        'exitCssFullscreen', //退出样式全屏
        'controlShow', //控制栏展示
        'controlHide', //控制栏隐藏
      ];
      eventList.map((i) => {
        this.player.on(i, (data) => {
          this.$emit('event', {
            type: i,
            data,
            id: this.id,
          });
        });
      });
    },
    play() {
      this.player.play();
    },
    pause() {
      this.player.pause();
    },
    setCurrentTime(currentTime) {
      this.player.currentTime = currentTime;
    },
    setPlaybackrate(rate) {
      this.player.playbackRate = rate;
    },
  },
};
</script>
