<template>
  <cb-search-table
    :cols.sync="columns"
    :data="queryData"
    :background="true"
    url="/devops/cluster/container/page/"
    baseURL="/api/mp"
    :searchBarBg="false"
  >
    <template v-slot:addressList="scope">
      <template v-if="scope.data.address_list">
        <div v-for="(item, index) in scope.data.address_list" :key="index">
          {{ item }}
        </div>
      </template>
    </template>
    <template v-slot:search>
      <cb-search-input
        v-model="inputValue"
        :placeholder="
          $t('systemOperation.views.clusterManagement.container.pleaseInputIp')
        "
        @change="validateIP(inputValue)"
        trigger="input"
      />
    </template>
    <template v-slot:sceneState="scope">
      <cb-tooltip
        v-if="
          scope.data.scene_status_desc === $t('systemOperation.scene.deleted')
        "
        effect="dark"
        :content="getError(scope.data)"
        placement="top"
        popper-class="instance-tooltip"
      >
        <span>{{ scope.data.scene_status_desc }}</span>
      </cb-tooltip>
      <span v-else>
        {{ scope.data.scene_status_desc || '-' }}
      </span>
    </template>
    <template v-slot:state="scope">
      <div
        :class="
          scope.data.status === 'Running'
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <span v-if="scope.data.status === 'Running'">{{
        $t('systemOperation.views.clusterManagement.container.running')
      }}</span>
      <span v-else>{{
        $t('systemOperation.views.clusterManagement.container.stopped')
      }}</span>
    </template>
  </cb-search-table>
</template>

<script>
import { getContainer, getSceneType } from '@/api/system-op.ts';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
  name: 'ContainerTab',
  data() {
    return {
      queryData: {
        addr: '',
      },
      inputValue: '',
      lastInputValue: '',
      columns: [],
      sceneType: {},
    };
  },
  created() {
    const that = this;

    that.columns = [
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.name',
        ),
        prop: 'name',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.addresses',
        ),
        prop: 'address_list',
        slot: 'addressList',
        // getData: (row) => {
        //   if (row.address_list) {
        //     return row.address_list;
        //   } else {
        //     return '';
        //   }
        // },
      },
      {
        label: this.$t('systemOperation.common.nodeStatus'),
        slot: 'state',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.image',
        ),
        prop: 'image',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('systemOperation.common.sceneType'),
        getData: (row) => {
          if (that.sceneType[row.reference_type]) {
            return that.sceneType[row.reference_type];
          }
          return that.$t('systemOperation.scene.other');
        },
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.scene_name',
        ),
        prop: 'scene_name',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.sceneStatus',
        ),
        slot: 'sceneState',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.node',
        ),
        prop: 'node',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.vlan',
        ),
        prop: 'vlan_id_list',
        getData: (row) => {
          if (row.vlan_id_list?.length > 0) {
            return row.vlan_id_list;
          } else {
            return '-';
          }
        },
      },

      {
        label: this.$t(
          'systemOperation.views.clusterManagement.container.runTime',
        ),
        getData: (row) => {
          return this.getFormatTime(row.running_time);
        },
        width: 180,
      },
    ];
  },
  mounted() {
    this.getSceneTypes();
  },
  watch: {
    inputValue: function (value) {
      this.lastInputValue = value;
    },
  },
  methods: {
    //获取全部类型，reference_type及对应的类型名称
    getSceneTypes() {
      getSceneType().then((res) => {
        const typeList = _.get(res, 'data.data', []);
        typeList.forEach((item) => {
          this.sceneType[item.code] = item.name;
        });
      });
    },
    getError(row) {
      return row.process_message;
    },
    getFormatTime(val) {
      const formatDate = dayjs.duration(val, 's');
      const days = parseInt(dayjs.duration(val, 's').asDays());
      const hours = formatDate.$d.hours;
      const minutes = formatDate.$d.minutes;
      const seconds = formatDate.$d.seconds;
      const getDay =
        days > 0
          ? `${days}${this.$t(
              'systemOperation.views.clusterManagement.container.day',
            )}`
          : '';
      const getHour =
        hours > 0
          ? `${hours}${this.$t(
              'systemOperation.views.clusterManagement.container.hour',
            )}`
          : '';
      const getMinute =
        minutes > 0
          ? `${minutes}${this.$t(
              'systemOperation.views.clusterManagement.container.min',
            )}`
          : '';
      const getSecond =
        seconds > 0
          ? `${seconds}${this.$t(
              'systemOperation.views.clusterManagement.container.second',
            )}`
          : '';
      const timeFormat = `${getDay}${getHour}${getMinute}${getSecond}`;
      return timeFormat;
    },
    //对输入的IP地址进行校验
    validateIP(inputValue) {
      const regexp =
        /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
      let isCorrect = true;
      let enterPressed = false;
      if (inputValue && regexp.test(inputValue) == false) {
        isCorrect = false;
      }
      if (inputValue.length === this.lastInputValue.length) {
        enterPressed = true;
      }
      if (!inputValue && enterPressed) {
        if (this.queryData.addr != '') {
          this.queryData.addr = this.inputValue;
        } else {
          this.$message.warning({
            message: this.$t(
              'systemOperation.views.clusterManagement.vm.emptyInput',
            ),
          });
        }
      } else if (!isCorrect && enterPressed) {
        this.$message.warning({
          message: this.$t(
            'systemOperation.views.clusterManagement.container.formatError',
          ),
        });
      } else if (isCorrect && enterPressed) {
        this.queryData.addr = this.inputValue;
      }
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
</style>
