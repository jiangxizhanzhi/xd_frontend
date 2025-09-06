<template>
  <cb-dialog
    v-if="visibleValue"
    width="52%"
    append-to-body
    custom-class="oj-video-checkpoint-dialog"
    :visible="visibleValue"
    destroy-on-close
    center="center"
    top="55px"
    @close="handleClose"
  >
    <template slot="title">
      <div>{{ $t('course.checkpoint') }}</div>
    </template>
    <cb-form
      ref="formRef"
      :model.sync="videoForm"
      id="id"
      :json="true"
      label-position="right"
      label-width="90px"
      class="oj-video-checkpoint-form"
    >
      <cb-row>
        <cb-form-item :label="$t('course.preview')">
          <div class="checkpoint-form-item">
            <video
              v-loading="videoLoading"
              id="video-checkpoint"
              controls
              ref="videoRef"
              class="custom-video video-js vjs-default-skin"
              preload="auto"
              controlsList="nodownload noremoteplayback disablePictureInPicture noplaybackrate"
            ></video>
            <div
              v-if="customOperation"
              class="video-checkpoint-add-box"
              :style="{ left: `calc(${addBtnLeftPos || 0}% - 90px)` }"
              v-click-out-side="onClickOutSide"
            >
              <cb-button size="small" hollow @click="addCustomCheckpoint(true)">
                {{ $t('course.add') + $t('course.customPoints') }}
              </cb-button>
            </div>
          </div>
        </cb-form-item>
      </cb-row>
      <cb-row>
        <cb-col :span="2" class="checkpoint-label-item">
          {{ $t('course.point') }}
        </cb-col>
        <cb-col class="checkpoint-item">
          <cb-tabs v-model="active">
            <cb-tab-pane :label="$t('course.evenly')" name="evenly">
              <template v-if="!videoForm.split">
                <div :class="{ 'empty-wrapper': true }">
                  <cb-button
                    type="text"
                    icon="icon-xinzeng"
                    @click="addEvenlyCheckpoint"
                    >{{ $t('course.add') + $t('course.point') }}
                  </cb-button>
                </div>
              </template>
              <div v-else class="evenly-item">
                <cb-col :span="1" style="width: 2%">
                  <div class="circle"></div>
                </cb-col>
                <cb-col :span="10">
                  <cb-form-item
                    :label="$t('course.split')"
                    prop="split"
                    label-width="40px"
                  >
                    <cb-input-number
                      v-model="videoForm.split"
                      controls-position="right"
                      :step-strictly="true"
                      :min="3"
                      :max="splitMin"
                      @change="changeSplit"
                    ></cb-input-number>
                    {{ $t('course.seconds') }}
                  </cb-form-item>
                </cb-col>
                <cb-col :span="13">
                  <cb-form-item label-width="0" prop="switchState">
                    <cb-checkbox
                      class="checkbox-item"
                      v-model="videoForm.pop_up"
                      @change="changePopUp"
                    >
                      {{ $t('course.interactive') }}
                    </cb-checkbox>
                  </cb-form-item>
                </cb-col>
              </div>
            </cb-tab-pane>
            <cb-tab-pane :label="$t('course.custom')" name="custom">
              <template v-if="!videoForm.custom || !videoForm.custom.length">
                <div :class="{ 'empty-wrapper': true }">
                  <cb-button
                    type="text"
                    icon="icon-xinzeng"
                    @click="addCustomCheckpoint(null)"
                  >
                    {{ $t('course.add') + $t('course.point') }}
                  </cb-button>
                </div>
              </template>
              <div v-else class="custom-wrapper" ref="customRef">
                <div
                  v-for="(item, index) in videoForm.custom"
                  :key="index"
                  class="custom-item"
                >
                  <cb-row>
                    <cb-col
                      :span="1"
                      style="width: 4%"
                      class="checkpoint-config-col"
                    >
                      <div class="circle custom"></div>
                    </cb-col>
                    <cb-col :span="8" class="checkpoint-config-col">
                      <cb-form-item
                        label-width="0"
                        :prop="'custom.' + index + '.time'"
                      >
                        <cb-time-picker
                          v-model="item.format"
                          @change="handleTimePicker($event, index)"
                          value-format="HH:mm:ss"
                          :picker-options="{
                            selectableRange: timePickerSelectableRange,
                          }"
                        ></cb-time-picker>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="13" class="checkpoint-config-col">
                      <cb-form-item
                        label-width="0"
                        :prop="'custom.' + index + '.pop_up'"
                      >
                        <cb-checkbox
                          class="checkbox-item"
                          v-model="item.pop_up"
                        >
                          {{ $t('course.interactive') }}
                        </cb-checkbox>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="2" class="checkpoint-config-col">
                      <div class="btn-box">
                        <cb-button
                          type="text"
                          icon="icon-jianshao"
                          @click="deleteCustomCheckpoint(index)"
                        ></cb-button>
                        <cb-button
                          v-if="index == videoForm.custom.length - 1"
                          type="text"
                          icon="icon-xinzeng"
                          @click="addCustomCheckpoint(null)"
                          class="add-btn"
                        ></cb-button>
                      </div>
                    </cb-col>
                  </cb-row>
                </div>
              </div>
            </cb-tab-pane>
          </cb-tabs>
        </cb-col>
      </cb-row>
    </cb-form>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button mr="mr" @click="save">{{ $t('button.confirm') }}</cb-button>
        <cb-button button-type="cancel" @click="cancel"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import {
  computed,
  onMounted,
  ref,
  watch,
  nextTick,
} from '@vue/composition-api';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-markers/dist/videojs.markers.css';
import 'videojs-markers';
import clickOutSide from '@/directives/clickoutside.js';

export default {
  name: 'video-checkpoint',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    video_url: {
      type: String,
      default: '',
    },
    // 检查点详情 json || object
    video_check_point: {
      // type: any,
      // default: '',
    },
  },
  directives: {
    clickOutSide,
  },
  setup(props, { emit }) {
    const defaultSplit = 10;
    let player = ref();
    let videoRef = ref(null);
    let videoLoading = ref(true);
    let videoDuration = ref();
    let videoDurationHms = ref();
    let addBtnLeftPos = ref();
    let customOperation = ref(false);
    let timePickerSelectableRange = ref('');
    let customRef = ref(null);
    let splitMin = ref(600);
    let videoForm = ref({
      split: 0, // 平均分布
      pop_up: false, // 平均分布
      evenly: [],
      custom: [],
    });
    let checkpoints = ref([]);
    let active = ref('evenly');
    const visibleValue = computed({
      get: () => {
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val);
        return val;
      },
    });
    let videoOption = {
      //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
      controls: true,
      //自动播放属性,muted:静音播放
      autoplay: true,
      //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
      preload: 'auto',
      muted: true,
      loop: true,
      //设置视频播放器的显示宽度（以像素为单位）
      // width: "800px",
      //设置视频播放器的显示高度（以像素为单位）
      // height: '320px',
      controlBar: {
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: true,
        remainingTimeDisplay: true,
        playToggle: false,
        children: [
          { name: 'progressControl' },
          { name: 'playToggle' },
          { name: 'currentTimeDisplay' },
          { name: 'timeDivider' },
          { name: 'durationDisplay' },
        ],
      },
      fluid: true,
      sources: [
        {
          src: props.video_url, // 视频或者直播地址
          type: 'video/mp4',
        },
      ],
    };

    const video_check_point_form = computed({
      get: () => {
        return props.video_check_point;
      },
      set: (val) => {
        emit('update:video_check_point', val);
        return val;
      },
    });

    onMounted(() => {
      nextTick(() => {
        if (
          video_check_point_form.value &&
          Object.keys(video_check_point_form.value)?.length
        ) {
          // 编辑回显
          let data = isJSON(video_check_point_form.value)
            ? JSON.parse(video_check_point_form.value)
            : props.video_check_point;
          if (data?.points && data.points.length) {
            videoForm.value.split = data.points[0].time;
            videoForm.value.pop_up = data.points[0].pop_up;
          }
          if (data?.custom_points && data.custom_points.length) {
            data.custom_points = data.custom_points?.map((item) => {
              return {
                ...item,
                class: 'custom',
                format: secondsToHms(item.time),
              };
            });
          }
          videoForm.value.custom = data.custom_points;
        } else {
          videoForm.value.split = defaultSplit;
        }
        player.value = videojs(
          document.getElementById('video-checkpoint'),
          videoOption,
        );
        // 播放器准备就绪后获取视频时长
        player.value.on('loadedmetadata', function () {
          videoLoading.value = false;
          videoDuration.value = player.value.duration();
          videoDurationHms.value = secondsToHms(videoDuration.value);
          timePickerSelectableRange.value = `00:00:00 - ${videoDurationHms.value}`;
          splitMin.value = Math.min(600, Number(videoDuration.value));
          updateEvenlyPoints(videoForm.value.split, true);
        });

        player.value.on('seeking', function (e) {
          setCustomOperation();
        });

        player.value.on('seeked', function (e) {
          setCustomOperation();
        });
        setMarkers();
      });
    });

    const changeSplit = (val) => {
      videoForm.value.split = val;
      updateEvenlyPoints(val, true);
    };

    const changePopUp = (val) => {
      updateEvenlyPoints(videoForm.value.split, false);
    };

    const addEvenlyCheckpoint = () => {
      videoForm.value.split = defaultSplit;
    };

    const deleteEvenlyCheckpoint = () => {
      videoForm.value.split = null;
    };

    /**
     * 添加自定义检查点
     * @param fromVideo 是否是点击视频进度条触发
     */
    const addCustomCheckpoint = (fromVideo) => {
      let item = {
        time: '0',
        pop_up: false,
        class: 'custom',
        format: '00:00:00',
      };
      if (fromVideo) {
        item.time = player.value.currentTime().toFixed(0);
        item.format = secondsToHms(item.time);
        active.value = 'custom';
      }
      if (
        item.time == '0' ||
        !videoForm.value.custom.some((itm) => itm.time == item.time)
      ) {
        videoForm.value.custom.push(item);
      }
      customOperation.value = false;
      nextTick(() => {
        customRef.value.scrollTop = customRef.value?.scrollHeight;
      });
      updatePointsMarkers();
    };

    const deleteCustomCheckpoint = (index) => {
      videoForm.value.custom.splice(index, 1);
      updatePointsMarkers();
    };

    const handleTimePicker = (val, index) => {
      videoForm.value.custom[index].time = timeToSeconds(val);
      updatePointsMarkers();
    };

    // 更新平均分布的视频点
    const updateEvenlyPoints = (split, updateMarkers) => {
      videoForm.value.evenly = [];
      if (split) {
        // 均等分批量生成检查点
        if (videoDuration.value) {
          let count = Math.floor(videoDuration.value / split);
          for (let index = 1; index < count + 1; index++) {
            if (
              !videoForm.value.evenly.length ||
              !videoForm.value.evenly.some((item) => item.time == index * split)
            ) {
              videoForm.value.evenly.push({
                time: index * split,
                class: 'evenly',
                pop_up: videoForm.value.pop_up,
              });
            }
          }
        }
      }
      updateMarkers && updatePointsMarkers();
      return videoForm.value.evenly;
    };

    // 更新检查点
    const updatePointsMarkers = () => {
      nextTick(() => {
        player.value.markers.reset([
          ...(videoForm.value.evenly?.filter((item) => item.time != '0') || []),
          ...(videoForm.value.custom?.filter((item) => item.time != '0') || []),
        ]);
      });
    };
    // 展示 滚动条下方 自定义添加检查点的按钮
    const setCustomOperation = () => {
      customOperation.value = false;
      player.value.pause();
      let currentTime = player.value.currentTime();
      let totalCheckPoints = [
        ...videoForm.value.evenly,
        ...videoForm.value.custom,
      ];
      if (
        !totalCheckPoints.some(
          (item) => Math.abs(item.time - currentTime) < 0.5,
        )
      ) {
        customOperation.value = true;
        addBtnLeftPos.value = (
          (player.value.currentTime() / player.value.duration()) *
          100
        ).toFixed(0);
      }
    };

    const handleClose = () => {
      emit('close');
    };

    const setMarkers = () => {
      player.value.markers({
        markerStyle: {
          // 标记点样式
          width: '0.7em',
          height: '0.7em',
          bottom: '-0.20em',
          'border-radius': '50%',
          position: 'absolute',
        },
        //鼠标移入标记点的提示
        markerTip: {
          display: false, // 是否显示
          /*
            用于动态构建标记提示文本的回调函数。
            只需返回一个字符串，参数标记是传递给插件的标记对象
           */
          text: function (marker) {
            return marker.time;
          },
        },
        markers: checkpoints.value,
      });
    };

    const secondsToHms = (sec) => {
      let hours = Math.floor(sec / 3600);
      let minutes = Math.floor((sec % 3600) / 60);
      let seconds = (sec % 60).toFixed(0);

      return [hours, minutes, seconds]
        .map((num) => (num < 10 ? '0' + num : num.toString()))
        .join(':');
    };

    const timeToSeconds = (time) => {
      let [hours, minutes, seconds] = time.split(':').map(Number); // 利用解构赋值和Array.map()将时间字符串转换为数字数组
      // 计算总秒数
      return hours * 3600 + minutes * 60 + seconds;
    };

    // 判断是否为json字符串
    const isJSON = (str) => {
      if (typeof str == 'string') {
        try {
          let obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    };

    const onClickOutSide = (e) => {
      if (
        ['vjs-progress-control vjs-control', 'checkpoint-form-item'].includes(
          e.target?.className,
        )
      ) {
      } else {
        customOperation.value = false;
      }
    };

    const save = () => {
      let data = {
        points:
          videoForm.value.evenly?.filter((item) => item.time != '0') || [], // 过滤掉0
        custom_points:
          videoForm.value.custom?.filter((item) => item.time != '0') || [],
      };
      video_check_point_form.value = JSON.stringify(data);
      handleClose();
    };

    const cancel = () => {
      handleClose();
    };

    return {
      visibleValue,
      videoRef,
      player,
      videoForm,
      active,
      videoLoading,
      videoDuration,
      videoDurationHms,
      addBtnLeftPos,
      customOperation,
      timePickerSelectableRange,
      customRef,
      splitMin,
      changeSplit,
      changePopUp,
      addCustomCheckpoint,
      deleteCustomCheckpoint,
      deleteEvenlyCheckpoint,
      addEvenlyCheckpoint,
      setMarkers,
      secondsToHms,
      timeToSeconds,
      handleTimePicker,
      handleClose,
      updateEvenlyPoints,
      updatePointsMarkers,
      isJSON,
      onClickOutSide,
      save,
      cancel,
    };
  },
};
</script>

<style lang="scss">
.oj-video-checkpoint-dialog {
  .vjs-volume-panel.vjs-control.vjs-volume-panel-horizontal,
  .vjs-play-control.vjs-control.vjs-button.vjs-paused.vjs-ended,
  .vjs-picture-in-picture-control.vjs-control.vjs-button,
  .vjs-fullscreen-control.vjs-control.vjs-button,
  .vjs-play-control.vjs-control.vjs-button.vjs-paused,
  .vjs-play-control.vjs-control.vjs-button.vjs-playing {
    display: none !important;
  }

  .vjs-time-control.vjs-time-divider {
    padding-left: 0;
    min-width: 0;
  }

  .vjs-duration.vjs-time-control.vjs-control {
    min-width: 1em;
    padding-left: 0;
  }

  .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
    opacity: 1 !important;
  }

  .split-item {
    display: flex;
  }

  .switch-state-item {
    display: inline-block;
  }

  .checkpoint-label-item {
    width: 90px;
    text-align: right;
    padding: 12px 12px 0 0;
  }

  .checkpoint-item {
    background-color: var(--neutral0);
    width: calc(100% - 90px);
    padding: 2px 16px 16px;
  }

  .evenly-item {
    background-color: var(--bg-color-3);
    height: 52px;
    line-height: 52px;
    display: flex;
    align-items: center;

    .el-form-item {
      margin: 16px;
    }
  }

  .custom-item {
    background-color: var(--bg-color-3);
    border-top: 1px solid var(--neutral0);

    .el-form-item {
      margin: 16px;
    }
  }

  .custom-wrapper {
    max-height: 160px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: rgba(0, 0, 0, 0) !important;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scrollbar-color) !important;
    }
  }

  .checkbox-item {
    margin-top: 10px;
  }

  .empty-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    color: var(--primary-color);
    background-color: var(--bg-color-3);
  }

  .btn-box {
    text-align: right;
    line-height: 52px;

    .add-btn {
      margin-left: 13px;
    }
  }

  .checkpoint-form-item {
    width: 100%;
    position: relative;
    //width: fit-content;

    .video-checkpoint-add-box {
      bottom: -26px;
      position: absolute;
    }
  }

  .circle {
    margin-left: 16px;
    //margin-top: 27px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    position: relative;

    &.custom {
      background-color: var(--orange-color);
    }
  }

  .evenly {
    background-color: var(--primary-color) !important;

    &:hover {
      transform: scale(1);
    }
  }

  .custom {
    background-color: var(--orange-color) !important;
  }

  .video-js .vjs-time-control {
    display: block;
  }

  .video-js .vjs-remaining-time {
    display: none;
  }
}
.el-time-panel {
  border: 0;
}
.el-time-spinner__item.disabled {
  color: #606266 !important;
}
.oj-video-checkpoint-form {
  margin-top: -24px;
  margin-bottom: -24px;
}
.checkpoint-config-col {
  height: 52px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
</style>
