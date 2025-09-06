<template>
  <cb-dialog
    :title="$t('device.selectBaseImage')"
    center
    :visible.sync="visibleDialog"
  >
    <cb-search-table
      :scroll="{ y: 430 }"
      ref="tableRef"
      :url="url"
      :baseURL="baseURL"
      :cols="columns"
      :data="model"
      :selector="selector"
      :selection.sync="selection"
      row-key="uuid"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-search-input
          v-model="model.name"
          :placeholder="$t('device.nameInput')"
        ></cb-search-input>
      </template>
      <!-- 镜像状态 状态为"错误"时，tooltip的content显示错误信息-->
      <template v-slot:imageStatus="scope">
        <template>
          <cb-popover
            v-if="isImageStatus(scope.data.image_status)"
            placement="top"
            :disabled="!getError(scope.data)"
            trigger="hover"
            :content="getError(scope.data)"
          >
            <div slot="reference">
              {{
                $CONSTANT.DICT.Device.ImageStatus[
                  scope.data.image_status
                ].toString()
              }}
            </div>
          </cb-popover>
          <span v-else>-</span>
        </template>
      </template>
    </cb-search-table>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button
          button-type="confirm"
          @click="dialogConfirm(selection)"
        ></cb-button>
        <cb-button button-type="cancel" @click="dialogCancel()"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
export default {
  name: 'BasicImageDialog',
  props: {
    category: {
      type: Object,
      default: {},
    },
    basicQuery: {
      type: Object,
      default() {
        return {
          system_type: '',
          system_architecture: '',
          language: '',
        };
      },
    },
  },
  watch: {
    category: {
      handler(value) {
        this.getCategories(value);
      },
      immediate: true,
      deep: true,
    },
    basicQuery: {
      handler(value) {
        this.model = {
          ...this.model,
          ...value,
        };
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      formatters: {
        // 表格"分类"列
        categoryFormatter: (row) => {
          let mainName = '-',
            subName = '-',
            thirdName = '-';
          const { main_category, sub_category, third_category } = row;
          mainName = this.tableListFilter(this.firstTypeList, main_category);
          subName = this.tableListFilter(this.secondTypeList, sub_category);
          thirdName = this.tableListFilter(this.thirdTypeList, third_category);
          if (thirdName) {
            return `${mainName}/${subName}/${thirdName}`;
          }
          return `${mainName}/${subName}`;
        },
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
      visibleDialog: false,
      selector: { maxSelect: 1 },
      selection: [],
      model: {
        name: '',
        image_status: 2,
        ...this.basicQuery,
      },
      baseURL: '/api/mp',
      url: '/devops/cluster/images/page',
      columns: [
        {
          label: this.$t('device.name'),
          prop: 'name',
        },
        {
          label: this.$t('device.category'),
          width: 160,
          getData: (data) => {
            return this.formatters.categoryFormatter(data);
          },
        },
        {
          label: this.$t('device.description'),
          prop: 'description',
          minWidth: 105,
        },
        {
          label: this.$t('device.systemType'),
          width: 160,
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
          label: this.$t('device.imageStatus'),
          slot: 'imageStatus',
          width: 80,
        },
      ],
      systemTypeMapping: {},
      firstTypeList: [],
      secondTypeList: [],
      thirdTypeList: [],
      imageList: [],
    };
  },
  mounted() {},
  methods: {
    getCategories(res) {
      let first_type_list = _.get(res, 'data.data.first_type_list', []),
        second_type_list = _.get(res, 'data.data.second_type_list', []),
        third_type_list = _.get(res, 'data.data.third_type_list', []),
        image_type = _.get(res, 'data.data.image_type', []);
      this.firstTypeList = _.cloneDeep(first_type_list);
      this.secondTypeList = _.cloneDeep(second_type_list);
      this.thirdTypeList = _.cloneDeep(third_type_list);
      // 镜像类型
      this.imageList = _.cloneDeep(image_type);
      const systemTypeMapping = {};
      _.forEach(third_type_list, (item) => {
        systemTypeMapping[item.id] = item.name;
      });
      this.systemTypeMapping = systemTypeMapping;
    },
    dialogConfirm() {
      if (this.selection.length !== 1) {
        this.$message({
          type: 'error',
          message: this.$t('device.selectBaseImage'),
        });
        return;
      }
      this.$emit('setBasicImage', this.selection);
      this.visibleDialog = false;
    },
    dialogCancel() {
      this.visibleDialog = false;
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
    // 错误信息
    getError(data) {
      if (data.ext_image_info && data.ext_image_info.error) {
        return data.ext_image_info.error;
      }
      return '';
    },
    // 检测 image_status 的值 是否在以下四种中
    isImageStatus(status) {
      return _.includes(
        [
          this.$CONSTANT.Device.ImageStatus.NOT_APPLY.value,
          this.$CONSTANT.Device.ImageStatus.CREATING.value,
          this.$CONSTANT.Device.ImageStatus.CREATED.value,
          this.$CONSTANT.Device.ImageStatus.ERROR.value,
        ],
        status,
      );
    },
  },
};
</script>

<style></style>
