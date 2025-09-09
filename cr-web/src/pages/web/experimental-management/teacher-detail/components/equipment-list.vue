<template>
  <!-- 团队设备清单详情 -->
  <div class="equipment-list">
    <div class="quipment-statistics">
      <block :title="$t('admin.deviceList')"></block>
      <!-- 设备统计 -->
      <div class="category-list">
        <div class="category-item">
          <div class="external-wrap">
            <div class="internal-wrap network">
              <cb-iconfont
                :size="16"
                type="icon-wangluoshebei"
                class="category-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="device-num">{{ countList.network_count || 0 }}</div>
          <div class="category-name">{{ $t('admin.netDevice') }}</div>
        </div>
        <div class="category-item">
          <div class="external-wrap">
            <div class="internal-wrap operate">
              <cb-iconfont
                :size="16"
                type="icon-zhongduanshebei1"
                class="category-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="device-num">
            {{ countList.operation_system_count || 0 }}
          </div>
          <div class="category-name">{{ $t('admin.OS') }}</div>
        </div>
        <div class="category-item">
          <div class="external-wrap">
            <div class="internal-wrap security">
              <cb-iconfont
                :size="16"
                type="icon-anfangshebei"
                class="category-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="device-num">{{ countList.safety_system_count || 0 }}</div>
          <div class="category-name">{{ $t('admin.secDevice') }}</div>
        </div>
        <div class="category-item">
          <div class="external-wrap">
            <div class="internal-wrap apply">
              <cb-iconfont
                :size="16"
                type="icon-shitishebei"
                class="category-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="device-num">
            {{ countList.application_system_count || 0 }}
          </div>
          <div class="category-name">{{ $t('admin.appSystem') }}</div>
        </div>
      </div>
    </div>
    <!-- 筛选条件 -->
    <div class="filter-wrap">
      <cb-select
        v-model="model.category"
        :options="categoryOption"
        @change="handleSelect"
      ></cb-select>
      <cb-search-input
        v-model="model.name"
        @change="handleInput"
      ></cb-search-input>
    </div>
    <!-- 设备列表 -->
    <div class="device-list cyber-scroll-bar-small">
      <div class="device-item" :key="index" v-for="(item, index) in deviceList">
        <div class="device-detail">
          <!-- 设备logo -->
          <div class="left-wrap">
            <div class="logo-wrap">
              <img :src="item.icon2" />
            </div>
          </div>
          <div class="right-wrap">
            <!-- 设备名称 -->
            <div
              class="device-name"
              :class="[
                start && !(item.event === 4 && item.event_status === 4)
                  ? 'device-name-start'
                  : 'device-name-close',
              ]"
              :title="item.name"
            >
              {{ item.name }}
            </div>
            <!-- 设备分类 -->
            <div
              class="device-category"
              :class="[
                start && !(item.event === 4 && item.event_status === 4)
                  ? 'device-category-start'
                  : 'device-category-close',
              ]"
            >
              <span>{{ computedCategory(item.category) }}</span> |
              <span>{{ handleVirtualType(item.virtual_type) }}</span> |
              <span>{{ item.system_type_name }}</span>
            </div>
            <div class="num-info">
              <!-- ip显示状态 -->
              <div class="ip-info">
                <div class="img-wrap">
                  <cb-iconfont
                    :size="16"
                    type="icon-IP"
                    class="num-info-icon"
                  ></cb-iconfont>
                </div>
                <div
                  class="ip-value"
                  :class="[
                    start && !(item.event === 4 && item.event_status === 4)
                      ? 'ip-value-start'
                      : 'ip-value-close',
                  ]"
                >
                  {{
                    item.ports.length && item.ports[0].ip
                      ? item.ports[0].ip
                      : '--'
                  }}
                </div>
              </div>
              <!-- cpu显示状态 -->
              <div class="cpu-info">
                <div class="img-wrap">
                  <cb-iconfont
                    :size="16"
                    type="icon-cpu"
                    class="num-info-icon"
                  ></cb-iconfont>
                </div>
                <div
                  class="cpu-value"
                  :class="[
                    start && !(item.event === 4 && item.event_status === 4)
                      ? 'cpu-value-start'
                      : 'cpu-value-close',
                  ]"
                >
                  {{
                    item.host_state && item.host_state.cpu_percent
                      ? item.host_state.cpu_percent + '%'
                      : '--'
                  }}
                </div>
              </div>
              <!-- 内存显示状态 -->
              <div class="ram-info">
                <div class="img-wrap">
                  <cb-iconfont
                    :size="16"
                    type="icon-neicun"
                    class="num-info-icon"
                  ></cb-iconfont>
                </div>
                <div
                  class="ram-value"
                  :class="[
                    start && !(item.event === 4 && item.event_status === 4)
                      ? 'ram-value-start'
                      : 'ram-value-close',
                  ]"
                >
                  {{
                    item.host_state && item.host_state.memory_percent
                      ? item.host_state.memory_percent + '%'
                      : '--'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="connect-wrap">
          <div class="connect-info" v-if="start">
            <div v-if="start">
              <!-- 开机状态  -->
              <span
                class="outer-wrap"
                v-if="
                  (item.event === 3 && item.event_status === 4) ||
                  (item.event === 2 && item.event_status === 4) ||
                  (item.event === 5 && item.event_status === 4)
                "
              >
                <i class="dot green"></i>
                <span>
                  <!-- 多人接入提示 -->

                  <span
                    class="connect-tip"
                    v-if="item.access_users && item.access_users.length > 1"
                  >
                    <span class="name">{{ item.access_users[0].name }}</span>
                    <span>
                      {{
                        $t('等') +
                        item.access_users.length +
                        $t('人') +
                        $t('接入')
                      }}</span
                    >
                  </span>
                  <!-- 一人接入提示 -->
                  <span
                    class="connect-tip"
                    v-if="item.access_users && item.access_users.length === 1"
                  >
                    <span class="name">{{ item.access_users[0].name }}</span>
                    <span> {{ $t('接入') }}</span>
                  </span>
                </span>
              </span>
              <!-- 关机状态 -->
              <span
                class="outer-wrap"
                v-if="item.event === 4 && item.event_status === 4"
              >
                <i class="dot red"></i>
                <span class="connect-tip">{{ $t('已关机') }}</span>
              </span>
            </div>
          </div>
          <div class="btn-group">
            <!-- 场景启动  状态是开机的接入按钮 -->
            <cb-popover
              placement="top"
              trigger="click"
              width="250"
              popper-class="login-popover"
              v-if="start && !(item.event === 4 && item.event_status === 4)"
            >
              <div class="login-info">
                <div class="name">{{ item.name }}</div>
                <div
                  class="env-info cyber-scroll-bar-small"
                  :key="port.id"
                  v-for="port in item.ports"
                >
                  <div class="address">
                    {{ $t('内网地址') + ':' + port.ip }}
                  </div>
                  <div class="tip">{{ $t('访问环境') + ':' }}</div>
                  <div
                    class="login-type"
                    v-for="mode in port.cloud_access_modes"
                  >
                    <div class="status-wrap">
                      <div class="img-wrap">
                        <!-- todo状态待替换 -->

                        <img :src="defaultLogo" />
                      </div>
                      <div class="ip-wrap">
                        {{ mode.protocol || ' -- ' }}
                        {{ mode.access_ip || ' -- ' }}
                        {{ mode.access_port || ' -- ' }}
                      </div>
                    </div>
                    <div
                      class="user-password"
                      v-if="mode.username && mode.password"
                    >
                      {{
                        $t('用户名') +
                        ':' +
                        mode.username +
                        $t('密码') +
                        ':' +
                        mode.password
                      }}
                    </div>
                    <div class="btn-wrap">
                      <cb-button
                        icon="icon-zhongduanshebei"
                        hollow
                        @click="
                          openTap(
                            '',
                            mode,
                            item.id,
                            item.virtual_type,
                            item.name,
                          )
                        "
                        >{{ mode.protocol + $t('登录') }}</cb-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div slot="reference">
                <div class="btn-wrap" title="登录方式">
                  <cb-iconfont
                    size="18"
                    type="icon-zhongduanshebei"
                  ></cb-iconfont>
                </div>
              </div>
            </cb-popover>
            <!-- 场景启动  状态是关机的接入按钮 -->
            <div
              class="btn-wrap"
              title="配置"
              v-if="!start || (item.event === 4 && item.event_status === 4)"
            >
              <cb-iconfont
                size="18"
                type="icon-zhongduanshebei"
                :style="{ color: $themed('--primary-color-4') }"
              ></cb-iconfont>
            </div>
            <div class="btn-wrap" title="配置">
              <cb-iconfont
                size="18"
                type="icon-xitongguanli"
                :style="{
                  color:
                    start && {}
                      ? $themed('--primary-color')
                      : $themed('--primary-color-4'),
                }"
              ></cb-iconfont>
            </div>
            <div class="btn-wrap" title="重建" @click="nodeRecreate(item)">
              <cb-iconfont
                type="icon-bianjiqizhongjian"
                :style="{
                  color:
                    start &&
                    ((item.event === 2 && item.event_status === 4) ||
                      (item.event === 5 && item.event_status === 4) ||
                      (item.event === 5 && item.event_status === 5) ||
                      (item.event === 11 && item.event_status === 4) ||
                      (item.event === 11 && item.event_status === 5) ||
                      (item.event === 7 && item.event_status === 4) ||
                      (item.event === 13 && item.event_status === 4) ||
                      (item.event === 8 && item.event_status === 4) ||
                      //  5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
                      (item.event === 4 && item.event_status === 4) ||
                      (item.event === 3 && item.event_status === 4) ||
                      (item.event === 2 && item.event_status === 5) ||
                      (item.event === 3 && item.event_status === 5) ||
                      (item.event === 4 && item.event_status === 5) ||
                      (item.event === 6 && item.event_status === 5) ||
                      (item.event === 7 && item.event_status === 5) ||
                      (item.event === 9 && item.event_status === 5) ||
                      (item.event === 10 && item.event_status === 5) ||
                      (item.event === 12 && item.event_status === 5) ||
                      (item.event === 13 && item.event_status === 5))
                      ? $themed('--primary-color')
                      : $themed('--primary-color-4'),
                }"
              ></cb-iconfont>
            </div>
            <div class="btn-wrap" title="重启" @click="nodeRestart(item)">
              <cb-iconfont
                size="18"
                type="icon-zhongqi"
                :style="{
                  color:
                    start &&
                    ((item.event === 2 && item.event_status === 4) ||
                      (item.event === 5 && item.event_status === 4) ||
                      (item.event === 5 && item.event_status === 5) ||
                      (item.event === 11 && item.event_status === 4) ||
                      (item.event === 11 && item.event_status === 5) ||
                      (item.event === 7 && item.event_status === 4) ||
                      (item.event === 13 && item.event_status === 4) ||
                      (item.event === 8 && item.event_status === 4) ||
                      //  5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
                      (item.event === 4 && item.event_status === 4) ||
                      (item.event === 3 && item.event_status === 4) ||
                      (item.event === 2 && item.event_status === 5) ||
                      (item.event === 3 && item.event_status === 5) ||
                      (item.event === 4 && item.event_status === 5) ||
                      (item.event === 6 && item.event_status === 5) ||
                      (item.event === 7 && item.event_status === 5) ||
                      (item.event === 9 && item.event_status === 5) ||
                      (item.event === 10 && item.event_status === 5) ||
                      (item.event === 12 && item.event_status === 5) ||
                      (item.event === 13 && item.event_status === 5))
                      ? $themed('--primary-color')
                      : $themed('--primary-color-4'),
                }"
              ></cb-iconfont>
            </div>
            <div
              class="btn-wrap"
              :title="
                (item.event === 2 && item.event_status === 4) ||
                (item.event === 3 && item.event_status === 4) ||
                (item.event === 5 && item.event_status === 4) ||
                (item.event === 7 && item.event_status === 4) ||
                (item.event === 8 && item.event_status === 4) ||
                (item.event === 10 && item.event_status === 4) ||
                (item.event === 11 && item.event_status === 4) ||
                (item.event === 13 && item.event_status === 4)
                  ? $t('关机')
                  : $t('开机')
              "
              @click="nodeShartShutDown(item)"
            >
              <cb-iconfont
                size="18"
                type="icon-guanji"
                :style="{
                  color:
                    start &&
                    ((item.event === 2 && item.event_status === 4) ||
                      (item.event === 3 && item.event_status === 4) ||
                      (item.event === 5 && item.event_status === 4) ||
                      (item.event === 7 && item.event_status === 4) ||
                      (item.event === 8 && item.event_status === 4) ||
                      (item.event === 10 && item.event_status === 4) ||
                      (item.event === 11 && item.event_status === 4) ||
                      (item.event === 13 && item.event_status === 4) ||
                      (item.event === 4 && item.event_status === 4))
                      ? $themed('--primary-color')
                      : $themed('--primary-color-4'),
                }"
              ></cb-iconfont>
            </div>
            <div class="btn-wrap" title="删除">
              <cb-iconfont
                size="18"
                type="icon-shanchu"
                :style="{
                  color: start
                    ? $themed('--primary-color')
                    : $themed('--primary-color-4'),
                }"
              ></cb-iconfont>
            </div>
          </div>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div
        v-if="!deviceList.length"
        class="empty-comp"
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <empty-page ref="emptyComp" />
      </div>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import defaultLogo from '@/assets/img/addhost.png';
import emptyPage from '@/pages/web/Empty';
import {
  nodeShutDownApi,
  nodeShutUpApi,
  nodeStartApi,
  nodeBuildApi,
} from '@/api/web/team-training';
export default {
  components: {
    block,
    emptyPage,
  },
  props: {
    countList: {
      type: Object,
      default: () => {},
    },
    deviceList: {
      type: Array,
      default: () => [],
    },
    start: {
      type: Boolean,
      default: false,
    },
    sceneId: {
      type: String,
      default: '',
    },
    topo_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      resource_id: this.$route.params && this.$route.params.resource_id,
      defaultLogo,
      showPopover: true,
      model: {
        category: '',
        name: '',
      },
      categoryOption: [
        {
          label: this.$t('rbt.allEquipment'),
          value: '',
        },
        {
          label: this.$t('admin.OS'),
          value: 1,
        },
        {
          label: this.$t('admin.appSystem'),
          value: 2,
        },
        {
          label: this.$t('admin.netDevice'),
          value: 3,
        },
        {
          label: this.$t('admin.secDevice'),
          value: 4,
        },
      ],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleSelect(val) {
      this.$emit('updateList', this.model);
    },
    handleInput(val) {
      this.$emit('updateList', this.model);
    },
    computedCategory(category) {
      const data = this.categoryOption.filter((item) => {
        return item.value === category;
      });
      if (data.length) {
        return data[0].label;
      }
    },
    handleVirtualType(value) {
      // 1 交换机
      // 2 路由器
      // 3 防火墙
      // 4 虚拟机
      // 5 容器
      // 6 实体设备
      const data = {
        1: this.$t('device.switch'),
        2: this.$t('device.router'),
        3: this.$t('device.firewall'),
        4: this.$t('device.vm'),
        5: this.$t('device.docker'),
        6: this.$t('device.real'),
      };
      return data[value];
    },
    // 开机关机
    nodeShartShutDown(data) {
      // 关机
      if (
        (data.event === 2 && data.event_status === 4) ||
        (data.event === 3 && data.event_status === 4) ||
        (data.event === 5 && data.event_status === 4) ||
        (data.event === 7 && data.event_status === 4) ||
        (data.event === 8 && data.event_status === 4) ||
        (data.event === 10 && data.event_status === 4) ||
        (data.event === 11 && data.event_status === 4) ||
        (data.event === 13 && data.event_status === 4)
      ) {
        nodeShutDownApi({
          node_id: data.id,
          mp_scene_id: this.sceneId,
        }).then((res) => {});
      } else if (data.event === 4 && data.event_status === 4) {
        // 开机
        nodeShutUpApi({
          node_id: data.id,
          mp_scene_id: this.sceneId,
        }).then((res) => {});
      }
    },
    // 红蓝重启节点
    nodeRestart(data) {
      if (
        (data.event === 2 && data.event_status === 4) ||
        (data.event === 5 && data.event_status === 4) ||
        (data.event === 5 && data.event_status === 5) ||
        (data.event === 11 && data.event_status === 4) ||
        (data.event === 11 && data.event_status === 5) ||
        (data.event === 7 && data.event_status === 4) ||
        (data.event === 13 && data.event_status === 4) ||
        (data.event === 8 && data.event_status === 4) ||
        //  5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
        (data.event === 4 && data.event_status === 4) ||
        (data.event === 3 && data.event_status === 4) ||
        (data.event === 2 && data.event_status === 5) ||
        (data.event === 3 && data.event_status === 5) ||
        (data.event === 4 && data.event_status === 5) ||
        (data.event === 6 && data.event_status === 5) ||
        (data.event === 7 && data.event_status === 5) ||
        (data.event === 9 && data.event_status === 5) ||
        (data.event === 10 && data.event_status === 5) ||
        (data.event === 12 && data.event_status === 5) ||
        (data.event === 13 && data.event_status === 5)
      ) {
        const { id } = data;
        nodeStartApi({
          node_id: id,
          resource_id: this.resource_id,
        }).then((res) => {});
      }
    },
    //红蓝节点重建
    nodeRecreate(data) {
      if (
        (data.event === 2 && data.event_status === 4) ||
        (data.event === 5 && data.event_status === 4) ||
        (data.event === 5 && data.event_status === 5) ||
        (data.event === 11 && data.event_status === 4) ||
        (data.event === 11 && data.event_status === 5) ||
        (data.event === 7 && data.event_status === 4) ||
        (data.event === 13 && data.event_status === 4) ||
        (data.event === 8 && data.event_status === 4) ||
        //  5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
        (data.event === 4 && data.event_status === 4) ||
        (data.event === 3 && data.event_status === 4) ||
        (data.event === 2 && data.event_status === 5) ||
        (data.event === 3 && data.event_status === 5) ||
        (data.event === 4 && data.event_status === 5) ||
        (data.event === 6 && data.event_status === 5) ||
        (data.event === 7 && data.event_status === 5) ||
        (data.event === 9 && data.event_status === 5) ||
        (data.event === 10 && data.event_status === 5) ||
        (data.event === 12 && data.event_status === 5) ||
        (data.event === 13 && data.event_status === 5)
      ) {
        const { id } = data;
        nodeBuildApi({
          node_id: id,
          resource_id: this.resource_id,
        }).then((res) => {
          this.crEventDatas = res.data;
        });
      }
    },
    // 接入方式
    openTap(connection_url, access_modes, nodeId, image_type, nodeName) {
      this.$emit(
        'connect',
        connection_url,
        access_modes,
        nodeId,
        image_type,
        nodeName,
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.equipment-list {
  height: 100%;
  padding: 16px;
  .quipment-statistics {
    .category-list {
      height: 114px;
      background: var(--bg-color-3);
      display: flex;
      .category-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .external-wrap {
          width: 40px;
          height: 40px;
          background: var(--neutral0);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 8px;
          .internal-wrap {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .category-icon {
              color: var(--white-color);
            }
          }
          .network {
            background: var(--cyan-color);
          }
          .operate {
            background: var(--blue-color);
          }
          .security {
            background: var(--green-color);
          }
          .apply {
            background: var(--orange-color);
          }
        }
        .device-num {
          width: 100%;
          height: 20px;
          font-size: 20px;
          margin-top: 8px;
          color: var(--neutral8);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 4px;
        }
        .category-name {
          width: 100%;
          height: 22px;
          font-size: 14px;
          margin-top: 4px;
          color: var(--neutral7);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 4px;
        }
      }
    }
  }
  .filter-wrap {
    display: flex;
    margin: 16px 0;
    .cb-select {
      margin-right: 8px;
    }
  }
  .device-list {
    height: calc(100% - 218px);
    overflow-y: scroll;
    position: relative;
    .device-item {
      height: 134px;
      padding: 8px;
      background: var(--bg-color-3);
      margin-bottom: 8px;
      .device-detail {
        height: 85px;
        border-bottom: 1px solid var(--neutral1);
        display: flex;
        .left-wrap {
          .logo-wrap {
            width: 32px;
            height: 32px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .right-wrap {
          margin-left: 8px;
          flex: 1;
          .device-name {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
          }
          .device-name-start {
            color: var(--neutral8);
          }
          .device-name-close {
            color: var(--neutral4);
          }
          .device-category {
            margin-top: 4px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
          .device-category-start {
            color: var(--neutral7);
          }
          .device-category-close {
            color: var(--neutral4);
          }
          .num-info {
            margin-top: 8px;
            display: flex;
            .ip-info,
            .cpu-info,
            .ram-info {
              height: 20px;
              display: flex;
              align-items: center;
              font-size: 12px;
              margin-right: 20px;
              .img-wrap {
                width: 16px;
                height: 16px;
                margin-right: 6px;
                .num-info-icon {
                  color: var(--neutral5);
                }
              }
            }

            .ip-value {
              width: 82px;
            }
            .ip-value-start {
              color: var(--neutral8);
            }
            .ip-value-close {
              color: var(--neutral4);
            }
            .cpu-value {
              width: 50px;
            }
            .cpu-value-start {
              color: var(--neutral8);
            }
            .cpu-value-close {
              color: var(--neutral4);
            }
            .ram-value {
              width: 50px;
            }
            .ram-value-start {
              color: var(--neutral8);
            }
            .ram-value-close {
              color: var(--neutral4);
            }
          }
        }
      }
      .connect-wrap {
        margin-top: 4px;
        height: 32px;
        line-height: 32px;
        position: relative;
        .connect-info {
          display: flex;
          align-items: center;
          .outer-wrap {
            display: inline-block;
            height: 32px;
            line-height: 32px;
            display: flex;
            align-items: center;
          }
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 5px;
          }
          .green {
            background: var(--green-color);
          }
          .red {
            background: var(--red-color);
          }
          .connect-tip {
            display: flex;
            align-items: center;
            color: var(--neutral7);
            font-size: 12px;
            span {
              display: inline-block;
              max-width: 60px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .btn-group {
          display: flex;
          position: absolute;
          right: 0;
          top: 0;
          .btn-wrap {
            cursor: pointer;
            margin-left: 18px;
          }
        }
      }
    }
  }
}
.login-info {
  padding-bottom: 10px;
  .name {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: var(--neutral8);
    border-bottom: 1px solid var(--neutral1);
    padding-left: 16px;
  }
  .env-info {
    margin-top: 8px;
    padding: 0 16px;
    max-height: 300px;
    overflow-y: scroll;
    .address {
      font-size: 12px;
      color: var(--neutral7);
    }
    .tip {
      margin-top: 10px;
      font-size: 12px;
      color: var(--neutral7);
    }
    .login-type {
      margin-top: 8px;
      .status-wrap {
        display: flex;
        align-items: center;
        .img-wrap {
          width: 16px;
          height: 16px;
          margin-right: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .ip-wrap {
          font-size: 12px;
          color: var(--neutral8);
        }
      }
      .user-password {
        margin-top: 8px;
        font-size: 12px;
        color: var(--neutral8);
      }
      .btn-wrap {
        margin-top: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
.el-popover.login-popover {
  padding: 0;
}
</style>
