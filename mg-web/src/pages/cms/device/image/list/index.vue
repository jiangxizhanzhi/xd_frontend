<template>
  <cb-inner-page class="app-container" :background="true" title="镜像管理">
    <cb-search-table
      v-if="!isShowAuthor"
      :url="url"
      :baseURL="baseURL"
      :cols.sync="columns"
      :data.sync="query"
      :selector="selector"
      :selection.sync="selection"
      ref="deviceTableRef"
      row-key="uuid"
    >
      <template v-slot:search>
        <template>
          <cb-button
            button-type="add"
            link-name="image-manage-create"
          ></cb-button>
          <cb-button
            hollow
            icon="icon-xinzeng"
            link-name="image-manage-quick-create"
            >{{ $t('device.QuickCreate') }}</cb-button
          >

          <cb-button
            hollow
            button-type="delete"
            :disabled="selection.length === 0"
            @click="deleteRow(selection, $event)"
          ></cb-button>
          <cb-button
            hollow
            v-if="$route.name === 'image-manage'"
            icon="icon-shouquancaozuo"
            :disabled="selection.length === 0"
            @click="openAuthorization(selection, $event)"
            >{{ $t('device.VolumeAuthorization') }}</cb-button
          >
        </template>
      </template>
      <template v-slot:filter>
        <template>
          <template>
            <cb-cascader
              v-model="roleSet"
              :options="roleList"
              :props="optionProps"
              @change="roleChange"
              :clearable="true"
              :placeholder="$t('device.changeRole')"
            />
          </template>

          <template>
            <cb-cascader
              style="width: 300px"
              :placeholder="$t('device.slectDeviceType')"
              v-model="categorySet"
              clearable
              :options="categoryAllOptions"
              :props="optionProps"
              @change="categoryChange"
            />
          </template>
          <template>
            <cb-select
              v-model="query.image_type"
              :placeholder="$t('common.pleaseChoose')"
              :options="imageTypeList"
            >
            </cb-select>
          </template>
          <template>
            <cb-checkbox v-model="query.vmStarted">{{
              $t('device.vmStarted')
            }}</cb-checkbox>
          </template>
          <cb-search-input
            v-model="query.name"
            :placeholder="$t('device.nameInput')"
            style="width: 300px"
          />
        </template>
      </template>
      <template v-slot:name="scope">
        <div class="name" v-if="scope.data.name">
          <div :title="scope.data.name" class="device_logo">
            <img :src="scope.data.logo" class="icon" />
          </div>
          <div :title="scope.data.name" class="standard_device_name">
            {{ scope.data.name }}
          </div>
        </div>
        <span v-else>-</span>
      </template>
      <!-- 文件注入 -->
      <template v-slot:fileInjection="scope">
        <template v-if="fileInjectShow(scope.data)">
          <cb-button type="text" mr @click="handleFileInjection(scope.data)">{{
            $t('device.fileInjection')
          }}</cb-button>
          <cb-button type="text" mr @click="handleView(scope.data)">{{
            $t('device.view')
          }}</cb-button>
        </template>
        <span v-else>-</span>
      </template>
      <!-- 授权操作 -->
      <template v-slot:authorOption="scope">
        <cb-button
          v-if="scope.data.is_public === 2"
          type="text"
          mr
          @click="handleRoute(scope.data)"
          >{{ $t('device.shareAll') }}</cb-button
        >
        <cb-button
          v-else-if="scope.data.is_public === 1 && scope.data.auth_total"
          type="text"
          mr
          @click="handleRoute(scope.data)"
          >{{
            $t('device.share') +
            '(' +
            (scope.data.auth_total ? scope.data.auth_total : 0) +
            ')'
          }}</cb-button
        >
        <cb-button
          v-else
          class="private-btn"
          type="text"
          mr
          @click="handleRoute(scope.data)"
          >{{ $t('device.private') }}</cb-button
        >
      </template>
      <!-- 镜像状态 状态为"错误"时，tooltip的content显示错误信息-->
      <template v-slot:imageStatus="scope">
        <template>
          <cb-popover
            v-if="isImageStatus(scope.data.image_status)"
            placement="bottom-start"
            :disabled="!getError(scope.data)"
            trigger="hover"
            width="250"
            :content="getError(scope.data)"
          >
            <div slot="reference">
              <span v-if="scope.data.image_type !== 'simple'">
                {{
                  $CONSTANT.DICT.Device.ImageStatus[
                    scope.data.image_status
                  ].toString()
                }}
              </span>
              <span v-else>-</span>
            </div>
          </cb-popover>
          <span v-else>-</span>
        </template>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'image-manage-edit',
            params: { id: scope.data.uuid },
          }"
          type="text"
          button-type="edit"
          mr
        >
          {{ $t('device.editMetaData') }}</cb-button
        >
        <!-- 虚拟机或者容器或者 dynamips 才显示 -->
        <device-operate-btn
          v-if="isDeviceSystem(scope.data.image_type)"
          :data.sync="scope.data"
          @reloadTable="reloadTable"
        >
        </device-operate-btn>
      </template>
    </cb-search-table>
    <!-- 文件注入弹窗 -->
    <file-injection
      @injectSuccess="injectSuccess"
      ref="fileInjection"
    ></file-injection>
    <file-view ref="fileView"></file-view>
    <!-- 授权操作 -->
    <author-user
      v-if="isShowAuthor"
      :ids="selectIds"
      @changeVisible="changeVisible"
    ></author-user>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import DeviceOperateBtn from './DeviceOperateBtn';
import FileInjection from './FileInjection';
import FileView from './FileView';
import AuthorUser from './AuthorUser.vue';
import {
  deleteSelectedData,
  getImageCategory,
  getDefaultLogo,
} from '@/api/device/image';
import { ROLEOPTIONS } from '../constant';
import wsutil from '@/utils/websocket-image';
import { getLanguage } from '@cyber/helper';

export default {
  name: 'ImageList',
  components: { DeviceOperateBtn, FileInjection, FileView, AuthorUser },

  data() {
    return {
      language: getLanguage(),
      selectIds: [], // 选择数据id 用于授权页面
      isShowAuthor: false, // 显示授权页面
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
          let ext_docker = _.get(row, 'ext_docker', {});
          const core = this.$t('device.core');
          const ram = this.$t('device.ram');
          const disk = this.$t('device.disk');
          //虚拟机类型ext_vm有返回值,容器类型ext_vm为null,大小值返回用"-"表示
          if (ext_vm !== null) {
            if (ext_vm.cpu === 0 && ext_vm.ram == 0 && ext_vm.disk === 0) {
              return ext_vm && ext_vm.flavor
                ? `${ext_vm.cpu + 1}${core}/${ext_vm.ram + 1}M${ram}/${
                    ext_vm.disk + 1
                  }G${disk}`
                : '-';
            } else {
              return ext_vm && ext_vm.flavor
                ? `${ext_vm.cpu}${core}/${ext_vm.ram}M${ram}/${ext_vm.disk}G${disk}`
                : '-';
            }
          } //虚拟机类型ext_docker有返回值,容器类型ext_docker为null,大小值返回用"-"表示
          else if (ext_docker !== null) {
            if (ext_docker.ram == 0 && ext_docker.disk === 0) {
              return ext_docker && ext_docker.flavor
                ? `${ext_docker.ram + 1}M${ram}/${ext_docker.disk + 1}G${disk}`
                : '-';
            } else {
              return ext_docker && ext_docker.flavor
                ? `${ext_docker.ram}M${ram}/${ext_docker.disk}G${disk}`
                : '-';
            }
          } else {
            return '-';
          }
        },
      },

      rowData: {}, // 每行的数据
      equipReignLists: {},

      baseURL: '/api/mp',
      url: '/devops/cluster/images/page',
      query: {
        image_type: '',
        role: '',
        main_category: '',
        sub_category: '',
        third_category: '',
        name: '',
        vmStarted: '',
      },
      roleSet: [],
      categorySet: [],
      selector: {
        maxSelect: 0,
      },
      selection: [],
      categoryAllOptions: [], // 所有分类树
      optionProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      systemTypeMapping: {},
      roleList: ROLEOPTIONS, // 角色
      imageTypeList: [], // 镜像类型
      columns: [
        {
          label: this.$t('device.name'),
          slot: 'name',
          prop: 'name',
          width: 260,
          resizable: true,
        },
        {
          label: this.$t('device.deviceType'),
          getData: (data) => {
            return this.formatters.categoryFormatter(data);
          },
          prop: 'deviceType',
          width: 220,
          resizable: true,
        },
        {
          label: this.$t('device.description'),
          prop: 'description',
          width: this.language === 'zh-CN' ? '200px' : '145px',
          resizable: true,
        },
        {
          label: this.$t('device.virtualType'),
          getData: (data) => {
            return this.formatters.systemTypeFormatter(data);
          },
          prop: 'virtualType',
          width: this.language === 'zh-CN' ? '200px' : '145px',
          resizable: true,
        },
        {
          label: this.$t('device.size'),
          getData: (data) => {
            if (data.image_type === 'dynamips') {
              const ram =
                data?.ext_vm?.ext_info?.ext_dynamips?.flavor?.ram || 0;
              return ram + 'M' + this.$t('device.ram');
            }
            return this.formatters.flavorFormatter(data);
          },
          prop: 'size',
          width: this.language === 'zh-CN' ? '180px' : '142px',
          resizable: true,
        },

        // 文件注入
        {
          label: this.$t('device.fileInjection'),
          slot: 'fileInjection',
          width: this.language === 'zh-CN' ? '140px' : '160px',
        },
        // 授权操作
        {
          label: this.$t('device.authorOption'),
          slot: 'authorOption',
          width: this.language === 'zh-CN' ? '90px' : '160px',
        },
        {
          label: this.$t('device.imageStatus'),
          slot: 'imageStatus',
          width: this.language === 'zh-CN' ? '80px' : '120px',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: this.language === 'zh-CN' ? '232px' : '250px',
        },
      ],
      firstTypeList: [],
      secondTypeList: [],
      thirdTypeList: [],
      defaultLogoList: [],
      imageList: [],
      tableData: [], // 表格数据
    };
  },
  computed: {},
  watch: {
    categorySet: {
      handler(nv) {
        if (nv && nv.length > 0) {
          this.query.main_category = nv[0];
          this.query.sub_category = nv[1];
          this.query.third_category = nv[2] ? nv[2] : '';
        } else {
          this.query.main_category = '';
          this.query.sub_category = '';
          this.query.third_category = '';
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getDefalutLogo();
    this.getCategories();
    //搜索参数回填
    this.fillSearchData();
    this.bindImageWs();
  },
  methods: {
    // 镜像管理ws
    bindImageWs() {
      wsutil.cbind('/mp/ws/devops/cluster/images-page', {
        'MP-device-by-uuid': (data) => {
          // TODO: 最优方案是匹配表格中某一条数据
          /* const list = _.cloneDeep(this.tableData),
            uuid = data.uuid;
          if (list.length) {
            let index = list.findIndex((item) => item.uuid === uuid);
            list[index] = data;
          }
          this.tableData = list; */
          this.$refs.deviceTableRef?.reload();
        },
      });
    },

    //搜索参数回填
    fillSearchData() {
      if (this.query.main_category) {
        if (this.query.third_category) {
          this.categorySet = [
            this.query.main_category,
            this.query.sub_category,
            this.query.third_category,
          ];
        } else {
          this.categorySet = [
            this.query.main_category,
            this.query.sub_category,
          ];
        }
      }
      if (this.query.role) {
        if (this.query.role == '21') {
          this.roleSet = [6, 21];
        } else if (this.query.role == '22') {
          this.roleSet = [6, 22];
        } else if (this.query.role == '23') {
          this.roleSet = [6, 23];
        } else if (this.query.role == '3') {
          this.roleSet = [3];
        } else {
          this.roleSet = [4];
        }
      }
    },

    // 获取靶标图标
    getDefalutLogo() {
      getDefaultLogo().then((res) => {
        const logoList = res.data.data;
        this.defaultLogoList = logoList;
      });
    },

    getCategories() {
      getImageCategory().then((res) => {
        let first_type_list = _.get(res, 'data.data.first_type_list', []) || [],
          second_type_list = _.get(res, 'data.data.second_type_list', []) || [],
          third_type_list = _.get(res, 'data.data.third_type_list', []) || [],
          role = _.get(res, 'data.data.role', []) || [],
          image_type = _.get(res, 'data.data.image_type', []) || [];

        this.firstTypeList = _.cloneDeep(first_type_list);
        this.secondTypeList = _.cloneDeep(second_type_list);
        this.thirdTypeList = _.cloneDeep(third_type_list);
        // 分类
        const firstTypeList = _.cloneDeep(first_type_list),
          secondTypeList = _.cloneDeep(second_type_list),
          thirdTypeList = _.cloneDeep(third_type_list);
        firstTypeList.forEach((item1) => {
          item1.children = [];
          secondTypeList.forEach((item2) => {
            if (item2.l1_parent_id === item1.id) {
              item1.children.push(item2);
            }
          });
        });
        firstTypeList.forEach((item1) => {
          // id为1 => 操作系统
          if (item1.id === 1) {
            item1.children.forEach((item2) => {
              item2.children = [];
              thirdTypeList.forEach((item3) => {
                if (item3.l2_parent_id === item2.id) {
                  item2.children.push(item3);
                }
              });
            });
          }
        });
        this.categoryAllOptions = [...firstTypeList];

        // 根据操作系统third_type_list，处理系统类型列的展示
        const systemTypeMapping = {};
        _.forEach(third_type_list, (item) => {
          systemTypeMapping[item.id] = item.name;
        });
        this.systemTypeMapping = systemTypeMapping;

        // 镜像类型
        this.imageList = _.cloneDeep(image_type);
        const imageTypeList = this.listMap(image_type).filter(
          (item) => item.value !== 'entity',
        );
        imageTypeList.unshift({
          label: this.$t('device.allImageType'),
          value: '',
        });
        this.imageTypeList = [...imageTypeList];
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

    roleChange(value) {
      this.query.role = value[value.length - 1];
    },
    // 错误信息
    getError(data) {
      if (data.ext_image_info && data.ext_image_info.error) {
        return data.ext_image_info.error;
      }
      return '';
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

    // 搜索条件'系统类型'值变化
    categoryChange(value) {
      if (value && value.length > 0) {
        this.query.main_category = value[0];
        this.query.sub_category = value[1];
        this.query.third_category = value[2] ? value[2] : '';
      } else {
        this.query.main_category = '';
        this.query.sub_category = '';
        this.query.third_category = '';
      }
    },
    // 删除
    deleteRow(data, done) {
      const image_ids = [];
      if (data?.length) {
        data.forEach((item) => {
          image_ids.push(item.uuid);
        });
      }
      deleteSelectedData({ image_ids })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.deviceTableRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 文件注入显示条件
    fileInjectShow(data) {
      /* 支持注入：
      1、虚拟类型： 虚拟机。
      2、镜像状态：已保存。
      3、系统镜像： a、基础镜像的情况：存在快照（快照数量大于0）；b、自定义上传或者CP-Cloud 。
      显示条件：1 and 2 and (a or b) */
      if (
        data.image_type === 'vm' &&
        data.image_status === 2 &&
        ((data.ext_image_info &&
          data.ext_image_info.image_source === 1 &&
          data.ext_vm &&
          data.ext_vm.snapshot_count > 0) ||
          data.ext_image_info.image_source === 2 ||
          data.ext_image_info.image_source === 3)
      ) {
        return true;
      }
    },
    // 解决文件注入
    handleFileInjection(row) {
      this.$refs.fileInjection.open(row);
    },

    // 注入成功 刷新表格
    injectSuccess() {
      this.$refs.deviceTableRef.reload();
    },

    // 查看文件
    handleView(row) {
      this.$refs.fileView.open(row);
    },

    // 授权操作
    handleRoute(row) {
      this.$router.push({
        path: '/admin/std/image-manage/author-operation',
        query: {
          resource_id: row.uuid,
          shareMode: row.is_public,
        },
      });
    },

    // 批量授权
    openAuthorization(selectRows, e) {
      this.isShowAuthor = true;
      this.selectIds = selectRows.map((i) => {
        return i.uuid;
      });
    },

    // 关闭
    changeVisible(value) {
      this.isShowAuthor = value;
    },

    // 刷新表格
    reloadTable() {
      this.$refs.deviceTableRef.reload();
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

    // 检测 image_type的值 是否在 ['虚拟机', '容器',dynamips]中
    isDeviceSystem(image_type) {
      return _.includes(
        [
          this.$CONSTANT.Device.ImageType.VM.value,
          this.$CONSTANT.Device.ImageType.CONTAINER.value,
          'dynamips',
        ],
        image_type,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.name {
  display: flex;
  align-items: center;
  .device_logo {
    position: relative;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    .icon {
      margin-right: 4px;
      width: 24px;
      height: 24px;
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
  .standard_device_name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.loading-mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  right: 0;
  color: #fff;
  width: 100%;
  height: calc(100% - 20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
