<template>
  <cb-search-table
    :cols="cols"
    url="/devops/cluster/monitor/hypervisor/page/"
    row-key="resource_id"
    baseURL="/api/mp"
    :background="true"
    :searchBarBg="false"
  >
    <template v-slot:cpu_percent="scope">
      <div>
        <span
          v-if="scope.data.cpu_percent || scope.data.cpu_percent === 0"
          :class="getStyle(scope.data.cpu_percent)"
          >{{ scope.data.cpu_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
    <template v-slot:ram_percent="scope">
      <div>
        <span
          v-if="scope.data.ram_percent || scope.data.ram_percent === 0"
          :class="getStyle(scope.data.ram_percent)"
          >{{ scope.data.ram_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
    <template v-slot:disk_percent="scope">
      <div>
        <span
          v-if="scope.data.disk_percent || scope.data.disk_percent === 0"
          :class="getStyle(scope.data.disk_percent)"
          >{{ scope.data.disk_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
    <template v-slot:status="scope">
      <div
        :class="
          scope.data.service_status === true
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <div>
        <span v-if="scope.data.service_status === true">{{
          $t('systemOperation.cloudPlatform.enabled')
        }}</span>
        <span v-else>{{ $t('systemOperation.cloudPlatform.disabled') }}</span>
      </div>
    </template>
    <template v-slot:state="scope">
      <div
        :class="
          scope.data.state === 'up'
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <div>
        <span v-if="scope.data.state === 'up'">{{
          $t('systemOperation.cloudPlatform.enabled')
        }}</span>
        <span v-else>{{ $t('systemOperation.cloudPlatform.disabled') }}</span>
      </div>
    </template>
    <template v-slot:operate="scope">
      <cb-button-group>
        <cb-button
          v-if="computeNodeExist && scope.data.name.slice(0, 7) === 'control'"
          @click="warn"
          type="text"
          >{{ $t('systemOperation.cloudPlatform.shutdown') }}</cb-button
        >
        <cb-button
          v-else
          :warnMsg="warnShutMsg"
          :completeMsg="completeShutMsg"
          @click="shutdownAndRestart(scope.data, $event, 'poweroff')"
          type="text"
          >{{ $t('systemOperation.cloudPlatform.shutdown') }}</cb-button
        >
        <cb-button
          :warnMsg="warnReMsg"
          :completeMsg="completeReMsg"
          @click="shutdownAndRestart(scope.data, $event, 'reboot')"
          type="text"
          >{{ $t('systemOperation.cloudPlatform.reStart') }}</cb-button
        >
      </cb-button-group>
    </template>
  </cb-search-table>
</template>

<script>
import _ from 'lodash';
import { poweroff, getNodeList } from '@/api/system-op';
import { getLanguage } from '@cyber/helper';
export default {
  data() {
    return {
      language: getLanguage(),
      cols: [],
      computeNodeExist: false,
    };
  },
  computed: {
    warnShutMsg() {
      return this.$t('systemOperation.cloudPlatform.comfirmShutDown');
    },
    completeShutMsg() {
      return this.$t('systemOperation.cloudPlatform.successShutDown');
    },
    warnReMsg() {
      return this.$t('systemOperation.cloudPlatform.confirmReStart');
    },
    completeReMsg() {
      return this.$t('systemOperation.cloudPlatform.successRestart');
    },
  },
  created() {
    this.isComputedNodeExisted();
    this.cols = [
      {
        label: this.$t('systemOperation.cloudPlatform.node'),
        prop: 'name',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.nodeIP'),
        prop: 'ip',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.virtualCpu'),
        slot: 'cpu_percent',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.virtualRam'),
        slot: 'ram_percent',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.virtualDisk'),
        slot: 'disk_percent',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.dynamipsCount'),
        prop: 'total_dynamips',
        width: this.language === 'zh-CN' ? '120px' : '100px',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.virmCount'),
        prop: 'total_instances',
        getData(row) {
          if (row.status == 'enabled') {
            return row.total_instances;
          } else {
            return '-';
          }
        },
      },
      {
        label: this.$t('systemOperation.cloudPlatform.containerCount'),
        prop: 'total_containers',
        getData(row) {
          if (row.status == 'enabled') {
            return row.total_containers;
          } else {
            return '-';
          }
        },
      },
      {
        label: this.$t('systemOperation.cloudPlatform.weight'),
        prop: 'weight',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.serverStatus'),
        slot: 'status',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.nodeStatus'),
        slot: 'state',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.operate'),
        slot: 'operate',
        width: this.language === 'zh-CN' ? '160px' : '200px',
      },
    ];
  },
  methods: {
    getStyle(data) {
      if (data > 90) {
        return 'high';
      } else {
        return '';
      }
    },
    // 关机&&重启
    shutdownAndRestart(data, done, type) {
      const object = {
        action: type,
        hostname: data.name,
      };
      poweroff(object)
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(false);
        });
    },
    warn() {
      this.$message.warning({
        message: this.$t('systemOperation.cloudPlatform.shutDownComputeNode'),
      });
    },
    //判断是否存在未关机的计算节点
    isComputedNodeExisted() {
      getNodeList().then((res) => {
        const list = _.get(res, 'data.data.list', []);
        list.forEach((item) => {
          if (item.name.slice(0, 7) !== 'control' && item.state === 'up') {
            this.computeNodeExist = true;
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.circle {
  float: left;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 5px;
}
.color-disable {
  background-color: var(--red-color);
}
.color-running {
  background-color: var(--green-color);
}
.high {
  color: var(--red-color);
}
</style>
