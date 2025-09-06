<template>
  <cb-inner-page :background="false">
    <div class="operation-monitor-box-card">
      <div class="operation-monitor">
        <div class="screen-btn">
          <div class="btn-group">
            <div
              class="icon icon-one"
              @click="choose(1)"
              :class="active === 1 ? 'active' : ''"
            >
              {{ $t('dashboard.oneScreen') }}
            </div>
            <div
              class="icon icon-four"
              @click="choose(4)"
              :class="active === 4 ? 'active' : ''"
            >
              {{ $t('dashboard.fourScreen') }}
            </div>
            <div
              class="icon icon-nine"
              @click="choose(9)"
              :class="active === 9 ? 'active' : ''"
            >
              {{ $t('dashboard.nineScreen') }}
            </div>
          </div>
          <div class="screen">
            <div class="one-screen" v-if="active === 1">
              <cb-col
                class="screen-list"
                :span="24"
                :key="item.user_name"
                v-for="item in screenData"
              >
                <div class="iframe-bg" v-if="item.monitor_url">
                  <span class="name">{{ item.node_name }}</span>
                </div>
                <iframe
                  class="link"
                  :src="item.monitor_url"
                  v-if="item.monitor_url"
                ></iframe>
                <div
                  class="play"
                  :class="{
                    active: !item.monitor_url,
                  }"
                >
                  <img class="img-responsive" :src="defaultImage" />
                </div>
              </cb-col>
            </div>
            <div v-if="active === 4">
              <div
                v-for="item in screenData"
                class="four-screen"
                :key="item.user_name"
              >
                <cb-col class="screen-list" :span="12">
                  <div class="iframe-bg" v-if="item.monitor_url">
                    <span class="name">{{ item.node_name }}</span>
                    <cb-iconfont
                      class="large"
                      type="icon-dangqian1"
                      @click="largeScreen(item)"
                    ></cb-iconfont>
                  </div>
                  <iframe
                    class="link"
                    :src="item.monitor_url"
                    v-if="item.monitor_url"
                  ></iframe>
                  <div
                    class="play"
                    :class="{
                      active: !item.monitor_url,
                    }"
                  >
                    <img class="img-responsive" :src="defaultImage" />
                  </div>
                </cb-col>
              </div>
            </div>
            <div v-if="active === 9">
              <div
                class="nine-screen"
                :key="item.user_name"
                v-for="item in screenData"
              >
                <cb-col class="screen-list" :span="8">
                  <div class="iframe-bg" v-if="item.monitor_url">
                    <span class="name">{{ item.node_name }}</span>
                    <cb-iconfont
                      class="large"
                      type="icon-dangqian1"
                      @click="largeScreen(item)"
                    ></cb-iconfont>
                  </div>
                  <iframe
                    class="link"
                    :src="item.monitor_url"
                    v-if="item.monitor_url"
                  ></iframe>
                  <div
                    class="play"
                    :class="{
                      active: !item.monitor_url,
                    }"
                  >
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
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
import defaultImage from '@/assets/img/dashboard/video.png';
export default {
  components: {},
  data() {
    return {
      user: '',
      userId: '',
      active: 1,
      defaultImage: defaultImage,
      sessionData: [],
      monitorData: [],
    };
  },
  computed: {
    screenData() {
      let screenDataList = [];
      if (this.monitorData.length < this.active) {
        const num = this.active - this.monitorData.length;
        const newData = [];
        _.times(num, (i) => {
          newData.push({ monitor_url: '' });
        });
        screenDataList = _.concat(this.monitorData, newData);
      } else {
        screenDataList = _.concat(this.monitorData);
      }
      return screenDataList;
    },
  },
  created() {
    this.userId = this.$route.params.id;
    this.user = this.$route.params.user;
    document.body.scrollTop = 0;
  },
  mounted() {
    this.getMonitorData();
    setBreadcrumbTitle(this.user);
  },
  methods: {
    choose(val) {
      this.active = val;
      this.getMonitorData();
    },
    //获取监控数据
    getMonitorData() {
      this.$request
        .get(
          `/agg/dashboard/user_node_session/`,
          {
            userId: this.userId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          this.sessionData = _.get(res, 'data.data') || [];
          this.splitData();
        });
    },
    //分屏处理数据
    splitData() {
      const screenDataList = [];
      _.forIn(this.sessionData, (element, key) => {
        if (screenDataList.length < this.active) {
          screenDataList.push(element);
        }
      });
      this.monitorData = screenDataList;
    },
    //放大屏幕切换到一屏
    largeScreen(item) {
      this.active = 1;
      this.monitorData = [item];
    },
  },
};
</script>

<style scoped lang="scss">
.operation-monitor-box-card {
  width: 100%;
}
.operation-monitor .screen .screen-list .play.active {
  opacity: 1;
}
.operation-monitor {
  .iframe-bg {
    background-color: var(--mask-color);
    span.name {
      color: var(--white-color);
    }
    .large {
      color: var(--white-color);
    }
  }
  .screen {
    .screen-list {
      .play {
        background-color: var(--bg-color-2) !important;
      }
    }
  }
  .screen-btn {
    .btn-group {
      .icon {
        color: var(--neutral8);
        border: 1px solid var(--neutral5);
      }
      .icon.active {
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
      }
    }
  }
}
.operation-monitor {
  display: flex;
  .link {
    position: absolute;
    width: calc(100% - 10px);
    height: calc(100% - 50px);
    border: 0;
  }
  .iframe-bg {
    position: absolute;
    top: 10px;
    width: calc(100% - 10px);
    height: 40px;
    text-align: center;
    padding: 10px 14px;
    box-sizing: border-box;
    z-index: 9;
    span.name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .large {
      float: right;
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
        .img-responsive {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .screen-btn {
    width: 100%;
    .btn-group {
      margin-bottom: 10px;
      font-size: 0;
      .icon {
        display: inline-block;
        font-size: 14px;
        min-width: 80px;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        box-sizing: border-box;
        background: var(--neutral1);
        cursor: pointer;
      }
    }
  }
}
</style>
