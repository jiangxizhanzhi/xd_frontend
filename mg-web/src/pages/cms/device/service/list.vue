<template>
  <cb-inner-page class="app-container" :background="false">
    <cb-search-table
      ref="serverTableRef"
      baseURL="/api/mp"
      :url="url"
      rowKey="resource_id"
      :cols.sync="columns"
      :data.sync="query"
      class="cb-search-table-li"
      :selection.sync="selection"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="service-manage-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="query.categories"
          :placeholder="$t('common.pleaseChoose')"
          style="margin-right: 10px"
          titleField="name"
          valueField="id"
          :first="{ name: $t('service.allType'), id: '' }"
          :options="deviceServiceCategoryCom"
          clearable
        />
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('service.inputServiceName')"
        />
      </template>
      <template v-slot:name="scope">
        <span>{{ scope.data.name || '-' }}</span>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'service-manage-edit',
            params: { id: scope.data.uuid },
          }"
          type="text"
          button-type="edit"
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  delServiceData,
  getServiceCategoriesMgData,
} from '@/api/device/service.js';
export default {
  name: 'ImageList',
  data() {
    const that = this;
    return {
      url: '/devops/cluster/service/page',
      query: {
        categories: '',
        name: '',
      },
      selection: [],
      deployTypeAll: [],
      columns: [
        {
          label: this.$t('device.name'),
          slot: 'name',
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('device.description'),
          prop: 'description',
          width: 400,
          resizable: true,
        },
        {
          label: this.$t('device.category'),
          getData(row) {
            const categories = row.categories
              ? _.map(row.categories.split('|'), (category) => category)
              : [];
            const categoryNames = _.map(categories, (category) =>
              that.$CONSTANT.DICT.DeviceService.Category[category].toString(),
            );
            return categoryNames.join(', ');
          },
        },
        {
          label: this.$t('device.serviceType'),
          getData(row) {
            const filterData = _.filter(that.deployTypeAll, (item) => {
              return row.deploy_type === item.id;
            });
            if (filterData.length > 0) {
              return filterData[0].name;
            }
            return '';
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: 120,
        },
      ],
      deviceServiceCategoryCom: [],
    };
  },
  computed: {
    // deviceServiceCategoryCom() {
    //   let arr = [];
    //   _.forEach(this.$CONSTANT.LIST.DeviceService.Category, (item) => {
    //     arr.push({
    //       label: item.name.toString(),
    //       value: item.value,
    //     });
    //   });
    //   return arr;
    // },
  },
  created() {
    this.getCategoriesData();
  },
  methods: {
    getCategoriesData() {
      // getServiceCategoriesData().then((res) => {
      //   this.deviceServiceCategoryCom = res.data.data.service_categories;
      // });
      getServiceCategoriesMgData().then((res) => {
        this.deployTypeAll = res.data.data.deploy_type;
        this.deviceServiceCategoryCom = res.data.data.service_categories;
      });
    },
    deleteRow(row, done) {
      const ids = row.map((i) => {
        return i.uuid;
      });
      const params = {
        uuids: [...ids],
      };
      delServiceData(params)
        .then(() => {
          done();
          this.$refs.serverTableRef.reload();
          this.selection = [];
        })
        .catch((error) => {
          done(false);
          this.$serverError(error);
        });
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
  position: absolute;
  left: 0;
  top: 5px;
  width: 40px;
  height: 40px;
  .icon {
    border-radius: 50%;
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
  top: 15px;
  left: 40px;
}
.device-service-description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style lang="scss">
.elc-service-table {
  .cell {
    word-break: initial;
  }
}
.cb-search-table-li {
  .ant-table {
    .ant-table-tbody > tr > td {
      position: relative;
    }
  }
}
</style>
