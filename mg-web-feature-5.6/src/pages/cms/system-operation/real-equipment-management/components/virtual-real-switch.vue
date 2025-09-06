<template>
  <div class="serial-server" v-loading="loading">
    <wing-title
      :title="
        $t(
          'systemOperation.realEquipmentManagement.virtualRealCombinationSwitch',
        ) +
        `${currentDevice ? currentDevice : ''}` +
        $t('systemOperation.realEquipmentManagement.detail')
      "
    />
    <div class="serial-server-options mt20">
      <cb-select
        v-model="currentDevice"
        :options="optionsList"
        class="select-list"
      ></cb-select>
      <ul class="list">
        <li>
          <cb-iconfont
            type="icon-duankou-shixin"
            themedColor="green-color"
          ></cb-iconfont>
          <span>{{ $t('systemOperation.realEquipmentManagement.up') }}</span>
        </li>
        <li>
          <cb-iconfont type="icon-duankou" themedColor="neutral8"></cb-iconfont>
          <span>{{ $t('systemOperation.realEquipmentManagement.down') }}</span>
        </li>
        <li>
          <cb-iconfont
            type="icon-duankou-shixin"
            themedColor="neutral5"
          ></cb-iconfont>
          <span>{{
            $t('systemOperation.realEquipmentManagement.shutDown')
          }}</span>
        </li>
        <li>
          <cb-iconfont
            type="icon-duankou-shixin"
            themedColor="primary-color"
          ></cb-iconfont>
          <span>{{
            $t('systemOperation.realEquipmentManagement.reserved')
          }}</span>
        </li>
      </ul>
    </div>
    <div class="serial-server-map mt20" ref="painter">
      <TopologyPainter
        :on-node-click="onNodeClick"
        :model="compileData"
        :options="paintOptions"
      />
    </div>
  </div>
</template>

<script>
import WingTitle from '@/components/wing-title';
import TopologyPainter from './TopologyPainter.vue';
export default {
  components: {
    WingTitle,
    TopologyPainter,
  },
  data() {
    return {
      optionsList: [],
      nodeList: [],
      currentDevice: '',
      originData: [],
      compileData: {
        nodeList: [],
        portData: [],
      },
      paintOptions: {
        height: '600px',
        portId: 'name',
        device: 'device_name',
        deviceId: 'device_uuid',
        logo: 'logo',
        status: 'status',
      },
      loading: false,
      movePanel: null,
    };
  },
  mounted() {
    this.getSwitchList();
  },
  watch: {
    currentDevice(val) {
      this.nodeList = this.originData.filter(
        (el) => el.name === val,
      )?.[0]?.interface_details;
      this.getEquipment();
    },
  },
  methods: {
    getSwitchList() {
      this.loading = true;
      this.$request
        .get('/devops/cluster/types/switch-list', {}, { baseURL: '/api/mp' })
        .then((res) => {
          this.originData = _.get(res, 'data.data', []);
          this.optionsList = this.originData.map((el) => ({
            label: el.name,
            value: el.name,
          }));
          this.currentDevice = this.optionsList[0]?.value;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getEquipment() {
      if (this.currentDevice) {
        this.$request
          .get(
            '/devops/cluster/real-equipment/by-switch-name',
            { switchName: this.currentDevice },
            { baseURL: '/api/mp' },
          )
          .then((res) => {
            this.compileData.nodeList = this.nodeList.map((el) => {
              return {
                ...el,
                name: el.interface_name,
              };
            });
            const data = _.get(res, 'data.data', []);
            this.compileData.portData = data;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    onNodeClick(node, { top, left }) {
      let switchInfo = {
        switch_port: this.$t(
          'systemOperation.realEquipmentManagement.portNumber',
        ),
        mac: 'mac',
      };
      let switchMap = {
        // switch_port: 'GigabitEthernet0/0/2',
        // mac: 'ff334::341d1::45dc',
      };

      let info = {
        interface_name: this.$t(
          'systemOperation.realEquipmentManagement.portNumber',
        ),
        type: this.$t('systemOperation.realEquipmentManagement.portType'),
        speed: this.$t('systemOperation.realEquipmentManagement.portRate'),
        status: this.$t('systemOperation.realEquipmentManagement.portState'),
        negotiation: this.$t(
          'systemOperation.realEquipmentManagement.negotiationType',
        ),
        duplex: this.$t('systemOperation.realEquipmentManagement.duplexMode'),
      };
      let map = {
        duplex: {
          FULL: this.$t('systemOperation.realEquipmentManagement.fullDuplex'),
          HALFl: this.$t('systemOperation.realEquipmentManagement.halfDuplex'),
        },
        negotiation: {
          ENABLE: this.$t(
            'systemOperation.realEquipmentManagement.autoNegotiation',
          ),
          DISABLE: this.$t(
            'systemOperation.realEquipmentManagement.disableAutoNegotiation',
          ),
        },
        type: {
          Ethernet: this.$t('systemOperation.realEquipmentManagement.ether'),
        },
      };
      let unit = {
        speed: 'M',
      };
      let index = this.compileData.nodeList.findIndex(
        (el) => el.interface_name === node.id,
      );
      let data = this.compileData.nodeList[index];
      let switchIndex = this.compileData.portData.findIndex(
        (el) => el.device_uuid === node.id.slice(7),
      );
      let switchData = this.compileData.portData[switchIndex];

      if (!this.movePanel) {
        this.movePanel = document.createElement('div');
        this.movePanel.className = 'device-info-panel';
      }
      this.movePanel.innerHTML = '';

      if (/target/.test(node.id)) {
        Object.keys(switchInfo).forEach((key) => {
          let box = document.createElement('div');
          box.className = 'device-item';
          let name = document.createElement('span');
          name.innerHTML = switchInfo[key] + ': ';
          let content = document.createElement('span');
          content.innerHTML = switchMap[key] ? switchMap[key] : switchData[key];
          box.appendChild(name);
          box.appendChild(content);
          this.movePanel.appendChild(box);
        });
      } else {
        Object.keys(info).forEach((key) => {
          let box = document.createElement('div');
          box.className = 'device-item';
          let name = document.createElement('span');
          name.innerHTML = info[key] + ': ';
          let content = document.createElement('span');
          let u = unit[key] || '';
          content.innerHTML = map[key]
            ? map[key][data[key]] + u
            : data[key] + u;
          box.appendChild(name);
          box.appendChild(content);
          this.movePanel.appendChild(box);
        });
      }

      this.movePanel.style.position = 'fixed';
      this.movePanel.style.background = this.$themed('bg-color-2');
      this.movePanel.style.color = this.$themed('neutral8');
      this.movePanel.style.left = left + 'px';
      this.movePanel.style.top = top + 'px';
      document.body.appendChild(this.movePanel);
      const dialogElement =
        document.getElementsByClassName('device-info-panel');
      const dialogWidth = dialogElement[0].clientWidth;
      const outLeft = document.body.clientWidth - left;
      if (outLeft < dialogWidth) {
        dialogElement[0].style.left = left - dialogWidth + 'px';
      }

      let clickOutSide = (e) => {
        if (!this.movePanel) {
          document.removeEventListener('click', clickOutSide);
          return;
        }
        if (!this.$refs.painter) {
          this.movePanel && this.movePanel.remove();
          this.movePanel = null;
          document.removeEventListener('click', clickOutSide);
        } else if (
          e.target !== this.$refs.painter &&
          !this.$refs.painter.contains(e.target) &&
          !this.movePanel.contains(e.target) &&
          e.target !== this.movePanel
        ) {
          this.movePanel && this.movePanel.remove();
          this.movePanel = null;
          document.removeEventListener('click', clickOutSide);
        }
      };
      document.addEventListener('click', clickOutSide);
    },
  },
};
</script>

<style lang="scss" scoped>
.serial-server {
  &-options {
    display: flex;
    justify-content: space-between;
    .select-list {
      width: 30%;
    }
    .list {
      li {
        float: left;
        list-style: none;
        margin: 0 10px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  &-map {
    width: 100%;
    border: 1px solid var(--neutral1);
    .node-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .node {
        width: 60px;
        text-align: center;
        margin: 24px;
        div {
          color: var(--primary-color);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.serial-server {
  &-options {
    .list {
      li {
        span {
          color: var(--neutral8);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.device-info-panel {
  padding: 10px;
  font-size: 14px;
  div {
    display: flex;
    & > span:nth-child(1) {
      width: 70px;
    }
  }
}
</style>
