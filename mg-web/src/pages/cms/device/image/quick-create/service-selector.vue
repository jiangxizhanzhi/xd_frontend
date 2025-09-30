<template>
  <div class="elc-quick-create-service-selector service-selector">
    <cb-search-table
      ref="serviceTableRef"
      :url="url"
      :baseURL="baseURL"
      rowKey="uuid"
      :cols="columns"
      :data="query"
      class="cb-search-table-li"
      :searchBarBg="false"
    >
      <template v-slot:filter>
        <cb-select
          v-model="query.categories"
          :placeholder="$t('common.pleaseChoose')"
          :first="{ label: $t('service.allType'), value: '' }"
          :options="serviceCategoryOptions"
        >
        </cb-select>
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('service.inputServiceName')"
          style="width: 193px"
        />
      </template>
      <!-- <template v-slot:name="scope">
        <div class="device_logo">
          <img :src="scope.data.logo" class="icon" />
        </div>
        <span :title="scope.data.name" class="device_service_name">{{
          scope.data.name
        }}</span>
      </template> -->
      <template v-slot:operation="scope">
        <cb-button @click="selectService(scope.data)" type="text">
          {{ $t('device.add') }}
        </cb-button>
      </template>
    </cb-search-table>
  </div>
</template>

<script>
import _ from 'lodash';
import { getServiceCategoriesData } from '@/api/device/service';
export default {
  name: 'ServiceSelector',
  props: {
    deployType: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    deployType: {
      handler(value) {
        this.query.deploy_type = value;
      },
    },
  },
  data() {
    return {
      baseURL: '/api/mp',
      url: '/devops/cluster/service/page',
      query: {
        categories: '',
        name: '',
        deploy_type: this.deployType,
      },
      serviceCategoryOptions: [],
      columns: [
        {
          label: this.$t('device.name'),
          prop: 'name',
          width: 150,
        },
        {
          label: this.$t('table.description'),
          prop: 'description',
        },
        {
          label: this.$t('device.type'),
          getData: (row) => {
            const categories = row.categories
              ? _.map(row.categories.split('|'), (category) => category)
              : [];
            const categoryNames = _.map(categories, (category) =>
              this.$CONSTANT.DICT.DeviceService.Category[category].toString(),
            );
            return categoryNames.join('|');
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: 80,
        },
      ],
    };
  },
  mounted() {
    this.getServiceCategories();
  },
  methods: {
    // 获取分类
    getServiceCategories() {
      getServiceCategoriesData().then((res) => {
        const data = _.get(res, 'data.data.service_categories', []);
        const list = this.listMap(data);
        this.serviceCategoryOptions = [...list];
      });
    },
    listMap(data) {
      const list = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      return list;
    },
    selectService(service) {
      this.$emit('select-service', service);
    },
  },
};
</script>

<style lang="scss" scoped>
$device-icon-size: 20px;
.el-row {
  margin-bottom: 20px;
}
.device_logo {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
  .icon {
    margin-right: 4px;
    vertical-align: middle;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60%;
    height: 60%;
    transform: translate(-50%, -50%);
  }
}

.device_service_name {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 60px);
  top: 12px;
  left: 45px;
}
.device_service_desc {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 60px);
  top: 32px;
}
.filter-container {
  margin-bottom: 5px;
}
</style>
