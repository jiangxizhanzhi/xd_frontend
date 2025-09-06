<template>
  <div class="visual-screen3">
    <div class="main">
      <div class="main-header one-overflow" :title="title">{{ title }}</div>
      <div class="main-time">{{ time }}</div>
      <!-- 动效步骤 -->
      <div class="stage-single">
        <stage-single
          :loadData="reLoadData"
          ref="stageSingleRef"
          :id="scene_id"
        />
      </div>
      <div class="toolbar-single">
        <cb-iconfont
          :size="24 * rate"
          type="icon-huifumoren"
          @click="restore"
        />
        <cb-iconfont
          :size="24 * rate"
          type="icon-shijianshijiaogensui"
          @click="follow"
        />
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

      <div class="total-contents">
        <div class="left-content">
          <div class="content">
            <img
              :src="effectListData[0] && effectListData[0].media_url"
              alt=""
              v-if="effectListData[0] && effectListData[0].media_type === 1"
            />
            <video
              :src="effectListData[0] && effectListData[0].media_url"
              v-if="effectListData[0] && effectListData[0].media_type === 2"
              autoplay
              muted
              loop
            ></video>
          </div>
          <div class="content">
            <img
              :src="effectListData[1] && effectListData[1].media_url"
              alt=""
              v-if="effectListData[1] && effectListData[1].media_type === 1"
            />
            <video
              :src="effectListData[1] && effectListData[1].media_url"
              v-if="effectListData[1] && effectListData[1].media_type === 2"
              autoplay
              muted
              loop
            ></video>
          </div>
        </div>
        <div class="right-content">
          <div class="right-box">
            <div class="content">
              <img
                :src="effectListData[2] && effectListData[2].media_url"
                alt=""
                v-if="effectListData[2] && effectListData[2].media_type === 1"
              />
              <video
                :src="effectListData[2] && effectListData[2].media_url"
                v-if="effectListData[2] && effectListData[2].media_type === 2"
                autoplay
                muted
                loop
              ></video>
            </div>
            <div class="content">
              <img
                :src="effectListData[3] && effectListData[3].media_url"
                alt=""
                v-if="effectListData[3] && effectListData[3].media_type === 1"
              />
              <video
                :src="effectListData[3] && effectListData[3].media_url"
                v-if="effectListData[3] && effectListData[3].media_type === 2"
                autoplay
                muted
                loop
              ></video>
            </div>
          </div>
        </div>
      </div>
      <Left v-show="show" :id="scene_id" v-if="!hiddenBoth" />
      <Right v-show="show" :id="scene_id" v-if="!hiddenBoth" />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  provide,
  getCurrentInstance,
} from '@vue/composition-api';
import { dateFormat } from '@/utils';
import ws from '@/utils/websocket';
import Left from './left';
import Right from './right';
import StageSingle from './stage-single';
import { getToken } from '@cyber/helper';
import {
  getSituFn, //获取态势场景
  refreshSituFn, //刷新态势场景
  // dynamicAttack, //3D攻击状态
  // nodeLinkStatus, //节点链路状态
} from './api';
import { getSysSettings } from '@cyber/helper';
export default defineComponent({
  name: '',
  props: {},
  components: {
    Left,
    Right,
    StageSingle,
  },
  setup() {
    let modeType = ref(''); //拓扑颜色配置
    //获取scene_id
    const is_instance = ref(false);
    const scene_new_id = ref('');
    const effectListData = ref([]);
    const hiddenBoth = ref(false);
    const title = ref('');
    const time = ref(dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    const rate = ref(window.screen.width / 1920);
    const rotate = ref(false);
    const show = ref(true);
    const reLoadData = ref([]);
    const room_id = ref('');
    const topo_id = ref('');
    const scene_id = ref('');
    const iframeRef = ref(null);
    const sceneConfigDataRef = ref(null);

    provide('rate', rate.value);

    let tick;
    let mountTimer;

    const url = ref(location.origin + '/topology/scene/');

    const rotateFun = () => {
      rotate.value = !rotate.value;
      iframeRef.value.contentWindow.postMessage({ type: 'rotate' }, url);
    };

    const restore = () => {
      iframeRef.value.contentWindow.postMessage({ type: 'restore' }, url);
    };
    const follow = () => {
      iframeRef.value.contentWindow.postMessage({ type: 'follow' }, url);
    };
    const findDirection = (index, arr) => {
      return arr.find((item) => {
        if (item) {
          return Number(item.direction) === index;
        }
      });
    };
    const sortDirection = (arr) => {
      if (arr.length < 4) {
        arr.length = 4;
      }
      let newArr = [
        findDirection(1, arr),
        findDirection(2, arr),
        findDirection(3, arr),
        findDirection(4, arr),
      ];
      return newArr;
    };
    //获取态势场景根据接口返回时间几秒请求一次refresh_rate
    const getSituation = () => {
      const params = {
        scene_id: scene_new_id.value,
        is_instance: is_instance.value,
      };
      if (
        scene_new_id.value === getCurrentInstance().proxy.$route.query.scene_id
      ) {
        getSituFn({ ...params }).then((res) => {
          sceneConfigDataRef.value = res.data.data;
          mountTimer = setInterval(() => {
            refreshSituFn({
              ...sceneConfigDataRef.value,
              scene_id: scene_new_id.value,
            });
          }, 1000 * sceneConfigDataRef.value.refresh_rate);
        });
      }
    };

    onMounted(() => {
      // 获取modeType
      modeType = getCurrentInstance().proxy.$route.query.modeType
        ? getCurrentInstance().proxy.$route.query.modeType
        : '1';

      //获取场景id(scene_id||topo_id,)
      scene_new_id.value = getCurrentInstance().proxy.$route.query.scene_id
        ? getCurrentInstance().proxy.$route.query.scene_id
        : getCurrentInstance().proxy.$route.query.topo_id;
      if (
        scene_new_id.value === getCurrentInstance().proxy.$route.query.topo_id
      ) {
        is_instance.value = false;
      } else {
        is_instance.value = true;
      }
      getSituation();
      // 获取设置页面title
      getSysSettings().then((res) => {
        try {
          const titleData =
            res.data.data.find((item, index) => {
              return item.key_name === 'system_name';
            }) || {};
          document.title = titleData?.value || '';
        } catch (error) {
          // console.log(error);
        }
      });

      tick = setInterval(() => {
        time.value = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      }, 1000);
      title.value = getCurrentInstance().proxy.$route.query.name;
      room_id.value = getCurrentInstance().proxy.$route.query.room_id;
      topo_id.value = getCurrentInstance().proxy.$route.query.topo_id;
      scene_id.value = getCurrentInstance().proxy.$route.query.scene_id;
      url.value += `?sceneId=${scene_id.value}&topoId=${
        topo_id.value
      }&modeType=${modeType}&token=${getToken()}`;

      if (!scene_id.value) {
        ws.cbind(
          `/ojj/ws/cr/ce_base/scene?business_id=${
            room_id.value
          }&token=${getToken()}`,
          (res) => {
            const { scene_element } = res.data.data;
            if (
              scene_element &&
              scene_element.event === 2 &&
              scene_element.event_status === 4
            ) {
              scene_id.value = scene_element.scence_id;
              iframeRef.value.contentWindow.postMessage(
                { type: 'scene', value: scene_id.value },
                url,
              );
            }
          },
        );
      }

      ws.cbind(
        `/ojj/ws/situation/scene?scene_id=${
          scene_new_id.value
        }&token=${getToken()}`,
        (res) => {
          if (res.code === 'attack_effect') {
            if (res.data.effect_list.length > 0) {
              let effectList = res.data.effect_list.map((item) => {
                return {
                  ...item,
                  // media_url: 'http://10.100.1.28:80' + item.media_url,
                  media_url: item.media_url,
                };
              });
              effectListData.value = sortDirection(effectList);
            } else {
              effectListData.value = [];
            }
          }
          //运行动效方案
          else if (res.code === 'attack_schedule') {
            reLoadData.value = res.data;
          } else if (res.code === 'scene_config') {
            if (scene_new_id.value) {
              //判断ws,scene_config,刷新态势场景接口根据时间refresh_rate几秒掉一次
              sceneConfigDataRef.value = { ...res.data };
            }
          }
        },
      );
    });

    onUnmounted(() => {
      clearInterval(tick);
      //清除定时
      clearInterval(mountTimer);
    });

    return {
      modeType,
      iframeRef,
      title,
      time,
      url,
      rate,
      rotate,
      show,
      scene_id,
      scene_new_id,
      topo_id,
      rotateFun,
      follow,
      restore,
      hiddenBoth,
      effectListData,
      reLoadData,
      is_instance,
    };
  },
});
</script>
<style lang="scss" scoped>
//团队的四个角图片
.total-contents {
  width: 98%;
  height: 90%;
  display: flex;
  justify-content: space-around;
  position: absolute;
  right: 1%;
  top: 7%;
  left: 1%;
  bottom: 3%;

  .left-content {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-flow: column;
    .content {
      width: 50%;
      height: 35%;
      overflow: hidden;
      position: relative;
      z-index: 13;
      img {
        width: 100%;
      }
      video {
        width: 100%;
      }
    }
  }
  .right-content {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    .right-box {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .content {
      width: 100%;
      height: 35%;
      overflow: hidden;
      position: relative;
      z-index: 13;
      img {
        width: 100%;
      }
      video {
        width: 100%;
      }
    }
  }
}
.toolbar-single {
  position: absolute;
  top: 6em;
  right: 32em !important;
  z-index: 30;
  user-select: none;
  .cb-iconfont {
    cursor: pointer;
  }
}
.stage-single {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  z-index: 14;
}
.main-header {
  z-index: 12;
}
.main-time {
  z-index: 12;
}
</style>
