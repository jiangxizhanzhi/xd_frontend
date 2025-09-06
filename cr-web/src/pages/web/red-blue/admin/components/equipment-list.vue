<template>
  <div class="equipment-list">
    <div class="quipment-statistics" v-if="showCategory">
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
    <div class="filter-wrap" v-if="showSearch">
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
    <div
      class="device-list cyber-scroll-bar-small"
      @click.self="onClickOutSide"
      v-if="showDevice"
    >
      <div
        :class="{
          'device-item': true,
          active: item.id === clickedNodeId && showActice,
        }"
        :key="index"
        v-for="(item, index) in deviceList"
      >
        <div class="device-detail" @click.prevent="selectNodeById(item.id)">
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
              <!-- 第一列分类 -->
              <span>{{ computedCategory(item.category) }}</span>
              <!-- 第二列分类 -->
              <!-- 网络设备 item.category === 3 -->
              <!-- 仿真节点 item.virtual_type === 7 不展示第二列分类 -->
              <!-- 外部网络 item.virtual_type === 1 && external = true 不展示第二列分类 -->
              <template>
                <!-- 网络设备 -->
                <template
                  v-if="
                    item.category === 3 &&
                    item.virtual_type !== 7 &&
                    !(item.virtual_type === 1 && item.external === true)
                  "
                >
                  <span> | {{ handleNetworkDevice(item.type) }} </span>
                </template>
                <!-- 非网络设备 -->
                <template
                  v-if="
                    item.category !== 3 &&
                    item.virtual_type &&
                    handleVirtualType(item.virtual_type)
                  "
                >
                  <span
                    >|
                    {{ handleVirtualType(item.virtual_type) }}
                  </span>
                </template>
              </template>
              <!-- 第三列分类 -->
              <span v-if="item.category !== 3"
                >| {{ item.system_type_name }}</span
              >
            </div>
            <div class="num-info" v-if="isBuiltInTarget(item)">
              <!-- ip显示状态 -->
              <div class="ip-info">
                <div class="img-wrap" :title="$t('m.ip')">
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
                  <!-- 网络设备不展示ip -->
                  <span
                    v-if="
                      item.ports &&
                      item.ports.length > 0 &&
                      item.ports[0] &&
                      item.ports[0].ip &&
                      item.category !== 3
                    "
                    :title="handleIp(item.ports)"
                  >
                    {{ item.ports[0].ip
                    }}{{ item.ports.length > 1 ? '...' : '' }}
                  </span>
                  <span v-else>{{ '--' }}</span>
                </div>
              </div>
              <!-- cpu显示状态 -->
              <div class="cpu-info">
                <div class="img-wrap" :title="$t('m.cpu')">
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
                <div class="img-wrap" :title="$t('m.memory')">
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
              <span class="outer-wrap" v-if="shutdownAvailable(item)">
                <i
                  class="dot green"
                  v-if="item.access_users && item.access_users.length"
                ></i>
                <span>
                  <!-- 多人接入提示 -->
                  <span
                    class="connect-tip"
                    v-if="item.access_users && item.access_users.length > 1"
                  >
                    <span class="name">{{ item.access_users[0].name }}</span>
                    <span>
                      {{
                        $t('rbt.ect') +
                        item.access_users.length +
                        $t('rbt.people') +
                        $t('rbt.switchOn')
                      }}</span
                    >
                  </span>
                  <!-- 一人接入提示 -->
                  <span
                    class="connect-tip"
                    v-if="item.access_users && item.access_users.length === 1"
                  >
                    <span class="name" :title="item.access_users[0].name">{{
                      item.access_users[0].name
                    }}</span>
                    <span> {{ $t('rbt.switchOn') }}</span>
                  </span>
                </span>
              </span>
              <!-- 关机状态 -->
              <span class="outer-wrap" v-if="shutupAvailable(item)">
                <i class="dot red"></i>
                <span class="connect-tip">{{ $t('rbt.powerOff') }}</span>
              </span>
            </div>
          </div>
          <div class="btn-group">
            <!-- 场景启动  接入按钮 -->
            <div
              class="btn-wrap"
              :title="$t('rbt.switchOn')"
              v-if="
                showConnection &&
                accessData &&
                accessData.get(item.id) &&
                accessData.get(item.id).enable
              "
            >
              <cb-popover
                trigger="click"
                placement="top"
                :popper-class="'access-popover'"
                :disabled="!start"
              >
                <div
                  v-if="accessData.get(item.id).id == item.id"
                  class="protocol-access-wrapper"
                >
                  <div>{{ $t('scene.accessEnvironment') }} :</div>
                  <div
                    v-for="(mode, index) in accessData.get(item.id).modes"
                    :key="index"
                  >
                    <div
                      class="protocol-item"
                      v-for="(itm, idx) in mode.modes"
                      :key="index + 'item' + idx + itm.id"
                    >
                      <template v-if="itm.protocol">
                        <div>
                          <!--开机状态显示图标-->
                          <template v-if="!shutupAvailable(item)">
                            <cb-iconfont
                              :class="[
                                'access-icon',
                                'access-icon-' + itm.available,
                              ]"
                              :type="
                                itm.available
                                  ? 'icon-danxuan-xuanzhong'
                                  : 'icon-jiazai'
                              "
                              :color="
                                itm.available
                                  ? 'var(--green-color)'
                                  : 'var(--primary-color)'
                              "
                            ></cb-iconfont>
                          </template>
                          <!--关机状态显示圆-->
                          <template v-else>
                            <div class="circle-gray"></div>
                          </template>
                          {{ itm.protocol || ' -- ' }}
                          {{ itm.access_ip || '  ' }}
                          {{ itm.access_port || ' -- ' }}
                        </div>
                        <div v-if="itm.username || itm.password">
                          {{ $t('scene.Username') }} :
                          {{ itm.username || ' -- ' }}
                          {{ $t('scene.Password') }} :
                          {{ itm.password || ' -- ' }}
                        </div>
                        <div class="login-btn">
                          <cb-button
                            v-if="
                              (itm.protocol != 'nc' && itm.proxy) ||
                              itm.protocol == 'console' ||
                              itm.protocol == 'COM'
                            "
                            :disabled="
                              (accessData.get(item.id) &&
                                !accessData.get(item.id).availableAccess) ||
                              !itm.available
                            "
                            icon="icon-web"
                            @click="
                              openTap(
                                '',
                                itm,
                                item.id,
                                item.image_type,
                                item.name,
                              )
                            "
                            >{{ itm.protocol }} {{ $t('scene.login') }}
                          </cb-button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div slot="reference">
                  <cb-button
                    type="text"
                    icon="icon-zhongduanshebei"
                    :disabled="!start || showProgress || item.event == 0"
                    class="icon-one"
                  >
                  </cb-button>
                </div>
              </cb-popover>
            </div>
            <div
              class="btn-wrap"
              :title="$t('rbt.disposition')"
              v-if="showConfig && btnVisibleControl('config', item)"
            >
              <!-- 动态更新场景中、场景未启动、场景未启动成功、节点未启动的时候禁用按钮 -->
              <cb-button
                class="icon-two"
                type="text"
                icon="icon-shezhi"
                :disabled="
                  sceneStatus === 'update' ||
                  !start ||
                  showProgress ||
                  item.event == 0
                "
                @click="configureNode(item)"
              >
              </cb-button>
            </div>
            <div
              class="btn-wrap"
              :title="$t('rbt.Recreate')"
              v-if="
                showRecreate &&
                btnVisibleControl('reCreate_ReStart_Shutdown_Shutup', item)
              "
            >
              <cb-button
                class="icon-three"
                type="text"
                icon="icon-zhongjian"
                :disabled="
                  !reCreateAvailable(item) ||
                  !start ||
                  showProgress ||
                  item.event == 0
                "
                @click="nodeRecreate(item)"
              >
              </cb-button>
            </div>
            <div
              class="btn-wrap"
              :title="$t('scene.Reboot')"
              v-if="
                showRestart &&
                btnVisibleControl('reCreate_ReStart_Shutdown_Shutup', item)
              "
            >
              <cb-button
                class="icon-four"
                type="text"
                icon="icon-bianjiqizhongqi"
                :disabled="
                  !reStartAvailable(item) ||
                  !start ||
                  showProgress ||
                  item.event == 0
                "
                @click="nodeRestart(item)"
              >
              </cb-button>
            </div>
            <div
              class="btn-wrap"
              :title="
                shutdownAvailable(item)
                  ? $t('rbt.powerOffs')
                  : $t('rbt.powerOn')
              "
              v-if="
                showOpenClose &&
                btnVisibleControl('reCreate_ReStart_Shutdown_Shutup', item)
              "
            >
              <cb-button
                class="icon-five"
                type="text"
                icon="icon-guanji"
                :disabled="
                  (!shutdownAvailable(item) && !shutupAvailable(item)) ||
                  !start ||
                  showProgress ||
                  item.event == 0
                "
                @click="nodeShartShutDown(item)"
              >
              </cb-button>
            </div>
            <div
              class="btn-wrap"
              :title="$t('rbt.delete')"
              v-if="showDelete && btnVisibleControl('delete', item)"
            >
              <cb-button
                class="icon-six"
                type="text"
                icon="icon-shanchu"
                :disabled="
                  sceneStatus === 'update' ||
                  !start ||
                  item.role != 4 ||
                  showProgress ||
                  item.event == 0
                "
                @click="deleteNode(item)"
              >
              </cb-button>
            </div>
            <!-- 学员页面删除资产按钮 -->
            <div
              class="btn-wrap delete-style"
              :title="$t('rbt.deleteAssets')"
              v-if="showDeleteAsset"
            >
              <cb-iconfont
                size="16"
                type="icon-guanbi"
                @click="deleteAsset(item)"
                class="delete-icon"
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
import { deleteNodeDynamic } from '../../../../../api/scene/scene';
import { nodeShutDown, nodeShutUp } from '../../../../../api/common';
import _ from 'lodash';

export default {
  components: {
    block,
    emptyPage,
  },
  props: {
    // 设备分类
    showCategory: {
      type: Boolean,
      default: true,
    },
    // 搜索
    showSearch: {
      type: Boolean,
      default: true,
    },
    // 设备列表
    showDevice: {
      type: Boolean,
      default: true,
    },
    // 是否展示点击样式
    showActice: {
      type: Boolean,
      default: true,
    },
    // 展示接入
    showConnection: {
      type: Boolean,
      default: true,
    },
    // 展示配置
    showConfig: {
      type: Boolean,
      default: true,
    },
    // 展示重建
    showRecreate: {
      type: Boolean,
      default: true,
    },
    // 展示重启
    showRestart: {
      type: Boolean,
      default: true,
    },
    // 展示开机/关机
    showOpenClose: {
      type: Boolean,
      default: true,
    },
    // 展示删除
    showDelete: {
      type: Boolean,
      default: true,
    },
    // 学员页面删除资产按钮
    showDeleteAsset: {
      type: Boolean,
      default: false,
    },
    countList: {
      type: [Array, Object, String],
      default: '',
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
    // 场景拓扑模式
    sceneStatus: {
      type: String,
      default: '',
    },
    // 场景运行的进度条，如果有进度条代表未启动完成或者启动失败，需要置灰设备清单的操作按钮
    showProgress: {
      type: Boolean,
      default: false,
    },
    // 当前画布层id，如果当前节点的id不属于当前层，则需要置灰操作按钮
    levelId: {
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
      accessData: null, // 接入协议数据
      accessNodeId: '', // 当前查看接入的节点id
      clickedNodeId: '', // 选中的节点id
    };
  },
  watch: {
    deviceList: {
      handler(val) {
        // 需要获取到所有节点的接入数据
        val && this.accessAvailable(val);
      },
      deep: true,
      immediate: true,
    },
    start: {
      handler(val) {
        this.clickedNodeId = null;
        this.accessAvailable(this.deviceList);
      },
      deep: true,
      immediate: true,
    },
    sceneStatus: {
      handler(val) {
        this.clickedNodeId = '';
      },
      deep: true,
      immediate: true,
    },
    levelId: {
      handler(val) {
        this.clickedNodeId = null;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 判断是否是内置靶标，内置靶标不需要展示IP CPU 内存等信息
    isBuiltInTarget(item) {
      const { role } = item;
      // 根据role的值来判断是否展示IP CPU 内存数据
      // 22 交换机
      // 1 二层交换机
      // 21 路由器
      // 23 防火墙
      // 3 外部网络
      // 7 仿真节点
      return ![22, 1, 21, 23, 3, 7].includes(role);
    },
    handleIp(ports) {
      let ips = '';
      ports.forEach((item) => {
        if (item.ip) {
          ips += item.ip + '\n';
        }
      });
      return ips;
    },
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
    handleNetworkDevice(value) {
      // 1 交换机
      // 2 路由器
      // 3 防火墙
      // 4 虚拟机
      // 5 容器
      // 6 实体设备
      // 7 npc
      // 8 dynamips
      const data = {
        1: this.$t('device.switch'),
        2: this.$t('device.router'),
        3: this.$t('device.firewall'),
        4: this.$t('device.vm'),
        5: this.$t('device.docker'),
        6: this.$t('device.real'),
        7: this.$t('device.npc'),
        8: this.$t('device.dynamips'),
      };
      return data[value];
    },
    handleVirtualType(value) {
      // 1 交换机
      // 2 路由器
      // 3 防火墙
      // 4 虚拟机
      // 5 容器
      // 6 实体设备
      // 7 npc
      // 8 dynamips
      const data = {
        1: this.$t('device.switch'),
        2: this.$t('device.router'),
        3: this.$t('device.firewall'),
        4: this.$t('device.vm'),
        5: this.$t('device.docker'),
        6: this.$t('device.real'),
        7: this.$t('device.npc'),
        8: this.$t('device.dynamips'),
      };
      return data[value];
    },
    // 开机关机
    nodeShartShutDown(data) {
      if (!this.start) return;
      // 关机
      if (this.shutdownAvailable(data)) {
        nodeShutDown({
          node_id: data.id,
          mp_scene_id: this.sceneId,
        }).then((res) => {
          this.$message.success(this.$t('common.operateSuccess'));
        });
      } else if (data.event === 4 && data.event_status === 4) {
        // 开机
        nodeShutUp({
          node_id: data.id,
          mp_scene_id: this.sceneId,
        }).then((res) => {
          this.$message.success(this.$t('common.operateSuccess'));
        });
      }
    },
    // 红蓝重启节点
    nodeRestart(data) {
      if (!this.start) return;
      if (this.reStartAvailable(data)) {
        const { id } = data;
        this.$emit('restart', id, this.resource_id);
      }
    },
    // 红蓝节点重建
    nodeRecreate(data) {
      if (!this.start) return;
      if (this.reCreateAvailable(data)) {
        const { id } = data;
        this.$emit('recreate', id, this.resource_id);
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
    // 动态配置单节点
    configureNode(data) {
      if (!this.start) return;
      this.$emit('configure-node', data);
    },
    // 动态删除节点
    deleteNode(data) {
      if (!this.start) return;
      this.$confirm(
        this.$t('m.confirmDeleteNode') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      ).then(() => {
        let params = {
          mp_scene_id: this.sceneId,
          node_id: data.id,
        };
        deleteNodeDynamic(params).then(() => {
          this.$emit('delete-node', data.id);
          this.$message.success(this.$t('common.deleteSuccessful'));
        });
      });
    },
    // 选中某个节点
    selectNodeById(nodeId) {
      if (!this.start) return;
      this.clickedNodeId = nodeId;
      this.start && nodeId && this.$emit('select-node', nodeId);
    },
    // 操作按钮的可见性控制
    btnVisibleControl(type, item) {
      // 不是当前层的节点不展示操作按钮
      if (item.area !== this.levelId) {
        return false;
      }
      if (type === 'config') {
        /**
         * 配置按钮
         * 镜像的网络设备和实装不支持节点属性更新
         * 后补充外部网络和NPC节点不支持节点属性更新
         * 后补充重启重建中不支持节点属性更新
         */
        return !(
          item.image_type === 'entity' ||
          item.role == 3 || // 外部网络
          item.role == 7 || // NPC
          (!item.is_build_in &&
            ['vm', 'container', 'dynamips'].includes(item.image_type) &&
            [21, 22, 23].includes(item.role)) ||
          (item.event === 5 && item.event_status === 1) ||
          (item.event === 5 && item.event_status === 2) ||
          (item.event === 11 && item.event_status === 1) ||
          (item.event === 11 && item.event_status === 2)
        );
      }
      if (type === 'reCreate_ReStart_Shutdown_Shutup') {
        /**
         * 重启重建开关机
         * 虚拟机、容器、dynamips节点支持
         */
        return ['vm', 'container', 'dynamips'].includes(item.image_type);
      }
      if (type === 'delete') {
        /**
         * 删除按钮
         * 终端节点支持
         */
        return item.role == 4;
      }
    },
    // 允许重建的状态值
    reCreateAvailable(item) {
      return (
        (item.event === 2 && item.event_status === 4) ||
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
        (item.event === 13 && item.event_status === 5) ||
        (item.event === 10 && item.event_status === 4)
      );
    },
    // 允许重启的状态值
    reStartAvailable(item) {
      return (
        (item.event === 2 && item.event_status === 4) ||
        (item.event === 5 && item.event_status === 4) ||
        // (item.event === 5 && item.event_status === 5) ||
        (item.event === 11 && item.event_status === 4) ||
        // (item.event === 11 && item.event_status === 5) ||
        (item.event === 7 && item.event_status === 4) ||
        (item.event === 13 && item.event_status === 4) ||
        (item.event === 8 && item.event_status === 4) ||
        //  5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
        (item.event === 4 && item.event_status === 4) ||
        (item.event === 3 && item.event_status === 4) ||
        // (item.event === 2 && item.event_status === 5) ||
        (item.event === 3 && item.event_status === 5) ||
        (item.event === 4 && item.event_status === 5) ||
        (item.event === 6 && item.event_status === 5) ||
        (item.event === 7 && item.event_status === 5) ||
        (item.event === 9 && item.event_status === 5) ||
        (item.event === 10 && item.event_status === 5) ||
        (item.event === 12 && item.event_status === 5) ||
        (item.event === 13 && item.event_status === 5) ||
        (item.event === 10 && item.event_status === 4)
      );
    },
    // 允许关机
    shutdownAvailable(item) {
      return (
        (item.event === 2 && item.event_status === 4) ||
        (item.event === 3 && item.event_status === 4) ||
        (item.event === 5 && item.event_status === 4) ||
        (item.event === 7 && item.event_status === 4) ||
        (item.event === 8 && item.event_status === 4) ||
        (item.event === 10 && item.event_status === 4) ||
        (item.event === 11 && item.event_status === 4) ||
        (item.event === 13 && item.event_status === 4) ||
        (item.event == 3 && item.event_status == 5)
      );
    },
    // 允许开机
    shutupAvailable(item) {
      return (
        (item.event === 4 && item.event_status === 4) ||
        (item.event === 4 && item.event_status === 5)
      );
    },
    // 接入面板数据
    accessAvailable(data, index) {
      if (!this.start) return;
      this.accessData = new Map();
      _.isArray(data) &&
        !_.isEmpty(data) &&
        data.forEach((item) => {
          let accessItem = {
            enable: false, // 标识是否有接入协议
            // 标识是否允许接入
            availableAccess:
              this.reCreateAvailable(item) && !this.shutupAvailable(item),
            name: item.name,
            image_type: item.image_type,
            id: item.id,
            modes: {},
          };
          _.isArray(item.ports) &&
            !_.isEmpty(item.ports) &&
            item.ports.forEach((itm) => {
              if (itm.cloud_access_modes?.length && item.event !== 0) {
                accessItem.enable = true;
              }
              if (itm.ip) {
                if (accessItem.modes[itm.ip]) {
                  accessItem.modes[itm.ip] = {
                    modes: [
                      ...accessItem.modes[itm.ip].modes,
                      ...itm.cloud_access_modes,
                    ],
                    name: data.name,
                  };
                } else {
                  accessItem.modes[itm.ip] = {
                    modes: itm.cloud_access_modes,
                    name: data.name,
                  };
                }
              }
            });
          this.accessData.set(item.id, accessItem);
        });
      return this.accessData;
    },
    /**
     * 点击外层关闭
     */
    onClickOutSide(e) {
      this.clickedNodeId = '';
    },
    // 删除资产事件
    deleteAsset(data) {
      this.$emit('deleteAsset', data);
    },
  },
};
</script>
<style lang="scss" scoped>
.equipment-list {
  border-radius: 4px;
  height: 100%;
  padding: 16px;
  .quipment-statistics {
    .category-list {
      border-radius: 2px;
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
            width: 26px;
            height: 26px;
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
    ::v-deep .cb-block {
      .cb-block-title-container {
        margin-bottom: 16px;
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
      border-radius: 2px;
      position: relative;
      height: 134px;
      padding: 8px;
      background: var(--bg-color-3);
      margin-bottom: 8px;
      cursor: pointer;
      .delete-style {
        position: absolute;
        top: -98px;
        right: -2px;
        .delete-icon {
          color: var(--neutral6);
        }
      }
      border: 1px solid transparent;
      &.active {
        border: 1px solid var(--primary-color);
      }
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
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
            height: 20px;
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
              width: 40px;
            }
            .cpu-value-start {
              color: var(--neutral8);
            }
            .cpu-value-close {
              color: var(--neutral4);
            }
            .ram-value {
              width: 40px;
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
            ::v-deep .icon-one {
              .el-button {
                .cb-iconfont {
                  font-size: 16px !important;
                }
              }
            }
            ::v-deep .icon-two {
              .el-button {
                .cb-iconfont {
                  font-size: 17px !important;
                }
              }
            }
            ::v-deep .icon-three {
              .el-button {
                .cb-iconfont {
                  font-size: 16px !important;
                }
              }
            }
            ::v-deep .icon-four {
              .el-button {
                .cb-iconfont {
                  font-size: 16px !important;
                }
              }
            }
            ::v-deep .icon-five {
              .el-button {
                .cb-iconfont {
                  font-size: 16px !important;
                }
              }
            }
            ::v-deep .icon-six {
              .el-button {
                .cb-iconfont {
                  font-size: 16px !important;
                }
              }
            }
          }
        }
      }
    }
    ::v-deep.empty-comp {
      .empty_page {
        .not-data {
          .cb-iconfont {
            font-size: 56px !important;
          }
          .text-data {
            font-size: 14px !important;
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
        .logo-wrap {
          width: 16px;
          height: 16px;
          margin-right: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
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
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.protocol-access-wrapper {
  color: var(--neutral8);
  margin-bottom: -16px;
  .protocol-item {
    margin: 4px 0 16px 0;
    line-height: 2;
  }
  .access-icon {
    margin-right: 3px;
    vertical-align: middle;

    &-undefined,
    &-null,
    &-false {
      animation: loading 0.55s steps(150) infinite;
      color: var(--primary-color) !important;
    }

    &-true {
      color: var(--green-color) !important;
    }
  }
  .circle-gray {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: var(--neutral3);
    vertical-align: middle;
  }
}
.no-data-txt {
  text-align: center;
  font-size: 12px;
}
</style>
