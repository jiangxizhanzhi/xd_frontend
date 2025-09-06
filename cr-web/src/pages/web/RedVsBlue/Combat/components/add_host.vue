<template>
  <div class="addHost">
    <div class="squash">
      <!-- <title-name :name="$t('m.machine')" /> -->
      <div class="title-user">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.machine')"
        />
      </div>
      <div v-loading="hosts_status" class="hosts">
        <div v-for="(item, index) in hosts" :key="index" class="host-lists fl">
          <div v-if="item.host_data !== ''" class="target_info">
            <div class="fl left-img">
              <img :src="item.host_data.icon2" alt />
            </div>

            <div class="inLine fr">
              <span :title="item.host_data.name" class="host-name">{{
                item.host_data.name
              }}</span>
              <div>
                <span v-if="item.host_data.ports.length > 0" class="font-title"
                  >ip:{{ item.host_data.ports[0].ip }}</span
                >
              </div>
              <div :title="item.host_data.image">
                <span class="font-title">os:{{ item.host_data.image }}</span>
              </div>

              <span class="deleHost el-icon-close" @click="deleHost(index)" />
              <cb-button
                class="elc-dialog-btn-cancel"
                @click="accessHost(item.host_data)"
              >
                {{ $t('m.host') }}
              </cb-button>
            </div>
          </div>

          <div v-else class="add-host">
            <cb-iconfont
              :size="'98'"
              class="dis-computer opacity-icon"
              type="icon-diannao2"
            >
            </cb-iconfont>
            <cb-iconfont
              v-if="runningStatus === 2 || runningStatus === 3"
              class="btn-icon sky-bule-icon"
              :size="'68'"
              type="icon-zengjia"
              @click.native="showDialog(index)"
            ></cb-iconfont>
            <cb-iconfont
              v-else
              class="btn-icon sky-bule-icon"
              :size="'68'"
              type="icon-jian"
              @click.native="showDialog(index)"
            ></cb-iconfont>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import DEFAULT_IMAGES from '@cyber/scene-icons';

export default {
  components: {
    // TitleName,
    TitleDirector,
  },
  props: {
    topologyData: {
      type: Object,
      default: () => {},
    },
    sceneId: {
      type: [Number, String],
      default: 0,
    },
    id: {
      type: [Number, String],
      default: 0,
    },
    clickIndex: {
      type: [Number, String],
      default: null,
    },
    getMachineInfo: {
      type: Object,
      default: () => {},
      deep: true,
    },
    runningStatus: {
      // 判断是否可以添加主机, 处于[2, 3]时可以添加主机，其他状态码不允许添加主机
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      DEFAULT_IMAGES,
      isDisable: false,
      machine: this.$t('m.machine'),
      hosts_status: false,
      hosts: [
        // 已添加主机
        {
          host_data: '',
        },
        {
          host_data: '',
        },
        {
          host_data: '',
        },
        {
          host_data: '',
        },
      ],
      machinelists: [],
      crSceneInstanceId: null,
      crEventScene: null,
      watchCount: 0,
      // showAddHost: true,
      occupy_host: null,
    };
  },
  computed: {
    user_hash() {
      return this.$store.state.user.id;
    },
    getUserStandarDdeviceMapping() {
      return _.keyBy(this.occupy_host, 'device_id');
    },
  },
  watch: {
    topologyData: {
      handler(val, oldval) {
        if (val !== undefined && Object.keys(val).length !== 0) {
          if (this.watchCount === 0) {
            this.initData();
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    accessHost(data) {
      const access_mode = data.access_modes[0];
      const { id, protocol, access_ip, access_port } = access_mode;
      // 这两个协议 前端拼接
      if (protocol === 'http' || protocol === 'https') {
        const connection_url = `${protocol}://${access_ip}:${access_port}`;
        window.open(connection_url, connection_url);
      } else {
        const params = {
          access_mode_id: id,
          context: {
            access_user_id: this.$store.state.user.id,
          },
          id: this.sceneId,
          node_id: data.id,
        };
        this.$request
          .post('/cscene/cscene_instances/get_connection', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            const url = this.$router.resolve({
              name: 'scene-screen-recording',
              query: {
                connection_url: _.get(res, 'data.data.connection_url'),
                node_id: data.id,
                connection_id: _.get(res, 'data.data.connection_id'),
                scene_id: this.sceneId,
                user_id: this.$store.state.user.id,
              },
            });
            window.open(url.href, '_blank');
          });
      }
    },
    computedIcon(icon) {
      const image = DEFAULT_IMAGES[icon] ? DEFAULT_IMAGES[icon] : 'icon2';
      return image;
    },
    initData(index) {
      // 获取靶机数据
      this.watchCount += 1;
      const nodes =
        this.topologyData &&
        this.topologyData.scene_config.topology &&
        this.topologyData.scene_config.topology.elements;
      const elements =
        this.topologyData.scene_config &&
        this.topologyData.scene_config.plugins &&
        this.topologyData.scene_config.plugins.cpcloud &&
        this.topologyData.scene_config.plugins.cpcloud.elements;

      const elementsPorts =
        this.topologyData.scene_config &&
        this.topologyData.scene_config.plugins &&
        this.topologyData.scene_config.plugins.cpcloud &&
        this.topologyData.scene_config.plugins.cpcloud.element_ports;

      for (let index = 0; index < nodes.length; index++) {
        for (const key in elements) {
          const keyID = nodes[index].id;
          if (keyID === key) {
            const data = elements[key];
            nodes[index].image = data.image;
            nodes[index].image_type = data.image_type;
            nodes[index].role = data.role;
            nodes[index].access_modes = this.getAccessModes(
              nodes[index].ports,
              elementsPorts,
            );
          }
        }
      }

      const server_nodes = nodes.filter((item) => {
        return item.role === 4 && item.image_type === 'vm';
      });
      // 判断是否启动成功的scene信息，只有启动成功的时候学员才可以添加靶机
      const sceneIsSuccessInfo =
        this.topologyData &&
        this.topologyData.scene_config.topology &&
        this.topologyData.scene_config.topology.scene;
      // 弹框机器列表，所有有guac链接的机器
      this.machinelists = [];
      this.getUserdata((res) => {
        if (
          sceneIsSuccessInfo &&
          (sceneIsSuccessInfo.event === 2 ||
            sceneIsSuccessInfo.event === 7 ||
            sceneIsSuccessInfo.event === 13) &&
          sceneIsSuccessInfo.event_status === 4
        ) {
          if (server_nodes.length > 0) {
            server_nodes.forEach((val) => {
              if (val.access_modes && val.access_modes.length) {
                // 暂时取第一个访问模式
                const access_mode = val.access_modes[0];
                this.getConnectionInfo(val, access_mode);
                if (val.connection_info) {
                  // 靶机添人物信息
                  const user_info = _.get(
                    this.getUserStandarDdeviceMapping,
                    `${val.id}`,
                    null,
                  );
                  if (user_info) {
                    val.user_info = user_info.create_user;
                  }
                  this.machinelists.push(val);
                }
              }
            });
          }
        }
        if (this.watchCount === 1) {
          this.getCurrentUserUsedMachine();
        }
        if (this.watchCount > 1 && this.machinelists.length === 0) {
          this.$message.error(this.$t('m.noHasAircraft'));
          return false;
        }
        if (this.watchCount > 1) {
          this.$emit('showDialog', {
            index: index,
            machinelists: this.machinelists,
          });
          this.machinelists = [];
        }
      });
    },
    /**
     * 获取链接信息
     */
    getAccessModes(ports, pluginsPorts) {
      let accessModes = [];
      ports?.forEach((port, index) => {
        if (index === 0) {
          accessModes = _.cloneDeep(pluginsPorts[port.id].access_modes);
        }
      });
      return accessModes;
    },
    getConnectionInfo(val, access_mode) {
      val.connection_info = null;
      const { id, protocol, access_ip, access_port } = access_mode;
      // 这两个协议 前端拼接
      if (protocol === 'http' || protocol === 'https') {
        const connection_url = `${protocol}://${access_ip}:${access_port}`;
        val.connection_info = connection_url;
        return val;
      } else {
        const params = {
          access_mode_id: id,
          context: {
            access_user_id: this.$store.state.user.id,
          },
          id: this.sceneId,
          node_id: val.id,
        };
        val.connection_info = 'connection_url';
      }
    },
    getUserdata(callback) {
      // 获取设备占用情况
      this.$request
        .get(
          'cr/red_vs_blue/red_vs_blue/device',
          { room_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.occupy_host = res.data.data;
          if (callback) {
            callback();
          }
        });
    },
    getCurrentUserUsedMachine() {
      this.hosts_status = true;
      let hosts_index = 0;
      const current_user_hosts = _.filter(this.occupy_host, (o) => {
        // return o.create_user.resource_id === this.user_hash;
        return o.create_user_id === this.user_hash;
      });

      const current_user_hosts_by_key = _.keyBy(
        current_user_hosts,
        'device_id',
      );

      _.forEach(this.machinelists, (value, index) => {
        if (hosts_index < 4 && value.id in current_user_hosts_by_key) {
          this.hosts[hosts_index].host_data = value;
          this.hosts[hosts_index].host_data.used_id = this.user_hash;
          hosts_index += 1;
        }
      });
      this.hosts_status = false;
    },
    // addMachine() {
    //   const data = {
    //     standard_device: this.getMachineInfo.id,
    //     red_vs_blue: this.id,
    //   };
    //   if (this.checkHasAddMachine(data.standard_device)) {
    //     this.$message.error(
    //       this.$t('m.hasTarget') +
    //         this.$t('m.hasBeen') +
    //         this.getMachineInfo.user_info.rep_name +
    //         ' ' +
    //         this.$t('m.Occupy'),
    //     );
    //     return false;
    //   }
    addMachine() {
      const data = {
        device_id: this.getMachineInfo.id,
        room_id: this.id,
      };

      if (this.checkHasAddMachine(data.device_id)) {
        this.$message.error(
          this.$t('m.hasTarget') +
            this.$t('m.hasBeen') +
            // this.getMachineInfo.user_info.rep_name +
            this.getMachineInfo.user_info +
            ' ' +
            this.$t('m.Occupy'),
        );
        return false;
      }
      //新增占用主机
      this.$request
        .post('/cr/red_vs_blue/user/device', data, { baseURL: '/api/ojj' })
        .then((res) => {
          this.hosts[this.clickIndex].host_data = this.getMachineInfo;
          this.hosts[this.clickIndex].host_data.used_id = res.data.id;
          this.$message({
            message: this.$t('m.successful'),
            type: 'success',
          });
          this.closeDialog();
        });
    },
    //删除主机
    deleHost(index) {
      const host_data_info = this.hosts[index].host_data;
      this.$request
        .delete(
          '/cr/red_vs_blue/user/device',
          { device_id: host_data_info.id, room_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.hosts[index].host_data = '';
          this.$message({
            message: this.$t('m.successful'),
            type: 'success',
          });
        });
    },
    checkHasAddMachine(device_id) {
      let flag = false;
      _.forEach(this.hosts, (value) => {
        if (value.host_data && _.get(value.host_data, 'id') === device_id) {
          flag = true;
        }
      });
      return flag;
    },
    simpleMessage(message, messagetype) {
      this.$message({
        message: message,
        type: messagetype,
      });
    },
    showDialog(index) {
      const allowAddHostMap = [2, 3];
      if (allowAddHostMap.some((it) => it === this.runningStatus)) {
        this.initData(index);
      } else {
        this.$message.error(this.$t('m.addHostMessage'));
      }
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>

<style lang="scss">
.addHost {
  width: 100%;
  height: 100%;
  margin-left: 15px;
  .squash {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .title-user {
      margin: 10px 0;
    }
    .scene-edit-example {
      height: 600px;
    }
    .hosts {
      height: 100%;
      width: 100%;
      .host-lists {
        width: 82%;
        height: 21%;
        background: var(--bg-color-2);
        border-radius: 2px;
        margin: 0 0 18px 26px;
        text-align: center;
        line-height: 20%;
        position: relative;
        .add-host {
          display: inline-block;

          .btn-icon {
            cursor: pointer;
            z-index: 90;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .dis-computer {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            opacity: 0.1;
          }
        }
        // .add-host::after {
        //     content: "&#xe69b";
        //     width: 98px;
        //     height: 68px;
        //     position: absolute;
        //     top: 50%;
        //     left: 50%;
        //     transform: translate(-50%, -50%);
        //     z-index: 10;
        //   }
      }
      // .host-lists {

      // }
      .target_info {
        width: 100%;
        height: 100%;
        .left-img {
          width: 40%;
          height: 100%;
          position: relative;
          img {
            width: 100px;
            height: 100px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .inLine {
          position: relative;
          width: 60%;
          height: 100%;
          text-align: left;
          padding-top: 20px;
          box-sizing: border-box;
          padding-right: 18px;
          .host-name {
            color: var(--neutral8);
          }
          .deleHost {
            cursor: pointer;
            color: #f44c4c;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 5px;
            right: 0px;
          }
          .elc-dialog-btn-cancel {
            width: 60%;
            margin-top: 5px;
          }
          .el-icon-close::before {
            font-size: 14px;
            // color: #0BDAFF;
            // color: turquoise;
            // background: linear-gradient(
            //   180deg,
            //   rgba(57, 239, 255, 1),
            //   rgba(58, 165, 255, 1)
            // );
          }
          h4 {
            color: #145e9d;
            font-size: 16px;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            /*padding-left: 10%;*/
          }
          span {
            display: inline-block;
            width: 100%;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #fff;
            line-height: 24px;
            vertical-align: bottom;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .font-title {
            color: rgba(192, 204, 231, 1);
          }
          a {
            height: 40px;
            .btn_into {
              cursor: pointer;
              position: absolute;
              bottom: 20px;
              right: 30%;
              width: 96px;
              height: 24px;
              background: rgba(132, 144, 159, 0);
              border: 1px solid #3fe4ee;
              box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
              border-radius: 12px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(0, 150, 255, 1);
              line-height: 22px;
              background: linear-gradient(
                180deg,
                rgba(57, 239, 255, 1) 0%,
                rgba(58, 165, 255, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
        .btn_into:hover {
          background-color: #66b1ff;
        }
        // @media screen and (max-width: 1680px) {
        //   img {
        //     width: 90px !important;
        //     height: 90px !important;
        //     left: 9% !important;
        //   }
        // }
        // @media screen and (max-width: 1440px) {
        //   img {
        //     width: 80px !important;
        //     height: 80px !important;
        //     left: 3% !important;
        //   }
        //   .inLine {
        //     width: 65% !important;
        //     div {
        //       padding-left: 5% !important;
        //       margin-bottom: 5px !important;
        //     }
        //   }
        // }
        // @media screen and (max-width: 1366px) {
        //   img {
        //     width: 70px !important;
        //     height: 70px !important;
        //     left: 3% !important;
        //   }
        //   .target_info {
        //     margin-top: 0 !important;
        //   }
        //   .inLine {
        //     width: 65% !important;
        //     div {
        //       padding-left: 3% !important;
        //       margin-bottom: 2px !important;
        //     }
        //   }
        //   a {
        //     height: 24px !important;

        //     .btn_into {
        //       margin-top: 10px !important;
        //       height: 30px !important;
        //       line-height: 30px !important;
        //     }
        //   }
        // }
      }
    }
  }
}
</style>
