<template>
  <div
    class="fixed-btn"
    id="running-scene-fixed-btn"
    @click="handleClick"
    @mouseover="mouseOverFixedBtn"
    @mouseout="mouseOutFixedBtn"
  >
    <!-- 我的场景气泡提示 -->
    <!-- <transition name="el-fade-in">
        <div v-show="showTip && !mouseOnDialog" class="tip-warp transition-box">
          <div class="scene-tip">{{ $t('scene.myScene') }}</div>
          <div class="triangle"></div>
        </div>
      </transition> -->

    <cb-badge :value="sceneNum.length" :max="99">
      <div>
        <cb-iconfont type="icon-zhongduanshebei" size="24"></cb-iconfont>
      </div>
    </cb-badge>

    <!-- 列表弹窗 -->
    <transition name="fade">
      <div
        class="my-scene transition-left-top transition-display"
        id="running-scene-my-scene"
        v-show="showDialog && sceneNum.length"
        :style="{
          position: 'absolute',
          left: dialogLeft + 'px',
          bottom: dialogBottom + 'px',
          zIndex: -1,
        }"
        @mouseover="mouseOnDialog = true"
        @mouseout="mouseOnDialog = false"
      >
        <!-- 表头 -->
        <div class="my-scene-head">
          <div></div>
          <div>{{ $t('scene.myScene') }}</div>
        </div>
        <!-- 列表 -->
        <div class="my-scene-list">
          <!-- type为2并且不是竞赛的可以点击跳转 type为1禁止点击-->
          <!-- 课程表121不跳转 -->
          <div class="my-scene-list-content cyber-scroll-bar-small">
            <template v-if="dataList.length > 0">
              <div
                v-for="(item, index) in dataList"
                :key="'my-scene-list-item' + index"
                :class="
                  item.type === 2 &&
                  item.reference_type !== 121 &&
                  item.reference_type !== 300 &&
                  item.reference_type !== 301 &&
                  item.reference_type !== 302 &&
                  item.reference_type !== 303 &&
                  item.reference_type !== 304 &&
                  item.reference_type !== 305 &&
                  item.reference_type !== 306
                    ? 'list-item'
                    : 'list-item-disable'
                "
                @click="
                  item.type === 2 &&
                  item.reference_type !== 121 &&
                  item.reference_type !== 300 &&
                  item.reference_type !== 301 &&
                  item.reference_type !== 302 &&
                  item.reference_type !== 303 &&
                  item.reference_type !== 304 &&
                  item.reference_type !== 305 &&
                  item.reference_type !== 306
                    ? jumpIntoScene(item)
                    : ''
                "
              >
                <!-- 图标区域，背景颜色固定，大小30 * 30， 图标字体大小为24 -->
                <div class="list-item-img">
                  <!-- 实操题 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 110"
                    class="bg-shixun list-item-img"
                  >
                    <cb-iconfont
                      type="icon-zhongduanshebei"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 课程 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 120"
                    class="bg-shixun list-item-img"
                  >
                    <cb-iconfont
                      type="icon-kechengguanli"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 课程表 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 121"
                    class="bg-shixun list-item-img"
                  >
                    <cb-iconfont
                      type="icon-kechengkeshi"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 考试 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 130"
                    class="bg-shixun list-item-img"
                  >
                    <cb-iconfont
                      type="icon-bianji"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 课后练习 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 140"
                    class="bg-shixun list-item-img"
                  >
                    <cb-iconfont
                      type="icon-tikuguanli"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>

                  <!-- 单兵训练 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 211"
                    class="bg-bachang list-item-img"
                  >
                    <cb-iconfont
                      type="icon-yonghu"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 团队训练 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 213"
                    class="bg-bachang list-item-img"
                  >
                    <cb-iconfont
                      type="icon-tuandui"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 红蓝对抗 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 214"
                    class="bg-bachang list-item-img"
                  >
                    <cb-iconfont
                      type="icon-honglanduikang"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>

                  <!-- AD通用 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 300"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-ADsai"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 运维赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 301"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-shezhi"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 解题赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 302"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-lianxitiku"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 攻防赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 303"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-heike"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 渗透赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 304"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-shentou"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 理论赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 305"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-renwufangan"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 沙盒攻防赛 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 306"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-heike"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <div
                    v-if="item.type === 2 && item.reference_type === 308"
                    class="bg-jingsai list-item-img"
                  >
                    <cb-iconfont
                      type="icon-heike"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 活体漏洞 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 310"
                    class="bg-qita list-item-img"
                  >
                    <cb-iconfont
                      type="icon-loudongguanli"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 靶场测评 -->
                  <div
                    v-if="item.type === 2 && item.reference_type === 236"
                    class="bg-qita list-item-img"
                  >
                    <cb-iconfont
                      type="icon-cepingguanli"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                  <!-- 后台测试 -->
                  <div v-if="item.type === 1" class="bg-qita list-item-img">
                    <cb-iconfont
                      type="icon-ceshi"
                      size="24"
                      style="color: #fff"
                    ></cb-iconfont>
                  </div>
                </div>
                <!-- 场景信息区域 -->
                <div class="list-item-message">
                  <div :title="item.name">{{ item.name }}</div>
                  <div
                    :title="
                      item.type === 2
                        ? sceneLabels[item.reference_type]
                        : $t('personal.backend_test')
                    "
                  >
                    {{
                      item.type === 2
                        ? sceneLabels[item.reference_type]
                        : $t('personal.backend_test')
                    }}
                  </div>
                </div>
              </div>
            </template>
            <!-- 暂无数据 -->
            <div
              v-if="dataList.length === 0"
              class="empty-comp"
              style="width: 100%; height: 200px; color: var(--neutral8)"
            >
              <empty-page ref="emptyComp" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import sceneDarkAnimation from '@/assets/svga/scene-dark.svg';
import sceneLightAnimation from '@/assets/svga/scene-light.svg';
import SVGA from 'svgaplayerweb';

// -------------
import { sceneType } from '@/constants/scene/scene-type';
import fixedIcon from '@/assets/fixed-icon.png';
import WingTitle from '@/pages/web/personal/components/wing-title/index';
import {
  getSceneListApi,
  deleteSceneApi,
  deleteManySceneApi,
  getSceneType,
  getRedSceneRole,
} from '@/api/message';
import { ListenDomChange } from '@cyber/ui';
import _ from 'lodash';
import { getLanguage } from '@cyber/helper';
import { routerPush } from '@/frame/apps.js';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    WingTitle,
    emptyPage,
  },
  props: {
    dragMyscene: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    drag(el) {
      let oDiv = el;
      // 在拖动我的场景的图标过程中禁止选择网页上的文字
      document.onselectstart = function () {
        if (this.showDialog) {
          return false;
        }
      };
      oDiv.onmousedown = function (e) {
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
      showDialog: false,
      mouseOnDialog: false, // 记录鼠标是否在浮窗之上
      dialogLeft: -302,
      dialogBottom: -6,
      showTip: false,
      language: getLanguage(),
      tableSelector: {
        maxSelect: 100,
      },
      multipleSelection: [],
      fixedIcon,
      sceneIcon: 'dark',
      //
      value: 'all',
      sceneTypes: [],
      sceneLabels: {},
      dialogScene: false,
      canMove: false,
      timer: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      is_admin: '',
      // themeClass: 'dark-bg',
      svgAnimation: sceneDarkAnimation,
      columns: [
        {
          label: this.$t('personal.category'),
          slot: 'type',
        },
        {
          label: this.$t('personal.designation'),
          slot: 'name',
        },
        {
          label: this.$t('personal.operation'),
          slot: 'operate',
        },
      ],
      dataList: [],
      sceneNum: [],
      temp: [],
      player: null,
      sceneType: sceneType,
    };
  },
  mounted() {
    this.getSceneTypes();
    this.listen.createListen();
    // this.getSceneList();
    this.getSceneList().then(() => {
      // this.scenePlay();
    });
    this.timer = setInterval(() => {
      this.value = 'all';
      this.getSceneList().then(() => {
        // this.scenePlay();
      });
    }, 60000);
    document.addEventListener('mousemove', this.mySceneMove);
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
    this.listen.destroyListen();
    document.removeEventListener('mousemove', this.mySceneMove);
  },
  computed: {},
  methods: {
    // 拖拽元素并移动的事件
    mySceneMove() {
      if (this.dragMyscene && !this.mouseOnDialog) {
        const div = document.getElementById('running-scene-fixed-btn');
        const left = div.getBoundingClientRect().left || 1809;
        const top = div.getBoundingClientRect().top || 596;
        if (left <= 297) {
          this.dialogLeft = 38;
        } else {
          this.dialogLeft = -302;
        }
        // dialogBottom分为两种情况，出现滚动条和无滚动条
        if (this.dataList.length >= 8) {
          if (top > 497) {
            this.dialogBottom = -6;
          } else {
            this.dialogBottom = top - 497;
          }
        } else {
          const minTop = 74 + 56 * (this.dataList.length - 1);
          if (top > minTop) {
            this.dialogBottom = -6;
          } else {
            this.dialogBottom = top - minTop;
          }
        }
      }
    },
    mouseOverFixedBtn() {
      this.showTip = true;
      this.showDialog = true;
    },
    mouseOutFixedBtn() {
      this.showTip = false;
      this.showDialog = false;
    },
    // mouseover() {
    //   this.getSceneList().then(() => {
    //     this.scenePlay();
    //   });
    // },
    //获取场景标签集合
    getSceneLabels(arr) {
      let obj = {};
      arr.forEach((item) => {
        obj[item.value] = item.label;
      });
      return obj;
    },
    //获取场景类型
    getSceneTypes() {
      getSceneType().then((res) => {
        const tempList = _.get(res, 'data.data', []);
        this.sceneTypes = tempList.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.sceneTypes.push({
          label: this.$t('scene.backend_test'),
          value: 'houtai',
        });
        this.sceneLabels = this.getSceneLabels(this.sceneTypes);
      });
    },
    scenePlay() {
      let player = new SVGA.Player('#demoCanvas');
      this.player = player;
      let parser = new SVGA.Parser('#demoCanvas');
      parser.load(this.svgAnimation, function (videoItem) {
        player.setVideoItem(videoItem);
        // player.startAnimation();
      });
    },
    startAnimation() {
      this.player.startAnimation();
    },
    pauseAnimation() {
      this.player.pauseAnimation();
    },
    // 场景类型筛选
    SceneChange(val) {
      if (val === 'all') {
        this.getSceneList().then(() => {
          this.scenePlay();
        });
      } else if (val === 'houtai') {
        this.getSceneList().then(() => {
          this.scenePlay();
          this.dataList = this.dataList.filter((item) => {
            return item.type === 1;
          });
        });
      } else {
        this.getSceneList().then(() => {
          this.scenePlay();
          this.dataList = this.dataList.filter((item) => {
            return item.type === 2 && item.reference_type === val;
          });
        });
      }
    },
    listenFunc() {
      const className = document.body.className;
      if (className.indexOf('theme-dark') != -1) {
        // this.themeClass = 'dark-bg';
        this.svgAnimation = sceneDarkAnimation;
        this.sceneIcon = 'dark';
        this.getSceneList().then(() => {
          // this.scenePlay();
        });
      } else {
        // this.themeClass = 'light-bg';
        this.svgAnimation = sceneLightAnimation;
        this.sceneIcon = 'light';
        this.getSceneList().then(() => {
          // this.scenePlay();
        });
      }
    },
    handleClick(e) {
      let isDrag = false;
      const node = e.target.parentNode.parentNode.parentNode;
      try {
        isDrag = node.getAttribute('ele-flag') === 'true';
      } catch (e) {}
      if (isDrag) {
        return;
      }
      // this.dialogScene = true;
      this.is_admin = this.$store.state.user.is_admin;
    },
    getSceneList() {
      const data = {
        page: 1,
        per_page: 10000,
        active: true,
        self: 1,
        valid: 1,
      };
      return new Promise((resolve) => {
        getSceneListApi(data).then((res) => {
          this.dataList = _.get(res, 'data.data.list', []);
          this.sceneNum = _.get(res, 'data.data.list', []);
          resolve();
        });
      });
    },
    handleName(data) {
      if (
        data.reference_meta_data &&
        JSON.parse(data.reference_meta_data).room_name
      ) {
        return JSON.parse(data.reference_meta_data).room_name;
      }
      if (
        data.reference_meta_data &&
        JSON.parse(data.reference_meta_data).scene_name
      ) {
        return JSON.parse(data.reference_meta_data).scene_name;
      }
      if (data.name) {
        return data.name;
      }
    },
    filterData(code, type) {
      if (type === 1) {
        return this.$t('personal.backend_test');
      }
      if (type === 2) {
        return this.sceneType[code] && this.sceneType[code].label;
      }
    },
    // 进入场景
    jumpIntoScene(data) {
      const rooData = JSON.parse(data.reference_meta_data);
      if (data.reference_type === 214) {
        // 调接口，拿role，来判断去 管理员-导演-裁判页面 （无学员）
        getRedSceneRole({
          resource_id: rooData.business_id,
        }).then((res) => {
          const role = _.get(res.data, 'data.role_group');
          if (role === 1) {
            // 管理员
            const url = this.$router.resolve({
              path: `/cr/manage-home/${rooData.business_id}`,
            });
            window.open(url.href, '_self');
          } else if (role === 2) {
            //导演
            const url = this.$router.resolve({
              path: `/cr/director-home/${rooData.business_id}`,
            });
            window.open(url.href, '_self');
          } else if (role === 3) {
            // 裁判
            const url = this.$router.resolve({
              path: `/cr/referee-home/${rooData.business_id}`,
            });
            window.open(url.href, '_self');
          }
          this.dialogScene = false;
          // 点击之后弹窗列表消失
          this.showDialog = false;
        });
      } else if (data.reference_type === 211) {
        // 单兵训练
        const url = this.$router.resolve({
          path: `/cr/single_train/${rooData.business_id}`,
        });
        window.open(url.href, '_self');
        this.dialogScene = false;
        // 点击之后弹窗列表消失
        this.showDialog = false;
      } else if (data.reference_type === 213) {
        // 团队训练
        const url = this.$router.resolve({
          path: `/cr/train-detail-home/${rooData.business_id}`,
        });
        window.open(url.href, '_self');
        this.dialogScene = false;
        // 点击之后弹窗列表消失
        this.showDialog = false;
      } else {
        const resolveData = this.dealWithCodeToUrl(
            data.reference_type,
            rooData,
          ),
          name = _.get(resolveData, 'name', ''),
          params = _.get(resolveData, 'params', {}) || {};
        if (data.reference_type === 310) {
          this.$router.push({
            name: name,
            params,
          });
        } else {
          routerPush(name, params);
        }
        this.dialogScene = false;
        // 点击之后弹窗列表消失
        this.showDialog = false;
      }
    },

    // 进入场景跳转
    dealWithCodeToUrl(code, rooData) {
      const business_id = rooData.business_id;
      const id = rooData.id;
      let paramsList = [];
      let resolveData = {};
      switch (code) {
        case 110: //练习
          resolveData = {
            name: 'exercise-capture-detail',
            params: {
              id: business_id,
            },
          };
          break;
        case 120: //课程两个id
          if (business_id) {
            paramsList = business_id.split('/');
          }
          if (paramsList.length > 1) {
            resolveData = {
              name: 'oj-all-course-lesson',
              params: {
                resource_id: paramsList[0],
                lesson_id: paramsList[1],
              },
            };
          }
          break;
        case 121: //课程表
          if (business_id) {
            paramsList = business_id.split('/');
          }
          if (paramsList.length > 1) {
            resolveData = {
              name: 'oj-all-course-lesson',
              params: {
                resource_id: paramsList[0],
                lesson_id: paramsList[1],
              },
            };
          }
          break;
        case 130: //考试
          resolveData = {
            name: 'oj-exam-detail',
            params: {
              resource_id: business_id,
            },
          };
          break;
        case 140: // 课后练习三个id
          if (business_id) {
            paramsList = business_id.split('/');
          }
          if (paramsList.length > 2) {
            resolveData = {
              name: 'oj-all-course-exercises',
              params: {
                resource_id: paramsList[0],
                lesson_id: paramsList[1],
                exercise_id: paramsList[2],
              },
            };
          }
          break;
        // case 211: // 单兵训练
        //   resolveData = {
        //     name: 'single_train',
        //     params: {
        //       resource_id: business_id,
        //     },
        //   };
        //   break;
        // case 213: // 团队训练
        //   resolveData = {
        //     name: 'team_train',
        //     params: {
        //       resource_id: business_id,
        //     },
        //   };
        //   break;
        case 236: // 靶场测试
          resolveData = {
            name: 'test-detail',
            params: {
              templateId: business_id,
            },
          };
          break;
        case 310:
          resolveData = {
            name: 'vuln-env-detail',
            params: {
              resource_id: id,
            },
          };
          break;
        // 有关竞赛的都不跳转无论前后台 300,301,302,303
        default:
          break;
      }
      return resolveData;
    },
    // 删除场景
    deleteScene(data, done) {
      deleteSceneApi(data.id).then((res) => {
        done(true);
        this.getSceneList();
      });
    },
    //批量刪除場景
    deleteManyScene(bool, data, done) {
      const id_list = data.map((item) => {
        return item.id;
      });
      deleteManySceneApi({ ids: id_list }).then((res) => {
        done();
        this.getSceneList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-scene {
  width: 296px;
  backface-visibility: hidden;
  box-shadow: 6px 6px 20px 0px var(--box-shadow-color);
  &-head {
    width: 100%;
    height: 40px;
    position: relative;
    & > div {
      width: 100%;
      height: 40px;
      padding-left: 16px;
      line-height: 40px;
      text-align: left;
      color: var(--neutral8);
      position: absolute;
    }
    & > div:nth-child(1) {
      background: var(--bg-color-4);
    }
    & > div:nth-child(2) {
      background: var(--neutral0);
    }
  }
  &-list {
    width: 100%;
    // height: 428px;
    background: var(--bg-color-4);
    padding-left: 16px;
    padding-bottom: 8px;
    &-content {
      max-height: 420px;
      overflow-y: auto;
    }
    .list-item {
      height: 56px;
      padding-left: 8px;
      margin-right: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--neutral0);
      &:hover {
        background: var(--neutral0);
      }
      .list-item-img {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .list-item-message {
        max-width: 216px;
        margin-left: 10px;
        color: var(--neutral8);
        & > div {
          text-align: left;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        & > div:first-child {
          font-size: 14px;
          margin-bottom: 2px;
        }
        & > div:last-child {
          font-size: 12px;
          color: var(--neutral7);
        }
      }
    }
    .list-item-disable {
      height: 56px;
      padding-left: 8px;
      margin-right: 16px;
      cursor: not-allowed;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--neutral0);
      &:hover {
        background: var(--neutral0);
      }
      .list-item-img {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .list-item-message {
        max-width: 216px;
        margin-left: 10px;
        & > div {
          text-align: left;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        & > div:first-child {
          font-size: 14px;
          color: var(--neutral4);
          margin-bottom: 2px;
        }
        & > div:last-child {
          font-size: 12px;
          color: var(--neutral5);
        }
      }
    }
  }
}

.transition-left-top {
  transition: left 0.3s ease-in-out, bottom 0.1s ease-in-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, left 0.3s ease-in-out,
    bottom 0.1s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.bg-shixun {
  background: #35d84c;
  border-radius: 2px;
}
.bg-bachang {
  background: #26c1d9;
  border-radius: 2px;
}
.bg-jingsai {
  background: #ff7d2c;
  border-radius: 2px;
}
.bg-qita {
  background: #448aff;
  border-radius: 2px;
}

::v-deep .el-badge__content.is-fixed {
  top: 2px;
  right: 18px;
  line-height: 16px;
}
.fixed-btn {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  .dark-bg {
    background: url('@/assets/fixed-icon.png');
  }
  .light-bg {
    background: url('@/assets/light-fixed-icon.png');
  }
  .tip-warp {
    position: relative;
    .scene-tip {
      position: absolute;
      width: 100px;
      height: 40px;
      line-height: 40px;
      left: -10px;
      top: -50px;
      border-radius: 4px;
      background: var(--bg-color-3);
      color: var(--neutral7);
    }
    .triangle {
      position: absolute;
      width: 0;
      height: 0;
      left: 30px;
      top: -14px;
      border-top: 10px solid var(--bg-color-3);
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
    }
  }

  #demoCanvas {
    width: 80px;
    height: 80px;
  }
}
</style>
<style lang="scss">
.runing-wing-title-en {
  .title-name {
    width: 128px !important;
  }
}

.cb-table-no-data {
  text-align: center;
  height: 80px;
  color: var(--neutral5);
}

// ::v-deep.el-dialog--center{
//   background: #14161A !important;
// }
</style>
