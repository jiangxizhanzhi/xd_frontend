<template>
  <cb-inner-page :background="true" title="全生命周期管理">
    <cb-search-table
      ref="monitorListRef"
      :cols="cols"
      :data.sync="query"
      :selector="selector"
      :selection.sync="selection"
      url="/cscene/cscene_instances/list_stat"
      baseURL="/api/mp"
      :searchBarBg="true"
      @reset="handleReset"
      :show-search-btn="true"
    >
      <template v-slot:filter>
        <cb-select
          v-model="query.reference_types"
          clearable
          :first="{
            code: '',
            name: $t('systemOperation.scene.allType'),
          }"
          :options="sceneTypes"
          titleField="name"
          valueField="code"
          mr
        />
        <cb-select
          v-model="query.scene_status"
          clearable
          :first="{
            code: '',
            name: $t('systemOperation.scene.allState'),
          }"
          :options="sceneStatus"
          titleField="name"
          valueField="code"
          @change="changeStatus"
          mr
        />
        <cb-radio-group
          v-model="activity"
          class="cb-checkbox-boxs"
          @change="changeActivity"
          style="margin-right: 20px"
        >
          <cb-radio label="active" style="margin-right: 16px">{{
            $t('systemOperation.scene.activeScene')
          }}</cb-radio>
          <cb-radio label="over">{{
            $t('systemOperation.scene.endScene')
          }}</cb-radio>
        </cb-radio-group>
        <cb-switch v-model="query.error" @change="changeAbnormal" />
        <span class="switch-label mr">{{
          $t('systemOperation.scene.showErrorScene')
        }}</span>
        <cb-search-input
          v-model="query.search"
          :placeholder="$t('systemOperation.scene.pleaseInputName')"
        />
      </template>
      <template v-slot:status="scope">
        <span>{{ scope.data.scene_status_desc || '-' }}</span>
        <cb-tooltip
          v-if="
            scope.data.scene_status_desc === $t('systemOperation.scene.error')
          "
          effect="dark"
          :content="getError(scope.data)"
          placement="top"
          popper-class="instance-tooltip"
        >
          <cb-iconfont type="icon-weixian" themedColor="--neutral8" />
        </cb-tooltip>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          type="text"
          :link-name="{
            name: 'life-cycle-detail',
            params: { id: scope.data.id },
          }"
        >查看</cb-button>
      </template>
      <template v-slot:help>
        <span>{{ $t('资源占用') }}</span>
        <cb-tooltip
          class="item"
          effect="dark"
          :content="$t('systemOperation.scene.cpuRamDiskHelp')"
          placement="top"
        >
          <span class="help"
            ><cb-iconfont type="icon-caozuoshuoming1"></cb-iconfont
          ></span>
        </cb-tooltip>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { getLanguage } from '@cyber/helper';
import { ScenePropsLists } from '../constant';
import {
  deleteSceneApi,
  clearSceneApi,
  deleteMultipleSceneApi,
  clearMultipleSceneApi,
  getSceneType,
  getSceneStatus,
} from '@/api/system-op.ts';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
export default {
  data() {
    return {
      language: getLanguage(),
      selector: {
        maxSelect: 0,
      },
      selection: [],
      activity: '',
      query: {
        reference_types: '',
        scene_status: '',
        search: '',

        active: false,
        over: false,
        error: false,
      },
      sceneTypes: [],
      sceneType: {},
      sceneStatus: [],
    };
  },
  computed: {
    cols() {
      const that = this;

      const colArr = [
        {
          label: that.$t('资源名称'),
          prop: 'name',
          width: '150px',
        },
        {
          label: that.$t('资源类型'),
          getData(row) {
            if (that.sceneType[row.reference_type]) {
              return that.sceneType[row.reference_type];
            }
            return that.$t('systemOperation.scene.other');
          },
        },
        // {
        //   label: that.$t('systemOperation.scene.nodeTotal'),
        //   width: '240px',
        //   getData(row) {
        //     const container_count = row.container_count || 0,
        //       entity_count = row.entity_count || 0,
        //       vm_count = row.vm_count || 0,
        //       dynamips_count = row.dynamips_count || 0;
        //     return (
        //       vm_count +
        //       ' ' +
        //       that.$t('systemOperation.scene.VM') +
        //       '/' +
        //       container_count +
        //       ' ' +
        //       that.$t('systemOperation.scene.CN') +
        //       '/' +
        //       entity_count +
        //       ' ' +
        //       that.$t('systemOperation.scene.PD') +
        //       '/' +
        //       dynamips_count +
        //       ' Dynamips'
        //     );
        //   },
        // },
        {
          label: that.$t('资源占用'),
          width: '160px',
          getData(row) {
            const cpu = row.cpu || 0,
              ram = row.ram || 0,
              disk = row.disk || 0;
            return (
              cpu +
              that.$t('systemOperation.scene.C') +
              '/' +
              ram +
              'MB/' +
              disk +
              'G'
            );
          },
          titleSlot: 'help', // 自定义表头
        },
        {
          label: that.$t('systemOperation.scene.creator'),
          prop: 'create_name',
        },
        {
          label: that.$t('systemOperation.scene.createTime'),
          prop: 'create_time',
          // width: '250px',
        },
        // {
        //   label: that.$t('systemOperation.scene.sceneProps'),
        //   getData(row) {
        //     const filterData = _.filter(ScenePropsLists, (item) => {
        //       return item.value === row.scene_attr;
        //     });
        //     if (filterData.length > 0) {
        //       return filterData[0].label;
        //     }
        //     return row.scene_attr;
        //   },
        // },
        {
          label: that.$t('资源状态'),
          slot: 'status',
        },

        {
          // 运行时长
          label: that.$t('systemOperation.scene.runTime'),
          getData(row) {
            return that.getFormateTime(row.scene_run_time);
          },
        },
        {
          label: that.$t('systemOperation.scene.operate'),
          slot: 'operation',
          width: '120px',
        },
      ];
      // 显示启动时长
      if (typeof this.$route.query.sst != 'undefined') {
        let runTime = {
          // 启动时长
          label: that.$t('systemOperation.scene.openTime'),
          getData(row) {
            if (row.create_consume_seconds === 0) {
              return '0s';
            }
            return that.getFormateTime(row.create_consume_seconds);
          },
          width: '90px',
        };
        colArr.splice(8, 0, runTime);
      }
      return colArr;
    },
  },
  watch: {},
  mounted() {
    this.getSceneTypes();
    this.getSceneStatusList();
  },
  methods: {
    handleReset() {
      this.activity = ''
    },
    getSceneInfo(row) {
      return _.get(row, 'scene.scene', {});
    },
    getFormateTime(val) {
      const formateTime = dayjs.duration(val, 's');
      const asDays = parseInt(dayjs.duration(val, 's').asDays());
      const days = asDays;
      const hours = formateTime.$d.hours;
      const minutes = formateTime.$d.minutes;
      const seconds = formateTime.$d.seconds;
      const getDay =
        days > 0 ? `${days}${this.$t('systemOperation.scene.day')}` : '';
      const getHour =
        hours > 0 ? `${hours}${this.$t('systemOperation.scene.hour')}` : '';
      const getMin =
        minutes > 0 ? `${minutes}${this.$t('systemOperation.scene.min')}` : '';
      const getSec =
        seconds > 0
          ? `${seconds}${this.$t('systemOperation.scene.second')}`
          : '';
      const timeFormat = `${getDay}${getHour}${getMin}${getSec}`;
      return timeFormat;
    },
    //获取全部类型标签
    getSceneType(arr) {
      let labels = {};
      for (let i = 0; i < arr.length; i++) {
        labels[arr[i].code] = arr[i].name;
      }
      return labels;
    },
    // 获取全部类型
    getSceneTypes() {
      getSceneType().then((res) => {
        this.sceneTypes = _.get(res, 'data.data', []);
        this.sceneType = this.getSceneType(this.sceneTypes);
      });
    },
    //获取全部状态
    getSceneStatusList() {
      getSceneStatus().then((res) => {
        this.sceneStatus = _.get(res, 'data.data', []);
      });
    },
    changeActivity() {
      this.query.scene_status = '';
      if (this.activity === 'active') {
        this.query.active = true;
        this.query.over = false;
        this.query.error = false;
      } else if (this.activity === 'over') {
        this.query.active = false;
        this.query.over = true;
        this.query.error = false;
      } else {
        this.query.active = false;
        this.query.over = false;
      }
    },
    changeAbnormal() {
      this.activity = '';
      this.query.scene_status = '';
      this.query.active = false;
      this.query.over = false;
    },
    changeStatus() {
      this.activity = '';
      this.query.error = false;
      this.query.over = false;
      this.query.active = false;
    },
    getTime(time) {
      const getDay = time.date() > 0 ? `${time.date()}d` : '';
      const getHour = time.hour() > 0 ? `${time.hour()}h` : '';
      const getMin = time.minute() > 0 ? `${time.minute()}m` : '';
      const getSec = time.second() > 0 ? `${time.second()}s` : '';
      const timeFormat = `${getDay}${getHour}${getMin}${getSec}`;
      return timeFormat;
    },
    getError(row) {
      return row.event_message;
    },
    showMonitorDisplay(row) {
      const displayUrl = this.$router.resolve({
        name: 'mg-monitor-display',
        params: {
          id: row.id,
        },
      });
      window.open(displayUrl.href, '_blank');
    },
    // 场景运维
    sceneDetail(row) {
      this.$router.push(
        `/admin/system-operation/instance-monitoring/scene-detail/${row.resource_id}`,
      );
    },
    // 场景回顾
    sceneBack(row) {
      this.$router.push(
        `/admin/system-operation/instance-monitoring/scene-detail/${row.resource_id}`,
      );
    },
    // 删除场景
    deleteScene(row) {
      const that = this;
      that
        .$confirm(that.$t('systemOperation.scene.confirmDeleteScene'), '', {
          confirmButtonText: that.$t('systemOperation.scene.confirm'),
          cancelButtonText: that.$t('systemOperation.scene.cancel'),
          type: 'warning',
        })
        .then(() => {
          // 此处不能立即调用中台接口，延时2秒调用
          deleteSceneApi({ id: row.id }).then(() => {
            setTimeout(() => {
              that.$refs.monitorListRef.reload();
            }, 2000);
          });
        });
    },
    // 批量关闭场景
    multipleDelete(done) {
      const params = {
        ids: this.selection.map((el) => el.id),
      };
      deleteMultipleSceneApi(params)
        .then((res) => {
          this.selection = [];
          this.$refs.monitorListRef.reload();
          done();
        })
        .catch(() => {
          done(false);
        })
        .finally(() => {
          done(false);
        });
    },
    // 清除场景数据
    clearData(row) {
      const that = this;
      that
        .$confirm(that.$t('systemOperation.scene.confirmClearScene'), '', {
          confirmButtonText: that.$t('systemOperation.scene.confirm'),
          cancelButtonText: that.$t('systemOperation.scene.cancel'),
          type: 'warning',
        })
        .then(() => {
          clearSceneApi(row.id).then(() => {
            that.$refs.monitorListRef.reload();
          });
          //调用清除态势场景数据接口
          this.$request
            .delete(
              '/situation/scene_data',
              { scene_ids: [row.id] },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {});
        });
    },
    //批量清除场景数据
    multipleClear(done) {
      const params = {
        ids: this.selection.map((el) => el.id),
      };
      clearMultipleSceneApi(params)
        .then((res) => {
          this.selection = [];
          this.$refs.monitorListRef.reload();
          //调用清除态势场景数据接口
          this.$request
            .delete(
              '/situation/scene_data',
              { scene_ids: params.ids },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {});
          done();
        })
        .catch(() => {
          done(false);
        })
        .finally(() => {
          done(false);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.enButton {
  width: 70px;
}
.zhButton {
  width: 59px;
}
.cb-checkbox-boxs {
  display: flex;
  align-items: center;
}
</style>
<style lang="scss" scoped>
.switch-label {
  color: var(--neutral8);
  font-size: 14px;
}
.deleting {
  color: var(--red-color);
}
.help {
  cursor: pointer;
  vertical-align: middle;
  padding-left: 2px;
}
</style>
