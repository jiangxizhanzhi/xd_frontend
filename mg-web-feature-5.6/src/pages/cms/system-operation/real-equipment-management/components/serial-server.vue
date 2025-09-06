<template>
  <div class="serial-server" v-loading="loading">
    <wing-title
      :title="
        $t('systemOperation.realEquipmentManagement.serialServer') +
        `${serverValue ? serverValue : ''}` +
        $t('systemOperation.realEquipmentManagement.detail')
      "
    />
    <div class="serial-server-options mt20">
      <cb-select
        :options="optionsList"
        v-model="serverValue"
        class="select-list"
        @change="handleChange"
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
      </ul>
    </div>
    <div class="serial-server-map mt20" ref="painter">
      <TopologyPainter
        :model="compileData"
        :options="options"
        :on-node-click="onNodeClick"
      />
    </div>
  </div>
</template>

<script>
import WingTitle from '@/components/wing-title';
import TopologyPainter from './TopologyPainter.vue';
import { serIalPortList, realEquipment } from '@/api/system-op.ts';
import _ from 'lodash';
export default {
  components: {
    WingTitle,
    TopologyPainter,
  },
  data() {
    return {
      options: {
        height: '600px',
        portId: 'name',
        device: 'device_name',
        deviceId: 'device_uuid',
        logo: 'logo',
        status: 'status',
      },
      resData: [],
      compileData: {
        nodeList: [],
        portData: [],
      },
      loading: false,
      serverValue: '',
      optionsList: [],
      movePanel: null,
    };
  },
  mounted() {
    this.getSerIalPortList();
  },
  methods: {
    onNodeClick(node, { top, left }) {
      if (/target/.test(node.id)) return;
      let info = {
        name: this.$t('systemOperation.realEquipmentManagement.portNumber'),
        type: this.$t('systemOperation.realEquipmentManagement.portType'),
        status: this.$t('systemOperation.realEquipmentManagement.portState'),
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
        (el) => el.interface_id === node.id,
      );
      let data = this.compileData.nodeList[index];
      if (!this.movePanel) {
        this.movePanel = document.createElement('div');
        this.movePanel.className = 'device-info-panel';
      }
      this.movePanel.innerHTML = '';

      Object.keys(info).forEach((key) => {
        let box = document.createElement('div');
        box.className = 'device-item';
        let name = document.createElement('span');
        name.innerHTML = info[key] + ': ';
        let content = document.createElement('span');
        let u = unit[key] || '';
        content.innerHTML = map[key]
          ? map[key][data[key]] || '' + u
          : (data[key] && data[key] + u) || '';
        //类型固定显示为'串口'
        if (key == 'type') {
          content.innerHTML = this.$t(
            'systemOperation.realEquipmentManagement.serial',
          );
        }
        box.appendChild(name);
        box.appendChild(content);
        this.movePanel.appendChild(box);
      });

      this.movePanel.style.position = 'fixed';
      this.movePanel.style.minWidth = '200px';
      this.movePanel.style.background = this.$themed('--bg-color-2');
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
    // 获取串口数据
    getSerIalPortList() {
      this.loading = true;
      serIalPortList().then((res) => {
        const data = _.get(res, 'data.data', []);
        this.resData = data;

        this.optionsList = data.map((item) => ({
          value: item.ccm_server_id,
          label: item.ccm_server_name,
        }));
        this.serverValue = this.optionsList[0]?.value;
        this.filterData(this.serverValue);
        if (this.serverValue) {
          this.getRealEquipment();
        }
        this.loading = false;
      });
    },
    filterData(value) {
      const data = this.resData.filter((item) => (item.ccm_server_id = value));
      this.compileData.nodeList = data[0].children.map((item) => {
        return {
          ...item,
          name: item.interface_id,
          status: 'up',
        };
      });
    },
    handleChange(value) {
      this.filterData(value);
    },
    getRealEquipment() {
      const data = {
        serialPort: this.serverValue,
      };
      realEquipment(data).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.compileData.portData = data;
      });
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
    min-height: 600px;
    border: 1px solid var(--neutral1);
  }
}
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
