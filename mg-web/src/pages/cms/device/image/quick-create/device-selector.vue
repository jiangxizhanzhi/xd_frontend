<template>
  <cb-search-table
    ref="deviceTableRef"
    :url="url"
    :baseURL="baseURL"
    rowKey="uuid"
    :cols="columns"
    :data="query"
    class="cb-search-table-li"
    :searchBarBg="false"
  >
    <template v-slot:search>
      <cb-search-input
        v-model="query.name"
        :placeholder="$t('device.inputSystemName')"
      />
    </template>
    <template v-slot:name="scope">
      <div :title="scope.data.name" class="device_logo">
        <img :src="scope.data.logo" class="icon" />
      </div>
      <span :title="scope.data.name" class="standard_device_name">{{
        scope.data.name
      }}</span>
    </template>
    <template v-slot:operation="scope">
      <cb-button @click="selectDevice(scope.data)" type="text">
        {{ $t('device.select') }}
      </cb-button>
    </template>
  </cb-search-table>
</template>

<script>
import _ from 'lodash';
import { getDefaultLogo, getImageCategory } from '@/api/device/image';
export default {
  name: 'DeviceSelector',
  data() {
    return {
      baseURL: '/api/mp',
      url: '/devops/cluster/images/page',
      query: {
        name: '',
        quick_create_support: true,
        image_type: 'vm',
      },
      systemTypeMapping: [],
      imageList: [],
      formatters: {
        // 系统类型
        systemTypeFormatter: (row) => {
          const { image_type } = row;
          let virtualName = this.tableListFilter(this.imageList, image_type);
          let systemTypeName = this.systemTypeMapping[row.system_type];
          if (systemTypeName) {
            return `${virtualName}/${systemTypeName}`;
          }
          return `${virtualName}`;
        },
        // 大小
        flavorFormatter: (row) => {
          let ext_vm = _.get(row, 'ext_vm', {});
          const core = this.$t('device.core');
          const ram = this.$t('device.ram');
          const disk = this.$t('device.disk');
          return ext_vm && ext_vm.flavor
            ? `${ext_vm.cpu}${core}/${ext_vm.ram}M${ram}/${ext_vm.disk}G${disk}`
            : '-';
        },
      },
      columns: [
        {
          label: this.$t('device.name'),
          slot: 'name',
        },
        {
          label: this.$t('table.description'),
          prop: 'description',
        },
        {
          label: this.$t('device.systemType'),
          getData: (data) => {
            return this.formatters.systemTypeFormatter(data);
          },
        },
        {
          label: this.$t('device.size'),
          getData: (data) => {
            return this.formatters.flavorFormatter(data);
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: 80,
        },
      ],
      defaultLogoList: [],
    };
  },
  mounted() {
    this.getDefalutLogo();
    this.getCategories();
  },
  methods: {
    getCategories() {
      getImageCategory().then((res) => {
        let image_type = _.get(res, 'data.data.image_type', []),
          third_type_list = _.get(res, 'data.data.third_type_list', []);
        // 根据操作系统third_type_list，处理系统类型列的展示
        const systemTypeMapping = {};
        _.forEach(third_type_list, (item) => {
          systemTypeMapping[item.id] = item.name;
        });
        this.systemTypeMapping = systemTypeMapping;
        // 镜像类型
        this.imageList = _.cloneDeep(image_type);
      });
    },
    // 分类匹配
    tableListFilter(list, rowProp) {
      let name = '';
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].id === rowProp) {
          name = list[i].name;
          break;
        }
      }
      return name;
    },
    selectDevice(device) {
      this.$emit('select-device', device);
    },
    // 获取靶标图标
    getDefalutLogo() {
      getDefaultLogo().then((res) => {
        const logoList = res.data.data;
        this.defaultLogoList = logoList;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.device_logo {
  display: inline-block;
  position: relative;
  width: 36px;
  height: 36px;
  .icon {
    border-radius: 50%;
    margin-right: 4px;
    vertical-align: middle;
    width: 100%;
    height: 100%;
  }
}
</style>
