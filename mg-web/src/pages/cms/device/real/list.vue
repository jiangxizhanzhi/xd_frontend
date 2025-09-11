<template>
  <cb-inner-page :background="true" title="虚实结合管理">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="URL"
      :baseURL="baseURL"
      :data.sync="model"
      ref="tableRef"
      row-key="id"
    >
      <template v-slot:search>
        <cb-button button-type="add" link-name="real-create"></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelected(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template>
      <template v-slot:filter>
        <cb-cascader
          v-model="categorySet"
          :options="categoryOptions"
          :props="optionProps"
          @change="categoryChange"
          ref="categoryRef"
          :placeholder="$t('device.pleaseInputCategory')"
          clearable
        />
        <cb-search-input
          v-model="model.name"
          :placeholder="$t('device.inputName')"
        ></cb-search-input>
      </template>
      <!-- <template v-slot:category_name="scope">
        <span>
          {{ scope.data.category_name || $t('device.OperateSystem') }}
        </span>
      </template>-->
      <template v-slot:in_position="scope">
        <span
          :class="['circle', { active: scope.data.in_position === 1 }]"
        ></span>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          @click="editRow(scope.data)"
          type="text"
          buttonType="edit"
          mr
        ></cb-button>
        <cb-popover placement="left" width="260" trigger="click">
          <template>
            <div
              style="margin-bottom: 5px"
              v-for="(item, index) in loginUrlData"
              :key="item.url + index"
            >
              <div>
                <span>{{ $t('device.internalAddr') }}：</span
                >{{ item.internal_ip }}
              </div>
              <div>
                <span>{{ $t('device.acceEnv') }}：</span>
                <span>{{ item.protocol }} </span
                ><span>{{ item.hostname }} </span><span>{{ item.port }} </span>
              </div>
              <div>
                <span>{{ $t('device.username') }}：</span>
                <span>{{ item.username }}</span>
                <span>{{ $t('device.password') }}：</span>
                <span>{{ item.password }}</span>
              </div>
              <div v-if="item.protocol === 'console'" style="margin-top: 5px">
                <cb-button @click="openNewWindow(item.url)"
                  >{{ item.protocol }}{{ $t('device.login') }}</cb-button
                >
              </div>
            </div>
          </template>
          <div style="text-align: center" v-if="loginUrlShow">
            {{ $t('device.noneLoginData') }}
          </div>
          <cb-button
            slot="reference"
            :disabled="!scope.data.login_enable"
            type="text"
            @click="login(scope.data)"
            >{{ $t('device.login') }}</cb-button
          >
        </cb-popover>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  getDeviceCategory,
  deleteSelectedData,
  getLoginMessage,
} from '@/api/device/real';
export default {
  name: 'RealManage',
  data() {
    return {
      selector: {
        maxSelect: 0,
      },
      selection: [],
      URL: '/devops/cluster/real-equipment/page',
      baseURL: '/api/mp',
      model: {
        category: '',
        second_category: '',
        third_category: '',
        name: '',
      },
      cols: [
        {
          label: this.$t('device.name'),
          prop: 'name',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('device.model'),
          prop: 'model',
        },
        {
          label: this.$t('device.parameter'),
          prop: 'params',
        },
        {
          label: this.$t('device.category'),
          prop: 'category_name',
          getData: (data) => {
            const { category_name, sub_category_name, third_category_name } =
              data;
            if (third_category_name) {
              return `${category_name}/${sub_category_name}/${third_category_name}`;
            } else {
              return `${category_name}/${sub_category_name}`;
            }
          },
          width: 220,
          resizable: true,
        },
        {
          label: this.$t('device.systemInfo'),
          prop: 'ext_system_info',
          getData: (data) => {
            let ext_system_info = _.get(data, 'ext_system_info', {});
            if (ext_system_info) {
              let {
                language_name,
                system_architecture_name,
                system_type_name,
              } = ext_system_info;
              system_type_name = system_type_name ? system_type_name + ';' : '';
              system_architecture_name = system_architecture_name
                ? system_architecture_name + ';'
                : '';
              language_name = language_name ? language_name : '';
              return `${system_type_name}${system_architecture_name}${language_name}`;
            } else {
              return '-';
            }
          },
          width: 220,
          resizable: true,
        },
        {
          label: this.$t('device.describe'),
          prop: 'description',
          width: 150,
          resizable: true,
        },
        {
          label: this.$t('device.entityType'),
          prop: 'entity_type_name',
        },
        {
          label: this.$t('device.entityDetails'),
          getData: (row) => {
            return this.entityDetailFormatter(row);
          },
        },
        {
          label: this.$t('device.reginStatus'),
          slot: 'in_position',
        },
        {
          label: this.$t('device.operation'),
          slot: 'operate',
          width: 150,
        },
      ],
      categoryOptions: [],
      categorySet: [],
      optionProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      loginUrlData: [],
      loginUrlShow: false,
    };
  },
  computed: {},
  mounted() {
    this.deviceCategory();
  },
  methods: {
    // 分类
    categoryChange(value) {
      let nodeObj = this.$refs.categoryRef.getCheckedNodes();
      if (value && value.length > 0) {
        if (value[0] === 1) {
          this.model.category = 1;
          this.model.second_category = nodeObj[0].data.l2_parent_id;
          this.model.third_category = value[1]; //当是操作系统时，其子节点本来都是第三级的值
        } else {
          this.model.category = value[0];
          this.model.second_category = value[1];
          this.model.third_category = null;
        }
      } else {
        this.model.category = '';
        this.model.second_category = '';
        this.model.third_category = null;
      }
    },
    // 分类
    deviceCategory() {
      getDeviceCategory().then((res) => {
        let first_type_list = _.get(res, 'data.data.first_type_list', []),
          second_type_list = _.get(res, 'data.data.second_type_list', []),
          third_type_list = _.get(res, 'data.data.third_type_list', []);
        first_type_list.forEach((item1) => {
          item1.children = [];
          let secondList = second_type_list;
          for (let i = 0, len = secondList.length; i < len; i++) {
            // 过略二级中的WINDOWS、UNIX
            if (secondList[i].l1_parent_id === 1) {
              continue;
            }
            if (item1.id === secondList[i].l1_parent_id) {
              item1.children.push(secondList[i]);
            }
          }
          third_type_list.forEach((item3) => {
            if (item1.id === item3.l1_parent_id) {
              item1.children.push(item3);
            }
          });
        });
        this.categoryOptions = [...first_type_list];
      });
    },
    // 删除
    deleteSelected(data, done) {
      const uuids = [];
      if (data?.length) {
        data.forEach((item) => {
          uuids.push(item.id);
        });
      }
      deleteSelectedData({ uuids })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.tableRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 编辑
    editRow(data) {
      const { id } = data;
      this.$router.push({
        path: `/admin/std/instance-manage/edit/${id}`,
      });
    },

    // 登录
    login(data) {
      this.loginUrlShow = false;
      const { id } = data;
      this.loginUrlData = [];
      getLoginMessage({ uuid: id }).then((res) => {
        let data = _.get(res, 'data.data', []);
        this.loginUrlData = [...data];
        if (!data.length) {
          this.loginUrlShow = true;
        }
      });
    },
    openNewWindow(url) {
      window.open(url, '_blank');
    },

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
  },
};
</script>

<style lang="scss" scoped>
.circle {
  background: var(--neutral1);
  font-size: 14px;
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 8px;
}
.circle.active {
  background: var(--green-color);
}
</style>
