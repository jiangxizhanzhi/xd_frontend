<template>
  <cb-inner-page :background="false">
    <cb-tabs type="border-card" v-model="activeName">
      <cb-tab-pane
        :label="$t('systemOperation.realEquipmentManagement.realEquipment')"
        name="list"
      >
        <cb-search-table
          ref="monitorListRef"
          :cols="cols"
          :data="query"
          :url="sceneTypeOptions ? '/devops/cluster/real-equipment/page' : ''"
          baseURL="/api/mp"
          :background="true"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-cascader
              v-model="sceneTypeSet"
              :options="sceneTypeOptions"
              :props="optionProps"
              @change="handleChange"
              :placeholder="
                $t('systemOperation.realEquipmentManagement.plzChangeCategory')
              "
              clearable
              mr
            />
            <cb-select
              v-model="query.inPosition"
              clearable
              :options="PlaceStatus"
              titleField="name"
              valueField="code"
              mr
              :first="{
                code: '',
                name: $t(
                  'systemOperation.realEquipmentManagement.allPlaceStatus',
                ),
              }"
            />
            <cb-select
              v-model="query.useStatus"
              clearable
              :options="UsageStatus"
              titleField="name"
              valueField="code"
              mr
              :first="{
                code: '',
                name: $t(
                  'systemOperation.realEquipmentManagement.allUsageStatus',
                ),
              }"
            />
            <cb-search-input
              v-model="query.name"
              style="width: 200px"
              :placeholder="
                $t('systemOperation.realEquipmentManagement.pleaseInputName')
              "
            />
          </template>
          <template v-slot:inStatus="scope">
            <span v-if="scope.data.in_position === null">--</span>
            <cb-iconfont
              v-else
              type="icon-zhuangtai"
              :themedColor="scope.data.in_position ? 'green-color' : 'neutral1'"
            />
          </template>
          <template v-slot:quoteStatus="scope">
            <span v-if="!scope.data.reference_status">
              {{ $t('systemOperation.realEquipmentManagement.free') }}
            </span>
            <span v-else class="quote">
              {{ $t('systemOperation.realEquipmentManagement.reference') }}
              （{{ scope.data.reference_status }}）
            </span>
          </template>
          <template v-slot:useStatus="scope">
            <cb-iconfont
              type="icon-zhuangtai"
              :themedColor="scope.data.use_status ? 'green-color' : 'neutral1'"
            />
          </template>
          <template v-slot:operation="scope">
            <cb-button
              v-if="false"
              mr
              type="text"
              @click="release(scope.data)"
              :disabled="!scope.data.reference_status"
            >
              {{ $t('systemOperation.realEquipmentManagement.release') }}
            </cb-button>
            <cb-button mr type="text" @click="openDetail(scope.data)">
              {{ $t('systemOperation.realEquipmentManagement.detail') }}
            </cb-button>
          </template>
        </cb-search-table>
      </cb-tab-pane>
      <cb-tab-pane
        :label="
          $t(
            'systemOperation.realEquipmentManagement.virtualRealCombinationSwitch',
          )
        "
        name="list1"
      >
        <virtual-real-switch v-if="activeName === 'list1'" />
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('systemOperation.realEquipmentManagement.serialServer')"
        name="list2"
      >
        <serial-server v-if="activeName === 'list2'" />
      </cb-tab-pane>
    </cb-tabs>
    <cb-dialog
      :title="dialogName"
      center
      :visible.sync="realDialog"
      width="75%"
    >
      <DetailDialog :id="id" :name="name" />
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import SerialServer from '../components/serial-server.vue';
import { getPlaceStatus, getUsageStatus } from '@/api/system-op.ts';
import DetailDialog from '../components/detail-dialog.vue';
import VirtualRealSwitch from '../components/virtual-real-switch.vue';
import { getLanguage } from '@cyber/helper';

export default {
  components: {
    SerialServer,
    DetailDialog,
    VirtualRealSwitch,
  },
  data() {
    return {
      language: getLanguage(),
      id: '',
      name: '',
      url: '',
      query: {
        category: '',
        secondCategory: '',
        scene_type: '',
        inPosition: '',
        name: '',
        useStatus: '',
      },
      sceneTypes: [],
      PlaceStatus: [],
      UsageStatus: [],
      activeName: 'list',
      realDialog: false,
      dialogName: '',
      sceneTypeSet: [],
      sceneTypeOptions: [],
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'child',
      },
    };
  },
  mounted() {
    this.getPlaceStatusList();
    this.getUsageStatusList();
  },
  computed: {
    cols() {
      const that = this;
      return [
        {
          label: this.$t('systemOperation.realEquipmentManagement.name'),
          prop: 'name',
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.desc'),
          prop: 'description',
          width: '180px',
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.model'),
          getData: (row) => {
            if (row.model && row.model.length > 0) {
              return row.model;
            }
            return '-';
          },
          width: '160px',
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.category'),
          width: '180px',
          getData(row) {
            let firstIndex = null;
            let secondIndex = null;
            firstIndex = _.findIndex(that.sceneTypeOptions, (item) => {
              return item.id === row.category;
            });
            if (firstIndex > -1) {
              secondIndex = _.findIndex(
                that.sceneTypeOptions[firstIndex].child,
                (second) => {
                  return second.id === row.sub_category;
                },
              );
            }
            let firstName = null;
            let secondName = null;
            firstName =
              firstIndex > -1 ? that.sceneTypeOptions[firstIndex].name : '';
            secondName =
              firstIndex > -1 && secondIndex > -1
                ? that.sceneTypeOptions[firstIndex].child[secondIndex].name
                : '';
            if (firstName && secondName) {
              return `${firstName} / ${secondName}`;
            }
            return `${firstName}`;
          },
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.entityType'),
          prop: 'entity_type_name',
          getData: (row) => {
            if (row.entity_type_name && row.entity_type_name.length > 0) {
              return row.entity_type_name;
            }
            return '-';
          },
        },
        {
          label: this.$t(
            'systemOperation.realEquipmentManagement.entityDetails',
          ),
          getData: (row) => {
            return this.entityDetailFormatter(row);
          },
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.placeStatus'),
          slot: 'inStatus',
          width: '80px',
        },
        {
          label: this.$t(
            'systemOperation.realEquipmentManagement.referenceStatus',
          ),
          slot: 'quoteStatus',
          width: this.language === 'zh-CN' ? '100px' : '150px',
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.usageStatus'),
          slot: 'useStatus',
          width: '80px',
        },
        {
          label: that.$t('systemOperation.scene.operate'),
          slot: 'operation',
          width: '100px',
        },
      ];
    },
  },
  watch: {},
  created() {
    const that = this;
    this.getTyps().then((res) => {
      that.sceneTypeOptions = res;
    });
  },
  methods: {
    // 实体详情数据处理
    entityDetailFormatter(row) {
      const { entity_detail } = row;
      if (entity_detail) {
        let detail = JSON.parse(entity_detail);
        if (detail.length > 0) {
          let arr = [],
            type = detail[0].accessType;
          if (type === 'remote_address') {
            detail.forEach((item) => {
              arr.push(item.ip);
            });
            return arr.join(',');
          } else if (type === 'device_port' || type === 'wireless') {
            detail.forEach((item) => {
              arr.push(`${item.switchName}[${item.switchPort}]`);
            });
            return arr.join(',');
          } else if (type === 'mac_address') {
            detail.forEach((item) => {
              arr.push(item.mac);
            });
            return arr.join(',');
          } else {
            return '-';
          }
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    },
    getTyps() {
      return new Promise((resp) => {
        this.$request
          .get(
            '/devops/cluster/types/l2-categories',
            {},
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {
            this.sceneTypeOptions = _.get(res, 'data.data.items', []);
            resp(res.data.data.items);
          });
      });
    },
    handleChange(value) {
      if (value && value.length > 0) {
        if (value.length === 1) {
          this.query.category = value[value.length - 1];
          this.query.secondCategory = '';
        } else if (value.length === 2) {
          this.query.category = value[0];
          this.query.secondCategory = value[value.length - 1];
        }
      } else {
        this.query.category = '';
        this.query.secondCategory = '';
      }
    },
    release(row) {
      this.$request
        .post(
          '/devops/cluster/real-equipment/freed/',
          {
            uuid: row.id,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          this.$message.success('释放成功');
          this.$refs.monitorListRef.reload();
        });
    },
    openDetail(row) {
      this.dialogName =
        this.$t('systemOperation.realEquipmentManagement.realEquipment') +
        `${row.name}` +
        this.$t('systemOperation.realEquipmentManagement.detail');
      this.id = row.id;
      this.name = row.name;
      this.realDialog = true;
    },
    //获取在位状态列表数据
    getPlaceStatusList() {
      getPlaceStatus().then((res) => {
        this.PlaceStatus = _.get(res, 'data.data', []);
      });
    },
    //获取使用状态列表数据
    getUsageStatusList() {
      getUsageStatus().then((res) => {
        this.UsageStatus = _.get(res, 'data.data', []);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.quote {
  color: var(--orange-color);
}
</style>
