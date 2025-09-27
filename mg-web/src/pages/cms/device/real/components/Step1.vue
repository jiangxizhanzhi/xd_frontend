<template>
  <div>
    <cb-form
      ref="step1FormRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :isBgColor="true"
    >
      <cb-form-item id="name" :label="$t('device.name')" prop="name">
        <cb-input v-model="model.name" />
        <div class="hint">
          {{ $t('device.nameChangeHint') }}
          <!-- [ {{ $t('device.openstackNameHint') }} ] -->
        </div>
      </cb-form-item>

      <cb-form-item :label="$t('device.description')" prop="description">
        <cb-input v-model="model.description" type="textarea" />
      </cb-form-item>

      <cb-form-item :label="$t('device.logo')" prop="logo">
        <cb-input v-model="model.logo" style="display: none" />
        <cb-upload-file
          v-model="logoList"
          :fetch-promise="uploadFunc"
          :tipText="$t('device.tipTextPng')"
          :image-size="[64, 64]"
          accept=".jpeg,.png,.jpg,.svg"
          @delete="deleteLogo"
          fit="scale-down"
        ></cb-upload-file>
        <cover-set
          :dataList="defaultLogoList"
          @selectDefaultLogo="selectDefaultLogo"
        ></cover-set>
        <!-- <fieldset class="select-default-panel">
          <legend class="title">
            {{ $t('device.selectDefaultLogo') }}
          </legend>
          <img
            v-for="item in defaultLogoList"
            :key="item.key"
            :src="item.url"
            class="image-item"
            @click="selectDefaultLogo(item)"
          />
        </fieldset> -->
        <!-- <div class="hint">
          {{ $t('device.imageSelectHint') }}
        </div> -->
      </cb-form-item>

      <cb-form-item :label="$t('device.model')" prop="style">
        <cb-input v-model="model.ext_entity.style" />
      </cb-form-item>

      <cb-form-item :label="$t('device.parameter')" prop="params">
        <cb-input v-model="model.ext_entity.params" />
      </cb-form-item>

      <cb-form-item :label="$t('device.role')" prop="role">
        <cb-col :span="7">
          <cb-cascader
            style="width: 100%"
            v-model="roleSet"
            :options="roleOptions"
            :props="optionProps"
          />
        </cb-col>
      </cb-form-item>

      <cb-form-item :label="$t('device.Category')" prop="category">
        <cb-col :span="7">
          <cb-cascader
            ref="categoryRef"
            style="width: 100%"
            v-model="categorySet"
            :options="categoryOptions"
            :props="optionProps"
            @change="categoryChange"
          />
        </cb-col>
      </cb-form-item>
      <cb-form-item :label="$t('device.systemInfo')">
        <cb-col :span="7">
          <cb-cascader
            style="width: 100%"
            v-model="systemTypeSet"
            :options="systemTypeOptions"
            :props="optionProps"
            @change="systemTypeChange"
            :placeholder="$t('device.plzSelectSystemInfo')"
          />
        </cb-col>
        <cb-col v-show="showSystemConfig" :span="7" :offset="1">
          <cb-select
            style="width: 100%"
            v-model="model.system_info.system_architecture"
            :options="systemArchitectureOptions"
          >
          </cb-select>
        </cb-col>
        <cb-col v-show="showSystemConfig" :span="8" :offset="1">
          <cb-select
            style="width: 100%"
            v-model="model.system_info.language"
            :options="languageOptions"
          >
          </cb-select>
        </cb-col>
      </cb-form-item>

      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="nextStep" mr>{{
            $t('device.next')
          }}</cb-button>
          <cb-button buttonType="cancel" @click="goBack"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  getEditBackData,
  uploadLogo,
  getDeviceCategory,
} from '@/api/device/real';
import { getCategoryIcon } from '@/api/device/image';
import { ROLEOPTIONS } from '../constant';
import CoverSet from './cover-set.vue';
export default {
  name: 'RealDeviceStep1',
  components: {
    CoverSet,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => {},
    },
    categoryData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultLogoList: [], // 默认图标,
      model: {
        name: '',
        description: '',
        image_type: 'entity',
        logo: null,
        ext_entity: {
          style: null,
          params: null,
        },
        role: null,
        main_category: null,
        sub_category: null,
        third_category: null,
        system_info: {
          parent_system_type: null,
          system_type: null,
          system_architecture: '64',
          language: 'cn',
        },
      },
      roleSet: this.id ? undefined : [4],
      logoList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('device.descInput'),
            trigger: 'blur',
          },
        ],
        logo: [
          {
            required: true,
            message: this.$t('device.needLogo'),
            trigger: 'blur',
          },
        ],
        role: [
          {
            required: true,
            message: this.$t('device.changeRole'),
            trigger: 'blur',
          },
        ],
      },
      roleOptions: ROLEOPTIONS,
      categoryOptions: [],
      categoryOptionsCopy: [],
      categorySet: [],
      optionProps: {
        checkStrictly: false,
        expandTrigger: 'click',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      systemTypeSet: [],
      systemTypeOptions: [],
    };
  },
  computed: {
    systemArchitectureOptions() {
      let arr = [];
      const datas = this.$CONSTANT.LIST?.Device?.SystemArchitecture;
      _.forEach(datas, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    languageOptions() {
      let arr = [];
      const datas = this.$CONSTANT.LIST.Device.Language;
      _.forEach(datas, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    // 是否显示系统位数和语言配置
    showSystemConfig() {
      // USB 设备不显示位数和语言设置
      if (this.systemTypeSet[1] === 403) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    // 监听角色
    roleSet: {
      handler(value) {
        if (!value) return;
        this.$emit('change-role', value);
        let length = value.length;
        this.model.role = value[value.length - 1];
        // 角色是终端节点
        if (length === 1 && value[0] === 4) {
          this.categoryOptionsDisabled(4);
          this.setWindow7();
        } else if (length === 1 && value[0] === 52) {
          this.categoryOptionsDisabled(52);
          this.setUSB();
        } else if (length > 1) {
          // 角色是路由器、交换机、防火墙
          this.setRouter();
          this.categoryOptionsDisabled();
        }
      },
      immediate: true,
    },
    // 监听系统
    systemTypeSet(value) {
      if (value && value.length > 0) {
        this.model.system_info.parent_system_type = value[0];
        this.model.system_info.system_type = value[1];
        // USB 设备清空系统位数和语言
        if (this.systemTypeSet[1] === 403) {
          this.model.system_info.system_architecture = null;
          this.model.system_info.language = null;
        }
      } else {
        this.model.system_info.parent_system_type = null;
        this.model.system_info.system_type = null;
      }
    },
    // 表单数据
    formData: {
      handler(value) {
        value && this.id && this.editBack(value);
      },
      immediate: true,
    },
    // 分类数据
    categoryData: {
      handler(value) {
        value && this.getCategories(value);
      },
      immediate: true,
    },
  },
  mounted() {
    this.getDefalutLogo();
    if (!this.formData) {
      this.$store.commit({
        type: 'real/setfirstStepFormValue',
        firstStepFormValue: {},
      });
    }
  },
  methods: {
    // 编辑回显
    editBack(res) {
      let data = _.get(res, 'data.data', {});
      const {
        name,
        description,
        logo,
        ext_entity,
        role,
        main_category,
        sub_category,
        third_category,
        system_info,
      } = data;

      this.model.name = name;
      this.model.description = description;
      this.model.logo = logo;
      this.model.role = role;
      if (role === 21 || role === 22 || role === 23) {
        this.roleSet = [6, role];
      } else if (role === 4) {
        this.roleSet = [4];
      } else {
        // 硬件外设
        this.roleSet = [52];
      }
      this.$nextTick(() => {
        this.model.main_category = main_category;
        this.model.sub_category = sub_category;
        this.model.third_category = third_category;

        if (ext_entity) {
          this.model.ext_entity.style = ext_entity.style;
          this.model.ext_entity.params = ext_entity.params;
        } else {
          this.model.ext_entity.style = null;
          this.model.ext_entity.params = null;
        }
        if (system_info) {
          this.model.system_info.parent_system_type =
            system_info.parent_system_type;
          this.model.system_info.system_type = system_info.system_type;
          this.model.system_info.system_architecture =
            system_info.system_architecture;
          this.model.system_info.language = system_info.language;
          this.systemTypeSet = [
            system_info.parent_system_type,
            system_info.system_type,
          ];
        } else {
          this.model.system_info = {
            parent_system_type: null,
            system_type: null,
            system_architecture: '64',
            language: 'cn',
          };
          this.systemTypeSet = [];
        }
        if (main_category === 1) {
          this.categorySet = [main_category, third_category];
        } else {
          this.categorySet = [main_category, sub_category];
        }
        // for (let i = 0, len = this.defaultLogoList.length; i < len; i++) {
        //   if (this.defaultLogoList[i].name === logo) {
        //     this.logoList = [{ name: logo, url: this.defaultLogoList[i].url }];
        //     break;
        //   }
        // }
        // if (!this.logoList.length) {
        //   this.logoList = [{ name: logo, url: logo }];
        // }
        this.logoList = [{ name: logo, url: logo }];
      });
    },

    // 获取靶标图标
    getDefalutLogo() {
      // getDefaultLogo().then((res) => {
      //   const list = res.data.data;
      //   const logoList = list.map((item) => {
      //     return {
      //       url: item,
      //       name: item,
      //       key: item,
      //     };
      //   });
      //   this.defaultLogoList = logoList;
      // });
      getCategoryIcon().then((res) => {
        this.defaultLogoList = _.get(res, 'data.data', []) || [];
      });
    },

    // 选择默认图标
    selectDefaultLogo(item) {
      this.model.logo = item.name;
      if (this.logoList.length > 0) {
        this.logoList[0].name = item.name;
        this.logoList[0].url = item.url;
      } else {
        this.logoList.push({
          name: item.name,
          url: item.url,
        });
      }
    },

    // 删除图标
    deleteLogo() {
      this.model.logo = null;
      this.logoList = [];
    },

    // 自定义上传
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadLogo(formData)
        .then((res) => {
          const data = _.get(res, 'data.data', '') || null;
          this.model.logo = data.http_url;
        })
        .catch((error) => {
          this.$serverError(error);
        });
    },

    // 获取分类、系统信息
    getCategories(res) {
      let first_type_list = _.get(res, 'data.data.first_type_list', []) || [],
        second_type_list = _.get(res, 'data.data.second_type_list', []) || [],
        third_type_list = _.get(res, 'data.data.third_type_list', []) || [];

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
      this.categoryOptionsCopy = [...first_type_list];
      // 系统信息
      const systermFirst = _.cloneDeep(second_type_list).splice(0, 5);
      systermFirst.forEach((item) => {
        item.children = [];
        third_type_list.forEach((item2) => {
          if (item.id === item2.l2_parent_id) {
            item.children.push(item2);
          }
        });
      });
      this.systemTypeOptions = [...systermFirst];
      if (!this.id) {
        this.model.role = 4;
        this.roleSet = [4];
      }
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

    // 分类值变化
    categoryChange(value) {
      let nodeObj = this.$refs.categoryRef.getCheckedNodes();
      if (value && value.length > 0) {
        /* this.model.sub_category = value[1]; */
        // 当主分类是操作系统也就是1的时候，系统信息的值将随分类的变化而变化
        if (value[0] === 1) {
          this.model.main_category = 1;
          this.model.sub_category = nodeObj[0].data.l2_parent_id;
          this.model.third_category = value[1]; //当是操作系统时，其子节点本来都是第三级的值
          const systemTypeOptions = this.systemTypeOptions;
          this.categorySystemChange(
            systemTypeOptions,
            'systemTypeSet',
            value[1],
          );
        } else {
          this.model.main_category = value[0];
          this.model.sub_category = value[1];
          this.model.third_category = null;
        }
      } else {
        this.model.main_category = null;
        this.model.sub_category = null;
      }
    },

    // 系统值变化
    systemTypeChange(value) {
      if (value && value.length > 0) {
        this.model.system_info.parent_system_type = value[0];
        this.model.system_info.system_type = value[1];
        // 当主分类是操作系统也就是1的时候，分类的值将随系统信息的变化而变化
        if (this.categorySet[0] === 1) {
          this.model.main_category = 1;
          this.model.sub_category = value[0];
          this.model.third_category = value[1];
          const categoryOptions = this.categoryOptions;
          this.categorySystemChange(categoryOptions, 'categorySet', value[1]);
        } else {
          this.model.main_category = this.categorySet[0];
          this.model.sub_category = this.categorySet[1];
          this.model.third_category = null;
        }
      } else {
        this.model.system_info.parent_system_type = null;
        this.model.system_info.system_type = null;
      }
    },

    // 分类和系统信息的联动
    categorySystemChange(data, prop, id) {
      data.forEach((item) => {
        let children = item.children;
        children.forEach((item2) => {
          if (item2.id === id) {
            this[prop] = [item.id, id];
          }
        });
      });
    },

    // 下一步
    nextStep() {
      this.$refs.step1FormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          const firstStepFormValue = { ...this.model };
          this.$store.commit({
            type: 'real/setfirstStepFormValue',
            firstStepFormValue,
          });
          this.$store.commit({
            type: 'real/setActive',
            active: 2,
          });
        }
      });
    },

    goBack() {
      this.$router.push({ name: 'real-manage' });
    },

    // 根据角色的类型，决定分类的禁用项
    categoryOptionsDisabled(value) {
      const categoryOptions = _.cloneDeep(this.categoryOptionsCopy);
      if (value === 4) {
        categoryOptions.forEach((item) => {
          if (item.id === 3 || item.id === 5) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      } else if (value === 52) {
        categoryOptions.forEach((item) => {
          if (item.id === 5) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        });
      } else {
        categoryOptions.forEach((item) => {
          if (item.id !== 3) {
            item.disabled = true;
          } else {
            item.disabled = false;
            let children = item.children;
            children.forEach((item2) => {
              item2.disabled = true;
              if (this.model.role === 21) {
                if (item2.id === 51) {
                  item2.disabled = false;
                }
              } else if (this.model.role === 22) {
                if (item2.id === 50) {
                  item2.disabled = false;
                }
              } else if (this.model.role === 23) {
                if (item2.id === 52) {
                  item2.disabled = false;
                }
              }
            });
          }
        });
      }
      this.categoryOptions = categoryOptions;
    },
    // 如果角色默认是硬件外设，则分类默认是 usb设备
    setUSB() {
      this.categorySet = [5, 600];
      this.model.main_category = 5;
      this.model.sub_category = 600;
      this.model.third_category = null;
    },
    // 如果角色默认是终端，则分类默认是 操作系统/Window7
    setWindow7() {
      this.categorySet = [1, 107];
      this.model.main_category = 1;
      this.model.sub_category = 1;
      this.model.third_category = 107;
    },
    // 如果角色切换到网关节点，则分类默认是相应的值
    setRouter() {
      let role = this.model.role;
      if (role === 21) {
        this.categorySet = [3, 51];
        this.model.main_category = 3;
        this.model.sub_category = 51;
      } else if (role === 22) {
        this.categorySet = [3, 50];
        this.model.main_category = 3;
        this.model.sub_category = 50;
      } else if (role === 23) {
        this.categorySet = [3, 52];
        this.model.main_category = 3;
        this.model.sub_category = 52;
      }
      this.model.third_category = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.hint {
  color: var(--red-color);
  font-size: 14px;
}
.image-item {
  width: 60px;
  height: 60px;
  padding: 10px;
}

// 选择默认图标
.select-default-panel {
  border: 1px solid var(--neutral3);
  .title {
    color: var(--neutral8);
    font-size: 14px;
  }
}
::v-deep .cb-button-group-small .cb-button {
  margin: 0;
}
</style>
