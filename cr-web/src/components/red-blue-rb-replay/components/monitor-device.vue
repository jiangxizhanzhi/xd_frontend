<template>
  <div class="monitor">
    <!-- 一屏 -->
    <div v-if="showOneScreen" class="one-screen">
      <div class="header" v-if="mainScreenData.play_url">
        <div class="info">
          <div class="avatar">
            <img :src="mainScreenData.avatar" alt="" />
          </div>
          <div class="user-name" :title="mainScreenData.userName">
            {{ mainScreenData.userName }}
          </div>
          <cb-iconfont
            :size="16"
            type="icon-zhongduanshebei1"
            class="icon-style"
          ></cb-iconfont>
          <div class="host">
            {{ mainScreenData.host }}
          </div>
        </div>
        <div class="icon">
          <cb-iconfont
            type="icon-fuzhi"
            size="18"
            class="switch-icon"
            @click="switchScreen()"
          >
          </cb-iconfont>
        </div>
      </div>
      <!-- 播放器 -->
      <cb-player
        v-if="mainScreenData.play_url"
        ref="oneScreenPlayer"
        :key="mainScreenData.play_url"
        :url="mainScreenData.play_url"
        :config="playerConfig"
        :id="mainScreenData.id"
        class="monitor-player"
        @event="playerEvent($event, 1)"
        @init="playerInit($event, mainScreenData.id)"
      ></cb-player>
    </div>
    <!-- 四屏 -->
    <div v-else class="more-screen">
      <!-- 左边大屏 -->
      <div class="left">
        <div class="first-screen">
          <div class="header" v-if="mainScreenData.play_url">
            <div class="info">
              <div class="avatar">
                <img :src="mainScreenData.avatar" alt="" />
              </div>
              <div class="user-name" :title="mainScreenData.userName">
                {{ mainScreenData.userName }}
              </div>
              <cb-iconfont
                :size="16"
                type="icon-zhongduanshebei1"
                class="icon-style"
              ></cb-iconfont>
              <div class="host">
                {{ mainScreenData.host }}
              </div>
            </div>
            <div class="icon">
              <cb-iconfont
                type="icon-fuxuankuang"
                size="18"
                class="switch-icon"
                @click="switchScreen()"
              >
              </cb-iconfont>
            </div>
          </div>
          <!-- <div class="add-screen" v-else>
            <div class="icon-wrap">
              <cb-iconfont type="icon-xinzeng" size="18"> </cb-iconfont>
            </div>
            <div class="add-tip">{{$t('common.addScreen')}}</div>
          </div> -->
          <!-- 播放器 -->
          <cb-player
            v-if="mainScreenData.play_url"
            ref="oneScreenPlayer"
            :key="mainScreenData.play_url"
            :url="mainScreenData.play_url"
            :config="playerConfig"
            :id="mainScreenData.id"
            class="monitor-player"
            @event="playerEvent($event, 2)"
            @init="playerInit($event, mainScreenData.id)"
          ></cb-player>
        </div>
      </div>
      <!-- 右边三小屏 -->
      <div class="right">
        <div class="second-screen screen">
          <div class="header" v-if="secondScreenData.play_url">
            <div class="info">
              <div class="avatar">
                <img :src="secondScreenData.avatar" alt="" />
              </div>
              <div class="user-name" :title="secondScreenData.userName">
                {{ secondScreenData.userName }}
              </div>
            </div>
            <div class="icon">
              <cb-iconfont
                type="icon-guanbi"
                size="18"
                class="close-icon"
                @click="closeScreen(1, secondScreenData)"
              >
              </cb-iconfont>
            </div>
          </div>
          <div class="add-screen" @click="addScreen(1)" v-else>
            <div class="icon-wrap">
              <cb-iconfont type="icon-xinzeng" size="18"> </cb-iconfont>
            </div>
            <div class="add-tip">{{ $t('common.addScreen') }}</div>
          </div>
          <!-- 播放器 -->
          <cb-player
            v-if="secondScreenData.play_url"
            :key="secondScreenData.play_url"
            :url="secondScreenData.play_url"
            :config="playerConfig"
            :id="secondScreenData.id"
            class="monitor-player"
            @init="playerInit($event, secondScreenData.id)"
          ></cb-player>
        </div>
        <div class="third-screen screen">
          <div class="header" v-if="thirdScreenData.play_url">
            <div class="info">
              <div class="avatar">
                <img :src="thirdScreenData.avatar" alt="" />
              </div>
              <div class="user-name" :title="thirdScreenData.userName">
                {{ thirdScreenData.userName }}
              </div>
            </div>
            <div class="icon">
              <cb-iconfont
                type="icon-guanbi"
                size="18"
                class="close-icon"
                @click="closeScreen(2, thirdScreenData)"
              >
              </cb-iconfont>
            </div>
          </div>
          <div class="add-screen" @click="addScreen(2)" v-else>
            <div class="icon-wrap">
              <cb-iconfont type="icon-xinzeng" size="18"> </cb-iconfont>
            </div>
            <div class="add-tip">{{ $t('common.addScreen') }}</div>
          </div>
          <!-- 播放器 -->
          <cb-player
            v-if="thirdScreenData.play_url"
            :key="thirdScreenData.play_url"
            :url="thirdScreenData.play_url"
            :config="playerConfig"
            :id="thirdScreenData.id"
            class="monitor-player"
            @init="playerInit($event, thirdScreenData.id)"
          ></cb-player>
        </div>
        <div class="fourth-screen screen">
          <div class="header" v-if="fourthScreenData.play_url">
            <div class="info">
              <div class="avatar">
                <img :src="fourthScreenData.avatar" alt="" />
              </div>
              <div class="user-name" :title="fourthScreenData.userName">
                {{ fourthScreenData.userName }}
              </div>
            </div>
            <div class="icon">
              <cb-iconfont
                type="icon-guanbi"
                size="18"
                class="close-icon"
                @click="closeScreen(3, fourthScreenData)"
              >
              </cb-iconfont>
            </div>
          </div>
          <div class="add-screen" @click="addScreen(3)" v-else>
            <div class="icon-wrap">
              <cb-iconfont type="icon-xinzeng" size="18"> </cb-iconfont>
            </div>
            <div class="add-tip">{{ $t('common.addScreen') }}</div>
          </div>
          <!-- 播放器 -->
          <cb-player
            v-if="fourthScreenData.play_url"
            :key="fourthScreenData.play_url"
            :url="fourthScreenData.play_url"
            :config="playerConfig"
            :id="fourthScreenData.id"
            class="monitor-player"
            @init="playerInit($event, fourthScreenData.id)"
          ></cb-player>
        </div>
      </div>
    </div>
    <!-- 添加屏幕弹窗 -->
    <cb-dialog
      :title="$t('common.addScreen')"
      :visible.sync="showAddScreenDialog"
      width="600px"
      height="400px"
      class="add-screen-dialog"
    >
      <div class="add-box">
        <div class="select">
          <span>{{ $t('common.selectDevice') }}：</span>
          <cb-select
            v-model="id"
            :options="deviceOptions"
            @change="changeDevice"
            titleField="name"
            valueField="id"
            style="width: 182px"
          ></cb-select>
        </div>
        <div class="list" v-if="addScreenData.length">
          <div
            class="item"
            v-for="(item, index) in addScreenData"
            :key="item.id"
          >
            <div>{{ item.name }}</div>
            <div v-for="(obj, key) in item.screen_records" :key="key">
              <div class="line">
                <div>
                  <cb-iconfont type="icon-kaishi" size="18"></cb-iconfont>
                  <span>{{ obj.file_name }}</span>
                </div>
                <div>
                  <cb-button
                    v-if="obj.disable"
                    :disabled="obj.disable"
                    type="text"
                    >{{ $t('common.added') }}</cb-button
                  >
                  <cb-button v-else type="text" @click="addThisScreen(obj)">{{
                    $t('common.adding')
                  }}</cb-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <div class="info">
            <cb-iconfont type="icon-zanwuziyuan" size="50"></cb-iconfont>
            <div>{{ $t('m.noData') }}</div>
          </div>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getRecordScreenByDevice,
  getTeamRecordScreenByDevice,
} from '@/api/web/replay';
export default {
  props: {
    refreshScreen: {
      type: Number,
      default() {
        return 0;
      },
    },
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //区分团队训练与红蓝，默认是红蓝
    isRedBlue: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //录屏数据
    sceneData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //当前设备
    nodeId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //所有设备
    deviceOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //当前复盘状态，默认为暂停
    replayStatus: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //复盘时间
    replayTime: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  data() {
    return {
      //默认显示一屏
      showOneScreen: true,
      //控制添加屏幕弹窗
      showAddScreenDialog: false,
      //记录当前添加屏幕的窗口
      active: '',
      //记录已经添加的录屏
      screenRecord: [],
      //播放器配置
      playerConfig: {
        width: '100%',
        height: '100%',
        playbackRate: [1, 1.5, 2, 2.5, 3],
      },

      //主屏播放视频时长
      screenTotalTime: '',
      //当前播放时间
      screenPlayTime: '',
      //时间轴快进的时间点在录屏时间后，此时为暂停状态
      screenTimeIsOut: false,

      //主屏播放数据(和分屏模式下较大的屏幕共用)
      mainScreenData: {
        id: '',
        play_url: '',
        startTime: '',
        endTime: '',
        userName: '',
        avatar: '',
      },
      //主屏当前播放状态, 默认为暂停
      mainScreenPlayStatus: 'pause',

      //分屏模式下右边第一个小屏
      secondScreenData: {
        id: '',
        userName: '',
        play_url: '',
        avatar: '',
      },
      //分屏模式下右边第二个小屏
      thirdScreenData: {
        id: '',
        userName: '',
        play_url: '',
        avatar: '',
      },
      //分屏模式下右边第三个小屏
      fourthScreenData: {
        id: '',
        userName: '',
        play_url: '',
        avatar: '',
      },
      //可以添加的录屏数据
      addScreenData: [],
      //当前设备
      id: this.nodeId,
      //所有用户选项
      // userOptions: userOptions,
    };
  },
  created() {},
  mounted() {},
  watch: {
    // 清空小屏幕数据
    refreshScreen: {
      handler(val, oldval) {
        this.secondScreenData.play_url = '';
        this.thirdScreenData.play_url = '';
        this.fourthScreenData.play_url = '';
        this.closeScreen(1, this.secondScreenData);
        this.closeScreen(2, this.thirdScreenData);
        this.closeScreen(3, this.fourthScreenData);
        this.showOneScreen = true;
      },
      deep: true,
      immediate: true,
    },
    sceneData: {
      handler(val, oldval) {
        this.initData(val);
      },
      deep: true,
      immediate: true,
    },
    nodeId: {
      handler(val, oldval) {
        this.id = val;
      },
      deep: true,
      immediate: true,
    },
    //复盘状态
    replayStatus: {
      handler(val, oldval) {
        if (this.mainScreenData.play_url) {
          // 判断复盘时间是否在当前播放的时间范围内,复盘暂停则录屏暂停,反之播放
          const changeTime = new Date(this.replayTime).getTime();
          const startTime = new Date(this.mainScreenData.startTime).getTime();
          const endTime = new Date(this.mainScreenData.endTime).getTime();
          if (changeTime >= startTime && changeTime <= endTime) {
            //暂停
            if (val) {
              this.$refs.oneScreenPlayer.pause();
            } else {
              this.$refs.oneScreenPlayer.play();
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
    //当前复盘时间
    replayTime: {
      handler(val, oldval) {
        if (this.mainScreenData.play_url) {
          const replayTime = new Date(val).getTime();
          const mainScreenStartTime = new Date(
            this.mainScreenData.startTime,
          ).getTime();
          //复盘时间到了录屏开始的时间则自动播放
          if (replayTime == mainScreenStartTime) {
            this.$refs.oneScreenPlayer.play();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initData(val) {
      if (val.length) {
        // //主屏默认取第一个数据
        if (val[0].screen_records.length) {
          this.mainScreenData.id = val[0].screen_records[0].file_name;
          this.mainScreenData.startTime = val[0].screen_records[0].create_time;
          this.mainScreenData.endTime = val[0].screen_records[0].end_time;
          this.mainScreenData.play_url = val[0].screen_records[0].play_url;
          this.mainScreenData.userName = val[0].screen_records[0].user_name;
          this.mainScreenData.avatar = val[0].screen_records[0].user_avatar;
          this.mainScreenData.host = val[0].screen_records[0].host;
          //记录已经添加的录屏
          this.screenRecord = [this.mainScreenData];
        }
        //可添加录屏数据
        this.addScreenData = _.cloneDeep(val);
      } else {
        this.mainScreenData = {
          id: '',
          play_url: '',
          startTime: '',
          endTime: '',
          userName: '',
          avatar: '',
        };
      }
    },
    //切换分屏
    switchScreen() {
      this.showOneScreen = !this.showOneScreen;
      //保存播放进度自动暂停或者播放
      if (
        this.mainScreenPlayStatus == 'play' ||
        this.mainScreenPlayStatus == 'pause'
      ) {
        this.$nextTick(() => {
          this.playScreen();
        });
      }
    },
    //显示添加屏幕的弹框，只有分屏模式下的右边小屏可以自由添加
    addScreen(val) {
      this.active = val;
      //校验是否已被添加
      this.screenRecord.forEach((item) => {
        this.addScreenData.forEach((obj) => {
          obj.screen_records.forEach((data) => {
            if (data.play_url == item.play_url) {
              data.disable = true;
            }
          });
        });
      });
      this.showAddScreenDialog = true;
    },
    //添加此录屏
    addThisScreen(data) {
      if (this.active == 1) {
        this.secondScreenData = {
          id: data.file_name,
          play_url: data.play_url,
          userName: data.user_name,
          avatar: data.user_avatar,
        };
      } else if (this.active == 2) {
        this.thirdScreenData = {
          id: data.file_name,
          play_url: data.play_url,
          userName: data.user_name,
          avatar: data.user_avatar,
        };
      } else {
        this.fourthScreenData = {
          id: data.file_name,
          play_url: data.play_url,
          userName: data.user_name,
          avatar: data.user_avatar,
        };
      }
      this.screenRecord.push(data);
      this.showAddScreenDialog = false;
    },
    //关闭此屏幕
    closeScreen(type, data) {
      //删除添加的录屏信息
      this.screenRecord = this.screenRecord.filter(
        (item) => item.play_url !== data.play_url,
      );
      // 重置此录屏数据添加状态
      this.addScreenData.forEach((item) => {
        item.screen_records.forEach((obj) => {
          if (obj.play_url == data.play_url) {
            obj.disable = false;
          }
        });
      });

      if (type == 1) {
        this.secondScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      } else if (type == 2) {
        this.thirdScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      } else {
        this.fourthScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      }
    },
    //切换主屏的录屏
    changeScreen(data) {
      if (this.secondScreenData.play_url == data.play_url) {
        this.secondScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      } else if (this.thirdScreenData.play_url == data.play_url) {
        this.thirdScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      } else if (this.fourthScreenData.play_url == data.play_url) {
        this.fourthScreenData = {
          id: '',
          name: '',
          play_url: '',
        };
      }
      //大屏录屏没变
      if (data.play_url == this.mainScreenData.play_url) {
      } else {
        //删除之前添加主屏录屏
        const screen = _.cloneDeep(this.mainScreenData);
        this.screenRecord = this.screenRecord.filter(
          (item) => item.play_url !== screen.play_url,
        );
        //改变视频的已添加状态
        this.addScreenData.forEach((item) => {
          item.screen_records.forEach((obj) => {
            if (obj.play_url == data.play_url) {
              obj.disable = true;
            }
            if (obj.play_url == screen.play_url) {
              obj.disable = false;
            }
          });
        });
        this.screenRecord.push(data);
      }
      //记录已经添加的录屏
      this.mainScreenData = data;
    },
    //播放初始化
    playerInit(player, id) {
      player.muted = true;
    },
    playerEvent(e, t) {
      //播放状态
      if (e.type == 'play') {
        //重置复盘时间在录屏后面的状态
        this.screenTimeIsOut = false;
        //更新时间轴上的播放、暂停图标状态
        this.$emit('changePlayStatus', e.type);
      }
      //暂停状态，且不是时间轴快进超出视频区间后的暂停
      if (e.type == 'pause' && !this.screenTimeIsOut) {
        //判断是否已播放结束，未结束则可以更新时间轴播放、暂停图标状态
        if (e.data.video.currentTime !== e.data.video.duration) {
          this.mainScreenPlayStatus = 'pause';
          //更新时间轴上的播放、暂停图标状态
          this.$emit('changePlayStatus', e.type);
        }
      }
      //播放中状态
      if (e.type == 'timeupdate') {
        if (e.data.video.currentTime) {
          const playTime = e.data.video.currentTime;
          const startTime = new Date(this.mainScreenData.startTime).getTime();
          //播放进度的时间点
          const time = moment(playTime * 1000 + startTime).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          this.mainScreenPlayStatus = 'play';
          //更新时间轴进度
          this.$emit('updateTimeLine', time);
        }
      }
      //视频就绪待播放
      if (e.type == 'canplay') {
        this.mainScreenPlayStatus = 'pause';
      }
      //结束状态
      if (e.type == 'ended') {
        this.mainScreenPlayStatus = 'end';
        this.$emit('screenPlayEnd');
      }
    },
    //添加屏幕时切换用户
    changeDevice() {
      this.getAddScreenData();
    },
    //获取切换用户下的录屏信息
    getAddScreenData() {
      const params = {
        resource_id: this.$route.params.resource_id,
        node_id: this.id,
      };
      if (this.isRedBlue) {
        getRecordScreenByDevice(params).then((res) => {
          const data = _.get(res, 'data.data') || [];
          this.addScreenData = data;
          //校验是否已被添加
          this.screenRecord.forEach((item) => {
            this.addScreenData.forEach((obj) => {
              obj.screen_records.forEach((data) => {
                if (data.play_url == item.play_url) {
                  data.disable = true;
                }
              });
            });
          });
        });
      } else {
        getTeamRecordScreenByDevice(params).then((res) => {
          const data = _.get(res, 'data.data') || [];
          this.addScreenData = data;
          //校验是否已被添加
          this.screenRecord.forEach((item) => {
            this.addScreenData.forEach((obj) => {
              obj.screen_records.forEach((data) => {
                if (data.play_url == item.play_url) {
                  data.disable = true;
                }
              });
            });
          });
        });
      }
    },
    //时间轴点击开始播放
    startPlay() {
      if (this.mainScreenData.play_url) {
        this.$refs.oneScreenPlayer.play();
      }
    },
    //时间轴点击开始暂停
    pauseScreen() {
      if (this.mainScreenData.play_url) {
        this.$refs.oneScreenPlayer.pause();
      }
    },
    //切换分屏模式时自动到播放进度暂停或播放
    playScreen() {
      if (this.replayTime) {
        const time = new Date(this.replayTime).getTime();
        const startTime = new Date(this.mainScreenData.startTime).getTime();
        const endTime = new Date(this.mainScreenData.endTime).getTime();
        //播放进度百分比
        const percent = (time - startTime) / (endTime - startTime);
        //转化为秒
        this.screenTotalTime = (endTime - startTime) / 1000;
        //调整进度
        this.$refs.oneScreenPlayer.setCurrentTime(
          parseInt(this.screenTotalTime * percent),
        );
        if (this.mainScreenPlayStatus == 'play') {
          this.$refs.oneScreenPlayer.play();
        }
      }
    },
    //时间轴拖动调整播放进度
    async changePlayTime(time) {
      //无录屏
      if (!this.mainScreenData.play_url) {
        return;
      }
      // 判断快进的时间是否在当前播放的时间范围内
      const changeTime = new Date(time).getTime();
      const startTime = new Date(this.mainScreenData.startTime).getTime();
      const endTime = new Date(this.mainScreenData.endTime).getTime();
      //时间轴快进或者后退的时间点在视频录屏期间
      if (changeTime >= startTime && changeTime <= endTime) {
        const percent = (changeTime - startTime) / (endTime - startTime);
        //转化为秒
        this.screenTotalTime = (endTime - startTime) / 1000;
        await this.$refs.oneScreenPlayer.setCurrentTime(
          parseInt(this.screenTotalTime * percent),
        );
        //复盘状态为进行中，自动播放录屏
        if (!this.replayStatus) {
          this.$refs.oneScreenPlayer.play();
        }
        //视频快进或者倒退完成后,允许时间轴随着播放进度改变
        this.$emit('setTimeHandle');
      } else if (changeTime < startTime) {
        //时间点在视频录屏前，视频继续播放，时间轴跟着视频进度走
        this.$emit('setTimeHandle');
        // this.$refs.oneScreenPlayer.pause();
      } else {
        //时间点在视频录屏后，暂停
        this.screenTimeIsOut = true;
        this.$refs.oneScreenPlayer.pause();
      }
    },
    //设置播放速率
    changePlayRate(rate) {
      if (this.mainScreenData.play_url) {
        this.$refs.oneScreenPlayer.setPlaybackrate(rate);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: 100%;
  .one-screen {
    position: relative;
    width: 100%;
    height: 100%;
    &::before {
      width: 100%;
      height: 100%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: url('../assets/main-screen-bg.jpg') no-repeat;
      background-size: 100%;
      opacity: 0.2;
    }
    .header {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 0;
      background: var(--mask-color);
      z-index: 106;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          margin-left: 8px;
          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--bg-color-3);
            border: 1px solid var(--neutral1);
          }
        }
        .user-name {
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 4px;
          margin-right: 40px;
        }
        .icon-style {
          color: var(--white-color);
        }
        .host {
          margin-left: 5px;
        }
      }
      .icon {
        padding: 10px;
        .cb-iconfont {
          cursor: pointer;
        }
        .switch-icon {
          margin-left: 12px;
        }
      }
    }
    .add-screen {
      width: 160px;
      height: 90px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: var(--primary-color);
      border: 1px dotted var(--primary-color);
      cursor: pointer;
    }
  }
  .more-screen {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: calc(100% - 280px - 8px);
      height: 100%;
      margin-right: 8px;
      position: relative;
      .first-screen {
        width: 100%;
        height: 100%;
        border: 1px solid var(--neutral3);
        &::before {
          width: 100%;
          height: 100%;
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: url('../assets/main-screen-bg.jpg') no-repeat;
          background-size: 100%;
          opacity: 0.2;
        }
        .header {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          position: absolute;
          top: 0;
          background: var(--mask-color);
          z-index: 106;
          .info {
            display: flex;
            align-items: center;
            .avatar {
              margin-left: 8px;
              img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--bg-color-3);
                border: 1px solid var(--neutral1);
              }
            }
            .user-name {
              max-width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-left: 4px;
              margin-right: 40px;
            }
            .icon-style {
              color: var(--white-color);
            }
            .host {
              margin-left: 5px;
            }
          }
          .icon {
            padding: 10px;
            .cb-iconfont {
              cursor: pointer;
            }
            .switch-icon {
              margin-left: 12px;
            }
          }
        }
        .add-screen {
          width: 128px;
          height: 72px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: var(--primary-color);
          border: 1px dotted var(--primary-color);
          cursor: pointer;
        }
      }
    }
    .right {
      width: 280px;
      height: 100%;
      .screen {
        width: 100%;
        height: calc((100% - 16px) / 3);
        border: 1px solid var(--neutral3);
        position: relative;
        &::before {
          width: 100%;
          height: 100%;
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: url('../assets/small-screen-bg.jpg') no-repeat;
          background-size: 100%;
          opacity: 0.2;
        }
      }
      .third-screen {
        margin-top: 8px;
      }
      .fourth-screen {
        margin-top: 8px;
      }
      .header {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: 0;
        background: var(--mask-color);
        z-index: 106;
        .info {
          display: flex;
          align-items: center;
          .avatar {
            margin-left: 8px;
            img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: var(--bg-color-3);
              border: 1px solid var(--neutral1);
            }
          }
          .user-name {
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 4px;
          }
        }
        .icon {
          padding: 4px;
          .cb-iconfont {
            cursor: pointer;
          }
          .close-icon {
            margin-left: 12px;
          }
        }
      }
      .add-screen {
        width: 80px;
        height: 45px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--primary-color);
        border: 1px dotted var(--primary-color);
        cursor: pointer;
      }
    }
  }
  .monitor-player {
    width: 100% !important;
    height: 100% !important;
  }
  .add-screen-dialog {
    .add-box {
      position: relative;
      width: 100%;
      height: 380px;
    }
    .list {
      margin-top: 16px;
      padding: 16px;
      background: var(--bg-color-3);
      .item {
        margin-bottom: 16px;
      }
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .no-data {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  // 隐藏播放器倍速设置
  ::v-deep.xgplayer-playbackrate {
    display: none;
  }
}
</style>
