<template>
  <cb-search-table
    :cols.sync="columns"
    :data="queryData"
    :background="true"
    url="/devops/cluster/instance/page/"
    baseURL="/api/mp"
    :searchBarBg="false"
  >
    <template v-slot:addressList="scope">
      <template v-if="scope.data.address_list.length > 0">
        <div v-for="(item, index) in scope.data.address_list" :key="index">
          {{ item }}
        </div>
      </template>
      <span v-else>-</span>
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
          scope.data.status === 'ACTIVE'
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <span v-if="scope.data.status === 'ACTIVE'">{{
        $t('systemOperation.views.clusterManagement.vm.active')
      }}</span>
      <span v-else>{{
        $t('systemOperation.views.clusterManagement.vm.shutoff')
      }}</span>
    </template>
  </cb-search-table>
</template>
<script>
import Utils from '@/utils/utils';
import { getVm, getSceneType } from '@/api/system-op.ts';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
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
        label: this.$t('systemOperation.views.clusterManagement.vm.serverName'),
        prop: 'name',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('systemOperation.views.clusterManagement.vm.serverIp'),
        prop: 'address_list',
        width: 140,
        resizable: true,
        slot: 'addressList',
      },
      {
        label: this.$t('systemOperation.common.nodeStatus'),
        slot: 'state',
      },
      {
        label: this.$t('systemOperation.common.sceneType'),
        getData(row) {
          if (that.sceneType[row.reference_type]) {
            return that.sceneType[row.reference_type];
          }
          return that.$t('systemOperation.scene.other');
        },
      },
      {
        label: this.$t('systemOperation.views.clusterManagement.vm.scene_name'),
        prop: 'scene_name',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.vm.sceneStatus',
        ),
        slot: 'sceneState',
      },
      {
        label: this.$t('systemOperation.views.clusterManagement.vm.node'),
        prop: 'node',
      },

      {
        label: this.$t('systemOperation.views.clusterManagement.vm.creator'),
        prop: 'user_realname',
      },
      {
        label: this.$t('systemOperation.common.Created'),
        getData(row) {
          return Utils.formatDate(row.create_time);
        },
        width: 180,
      },
      {
        label: this.$t('systemOperation.views.clusterManagement.vm.runTime'),
        getData(row) {
          return that.getFormatTime(row.running_time);
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
    fetchPromise(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getVm(queryData).then((resp) => {
          resolve(resp);
        });
      });
    },
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
              'systemOperation.views.clusterManagement.vm.day',
            )}`
          : '';
      const getHour =
        hours > 0
          ? `${hours}${this.$t(
              'systemOperation.views.clusterManagement.vm.hour',
            )}`
          : '';
      const getMinute =
        minutes > 0
          ? `${minutes}${this.$t(
              'systemOperation.views.clusterManagement.vm.min',
            )}`
          : '';
      const getSecond =
        seconds > 0
          ? `${seconds}${this.$t(
              'systemOperation.views.clusterManagement.vm.second',
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
            'systemOperation.views.clusterManagement.vm.formatError',
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
