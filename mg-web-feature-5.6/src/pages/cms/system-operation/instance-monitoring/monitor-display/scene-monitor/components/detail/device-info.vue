<template>
  <div class="main">
    <div class="top" :title="this.deviceInfoDetail.name">
      <div class="button-shadow">
        {{
          typeof deviceInfoDetail.name != 'undefined'
            ? deviceInfoDetail.name
            : ''
        }}
      </div>
    </div>
    <div class="scene-line"></div>
    <div class="mainCon">
      <div class="mainCon-left">
        <div class="mainCon-left-top">
          <div class="imgDiv">
            <img :src="processor" alt="" class="imgSize" />
          </div>
          <div>
            <div class="percent button-shadow">
              {{
                typeof deviceInfoDetail.host_state.cpu_percent != 'undefined'
                  ? getPercent(deviceInfoDetail.host_state.cpu_percent)
                  : ''
              }}
            </div>
            <div>{{ $t('systemOperation.monitorScene.processor') }}</div>
          </div>
        </div>
        <div class="mainCon-left-bottom">
          <div>
            <div>{{ $t('systemOperation.monitorScene.processor') }}</div>
            <div class="button-shadow">
              {{ deviceInfoDetail.host_state.cpu_count }}
            </div>
          </div>
          <div>
            <div>{{ $t('systemOperation.monitorScene.port') }}</div>
            <div class="button-shadow">
              {{
                deviceInfoDetail.rt_info && deviceInfoDetail.rt_info.ports_count
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="mainCon-right">
        <div class="mainCon-left-top">
          <div class="imgDiv">
            <img :src="ram" alt="" class="imgSize" />
          </div>
          <div>
            <div class="percent button-shadow">
              {{
                typeof deviceInfoDetail.host_state.memory_percent != 'undefined'
                  ? getPercent(deviceInfoDetail.host_state.memory_percent)
                  : ''
              }}
            </div>
            <div>{{ $t('systemOperation.monitorScene.ram') }}</div>
          </div>
        </div>
        <div class="mainCon-left-bottom">
          <div>
            <div>
              {{ $t('systemOperation.monitorScene.networkConnection') }}
            </div>
            <div class="button-shadow">
              {{
                typeof deviceInfoDetail.rt_info != 'undefined'
                  ? deviceInfoDetail.rt_info &&
                    deviceInfoDetail.rt_info.connection_count
                  : ''
              }}
            </div>
          </div>
          <div>
            <div>{{ $t('systemOperation.monitorScene.users') }}</div>
            <div class="button-shadow">
              {{
                typeof deviceInfoDetail.rt_info != 'undefined'
                  ? deviceInfoDetail.rt_info &&
                    deviceInfoDetail.rt_info.user_count
                  : ''
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import processor from '../../../assets/img/icon-processor.png';
import ram from '../../../assets/img/icon-ram.png';
import line from '../../../assets/img/scene-line.png';
export default {
  props: {
    deviceInfoDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      processor,
      ram,
      line,
    };
  },
  methods: {
    getPercent(value) {
      if (value) {
        return `${value}%`;
      } else {
        return 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-shadow {
  text-shadow: 0 0 8px rgba(231, 239, 255, 0.2),
    0 0 8px rgba(231, 239, 255, 0.2), 0 0 8px rgba(231, 239, 255, 0.2),
    0 0 8px rgba(231, 239, 255, 0.2);
  background: linear-gradient(0deg, #bde1ff 0%, #ffffff 50%, #e7efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.main {
  width: 30%;
  // flex: 1;
  font-size: 12px;
  margin: 10px 0;
  // 图片的大小
  .imgDiv {
    width: 50%;
    .imgSize {
      width: 100%;
    }
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-left: 15px;
    max-width: 250px;
    cursor: pointer;
    display: -webkit-box;
    text-overflow: ellipsis;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  .scene-line {
    width: 100%;
    height: 2px;
    background: url('../../../assets/img/scene-line.png') 0 0 no-repeat;
    background-size: 100% 100%;
    background-position-x: 15px;
  }
  .mainCon {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 28px);
    .mainCon-right,
    .mainCon-left {
      flex: 1;
      .percent {
        font-size: 18px;

        padding-top: 6px;
      }
      width: 50%;
      .mainCon-left-top {
        display: flex;
        height: 45%;
        align-items: center;
      }
      .mainCon-left-top > div {
        display: inline-block;
      }
      .mainCon-left-bottom {
        color: #c0cce7;
        height: 55%;
        // 下面文字与图片的对齐位置调整
        padding-left: 15%;
      }
      .mainCon-left-bottom > div {
        display: flex;
        height: 50%;
        align-items: center;
        & > div {
          // 进口端口号等宽度调整
          width: 50%;
        }
      }
    }
  }
}
</style>
