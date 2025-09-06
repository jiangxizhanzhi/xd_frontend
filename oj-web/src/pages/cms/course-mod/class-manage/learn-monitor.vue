<template>
  <cb-inner-page :background="false">
    <div class="learn-monitor-box-card">
      <div class="learn-monitor">
        <div class="monitor-choose">
          <div class="title">{{ $t('m.studentList') }}</div>
          <div class="user-select">
            <cb-checkbox-group
              v-model="checkedUser"
              @change="handleChange"
              direction="vertical"
            >
              <cb-checkbox
                v-for="(data, key, index) in monitorData"
                :label="data.user_id"
                :key="data.user_id"
                :value="data.user_id"
                >{{ data.user_name }}</cb-checkbox
              >
            </cb-checkbox-group>
          </div>
        </div>
        <div class="screen-btn">
          <div class="btn-group">
            <div
              class="icon icon-one"
              @click="choose($CONSTANT.SPLITSCREEN.ONE)"
              :class="active === $CONSTANT.SPLITSCREEN.ONE ? 'active' : ''"
            >
              {{ $t('m.oneScreen') }}
            </div>
            <div
              class="icon icon-four"
              @click="choose($CONSTANT.SPLITSCREEN.FOUR)"
              :class="active === $CONSTANT.SPLITSCREEN.FOUR ? 'active' : ''"
            >
              {{ $t('m.fourScreen') }}
            </div>
            <div
              class="icon icon-nine"
              @click="choose($CONSTANT.SPLITSCREEN.NINE)"
              :class="active === $CONSTANT.SPLITSCREEN.NINE ? 'active' : ''"
            >
              {{ $t('m.nineScreen') }}
            </div>
            <div
              class="icon icon-twelve"
              @click="choose($CONSTANT.SPLITSCREEN.TWELVE)"
              :class="active === $CONSTANT.SPLITSCREEN.TWELVE ? 'active' : ''"
            >
              {{ $t('m.twelveScreens') }}
            </div>
          </div>
          <div class="screen">
            <div class="one-screen" v-if="active === $CONSTANT.SPLITSCREEN.ONE">
              <cb-col
                class="screen-list"
                :span="24"
                :key="index"
                v-for="(item, index) in screenData"
              >
                <div class="iframe-bg" v-if="item.monitor_sessions.monitor_url">
                  <span class="name">{{ item.user_name }}</span>
                </div>
                <iframe
                  class="link"
                  :src="item.monitor_sessions.monitor_url"
                  v-if="item.monitor_sessions.monitor_url"
                ></iframe>
                <div
                  class="play"
                  :class="{
                    active: !item.monitor_sessions.monitor_url,
                  }"
                >
                  <div
                    class="play-btn"
                    v-if="item.monitor_sessions.monitor_url"
                  >
                    <div class="play-btn-icon">
                      <cb-iconfont
                        type="icon-kaishi"
                        size="36"
                        themedColor="cy1"
                      ></cb-iconfont>
                    </div>
                  </div>
                  <img class="img-responsive" :src="defaultImage" />
                </div>
              </cb-col>
            </div>
            <div v-if="active === $CONSTANT.SPLITSCREEN.FOUR">
              <div
                class="four-screen"
                v-for="item in screenData"
                :key="item.user_name"
              >
                <cb-col class="screen-list" :span="12">
                  <div
                    class="iframe-bg"
                    v-if="item.monitor_sessions.monitor_url"
                  >
                    <span class="name">{{ item.user_name }}</span
                    ><i
                      class="iconfont iconzoom_large"
                      @click="largeScreen(item)"
                    ></i>
                  </div>
                  <iframe
                    class="link"
                    :src="item.monitor_sessions.monitor_url"
                    v-if="item.monitor_sessions.monitor_url"
                  ></iframe>
                  <div
                    class="play"
                    :class="{
                      active: !item.monitor_sessions.monitor_url,
                    }"
                  >
                    <div
                      class="play-btn"
                      v-if="item.monitor_sessions.monitor_url"
                    >
                      <div class="play-btn-icon">
                        <cb-iconfont
                          type="icon-kaishi"
                          size="36"
                          themedColor="cy1"
                        ></cb-iconfont>
                      </div>
                    </div>
                    <img class="img-responsive" :src="defaultImage" />
                  </div>
                </cb-col>
              </div>
            </div>
            <div v-if="active === $CONSTANT.SPLITSCREEN.NINE">
              <div
                class="nine-screen"
                v-for="item in screenData"
                :key="item.user_name"
              >
                <cb-col class="screen-list" :span="8">
                  <div
                    class="iframe-bg"
                    v-if="item.monitor_sessions.monitor_url"
                  >
                    <span class="name">{{ item.user_name }}</span
                    ><i
                      class="iconfont iconzoom_large"
                      @click="largeScreen(item)"
                    ></i>
                  </div>
                  <iframe
                    class="link"
                    :src="item.monitor_sessions.monitor_url"
                    v-if="item.monitor_sessions.monitor_url"
                  ></iframe>
                  <div
                    class="play"
                    :class="{
                      active: !item.monitor_sessions.monitor_url,
                    }"
                  >
                    <div
                      class="play-btn"
                      v-if="item.monitor_sessions.monitor_url"
                    >
                      <div class="play-btn-icon">
                        <cb-iconfont
                          type="icon-kaishi"
                          size="36"
                          themedColor="cy1"
                        ></cb-iconfont>
                      </div>
                    </div>
                    <img class="img-responsive" :src="defaultImage" />
                  </div>
                </cb-col>
              </div>
            </div>
            <div v-if="active === $CONSTANT.SPLITSCREEN.TWELVE">
              <div
                class="twelve-screen"
                v-for="item in screenData"
                :key="item.user_name"
              >
                <cb-col class="screen-list" :span="6">
                  <div
                    class="iframe-bg"
                    v-if="item.monitor_sessions.monitor_url"
                  >
                    <span class="name">{{ item.user_name }}</span
                    ><i
                      class="iconfont iconzoom_large"
                      @click="largeScreen(item)"
                    ></i>
                  </div>
                  <iframe
                    class="link"
                    :src="item.monitor_sessions.monitor_url"
                    v-if="item.monitor_sessions.monitor_url"
                  ></iframe>
                  <div
                    class="play"
                    :class="{
                      active: !item.monitor_sessions.monitor_url,
                    }"
                  >
                    <div
                      class="play-btn"
                      v-if="item.monitor_sessions.monitor_url"
                    >
                      <div class="play-btn-icon">
                        <cb-iconfont
                          type="icon-kaishi"
                          size="36"
                          themedColor="cy1"
                        ></cb-iconfont>
                      </div>
                    </div>
                    <img class="img-responsive" :src="defaultImage" />
                  </div>
                </cb-col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Constant from '../course-constant.js';
import _ from 'lodash';
import defaultImage from '@/assets/img/course/video.png';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
let interval = null;
export default {
  components: {},
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // 表示是否是浅色系
      light: true,
      active: Constant.SPLITSCREEN.ONE,
      checkedUser: [],
      monitorData: null,
      screenmonitorData: [],
      time: 5,
      defaultImage: defaultImage,
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
    screenData() {
      let screenDataList = [];
      if (this.screenmonitorData.length < this.active) {
        const num = this.active - this.screenmonitorData.length;
        const newData = [];
        _.times(num, (i) => {
          newData.push({ monitor_sessions: [{ monitor_url: '' }] });
        });
        screenDataList = _.concat(this.screenmonitorData, newData);
      } else {
        screenDataList = _.concat(this.screenmonitorData);
      }
      return screenDataList;
    },
  },
  mounted() {
    this.listenFunc();
  },
  created() {
    this.listen.createListen();
    clearInterval(interval);
    sessionStorage.removeItem('screen-monitor-checked-user');
    sessionStorage.removeItem('screen-monitor-screen-data');
    this.getMonitorDataInit();
    this.getTime();
  },
  beforeDestroy() {
    this.listen.destroyListen();
    clearInterval(interval);
  },
  methods: {
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
    },
    getTime() {
      this.$request
        .get('/oj/admin/lesson/monitor_refresh_interval', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.time = _.get(res, 'data.data') || 5;
          this.timeInterval();
        });
    },
    getMonitorDataInit() {
      const smCheckedUser = sessionStorage.getItem(
        'screen-monitor-checked-user',
      );
      const smScreenData = sessionStorage.getItem('screen-monitor-screen-data');
      smCheckedUser ? (this.checkedUser = JSON.parse(smCheckedUser)) : '';
      smScreenData ? (this.screenmonitorData = JSON.parse(smScreenData)) : '';

      this.$request
        .get(
          '/oj/admin/lesson/lesson_monitor',
          {
            resource_id: this.$route.params.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.monitorData = _.get(res, 'data.data') || null;
          if (this.monitorData.length != 0) {
            this.checkedUser.push(this.monitorData[0].user_id);
            this.sortCheckedUserPush();
          }
        });
    },
    getMonitorData() {
      const smCheckedUser = sessionStorage.getItem(
        'screen-monitor-checked-user',
      );
      const smScreenData = sessionStorage.getItem('screen-monitor-screen-data');
      smCheckedUser ? (this.checkedUser = JSON.parse(smCheckedUser)) : '';
      smScreenData ? (this.screenmonitorData = JSON.parse(smScreenData)) : '';
      this.$request
        .get(
          '/oj/admin/lesson/lesson_monitor',
          {
            resource_id: this.$route.params.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.monitorData = _.get(res, 'data.data') || null;
          // this.sortCheckedUserPush();
        });
    },
    timeInterval() {
      interval = setInterval(() => {
        this.getMonitorData();
      }, this.time * 1000);
    },
    choose(val) {
      this.active = val;
      this.sortCheckedUser();
    },
    handleChange(value) {
      this.sortCheckedUserPush();
    },
    sortCheckedUserPush() {
      const oldCheckedUserList = this.checkedUser;
      const newCheckedUserList = [];
      const screenDataList = [];
      if (
        this.active === this.$CONSTANT.SPLITSCREEN.ONE &&
        oldCheckedUserList.length > this.active
      ) {
        oldCheckedUserList.shift();
      }

      _.forEach(oldCheckedUserList, (item) => {
        _.forIn(this.monitorData, (element, key) => {
          if (element.user_id === item) {
            _.forEach(element.monitor_info, (data) => {
              if (screenDataList.length < this.active) {
                screenDataList.push(
                  _.assign(data, {
                    resource_id: element.user_id,
                  }),
                );
                newCheckedUserList.push(item);
              }
            });
          }

          // if (key === item) {
          //   _.forEach(element.monitor_info, (data) => {
          //     if (screenDataList.length < this.active) {
          //       screenDataList.push(
          //         _.assign(data, {
          //           resource_id: element.user_info.resource_id,
          //         }),
          //       );
          //       newCheckedUserList.push(item);
          //     }
          //   });
          // }
        });
      });
      this.checkedUser = _.concat([], [...new Set(newCheckedUserList)]);
      this.screenmonitorData = _.concat([], screenDataList);
      sessionStorage.setItem(
        'screen-monitor-checked-user-checked-user',
        JSON.stringify(this.checkedUser),
      );
      sessionStorage.setItem(
        'screen-monitor-screen-data',
        JSON.stringify(this.screenmonitorData),
      );
    },
    sortCheckedUser() {
      const oldCheckedUserList = this.checkedUser;
      const newCheckedUserList = [];
      const screenDataList = [];
      _.forIn(this.monitorData, (element, key) => {
        _.forEach(oldCheckedUserList, (item) => {
          if (element.user_id === item) {
            _.forEach(element.monitor_info, (data) => {
              if (screenDataList.length < this.active) {
                screenDataList.push(
                  _.assign(data, {
                    resource_id: element.user_id,
                  }),
                );
                newCheckedUserList.push(item);
              }
            });
          }

          // if (key === item) {
          //   _.forEach(element.monitor_info, (data) => {
          //     if (screenDataList.length < this.active) {
          //       screenDataList.push(
          //         _.assign(data, {
          //           resource_id: element.user_info.resource_id,
          //         }),
          //       );
          //       newCheckedUserList.push(item);
          //     }
          //   });
          // }
        });
      });
      this.checkedUser = _.concat([], [...new Set(newCheckedUserList)]);
      this.screenmonitorData = _.concat([], screenDataList);
      sessionStorage.setItem(
        'screen-monitor-checked-user-checked-user',
        JSON.stringify(this.checkedUser),
      );
      sessionStorage.setItem(
        'screen-monitor-screen-data',
        JSON.stringify(this.screenmonitorData),
      );
    },
    // largeScreen(item) {
    //   this.active = this.$CONSTANT.SPLITSCREEN.ONE;

    //   const monitorSessions = this.monitorData[item.resource_id].monitor_info;
    //   const newScreenObj = _.find(monitorSessions, function (description) {
    //     return (
    //       JSON.stringify(description.monitor_sessions) ===
    //       JSON.stringify(item.monitor_sessions)
    //     );
    //   });
    //   this.checkedUser = _.concat([], item.resource_id);
    //   this.screenmonitorData = _.concat([], newScreenObj);
    //   sessionStorage.setItem(
    //     'screen-monitor-checked-user',
    //     JSON.stringify(this.checkedUser),
    //   );
    //   sessionStorage.setItem(
    //     'screen-monitor-screen-data',
    //     JSON.stringify(this.screenmonitorData),
    //   );
    // },
    largeScreen(item) {
      this.active = this.$CONSTANT.SPLITSCREEN.ONE;
      let findData = this.monitorData.find((item1) => {
        return item1.user_id == item.resource_id;
      });
      const monitorSessions = findData.monitor_info;

      const newScreenObj = _.find(monitorSessions, function (description) {
        return (
          findData.user_id === item.resource_id &&
          description.monitor_sessions.protocol ===
            item.monitor_sessions.protocol &&
          description.monitor_sessions.node_id === item.monitor_sessions.node_id
        );
      });
      this.checkedUser = _.concat([], item.resource_id);
      this.screenmonitorData = _.concat([], newScreenObj);
      sessionStorage.setItem(
        'screen-monitor-screen-data',
        JSON.stringify(this.screenmonitorData),
      );
    },
  },
};
</script>
<style scoped lang="scss">
.learn-monitor .screen .screen-list .play.active {
  opacity: 1;
}

.learn-monitor {
  .iframe-bg {
    background-color: var(--bg-color-3);
    span.name {
      color: var(--neutral8);
    }
    i {
      color: var(--neutral8);
    }
  }
  .screen {
    .screen-list {
      .play {
        background-color: var(--bg-color-2) !important;
      }
    }
  }
  .monitor-choose {
    color: var(--neutral8);
    background-color: var(--bg-color-2);
    .title {
      color: var(--neutral8);
    }
  }
  .screen-btn {
    .btn-group {
      .icon {
        color: var(--neutral8);
      }
      .icon.active {
        color: var(--primary-color);
      }
    }
  }
}

.user-select {
  margin-left: 15px;
}
</style>

<style lang="scss">
.el-card.learn-monitor-box-card.is-always-shadow,
.el-card.learn-monitor-box-card.is-hover-shadow:focus,
.el-card.learn-monitor-box-card.is-hover-shadow:hover {
  background: transparent;
  border: 0;
  box-shadow: none;
}
.learn-monitor-box-card {
  .el-checkbox {
    display: block;
    margin: 0 20px 20px;
  }
}
</style>
<style scoped lang="scss">
.learn-monitor {
  display: flex;
  .link {
    position: absolute;
    width: calc(100% - 10px);
    height: calc(100% - 50px);
    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;
    top: 50px;
  }
  .iframe-bg {
    position: absolute;
    top: 10px;
    width: calc(100% - 10px);
    height: 40px;
    border-radius: 16px 16px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    box-sizing: border-box;
    z-index: 9;
    span.name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    i {
      font-size: 16px;
    }
  }
  .screen {
    .screen-list {
      position: relative;
      padding: 10px 10px 0 0;
      .play {
        opacity: 0;
        .play.active {
          opacity: 1;
        }
        .play-btn {
          position: absolute;
          top: calc((100% - 36px) / 2);
          left: calc(calc((100% - 36px) / 2));
          width: 36px;
          height: 36px;
          border-radius: 50%;
          .play-btn-icon {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            // span {
            //   width: 0;
            //   height: 0;
            //   border-top: 10px solid transparent;
            //   border-left: 10px solid #000;
            //   border-bottom: 10px solid transparent;
            //   font-size: 0;
            //   line-height: 0;
            // }
          }
        }
        .img-responsive {
          border-radius: 16px;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .monitor-choose {
    width: 200px;
    min-height: 200px;
    margin-right: 20px;
    .title {
      font-size: 14px;
      font-weight: 400;
      margin: 15px 0 20px 15px;
    }
  }
  .screen-btn {
    width: calc(100% - 220px);
    .btn-group {
      margin-bottom: 10px;
      .icon {
        display: inline-block;
        min-width: 80px;
        height: 32px;
        line-height: 32px;
        margin-right: 20px;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
        text-align: center;
        background: var(--neutral1);
      }
    }
  }
}
</style>
