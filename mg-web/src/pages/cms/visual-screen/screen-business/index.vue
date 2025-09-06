<template>
  <div class="situation-business">
    <div class="main">
      <div class="main-header">
        <div class="header-name one-overflow" :title="screenName">
          {{ screenName }}
        </div>
      </div>

      <div class="toolbar-single">
        <cb-iconfont
          :size="24 * rate"
          type="icon-huifumoren"
          @click="restore"
        />
        <!-- <cb-iconfont
          :size="24 * rate"
          type="icon-shijianshijiaogensui"
          @click="follow"
        /> -->
        <cb-iconfont
          :size="24 * rate"
          :type="show ? 'icon-xianshitubiao' : 'icon-yincangtubiao'"
          @click="show = !show"
        />
        <cb-iconfont
          :size="24 * rate"
          :type="
            rotate ? 'icon-zidongxuanzhuankaiqi' : 'icon-zidongxuanzhuanguanbi'
          "
          @click="rotateFun"
        />
      </div>

      <iframe
        v-if="scene_id || topo_id"
        class="u3d"
        runat="server"
        :src="url"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
        ref="iframeRef"
        style="z-index: 11"
      ></iframe>

      <left :show="show" :data-list="leftData"></left>
      <right :show="show"></right>
      <attack-route v-show="show" :data="attackRouteData"></attack-route>
    </div>
  </div>
</template>

<script>
import Left from './components/left.vue';
import Right from './components/right.vue';
import AttackRoute from './components/attack-route.vue';
import { querySituationInfo } from './api';
import { getToken } from '@cyber/helper';
export default {
  components: { Left, Right, AttackRoute },
  data() {
    return {
      scene_id: this.$route.params.id,
      topo_id: '',
      show: true,
      rotate: false,
      rate: window.screen.width / 1920,
      room_id: '',
      leftData: {},
      attackRouteData: [],
      url: '',
      screenName: '',
      timer: null,
    };
  },
  created() {
    this.room_id = this.$route.params.id;
    if (this.room_id) {
      this.getSituationInfo();
      this.timer = setInterval(() => {
        this.getSituationInfo();
      }, 1000 * 5);
    }
  },
  mounted() {
    this.url =
      location.origin +
      '/ts/industry/AviationOil/' +
      `?business_id=${this.room_id}&token=${getToken()}`;
    this.screenName = this.$route.query.name;
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    rotateFun() {
      this.rotate = !this.rotate;
      const topoUrl = location.origin + '/ts/industry/AviationOil/';
      if (this.$refs.iframeRef.contentWindow) {
        this.$refs.iframeRef.contentWindow.postMessage(
          { type: 'rotate' },
          topoUrl,
        );
      }
    },
    restore() {
      const topoUrl = location.origin + '/ts/industry/AviationOil/';
      if (this.$refs.iframeRef.contentWindow) {
        this.$refs.iframeRef.contentWindow.postMessage(
          { type: 'restore' },
          topoUrl,
        );
      }
    },
    follow() {
      const topoUrl = location.origin + '/ts/industry/AviationOil/';
      if (this.$refs.iframeRef.contentWindow)
        this.$refs.iframeRef.contentWindow.postMessage(
          { type: 'follow' },
          topoUrl,
        );
    },
    getSituationInfo() {
      querySituationInfo({ room_id: this.room_id }).then((res) => {
        this.leftData = _.get(res, 'data.data', {}) || {};
        this.attackRouteData = _.get(res, 'data.data.route', []) || [];
        // 需后端确认状态 是否是攻击中 成功 失败三种状态1：未受攻击；2：正被攻击；3：攻击完成
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.situation-business {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .main {
    width: 100%;
    height: 100%;
    background: url(~@/assets/img/visual-screen/screen-3/bg.png) no-repeat
      center center;
    background-size: 100% 100%;
    position: relative;

    // &::before {
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   inset: 0;
    //   background-image: url(~@/assets/img/visual-screen/screen-3/border.png);
    //   background-size: 100% 100%;
    //   background-position: center;
    //   background-repeat: no-repeat;
    //   z-index: 12;
    //   pointer-events: none;
    // }
    .u3d {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .main-header {
      width: 100%;
      height: 80px;
      position: absolute;
      z-index: 12;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      // align-items: center;
      white-space: nowrap;
      font-family: youshebiaotihei !important;
      font-size: 3em;
      color: #fff;
      background-image: url(~@/assets/img/visual-screen/screen-business/top_bg.png);
      background-size: 100% 100%;
      .header-name {
        text-align: center;
        width: 38%;
        font-size: 40px;
        letter-spacing: 7px;
        font-family: YouSheBiaoTiHei !important;
        color: #f78d20;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .toolbar-single {
      position: absolute;
      top: 46px;
      right: 345px;
      z-index: 30;
      user-select: none;
      .cb-iconfont {
        cursor: pointer;
      }
    }
  }
}
</style>
